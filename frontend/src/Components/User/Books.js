import axios from "axios";
import { useEffect, useState } from "react";
import somebook from './img/images/at war on the gothic line.jpg'
import './books.css'
import Pagination from "./pagination";



const Books = () =>{
  const [books, setBooks] = useState([]);
  const [languageFilter, setLanguageFilter] = useState(''); // State for language filter
  const [categoryFilter, setCategoryFilter] = useState(''); // State for category filter
  const [ageFilter, setAgeFilter] = useState(''); // State for age group filter
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [curentPage, setCurentpage] = useState(1);
  const [postPerPage, setPostPerpage] = useState(8);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [users, setUsers] = useState('');
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Function to fetch books from the API
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://0.0.0.0:8000/book/get-books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // UseEffect hook to fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to handle adding a book to the cart
  const handleAddToCart = async (book) => {
    const token = localStorage.getItem('refreshToken');
    try {
      const requestBody = {
        book_id: book.id, // assuming `book.id` is the correct identifier
        quantity: 1, 
      };
  
      const response = await axios.post('http://0.0.0.0:8000/add-to-cart', requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      // Check if the book is already in the cart based on the response status or detail message
      if (response.status === 400 && response.data.detail === 'Book is already in cart') {
        alert(`${book.title} is already in the cart`);
      } else {
        console.log('Book added to cart:', response.data);
        alert(`${book.title} has been added to the cart`);
      }
  
    } catch (error) {
      // Handle the case where the book is already in the cart
      if (error.response && error.response.status === 400 && error.response.data.detail === 'Book is already in cart') {
        alert(`${book.title} is already in the cart`);
      } else {
        console.error('Error adding to cart:', error);
        alert('Failed to add the book to the cart');
      }
    }
  };

  
  

  const lastPostIndex = curentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  const filteredSlicedMappedBooks = books
    .filter((book) => (
      (languageFilter ? book.language === languageFilter : true) &&
      (categoryFilter ? book.category === categoryFilter : true) &&
      (ageFilter ? book.ages === ageFilter : true) &&
      (searchTerm ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (minPrice ? book.price >= minPrice : true) &&
      (maxPrice ? book.price <= maxPrice : true)
    ))
    .slice(firstPostIndex, lastPostIndex)
    .map((book) => (
      <div className="book-item" key={book.id}>
        <div className="img-top">
          <img src={ somebook} alt={`Cover of ${book.title}`} />
        </div>
        <div className="bottom-cart">
          <h3>{book.title}</h3>
          <p className="authors">{book.author}</p>
          <p className="price">{`UZS ${book.price}`}</p>
          <button className="cart-btn" onClick={() => handleAddToCart(book)}>
            <svg
              width="20.06"
              height="24"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.53025 0C4.15756 0 3.03082 1.12675 3.03082 2.49943V2.99932H0.562373L0.53138 3.46822L0.031493 12.4662L0 12.9971H11.06L11.029 12.4657L10.5291 3.46772L10.4976 2.99932H8.02969V2.49943C8.02969 1.12675 6.90294 0 5.53025 0ZM5.53025 0.999774C5.92798 0.999774 6.30943 1.15777 6.59067 1.43901C6.87191 1.72026 7.02991 2.1017 7.02991 2.49943V2.99932H4.03059V2.49943C4.03059 2.1017 4.18859 1.72026 4.46983 1.43901C4.75107 1.15777 5.13251 0.999774 5.53025 0.999774ZM1.49966 3.9991H3.03082V5.49876H4.03059V3.9991H7.02991V5.49876H8.02969V3.9991H9.56084L9.99824 11.9973H1.06276L1.49966 3.9991Z"
                fill="#fff"
              />
            </svg>
            Add to cart
          </button>
        </div>
      </div>
    ));


  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('refreshToken'); // Use accessToken instead of refreshToken
            const response = await axios.get('http://0.0.0.0:8000/auth/user_info', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const userData = response.data[0];
            setUsers(userData.name);   
         } catch (error) {
            console.error('Error fetching user profile:', error);
         }
       };
         fetchUserProfile();
   }, []);



   useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('refreshToken'); // Use your token
        const response = await axios.get('http://0.0.0.0:8000/get-shopping-cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);
 
    
   return(
    <div className="Container-books">
       <div className="top-bar">
        <div className="contact-info">
          <div className="phone-and-number">
            <svg
              className="phone"
              width="15"
              height="20"
              viewBox="0 0 15 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.98047 0.106456C4.51808 -0.058503 5.09499 -0.0310978 5.61516 0.184109C6.13533 0.399317 6.56738 0.789342 6.8394 1.28926L6.93031 1.47556L7.74364 3.31478C7.99047 3.87303 8.0706 4.49281 7.97404 5.09704C7.87749 5.70126 7.60853 6.26327 7.2006 6.71316L7.0372 6.8782L5.75578 8.09476C5.52481 8.31732 5.69804 9.17879 6.53348 10.6517C7.28537 11.977 7.89721 12.5959 8.19822 12.6297H8.25105L8.31616 12.6172L10.8348 11.8332C11.1733 11.7276 11.5345 11.7234 11.8752 11.8212C12.216 11.919 12.5219 12.1146 12.7563 12.3846L12.8681 12.5284L14.5353 14.879C14.862 15.3397 15.0248 15.9 14.9969 16.4675C14.969 17.035 14.752 17.5758 14.3817 18.0011L14.2318 18.1586L13.5659 18.8013C12.968 19.3776 12.22 19.767 11.4109 19.9233C10.6017 20.0795 9.76556 19.996 9.00171 19.6827C6.62439 18.7075 4.46453 16.4794 2.50248 13.021C0.536733 9.55389 -0.280279 6.53186 0.0846125 3.94369C0.19503 3.16133 0.511597 2.424 1.00069 1.81001C1.48979 1.19603 2.13315 0.728318 2.86245 0.456546L3.09957 0.376525L3.98047 0.106456Z"
                fill="#fff"
              />
            </svg>
            <p className="number">+91 8374902234</p>
          </div>
          <div className="logos">
            <svg
              width="11"
              height="21"
              viewBox="0 0 11 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.05272 0C5.23205 0 3.57771 1.48976 3.57771 4.88429V7.87097H0V11.4487H3.57771V20.0352H7.15543V11.4487H10.0176L10.7331 7.87097H7.15543V5.48964C7.15543 4.21097 7.57259 3.57771 8.77255 3.57771H10.7331V0.146686C10.394 0.100891 9.40581 0 8.05272 0Z"
                fill="fff"
              />
            </svg>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.29462 -6.10352e-05C2.75372 -6.10352e-05 0.665771 2.08503 0.665771 4.62878V11.113C0.665771 13.6539 2.75086 15.7419 5.29462 15.7419H11.7789C14.3198 15.7419 16.4077 13.6568 16.4077 11.113V4.6295C16.4077 2.08789 14.3226 -6.10352e-05 11.7789 -6.10352e-05H5.29462ZM5.29462 1.43102H11.7789C12.199 1.43046 12.615 1.51279 13.0033 1.67329C13.3915 1.83379 13.7442 2.06931 14.0413 2.36637C14.3383 2.66342 14.5739 3.01616 14.7344 3.40439C14.8949 3.79261 14.9772 4.20869 14.9766 4.62878V11.113C14.9772 11.5331 14.8949 11.9492 14.7344 12.3374C14.5739 12.7257 14.3383 13.0784 14.0413 13.3754C13.7442 13.6725 13.3915 13.908 13.0033 14.0685C12.615 14.229 12.199 14.3114 11.7789 14.3108H5.29533C4.87518 14.3114 4.45902 14.2292 4.07071 14.0687C3.68241 13.9083 3.32958 13.6728 3.03245 13.3757C2.73532 13.0786 2.49974 12.7259 2.33919 12.3376C2.17864 11.9493 2.09629 11.5332 2.09686 11.113V4.6295C2.0962 4.20934 2.17845 3.79319 2.33891 3.40488C2.49937 3.01657 2.73488 2.66375 3.03194 2.36662C3.32901 2.06949 3.68178 1.8339 4.07005 1.67336C4.45832 1.51281 4.87446 1.43046 5.29462 1.43102ZM12.7627 2.99663C12.6775 2.99625 12.593 3.01276 12.5142 3.04521C12.4354 3.07765 12.3638 3.12539 12.3035 3.18566C12.2432 3.24594 12.1955 3.31755 12.163 3.39638C12.1306 3.4752 12.1141 3.55967 12.1145 3.64491C12.1145 4.00555 12.4021 4.29319 12.7627 4.29319C12.848 4.29367 12.9326 4.27723 13.0115 4.24483C13.0904 4.21242 13.1621 4.1647 13.2224 4.10442C13.2828 4.04413 13.3306 3.97248 13.3631 3.89361C13.3956 3.81474 13.4121 3.73021 13.4117 3.64491C13.4121 3.55961 13.3956 3.47508 13.3631 3.39621C13.3306 3.31734 13.2828 3.24569 13.2224 3.18541C13.1621 3.12512 13.0904 3.0774 13.0115 3.045C12.9326 3.0126 12.848 2.99616 12.7627 2.99663ZM8.53674 3.57765C6.17545 3.57765 4.24348 5.50962 4.24348 7.87091C4.24348 10.2322 6.17545 12.1642 8.53674 12.1642C10.898 12.1642 12.83 10.2322 12.83 7.87091C12.83 5.50962 10.898 3.57765 8.53674 3.57765ZM8.53674 5.00874C10.1274 5.00874 11.3989 6.28026 11.3989 7.87091C11.3989 9.46156 10.1274 10.7331 8.53674 10.7331C6.94609 10.7331 5.67457 9.46156 5.67457 7.87091C5.67457 6.28026 6.94609 5.00874 8.53674 5.00874Z"
                fill="#fff"
              />
            </svg>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.23127 -6.04931e-05C1.98304 -0.000248489 1.73721 0.0484688 1.50782 0.143309C1.27842 0.238148 1.06996 0.377252 0.894341 0.552675C0.718719 0.728097 0.579379 0.9364 0.484279 1.16569C0.389178 1.39497 0.340182 1.64075 0.340088 1.88897C0.340088 2.93366 1.18657 3.79947 2.22912 3.79947C3.2731 3.79947 4.1203 2.93366 4.1203 1.8904C4.12049 1.64221 4.07176 1.39642 3.97692 1.16706C3.88207 0.937709 3.74295 0.729294 3.56752 0.55373C3.39209 0.378166 3.18378 0.238892 2.9545 0.14387C2.72522 0.0488479 2.47946 -6.05644e-05 2.23127 -6.04931e-05ZM11.456 5.00874C9.86825 5.00874 8.96023 5.83877 8.52375 6.6645H8.47795V5.23127H5.34889V15.7419H8.60961V10.5392C8.60961 9.16819 8.71265 7.843 10.4092 7.843C12.0814 7.843 12.1058 9.40646 12.1058 10.6257V15.7419H15.3665V9.96888C15.3665 7.14392 14.759 5.00874 11.456 5.00874ZM0.59983 5.23056V15.7419H3.8627V5.23056H0.59983Z"
                fill="#fff"
              />
            </svg>
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4721 1.6561C16.8291 1.94076 16.1469 2.12721 15.4485 2.20921C16.1838 1.76892 16.7341 1.0765 16.997 0.260788C16.3055 0.670605 15.5493 0.959984 14.7609 1.11658C14.2779 0.600207 13.6507 0.241108 12.9609 0.0859739C12.271 -0.0691603 11.5505 -0.0131523 10.8929 0.246715C10.2353 0.506582 9.67113 0.958285 9.2737 1.54309C8.87628 2.12789 8.66401 2.81874 8.66448 3.52581C8.66448 3.80272 8.69525 4.07105 8.7575 4.32793C7.35612 4.25895 5.985 3.89546 4.73349 3.26114C3.48199 2.62682 2.37819 1.73591 1.49403 0.646465C1.17989 1.1842 1.01512 1.7961 1.01676 2.41886C1.01676 3.6403 1.63714 4.71933 2.58452 5.35116C2.02493 5.3334 1.47776 5.18176 0.988855 4.90895V4.95403C0.988371 5.76773 1.26966 6.55649 1.7849 7.18627C2.30015 7.81604 3.01758 8.24798 3.81525 8.40867C3.29653 8.55093 2.75204 8.57198 2.22388 8.47021C2.44885 9.17023 2.88686 9.78249 3.47671 10.2215C4.06657 10.6605 4.77881 10.9043 5.51395 10.9188C4.78312 11.4924 3.94635 11.9163 3.05151 12.1662C2.15668 12.416 1.22135 12.487 0.299072 12.3749C1.90942 13.4112 3.7843 13.9615 5.69927 13.9598C12.1807 13.9598 15.7255 8.59042 15.7255 3.93367C15.7255 3.7834 15.7197 3.62885 15.714 3.47787C16.4028 2.97917 16.9979 2.36267 17.4721 1.65681V1.6561Z"
                fill="#fff"
              />
            </svg>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.69804 0.00012207C3.5594 0.00012207 2.46739 0.452446 1.66225 1.25759C0.857109 2.06273 0.404785 3.15474 0.404785 4.29338V9.30218C0.404785 10.4408 0.857109 11.5328 1.66225 12.338C2.46739 13.1431 3.5594 13.5954 4.69804 13.5954H9.70684C10.8455 13.5954 11.9375 13.1431 12.7426 12.338C13.5478 11.5328 14.0001 10.4408 14.0001 9.30218V5.72446C14.0001 5.53469 13.9247 5.35269 13.7905 5.2185C13.6563 5.08431 13.4743 5.00892 13.2846 5.00892H12.569C12.3792 5.00892 12.1972 4.93353 12.063 4.79934C11.9289 4.66515 11.8535 4.48315 11.8535 4.29338C11.8535 3.15474 11.4011 2.06273 10.596 1.25759C9.79086 0.452446 8.69885 0.00012207 7.56021 0.00012207H4.69804ZM4.69804 3.57783H7.56021C7.95376 3.57783 8.27575 3.89983 8.27575 4.29338C8.27575 4.68693 7.95376 5.00892 7.56021 5.00892H4.69804C4.30449 5.00892 3.9825 4.68693 3.9825 4.29338C3.9825 3.89983 4.30449 3.57783 4.69804 3.57783ZM4.69804 8.58663H9.70684C10.1004 8.58663 10.4224 8.90863 10.4224 9.30218C10.4224 9.69572 10.1004 10.0177 9.70684 10.0177H4.69804C4.30449 10.0177 3.9825 9.69572 3.9825 9.30218C3.9825 8.90863 4.30449 8.58663 4.69804 8.58663Z"
                fill="#fff"
              />
            </svg>
          </div>
        </div>
        <div className="cart">
          <a href="/userprofile" className="pr">
          <div className="photo">
             <p>{users.charAt(0).toUpperCase()}</p>
          </div>
          </a>
          <div className="search-bar">
            <input
              className="search-books"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Books"
            />
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.0013 0C7.14359 0 4.00257 3.1409 4.00257 6.99844C4.00257 8.67457 4.59046 10.2107 5.57728 11.4166L0 16.9922L1.00712 18L6.58369 12.4229C7.82914 13.444 9.39078 14.0004 11.0013 13.9969C14.859 13.9969 18 10.856 18 6.99844C18 3.1409 14.859 0 11.0013 0ZM11.0013 1.39969C14.1017 1.39969 16.6003 3.89813 16.6003 6.99844C16.6003 10.0988 14.1017 12.5972 11.0013 12.5972C7.90085 12.5972 5.40231 10.0988 5.40231 6.99844C5.40231 3.89813 7.90085 1.39969 11.0013 1.39969Z"
                fill="#111111"
              />
            </svg>
          </div>
          <div className="account">
            <a href="/userprofile" 
              ><svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 0C3.687 0 1.8 1.85841 1.8 4.13636C1.8 5.56045 2.538 6.825 3.6564 7.57132C1.5162 8.47541 0 10.5672 0 13H1.2C1.2 10.3823 3.342 8.27273 6 8.27273C8.658 8.27273 10.8 10.3823 10.8 13H12C12 10.5672 10.4838 8.476 8.3436 7.57073C8.91441 7.19123 9.38209 6.67975 9.70572 6.08104C10.0293 5.48233 10.1991 4.81463 10.2 4.13636C10.2 1.85841 8.313 0 6 0ZM6 1.18182C7.6638 1.18182 9 2.49777 9 4.13636C9 5.77495 7.6638 7.09091 6 7.09091C4.3362 7.09091 3 5.77495 3 4.13636C3 2.49777 4.3362 1.18182 6 1.18182Z"
                  fill="#393280"
                />
              </svg>
              ACCOUNT
            </a>
            <div className="line1"></div>
            <a href="/cart"
              ><svg
                width="11.06"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.53025 0C4.15756 0 3.03082 1.12675 3.03082 2.49943V2.99932H0.562373L0.53138 3.46822L0.031493 12.4662L0 12.9971H11.06L11.029 12.4657L10.5291 3.46772L10.4976 2.99932H8.02969V2.49943C8.02969 1.12675 6.90294 0 5.53025 0ZM5.53025 0.999774C5.92798 0.999774 6.30943 1.15777 6.59067 1.43901C6.87191 1.72026 7.02991 2.1017 7.02991 2.49943V2.99932H4.03059V2.49943C4.03059 2.1017 4.18859 1.72026 4.46983 1.43901C4.75107 1.15777 5.13251 0.999774 5.53025 0.999774ZM1.49966 3.9991H3.03082V5.49876H4.03059V3.9991H7.02991V5.49876H8.02969V3.9991H9.56084L9.99824 11.9973H1.06276L1.49966 3.9991Z"
                  fill="#393280"
                />
              </svg>
              CART:({cartItems.length})
            </a>
            <div className="line2"></div>
            <a href="#"
              ><svg
                width="15"
                height="13"
                viewBox="0 0 17 14"
                fillRule="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.91266 7.64435C0.290154 5.5258 0.830989 2.34797 3.53517 1.2887C6.23934 0.229422 7.86185 2.34797 8.40268 3.40725C8.94352 2.34797 11.1069 0.229422 13.811 1.2887C16.5152 2.34797 16.5152 5.5258 14.8927 7.64435C13.2702 9.7629 8.40268 14 8.40268 14C8.40268 14 3.53517 9.7629 1.91266 7.64435Z"
                  stroke="#393280"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              WISHLIST
            </a>
          </div>
        </div>
      </div>
      <div className="bottom-bar">
           <h1><a href="/">HOME</a> / BOOKS</h1>
      </div>
      <div className="main-book-part">
         <div className="filter-part">
            <div className="filter-by-price">
                 <div className="filter-top-part">
                     <p>UZS</p>
                     <input 
                       placeholder="Min"
                       type="number"
                       value={minPrice}
                       onChange={(e) => setMinPrice(e.target.value)}
                       min="0"
                     />
                     <p className="to">to</p>
                     <p>UZS</p>
                     <input 
                       type="number"
                       placeholder="Max"
                       value={maxPrice}
                       onChange={(e) => setMaxPrice(e.target.value)}
                       min="0"
                       
                    />
                 </div>
            </div>
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
         <div className="body-part">
             {
               filteredSlicedMappedBooks
             }
         </div>
         <Pagination
                totalPosts= {books.length}
                postPerPage ={postPerPage}
                setCurentpage={setCurentpage}
         />
      </div>
    </div>
   )
}

export default Books