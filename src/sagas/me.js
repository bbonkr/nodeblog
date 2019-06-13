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
    LOAD_MY_POST_CALL,
    LOAD_MY_POST_DONE,
    LOAD_MY_POST_FAIL,
    WRITE_POST_CALL,
    WRITE_POST_DONE,
    WRITE_POST_FAIL,
    LOAD_MY_TAGS_CALL,
    LOAD_MY_TAGS_DONE,
    LOAD_MY_TAGS_FAIL,
    LOAD_MY_CATEGORIES_CALL,
    LOAD_MY_CATEGORIES_FAIL,
    LOAD_MY_CATEGORIES_DONE,
    EDIT_POST_CALL,
    EDIT_POST_DONE,
    EDIT_POST_FAIL,
    WRITE_NEW_POST_CALL,
    WRITE_NEW_POST_FAIL,
    WRITE_NEW_POST_DONE,
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
            pageToken || '',
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
    return axios.post('/post', formData, { withCredentials: true });
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

function editPostApi(id, data) {
    return axios.patch(`/post/${id}`, data, { withCredentials: true });
}

function* editPost(action) {
    try {
        const result = yield call(editPostApi, action.id, action.data);
        yield put({
            type: EDIT_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: EDIT_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchEditPost() {
    yield takeLatest(EDIT_POST_CALL, editPost);
}

function loadMyPostApi(id) {
    return axios.get(`/me/post/${id}`, { withCredentials: true });
}

function* loadMyPost(action) {
    try {
        const result = yield call(loadMyPostApi, action.data);

        yield put({
            type: LOAD_MY_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_MY_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadMyPost() {
    yield takeLatest(LOAD_MY_POST_CALL, loadMyPost);
}

function* writeNewPost(action) {
    try {
        yield put({
            type: WRITE_NEW_POST_DONE,
        });
    } catch (e) {
        yield put({
            type: WRITE_NEW_POST_FAIL,
            error: e,
        });
    }
}

function* watchWriteNewPost() {
    yield takeLatest(WRITE_NEW_POST_CALL, writeNewPost);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadMyPosts),
        fork(watchLoadMyPost),
        fork(watchWritePost),
        fork(watchEditPost),
        fork(watchLoadCategories),
        fork(watchLoadTags),
        fork(watchWriteNewPost),
    ]);
}
