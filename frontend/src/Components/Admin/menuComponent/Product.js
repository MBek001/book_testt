import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Link } from 'react-router-dom'
import PaginationProduct from './PaginationandModals/paginationProduct'
import {useSelector} from 'react-redux'

function TableShow() {  
    


    const [value, setValue] = React.useState(new Date('2022-07-31T21:11:54'));
    const [product,setProduct] = useState([])

    const handleChange = (newValue) => {
      setValue(newValue);
    };



  return (
    <div className='Showtable'>
        <div className='Heade'>
            <div className='top'>
                <h2>Product </h2>
            </div>
        </div>
        <div className="body">
              <PaginationProduct data={product}/>
        </div>
    </div>
  )
}

export default TableShow

