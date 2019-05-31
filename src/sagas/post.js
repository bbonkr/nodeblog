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
        console.error(e);
        yield put({
            type: LOAD_POSTS_FAIL,
            error: e,
        });
    }
}

function* watchLoadPosts() {
    yield takeLatest(LOAD_POSTS_CALL, loadPosts);
}

export default function* postSaga() {
    yield all([fork(watchLoadPosts)]);
}
