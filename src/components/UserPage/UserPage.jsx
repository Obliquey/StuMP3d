import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';

// * This component will be the display of all the User's info, like current streak and current score, song history etc.
function UserPage() {

  const user = useSelector((store) => store.user);
  return (
    <div className="container">
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
