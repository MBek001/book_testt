import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Historypagination() {
    const [latestBooks, setLatestBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get('/home', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                setLatestBooks(response.data['Latest Books']);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching books:', err.response ? err.response.data : err.message);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className='row n'>
            {error && <p className="error">{error}</p>}
            {
                latestBooks.map((book, index) => (
                    <div key={book.id} className='col-md-4 col-lg-4 col-xl-4 col-sm-4 col-9 mt-3'>
                        <div className='card r'>
                            <div className='card-header hed'>
                                {book.photos.length > 0 ? (
                                    <img 
                                        src={`https://store-management-backend-app.herokuapp.com/api/v1/attachment/${book.photos[0]}`} 
                                        className="hisimg"
                                        alt={book.title}
                                    />
                                ) : (
                                    <img 
                                        src="default-image-url" 
                                        className="hisimg"
                                        alt="Default"
                                    />
                                )}
                            </div>
                            <div className='card-body bod'>
                                <h5>Number Product: <span className='mx-2'>{index + 1}</span></h5>
                                <h5>Name: <span className='mx-2'>{book.title}</span></h5>
                                <h5>Amount: <span className='mx-2'>{book.quantity}</span></h5>
                                <h5>Price: <span className='mx-2'>{book.price}</span></h5>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Historypagination;
