import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  //console.log("User inside DashboardLayout:", user);
  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user ? (
        <div className="flex bg-pink-300">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu}/>                            
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      ) : (
        <div>Not Logged In</div>
      )}
    </div>
  );
};

export default DashboardLayout;
