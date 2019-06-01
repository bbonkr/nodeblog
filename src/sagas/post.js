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
    LOAD_POSTS_CALL,
    LOAD_POSTS_DONE,
    LOAD_POSTS_FAIL,
    LOAD_SINGLE_POST_CALL,
    LOAD_SINGLE_POST_DONE,
    LOAD_SINGLE_POST_FAIL,
} from '../reducers/post';

function loadPostsApi(pageToken = '', limit = 10, keyword = '') {
    return axios.get(
        `/posts?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
    );
}

function* loadPosts(action) {
    try {
        const { pageToken, limit, keyword } = action.data;
        const result = yield call(
            loadPostsApi,
            pageToken,
            limit || 10,
            keyword,
        );

        yield put({
            type: LOAD_POSTS_DONE,
            data: result.data,
            nextPageToken:
                result.data &&
                result.data.length > 0 &&
                result.data[result.data.length - 1].id,
            limit: limit,
            keyword: keyword,
        });
    } catch (e) {
        // console.error(e);
        yield put({
            type: LOAD_POSTS_FAIL,
            error: e,
        });
    }
}

function* watchLoadPosts() {
    yield takeLatest(LOAD_POSTS_CALL, loadPosts);
}

function loadSinglePostApi(slug) {
    return axios.get(`/posts/${slug}`);
}

function* loadSinglePost(action) {
    try {
        const result = yield call(loadSinglePostApi, action.data);
        yield put({
            type: LOAD_SINGLE_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        // console.error(e);
        yield put({
            type: LOAD_SINGLE_POST_FAIL,
            error: e,
        });
    }
}

function* watchLoadSinglePost() {
    yield takeLatest(LOAD_SINGLE_POST_CALL, loadSinglePost);
}

export default function* postSaga() {
    yield all([fork(watchLoadPosts), fork(watchLoadSinglePost)]);
}
