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
    LOAD_USERS_POSTS_DONE,
    LOAD_USERS_POSTS_FAIL,
    LOAD_USERS_POSTS_CALL,
    LOAD_USER_CATEGORY_POSTS_CALL,
    LOAD_USER_CATEGORY_POSTS_DONE,
    LOAD_USER_CATEGORY_POSTS_FAIL,
    LOAD_SEARCH_POSTS_CALL,
    LOAD_SEARCH_POSTS_DONE,
    LOAD_SEARCH_POSTS_FAIL,
    ADD_LIKE_POST_CALL,
    ADD_LIKE_POST_DONE,
    ADD_LIKE_POST_FAIL,
    REMOVE_LIKE_POST_CALL,
    REMOVE_LIKE_POST_DONE,
    REMOVE_LIKE_POST_FAIL,
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

function loadSinglePostApi(user, slug) {
    return axios.get(`/users/${user}/posts/${encodeURIComponent(slug)}`, {
        withCredentials: true,
    });
}

function* loadSinglePost(action) {
    try {
        const { user, slug } = action.data;
        const result = yield call(loadSinglePostApi, user, slug);

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

function loadUsersPostsApi(user, pageToken = '', limit = 10, keyword = '') {
    return axios.get(
        `/users/${user}/posts?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
    );
}

function* loadUsersPosts(action) {
    try {
        const { user, pageToken, limit, keyword } = action.data;
        const result = yield call(
            loadUsersPostsApi,
            user,
            pageToken,
            limit || 10,
            keyword,
        );
        yield put({
            type: LOAD_USERS_POSTS_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_USERS_POSTS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadUsersPosts() {
    yield takeLatest(LOAD_USERS_POSTS_CALL, loadUsersPosts);
}

function loadUserCategoryPostsApi(query) {
    const { user, category, pageToken, limit, keyword } = query;
    return axios.get(
        `/users/${user}/categories/${category}/posts?pageToken=${pageToken}&limit=${limit}&keyword=${keyword}`,
        {
            withCredentials: true,
        },
    );
}

function* loadUserCategoryPosts(action) {
    try {
        const result = yield call(loadUserCategoryPostsApi, action.data);
        yield put({
            type: LOAD_USER_CATEGORY_POSTS_DONE,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: LOAD_USER_CATEGORY_POSTS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLaodUserCatetoryPosts() {
    yield takeLatest(LOAD_USER_CATEGORY_POSTS_CALL, loadUserCategoryPosts);
}

function loadSearchPostsApi(query) {
    const { pageToken, limit, keyword } = query;
    return axios.get(
        `/posts?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
    );
}

function* loadSearchPosts(action) {
    try {
        const { keyword } = action.data;
        const result = yield call(loadSearchPostsApi, action.data);
        yield put({
            type: LOAD_SEARCH_POSTS_DONE,
            data: result.data,
            keyword: keyword,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_SEARCH_POSTS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadSearchPosts() {
    yield takeLatest(LOAD_SEARCH_POSTS_CALL, loadSearchPosts);
}

function addUserLikePostApi(data) {
    const { user, post } = data;
    return axios.post(
        `/users/${user}/posts/${post}/like`,
        {},
        { withCredentials: true },
    );
}

function* addUserLikePost(action) {
    try {
        const result = yield call(addUserLikePostApi, action.data);
        yield put({
            type: ADD_LIKE_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: ADD_LIKE_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchAddUserLikePost() {
    yield takeLatest(ADD_LIKE_POST_CALL, addUserLikePost);
}

function removeUserLikePostApi(data) {
    const { user, post } = data;
    return axios.delete(`/users/${user}/posts/${post}/like`, {
        withCredentials: true,
    });
}

function* removeUserLikePost(action) {
    try {
        const result = yield call(removeUserLikePostApi, action.data);
        yield put({
            type: REMOVE_LIKE_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: REMOVE_LIKE_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchRemoveUserLikePost() {
    yield takeLatest(REMOVE_LIKE_POST_CALL, removeUserLikePost);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPosts),
        fork(watchLoadSinglePost),
        fork(watchLoadCategoryPosts),
        fork(watchLoadTagPosts),
        fork(watchLoadUsersPosts),
        fork(watchLaodUserCatetoryPosts),
        fork(watchLoadSearchPosts),
        fork(watchAddUserLikePost),
        fork(watchRemoveUserLikePost),
    ]);
}
