import React, { useState } from 'react';
import axios from 'axios';
import './cart.css';

const PaymentPage = ({ totalPrice, showPayment, setShowPayment }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('refreshToken'); // Use your token
      const response = await axios.post('/process-payment', {
        card_number: cardNumber,
        card_holder: cardHolder,
        expiry_date: expiryDate,
        cvv: cvv,
        amount: amount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Payment successful:', response.data);
      // Redirect or show success message
    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closePayment = () => {
    showPayment(false);
  };

  return (
    <div className="paymentContainer">
      <button onClick={closePayment} className='btn clso text-danger'>Cancel</button>
      <form onSubmit={handlePayment} className="paymentForm">
        <h2>Payment</h2>
        <div className="formGroup">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="cardHolder">Card Holder</label>
          <input
            type="text"
            id="cardHolder"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={totalPrice}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="paymentButton btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
