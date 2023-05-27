import axios from "axios";
import { combineReducers } from "redux";
import { put, takeLatest } from "redux-saga/effects";


function* correctGuess(action) {
    try {
        console.log("Guessed correctly!", action.payload);
        const response = yield axios({
            method: 'POST',
            url: '/api/guess',
            data: {songInfo: action.payload, guess:'true'}
        })
        yield put({
            type: 'SET_CORRECT_SONG',
            payload: {song: action.payload, guess:'true'}
        })
        if (response === 200) {
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
            url: '/api/guess',
            data: {song:action.payload, guess:'false'}
        })
        yield put({
            type:'SET_CORRECT_SONG',
            payload:{song:action.payload, guess:'false'}
        })
        if(response === 200) {
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