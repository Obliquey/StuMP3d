import { takeLatest } from "redux-saga/effects";

function* deleteItem(action) {
    try {
        console.log("Got the id we need:", action.payload);
    } catch (error) {
        console.log("didn't get the id we need:", error);
    }
}

function* historySaga() {
    yield takeLatest('DELETE_HISTORY_ITEM', deleteItem)
}

export default historySaga;