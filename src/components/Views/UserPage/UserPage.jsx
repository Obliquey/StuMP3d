import React from 'react';
import LogOutButton from '../../FunctionComponents/LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';

// * This component will be the display of all the User's info, like current streak and current score, song history etc.
function UserPage() {

  const user = useSelector((store) => store.user);
  return (
    <div className="text-center">
      <p>UserName</p>
      <
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
