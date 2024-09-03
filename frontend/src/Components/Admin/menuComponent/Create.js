import React, { useState } from 'react';
import img1 from '../../../img/img.png';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Create() {
  const [specialBookId, setSpecialBookId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [language, setLanguage] = useState('');
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const bookData = new URLSearchParams({
      special_book_id: specialBookId,
      title: title,
      author: author,
      publication_date: publicationDate,
      quantity: quantity,
      age: age,
      category: category,
      description: description,
      price: price,
      language: language,
      barcode: barcode,
    }).toString();
  
    axios.post(`http://0.0.0.0:8000/book/add-book?${bookData}`)
      .then((res) => {
        console.log('Book added successfully:', res.data);
      }).catch(err => console.log('Error adding book:', err));
  
    // Clear form fields
    setSpecialBookId('');
    setTitle('');
    setAuthor('');
    setPublicationDate('');
    setQuantity('');
    setAge('');
    setCategory('');
    setDescription('');
    setPrice('');
    setLanguage('');
    setBarcode('');
  };

  return (
    <div className='createside'>
      <div className='heade1'>
        <h4 className='m'>Create New Book</h4>
        <div className='centerside'>
          <div className='leftcreate'>
            <input
              type="text"
              value={specialBookId}
              onChange={(e) => setSpecialBookId(e.target.value)}
              placeholder='Special Book ID'
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Book Title'
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder='Author'
            />
            <input
              type="text"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              placeholder='Publication Date'
            />
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder='Barcode'
            />
            <p className='lable'>Description</p>
            <textarea
              className='textarea'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className='rightcreate'>
            <div className='topcreate'>
              <p className='lable'>Language</p>
              <select className='select1' value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="">Select Language</option>
                <option value="Russian">Russian</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Uzbek">Uzbek</option>
              </select>
              <p className='lable'>Category</p>
              <select className='select1' value={category} onChange={(e) => setCategory(e.target.value)}>
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
              <p className='lable'>Age Group</p>
              <select className='select1' value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">Select Age Group</option>
                <option value="for children from 0 to 2 ages">for children from 0 to 2 ages</option>
                <option value="for children from 3 to 5 ages">for children from 3 to 5 ages</option>
                <option value="for children from 6 to 9 ages">for children from 6 to 9 ages</option>
                <option value="for children from 10 to 15 ages">for children from 10 to 15 ages</option>
              </select>

              <p>Quantity</p>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder='Quantity'
              />
              <p>Price</p>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='Price'
              />
            </div>
            <button className='btn bt btn-success' onClick={handleSubmit}>Create Book</button>
          </div>
          <div className='meddle'>
            <Link className='btn btn-success full float-end mx-1 mt-2' to={'/order'}>Add Book</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
