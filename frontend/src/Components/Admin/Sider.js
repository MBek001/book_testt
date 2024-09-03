import React from 'react';
import { Link } from 'react-router-dom';
import img from '../../img/kindpng_1372514.png';
import { FaBox } from 'react-icons/fa';
import { BsFillBagCheckFill, BsFillPlusSquareFill } from 'react-icons/bs';
import { RiFileList2Fill } from 'react-icons/ri';
import './sidebar.css'; 

const Sider = () => {
    return (
        <div className="sider">
            <img src={img} className="logo" alt="Logo" />
            <Link to="users">
                <button className="s-b" activeClassname="active-link">
                    <FaBox className="s-i" />
                    <span className="icn">Users</span>
                </button>
            </Link>
            <Link to="product">
                <button className="s-b">
                    <BsFillBagCheckFill className="s-i" />
                    <span className="icn">Product</span>
                </button>
            </Link>
            <Link to="create">
                <button className="s-b">
                    <BsFillPlusSquareFill className="s-i" />
                    <span className="icn">Create</span>
                </button>
            </Link>
            <Link to="newRelease">
                <button className="s-b">
                    <RiFileList2Fill className="s-i" />
                    <span className="icn">New Release</span>
                </button>
            </Link>
        </div>
    );
};

export default Sider;

