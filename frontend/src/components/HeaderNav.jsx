import React from 'react';
import userProfile from '../assets/user.png';

const HeaderNav = () => {
    return (
        <header>
          <div class="header-right">
            <img
              src={userProfile}
              alt="Profile"
              class="profile-picture"
            />
            <span class="username">Username</span>
          </div>
          <div class="header-center">
            <h1>Welcome to the BK Queue System: Online Version</h1>
          </div>
        </header>
    );
};

export default HeaderNav;







