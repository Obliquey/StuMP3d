import React from 'react';
import LogOutButton from '../../FunctionComponents/LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from 'react';


// * This component will be the display of all the User's info, like current streak and current score, song history etc.
function UserPage() {
  // will need a useEffect to proc a dispatch upon page load
  // dispatch will call to Saga to get the user's history + current score and streak
  // const history = useSelector(store => store.history)
  const user = useSelector((store) => store.user);
  // console.log("Here is our user:", user);
  return (
    <div className="text-center">
      {/* User Info + current streak, current score, etc */}
      <p>UserName</p>
      <p>Current Score: </p>
      <p>Current Streak: </p>
      
      {/* their history, last ten songs listened to */}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
