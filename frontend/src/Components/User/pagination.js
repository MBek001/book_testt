// import { Button } from "bootstrap";
import React from "react";
import './books.css'

const Pagination = ({totalPosts , postPerPage , setCurentpage}) =>{
   let page = []

   for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
     page.push(i)
   }

   return (
      <div className="Pagination">
          {
            page.map((page, index) =>{
                return <button key={index} onClick={()=> setCurentpage(page)}>{page}</button>
            })
          }
      </div>
   )
}

export default Pagination