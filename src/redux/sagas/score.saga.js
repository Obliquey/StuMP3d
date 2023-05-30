import { takeLatest, put } from "redux-saga/effects";
import axios from "axios";

function* fetchScore() {
    try {
      const res = yield axios.get('/api/user/score');
      yield put({type: 'SET_SCORE', payload: res.data})
      
    } catch (error) {
      console.log("Error in user fetchScore saga", error);
    }
  }

  function* scoreSaga() {
    yield takeLatest('FETCH_SCORE', fetchScore);
  }
  export default scoreSaga;