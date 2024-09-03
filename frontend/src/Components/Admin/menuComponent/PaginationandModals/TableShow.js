import React, { useState, useEffect } from 'react';
import Pagination from './pagination';

function TableShow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  const [table, setTable] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  // Filter users based on search term and filter option
  const filteredTable = table.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterOption === 'All' || user.name.startsWith(filterOption);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='Showtable'>
      <div className='Heade'>
        <div className='top'>
          <h2>Users</h2>
        </div>
      </div>
      <div className="body">
        <Pagination data={filteredTable} />
      </div>
    </div>
  );
}

export default TableShow;

