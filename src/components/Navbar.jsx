import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';  
import './Navbar.css'; 
import { IconContext } from 'react-icons';  

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);  // Toggle sidebar visibility

  return (
    <>
      <IconContext.Provider value={{ color: 'white' }}> {/* Apply white color to icons */}
        <div className='navbar'>
          
          <Link to='#' className='menu-bars' >
            <FaIcons.FaBars onClick={showSidebar} /> {/* Hamburger icon */}
          </Link>

          {/* Logo on the right */}
          <Link to='/' className='navbar-logo'>
            <img src='./qicon1.png' alt='Logo' className='logo-image' />
          </Link>
        </div>


        {/* Sidebar */}
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            {/* Close button for sidebar */}
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose /> {/* Close icon */}
              </Link>
            </li>
            {/* Render menu items from SidebarData */}
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span> {/* Menu item title */}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
