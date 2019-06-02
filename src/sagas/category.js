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
    LOAD_CATEGORIES_CALL,
    LOAD_CATEGORIES_DONE,
    LOAD_CATEGORIES_FAIL,
} from '../reducers/category';

function loadCategoriesApi() {
    return axios.get('/category');
}

function* loadCategories(action) {
    try {
        const result = yield call(loadCategoriesApi);
        yield put({
            type: LOAD_CATEGORIES_DONE,
            data: result.data,
        });
    } catch (e) {
        // console.error(e);
        yield put({
            type: LOAD_CATEGORIES_FAIL,
            error: e,
        });
    }
}

function* watchLoadCategories() {
    yield takeLatest(LOAD_CATEGORIES_CALL, loadCategories);
}

export default function* postSaga() {
    yield all([fork(watchLoadCategories)]);
}
