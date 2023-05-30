import axios from "axios";
import { combineReducers } from "redux";
import { put, takeLatest } from "redux-saga/effects";


function* correctGuess(action) {
    try {
        console.log("Guessed correctly!", action.payload);
        const response = yield axios({
            method: 'POST',
            url: '/api/guess/guess',
            data: {songInfo: action.payload}
        })
        const res = yield put({
            type: 'SET_CORRECT_SONG',
            payload: {song: action.payload, guess:'true'}
        })
        if (res === 200) {
            console.log("Successfully made axios request to server in correctGuess saga");
        } else {
            console.log("Error in correctGuess saga, error making axios request to server");
        }
    } catch (error) {
        console.log("Error in correctGuess saga", error);
    }
}

function* incorrectGuess(action) {
    try {
        console.log("Guessed incorrectly!", action.payload);
        const response = yield axios({
            method: 'POST',
            url: '/api/guess/guess',
            data: {songInfo:action.payload}
        })
        const res = yield put({
            type:'SET_CORRECT_SONG',
            payload:{song:action.payload, guess:'false'}
        })
        if(res === 200) {
            console.log("Successfully made axios request to server in incorrectGuess saga")
        }else {
            console.log("Error in incorrectGuess saga, error making axios request to db");
        }
    } catch (error) {
        console.log("Error in incorrectGuess saga", error);
    }
}
function* sagaGuess() {
    yield takeLatest('CORRECTLY_GUESSED', correctGuess)
    yield takeLatest('INCORRECTLY_GUESSED', incorrectGuess)
}
export default sagaGuess;