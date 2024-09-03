import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

function Pagination() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [quantityInputs, setQuantityInputs] = useState({}); // Manage quantity input for each book
  const [image, setImage] = useState('');


  const handleImage = async (e, bookId) => {
    const fileInput = e.target; // Reference to the file input element
    const upload = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', upload);

    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        `http://0.0.0.0:8000/book/upload-image?book_id=${bookId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if(response.status === 200){
           setNotification("Image uploaded successfully ")
      }
      // Assuming the backend returns the URL of the uploaded image
      const updatedBooks = books.map(book =>
        book.id === bookId ? { ...book, img: response.data.isImageUrl } : book
      );
      setBooks(updatedBooks); // Update state with new image URL
    } catch (err) {
      setNotification('Something went wrong. Please try again.');
      console.error('Error uploading image:', err.response?.data || err);
    }

    fileInput.value = '';
  };
  

  const handleDelete = async (bookId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await axios.delete('http://0.0.0.0:8000/book/delete-book', {
      params: {
        book_id: bookId,
      },
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      // Fetch the updated list of books
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);

      // Optionally, reassign IDs or update the state as needed
      // For example, you could remap IDs or handle gaps here

      setNotification('Book deleted successfully');
      setIsError(false);
      setShowPopup(true);
    }
  } catch (err) {
    setNotification('Something went wrong. Please try again.');
    setIsError(true);
    setShowPopup(true);
    setError(err.message);
    console.error('Error deleting book:', err.response?.data || err);
  }
};

  

  const closePopup = () => {
    setTimeout(() => {
      setShowPopup(false);
      setNotification('');
    }, 3000);
  };

  const fetchBooks = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get('http://0.0.0.0:8000/book/get-books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBooks(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err.response || err);
    }
  };

  const handleQuantityChange = async (bookId, newQuantity) => {
    const token = localStorage.getItem('accessToken');
    const currentBook = books.find(book => book.id === bookId);
    const currentQuantity = currentBook?.quantity || 0;
    const quantity = parseInt(newQuantity, 10);

    if (isNaN(quantity) || quantity < 0) {
      setNotification('Invalid quantity. Please enter a non-negative number.');
      setIsError(true);
      setShowPopup(true);
      return;
    }

    if (quantity > currentQuantity) {
      try {
        const response = await axios.patch('http://0.0.0.0:8000/book/increment-quantity', null, {
          params: {
            book_id: bookId,
            increment_by: quantity - currentQuantity
          },
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setNotification('Quantity updated successfully');
          setIsError(false);
          setShowPopup(true);
          // Update local state
          setBooks(books.map(book =>
            book.id === bookId ? { ...book, quantity: quantity } : book
          ));
          // Clear input field
          setQuantityInputs(prevState => ({ ...prevState, [bookId]: '' }));
        }
      } catch (err) {
        setNotification('Failed to update quantity. Please try again.');
        setIsError(true);
        setShowPopup(true);
        console.error('Error updating quantity:', err.response?.data || err);
      }
    } else if (quantity < currentQuantity) {
      try {
        const response = await axios.patch('http://0.0.0.0:8000/book/decrement-quantity', null, {
          params: {
            book_id: bookId,
            decrement_by: currentQuantity - quantity
          },
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setNotification('Quantity updated successfully');
          setIsError(false);
          setShowPopup(true);
          // Update local state
          setBooks(books.map(book =>
            book.id === bookId ? { ...book, quantity: quantity } : book
          ));
          // Clear input field
          setQuantityInputs(prevState => ({ ...prevState, [bookId]: '' }));
        }
      } catch (err) {
        setNotification('Failed to update quantity. Please try again.');
        setIsError(true);
        setShowPopup(true);
        console.error('Error updating quantity:', err.response?.data || err);
      }
    }
  };

  if(showPopup){
    closePopup()
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleQuantityInputChange = (bookId, value) => {
    // Validate if value is a number
    if (value === '' || /^\d*$/.test(value)) {
      setQuantityInputs(prevState => ({ ...prevState, [bookId]: value }));
    }
  };

  const filteredBooks = books.filter((book) => {
    return (
      (languageFilter ? book.language === languageFilter : true) &&
      (categoryFilter ? book.category === categoryFilter : true) &&
      (ageFilter ? book.ages === ageFilter : true) &&
      (searchTerm ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
  });

  return (
    <div className='l'>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className='select' value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
          <option value="">Select Language</option>
          <option value="Russian">Russian</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Uzbek">Uzbek</option>
        </select>
        <select className='select' value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Сказки/Стихи/Рассказы">Сказки/Стихи/Рассказы</option>
          <option value="Интерактивные книги">Интерактивные книги</option>
          <option value="Развивающие пособия">Развивающие пособия</option>
          <option value="Энциклопедии">Энциклопедии</option>
          <option value="Творчество-лепка/раскраски/наклейки">Творчество-лепка/раскраски/наклейки</option>
          <option value="Развивающие-игры/игрушки">Развивающие-игры/игрушки</option>
          <option value="Книги на английском языке">Книги на английском языке</option>
          <option value="Книжки/Игрушки-музыкальные/деревянные/мягкие">Книжки/Игрушки-музыкальные/деревянные/мягкие</option>
          <option value="Наука и техника">Наука и техника</option>
          <option value="Пазлы">Пазлы</option>
        </select>
        <select className='select' value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
          <option value="">Select Age Group</option>
          <option value="for children from 0 to 2 ages">for children from 0 to 2 ages</option>
          <option value="for children from 3 to 5 ages">for children from 3 to 5 ages</option>
          <option value="for children from 6 to 9 ages">for children from 6 to 9 ages</option>
          <option value="for children from 10 to 15 ages">for children from 10 to 15 ages</option>
        </select>
      </div>

      <div className='Tab'>
        <table className='table table-hover h'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Special Book Id</th>
              <th>Book img</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publication Date</th>
              <th>Quantity</th>
              <th>Age Limitation</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Language</th>
              <th>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='tb'>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.special_book_id}</td>
                <td>
                  <div>
                    {/* Display the existing image */}
                    <img
                      src={`/static/images/${book.photos}`}
                      alt={book.title}
                      style={{ width: '50px', height: '50px' }}
                    />
                    {/* File input for uploading a new image */}
                    <input
                      type="file"
                      accept="images/*"
                      onChange={(e) => handleImage(e, book.id)}
                      style={{ display: 'block', marginTop: '5px' }}
                    />
                  </div>
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publication_date}</td>
                <td>
                  <input
                    type="number"
                    className='update-incremant'
                    value={quantityInputs[book.id] || book.quantity}
                    onChange={(e) => handleQuantityInputChange(book.id, e.target.value)}
                    onBlur={() => handleQuantityChange(book.id, quantityInputs[book.id])}
                    min="0"
                  />
                </td>
                <td>{book.ages}</td>
                <td>{book.category}</td>
                <td>{book.description}</td>
                <td>{book.price}</td>
                <td>{book.language}</td>
                <td>{book.barcode}</td>
                <td>
                  <button className='btn btn-danger' onClick={() => handleDelete(book.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className={`popup ${isError ? 'error' : 'success'}`}>
          <p>{notification}</p>
        </div>
      )}
    </div>
  );
}

export default Pagination;
