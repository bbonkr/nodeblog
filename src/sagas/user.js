import {
    all,
    fork,
    call,
    delay,
    takeLatest,
    put,
    actionChannel,
    throttle,
} from 'redux-saga/effects';
import axios from 'axios';
import {
    SIGN_IN_CALL,
    SIGN_IN_DONE,
    SIGN_IN_FAIL,
    SIGN_OUT_CALL,
    SIGN_OUT_DONE,
    SIGN_OUT_FAIL,
    ME_CALL,
    ME_FAIL,
    ME_DONE,
    SIGN_UP_CALL,
    SIGN_UP_FAIL,
    SIGN_UP_DONE,
} from '../reducers/user';

function getMyInfoApi() {
    return axios.get('/me', { withCredentials: true });
}

function* getMyInfo(action) {
    try {
        const result = yield call(getMyInfoApi);
        yield put({
            type: ME_DONE,
            data: result.data,
        });
    } catch (e) {
        // console.error(e);
        yield put({
            type: ME_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchGetMyInfo() {
    yield takeLatest(ME_CALL, getMyInfo);
}

function signInApi(data) {
    return axios.post('/account/signin', data);
}

function* signIn(action) {
    try {
        const result = yield call(signInApi, action.data);
        yield put({
            type: SIGN_IN_DONE,
            data: result.data,
            returnUrl: action.returnUrl,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: SIGN_IN_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchSignIn() {
    yield takeLatest(SIGN_IN_CALL, signIn);
}

function signOutApi() {
    return axios.post('/account/signout', {}, { withCredentials: true });
}

function* signOut(action) {
    try {
        const result = yield call(signOutApi);
        yield put({
            type: SIGN_OUT_DONE,
            data: result.data,
            returnUrl: action.returnUrl,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: SIGN_OUT_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchSignOut() {
    yield takeLatest(SIGN_OUT_CALL, signOut);
}

function signUpApi(formData) {
    return axios.post('/user', formData, {});
}

function* signUp(action) {
    try {
        const result = yield call(signUpApi, action.data);
        yield put({
            type: SIGN_UP_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: SIGN_UP_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_CALL, signUp);
}

export default function* postSaga() {
    yield all([
        fork(watchGetMyInfo),
        fork(watchSignIn),
        fork(watchSignOut),
        fork(watchSignUp),
    ]);
}
