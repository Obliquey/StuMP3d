import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    // * I need to configure what information about the user actually gets set in the reducer.
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

// saga to get the specific user's song history
function* fetchUserHistory(action) {
  try {
    const res = yield axios.get(`/api/user/history/${action.payload}`);

    console.log("Here's our user's history:", res.data);
  } catch (error) {
    console.log("Error connecting to server in fetchUserHistory", error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('GET_HISTORY', fetchUserHistory);
}

export default userSaga;
