import React from "react";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR_IMAGE } from "../../constants/userAssets";

const Navbar2 = () => {
  const [dropdown, setDropDown] = useState(false);
  const location = useLocation();
  const [notificationCount] = useState(3); // Example notification count

  console.log(location)

  return (
    <div className="bg-white h-13 fixed top-0 left-0 right-0 z-1000 shadow-sm">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6 lg:px-8 h-full flex justify-between items-center">
      <div className="flex gap-2 items-center h-full">
        <div>
          <img
            src={"https://pngimg.com/d/linkedIn_PNG13.png"}
            alt="LinkedInLogo"
            className="w-7 h-7"
          />
        </div>
    
        <div className="relative">
          <input 
            className="searchInput w-70 bg-gray-100 rounded-sm h-10 px-4" 
            placeholder="Search" 
            onFocus={() => setDropDown(true)}
            onBlur={() => setDropDown(false)}
          />
          {dropdown && (
            <div className='absolute w-88 left-0 bg-gray-200'>
              <div className='flex gap-2 mb-1 items-center cursor-pointer'>
                <div>
                  <img 
                    className='w-10 h-10 rounded-full' 
                    src='https://media.licdn.com/dms/image/D4D03AQH1X3K2e6E2xg/profile-displayphoto-shrink_800_800/0/1683296324862?e=2147483647&v=beta&t=YJH6Z1bX5n0b6u0K3l0d8YI3j1F6v1X5n5F5F5F5F5F'
                    alt='profile' />
                  <div>Rishijeet</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="hidden gap-10 md:flex h-full">
        <Link to="/posts" className="flex flex-col items-center cursor-pointer">
          <HomeIcon sx={{ color: location.pathname === '/posts' ? "black" : "gray" }} />
          <div className="text-sm text-gray-500">Home</div>
        </Link>

        <Link to="/mynetwork" className="flex flex-col items-center cursor-pointer">
          <PeopleIcon sx={{ color: location.pathname === '/mynetwork' ? "black" : "gray" }} />
          <div className="text-sm text-gray-500">My Network</div>
        </Link>

        <Link to="/resume" className="flex flex-col items-center cursor-pointer">
          <WorkIcon sx={{ color: location.pathname === '/resume' ? "black" : "gray" }} />
          <div className="text-sm text-gray-500">Resume</div>
        </Link>

        <Link to="/message" className="flex flex-col items-center cursor-pointer">
          <MessageIcon sx={{ color: location.pathname === '/message' ? "black" : "gray" }} />
          <div className="text-sm text-gray-500">Messages</div>
        </Link>

        <div className="flex flex-col items-center cursor-pointer relative">
          <NotificationsIcon sx={{ color: location.pathname === '/Notifications' ? "black" : "gray" }} />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notificationCount}
            </div>
          )}
          <div className="text-sm text-gray-500">Notification</div>
        </div>

        <Link to="/profile" className="flex flex-col items-center cursor-pointer">
          <img className='w-6 h-6 rounded-full' src={DEFAULT_AVATAR_IMAGE} alt='Me' />
          <div className="text-sm text-gray-500">Me</div>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Navbar2;