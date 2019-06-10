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
    LOAD_MY_POSTS_CALL,
    LOAD_MY_POSTS_DONE,
    LOAD_MY_POSTS_FAIL,
    WRITE_POST_CALL,
    WRITE_POST_DONE,
    WRITE_POST_FAIL,
    LOAD_MY_TAGS_CALL,
    LOAD_MY_TAGS_DONE,
    LOAD_MY_TAGS_FAIL,
    LOAD_MY_CATEGORIES_CALL,
    LOAD_MY_CATEGORIES_FAIL,
    LOAD_MY_CATEGORIES_DONE,
} from '../reducers/me';

function loadMyPostsApi(pageToken = '', limit = 10, keyword = '') {
    return axios.get(
        `/me/posts?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
        {
            withCredentials: true,
        },
    );
}

function* loadMyPosts(action) {
    try {
        const { pageToken, limit, keyword } = action.data;

        const result = yield call(
            loadMyPostsApi,
            pageToken,
            limit || 10,
            keyword,
        );
        yield put({
            type: LOAD_MY_POSTS_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_MY_POSTS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadMyPosts() {
    yield takeLatest(LOAD_MY_POSTS_CALL, loadMyPosts);
}

function writePostApi(formData) {
    return axios.post('/post?id=', formData, { withCredentials: true });
}

function* writePost(action) {
    try {
        const result = yield call(writePostApi, action.data);
        yield put({
            type: WRITE_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: WRITE_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchWritePost() {
    yield takeLatest(WRITE_POST_CALL, writePost);
}

function loadCategoriesApi() {
    return axios.get('/categories', { withCredentials: true });
}

function* loadCategories(action) {
    try {
        const result = yield call(loadCategoriesApi);
        yield put({
            type: LOAD_MY_CATEGORIES_DONE,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: LOAD_MY_CATEGORIES_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadCategories() {
    yield takeLatest(LOAD_MY_CATEGORIES_CALL, loadCategories);
}

function loadTagsApi() {
    return axios.get('/tags', { withCredentials: true });
}

function* loadTags(action) {
    try {
        const result = yield call(loadTagsApi);
        yield put({
            type: LOAD_MY_TAGS_DONE,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: LOAD_MY_TAGS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadTags() {
    yield takeLatest(LOAD_MY_TAGS_CALL, loadTags);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadMyPosts),
        fork(watchWritePost),
        fork(watchLoadCategories),
        fork(watchLoadTags),
    ]);
}
