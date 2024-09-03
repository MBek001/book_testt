import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RxCross1 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import PaymentPage from './paymant';
import img from './img/images/at war on the gothic line.jpg'
import './cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowpayment] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('refreshToken');
        const response = await axios.get('/get-shopping-cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const incrementQuantity = async (cartId) => {
    try {
      await axios.post('/shopping-cart/increment-quantity', null, {
        params: {
          cart_id: cartId,
          quantity: 1,
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const decrementQuantity = async (cartId) => {
    try {
      await axios.post('/shopping-cart/decrement-quantity', null, {
        params: {
          cart_id: cartId,
          quantity: 1,
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
      });

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      await axios.delete('/delete-cart', {
        params: { cart_id: cartId },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
      });

      setCartItems(prevItems => prevItems.filter(item => item.id !== cartId));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleConfirmShop = () => {
    setShowpayment(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='cartContainer'>
        <div className='left-cart'>
          <div className='cart-head d-flex'>
            <h3>Shopping Cart</h3>
            <p>{cartItems.length} items</p>
          </div>
          <div className='body-cart'>
            <table className="table table-hover z">
              <thead>
                <tr>
                  <th>Id</th>
                  <th></th>
                  <th>Book</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <img src={img} alt="Book Cover" className='book-cover' />
                    </td>
                    <td>
                      <h4>{item.book_title}</h4>
                    </td>
                    <td>
                      <button onClick={() => incrementQuantity(item.id)} className='incr'><GoPlus /></button>
                      <input type='text' value={item.quantity} readOnly className='quantity-inp' />
                      <button onClick={() => decrementQuantity(item.id)} className='dcr'><FiMinus /></button>
                    </td>
                    <td>
                      <p>{item.price}</p>
                    </td>
                    <td>
                      <RxCross1 onClick={() => deleteCartItem(item.id)} style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='bottom-cart-cart'>
            <a href='/books'>&larr; Back to shop</a>
          </div>
        </div>
        <div className='right-cart'>
          <div className='right-cart-head'>
            <h3>Summary</h3>
            <div className='line'></div>
          </div>
          <div className='right-cart-body'>
            <div className='d-flex'>
              <p>ITEMS</p>
              <p>{cartItems.length}</p>
            </div>
            <label className='mt-3'>SHIPPING</label>
            <select>
              <option value={"normal-shipping"}>Normal shipping - UZS 5.00</option>
              <option value={"normal-shipping"}>Normal shipping - UZS 5.00</option>
              <option value={"normal-shipping"}>Normal shipping - UZS 5.00</option>
            </select>
            <div className='line'></div>
            <div className='d-flex mt-3 mb-4'>
              <p>TOTAL PRICE</p>
              <p>{totalPrice} USD</p>
            </div>
            <button onClick={handleConfirmShop}>Confirm Shop</button>
          </div>
        </div>
      </div>
      {showPayment && <PaymentPage  totalPrice={totalPrice} // Example price
                         showPayment={setShowpayment}/>}
    </>
  );
};

export default CartPage;
