import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* deleteItem(action) {
    try {
        const res = yield axios.delete(`/api/user/delete/${action.payload}`)
    } catch (error) {
        console.log("didn't get the id we need:", error);
    }
}

// saga to get the specific user's song history
function* fetchUserHistory(action) {
  try {
    // make the call to the server to get the user's history
    const res = yield axios.get(`/api/user/history/${action.payload}`);

    yield put({type: 'SET_HISTORY', payload: res.data})
  } catch (error) {
    console.log("Error connecting to server in fetchUserHistory", error);
  }
}

function* historySaga() {
    yield takeLatest('DELETE_HISTORY_ITEM', deleteItem);
    yield takeLatest('GET_HISTORY', fetchUserHistory);
}

export default historySaga;