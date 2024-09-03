import React from 'react';
import Sider from './Sider';  
import Show from './Show';


const AdminPage = () => {
    return (
        <div className="container-fluid">
            <Sider />
            <Show/>
        </div>
    );
};

export default AdminPage;
