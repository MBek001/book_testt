import React from 'react'
import './show2.css'
import img from '../../../img/bg.png'
import { Checkout,DeleteCart,InputCart,ClearCart  } from './../../../Store/sale';
import { useDispatch, useSelector } from 'react-redux'
import {FaTrash} from 'react-icons/fa'
import { useState } from 'react';
import { useEffect } from 'react';

function Sales() {
    const cart = useSelector((state)=>state.Cart.cart)
    const dispatch = useDispatch()
    const [delet,setDelet] = useState([])
    
    function Submit() {
        dispatch(Checkout(cart))
    }    
    

    const subTotal = cart.reduce((a, b) => {
      a += b.price * b.amount;
      return a;
    }, 0);
    const tax = (subTotal / 100) * 18;

  return (
   
    <div className='salesside'>

        <h3 className='s'>Sales</h3>
        <div className='centersale'>
            <div className='tableside'>
            {
            cart == '' ? <img src={img} className={'imgtab'} alt="" />:<table className="table mt-2 st">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      className="Saleimg"
                      src={`https://store-management-backend-app.herokuapp.com/api/v1/attachment/${item.imageId}`}
                      alt={`${
                        item.productName.length > 15
                          ? `${item.productName.substr(0, 15)}...`
                          : item.productName
                      }`}
                    />
                  </td>
                  <td>
                    {"  "}
                    {item.productName.length > 15
                      ? `${item.productName.substr(0, 15)}...`
                      : item.productName}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.amount}
                      className={"quantity"}
                      onChange={(e) =>
                        dispatch(
                          InputCart({
                            id: item.productId,
                            amount: e.target.value,
                          })
                        )
                      }
                    />
                  </td>
                  <td>{item.price}</td>
                  <td>{item.amount * item.price}</td>
                  <td>
                    <button
                      onClick={
                        () => dispatch(DeleteCart(item)) 
                      }
                      className="btn btn-danger"
                    >
                      <FaTrash/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
          }
                
            </div>
            <div className='totleside'>
                <div className='inset'>
                  <h4 className='h4'>Price</h4>
                   <h6 className='h5'>Sub Total:<span>$ {subTotal}</span></h6>
                   <h6 className='h5'>Shiping:<span>Free</span></h6>
                   <h6 className='h5'>Tax (18%):<span>${ parseInt(tax)}</span></h6>
                   <h4 className='Total'>Total:<span>${ subTotal + tax}</span></h4>
                </div>
                <button className='btn btn-success  mx-2 mt-3 f' onClick={Submit}>CheckOut</button>
                <button className='btn btn-danger mt-3 f' onClick={ClearCart}>Clear All</button>
            </div>
            
        </div>
    </div>
    
  )
}

export default Sales