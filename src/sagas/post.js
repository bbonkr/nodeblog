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
    LOAD_CATEGORY_POSTS_CALL,
    LOAD_CATEGORY_POSTS_DONE,
    LOAD_CATEGORY_POSTS_FAIL,
    LOAD_TAG_POSTS_CALL,
    LOAD_TAG_POSTS_DONE,
    LOAD_TAG_POSTS_FAIL,
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
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadPosts() {
    yield takeLatest(LOAD_POSTS_CALL, loadPosts);
}

function loadSinglePostApi(slug) {
    return axios.get(`/posts/${encodeURIComponent(slug)}`);
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
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadSinglePost() {
    yield takeLatest(LOAD_SINGLE_POST_CALL, loadSinglePost);
}

function loadCategoryPostsApi(
    category,
    pageToken = '',
    limit = 10,
    keyword = '',
) {
    return axios.get(
        `/posts/category/${category}?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
    );
}

function* loadCategoryPosts(action) {
    try {
        const { category, pageToken, limit, keyword } = action.data;
        const result = yield call(
            loadCategoryPostsApi,
            category,
            pageToken,
            limit,
            keyword,
        );
        yield put({
            type: LOAD_CATEGORY_POSTS_DONE,
            data: result.data,
            currentCategory: category,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_CATEGORY_POSTS_FAIL,
            error: e,
        });
    }
}

function* watchLoadCategoryPosts() {
    yield takeLatest(LOAD_CATEGORY_POSTS_CALL, loadCategoryPosts);
}

function loadTagPostsApi(tag, pageToken = '', limit = 10, keyword = '') {
    return axios.get(
        `/posts/tag/${encodeURIComponent(
            tag,
        )}?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
    );
}

function* loadTagPosts(action) {
    try {
        const { tag, pageToken, limit, keyword } = action.data;
        const result = yield call(
            loadTagPostsApi,
            tag,
            pageToken,
            limit,
            keyword,
        );
        yield put({
            type: LOAD_TAG_POSTS_DONE,
            data: result.data,
            currentTag: tag,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_TAG_POSTS_FAIL,
            error: e,
        });
    }
}

function* watchLoadTagPosts() {
    yield takeLatest(LOAD_TAG_POSTS_CALL, loadTagPosts);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPosts),
        fork(watchLoadSinglePost),
        fork(watchLoadCategoryPosts),
        fork(watchLoadTagPosts),
    ]);
}
