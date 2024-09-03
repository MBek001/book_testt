import React, { useState } from 'react'
import Historypagination from './Historypagination'

function History() {

  const [history,setHistory] = useState([])

  return (
    <div className='historyside' >
       <Historypagination history={history}/>
    </div>
  )
}

export default History