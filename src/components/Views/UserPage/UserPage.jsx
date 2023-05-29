import React from 'react';
import LogOutButton from '../../FunctionComponents/LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


// * This component will be the display of all the User's info, like current streak and current score, song history etc.
function UserPage() {
  const user = useSelector((store) => store.user);
  const userHistory = useSelector(store => store.guess.userHistory)
  const dispatch = useDispatch();
  const history = useHistory();
  // will need a useEffect to proc a dispatch upon page load
  console.log("Our user's info:", userHistory);
  useEffect(() => {
    dispatch({
      type: 'GET_HISTORY',
      payload: user.id
    })
  }, [])

  // quick function to conditionally render the score + streak
  const returnZero = (value) => {
    if(!value) {
      return 0;
    } else {
      return value
    }
  } 
  
  // dispatch will call to Saga to get the user's history + current score and streak
  
  // click handler to take the player back to the playPage + clear out the reducers
  const playAgain = () => {
    dispatch({
      type: 'EMPTY_PREVIEWS',
      payload: []
    });
    dispatch({
        type: 'EMPTY_ALBUM',
        payload: []
    })
    dispatch({
        type: 'CLEAR_SONGS_ARRIVED',
        payload: 'false'
    })
    history.push('/playPage');
  }
  
  // function to delete a specific history item
  const deleteItem = (id) => {
    console.log("You sure you want to delete this song?",id);
  }
  return (
    <div className="flex flex-row space-x-12">
      {/* User Info + current streak, current score, etc */}
      <div className='m-auto basis-1/4 ml-86 border-inherit rounded-3xl text-center bg-purple-400 w-96 p-12 space-y-8'>
        <p className='text-4xl mb-24'>{user.username}</p>
        <p>Current Score: {returnZero(user.current_score)}</p>
        <p>Current Streak: {returnZero(user.current_streak)}</p>
        <button onClick={playAgain} className='border-inherit rounded-full p-2 bg-purple-700 m-2 text-white font-medium'>Play Again</button>
      </div>

      {/* their history, last ten songs listened to */}
      <div className="relative overflow-x-auto justify-self-center m-auto basis-1/2">
        <p className='text-xl underline italic text-center'>History</p>
        <table className="w-auto border-spacing-1 h-1 m-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-purple-800 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">Song</th>
              <th scope="col" className="px-6 py-3">Artist</th>
              <th scope="col" className="px-6 py-3">Album</th>
              <th scope="col" className="px-6 py-3">Released</th>
              <th scope="col" className="px-6 py-3">Guess</th>
              <th scope="col" className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              userHistory.map(item => {
                return (
                  <tr className="bg-white border-b dark:bg-gray-600 dark:border-gray-700 h-2" key={userHistory.indexOf(item)}>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.song_name}</td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.artist}</td>
                    <td><img src={item.cover_art}/></td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.year_released}</td>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{!item.correctly_guessed ? <p>Incorrect</p> : <p>Correct</p>}</td>
                    <td className='text-center'><button onClick={() => deleteItem(item.id)}>X</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
