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
    UPLOAD_MY_MEDIA_FILES_CALL,
    UPLOAD_MY_MEDIA_FILES_DONE,
    UPLOAD_MY_MEDIA_FILES_FAIL,
    LOAD_MY_MEDIA_FILES_CALL,
    LOAD_MY_MEDIA_FILES_FAIL,
    LOAD_MY_MEDIA_FILES_DONE,
    DELETE_MY_MEDIA_FILES_CALL,
    DELETE_MY_MEDIA_FILES_FAIL,
    DELETE_MY_MEDIA_FILES_DONE,
    DELETE_POST_CALL,
    DELETE_POST_FAIL,
    DELETE_POST_DONE,
    EDIT_MY_CATEGORY_CALL,
    EDIT_MY_CATEGORY_DONE,
    EDIT_MY_CATEGORY_FAIL,
    DELETE_MY_CATEGORY_CALL,
    DELETE_MY_CATEGORY_DONE,
    DELETE_MY_CATEGORY_FAIL,
    LOAD_LIKED_POSTS_CALL,
    LOAD_LIKED_POSTS_DONE,
    LOAD_LIKED_POSTS_FAIL,
    LOAD_STAT_GENERAL_CALL,
    LOAD_STAT_GENERAL_DONE,
    LOAD_STAT_GENERAL_FAIL,
    LOAD_STAT_READ_CALL,
    LOAD_STAT_READ_DONE,
    LOAD_STAT_READ_FAIL,
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

function loadCategoriesApi(query) {
    const { pageToken, limit, keyword } = query;
    return axios.get(
        `/me/categories?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
        { withCredentials: true },
    );
}

function* loadCategories(action) {
    try {
        const { pageToken, limit, keyword } = action.data;
        const result = yield call(loadCategoriesApi, {
            pageToken,
            limit,
            keyword,
        });
        yield put({
            type: LOAD_MY_CATEGORIES_DONE,
            data: {
                items: result.data.items,
                total: result.data.total,
            },
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

/**
 * 글을 삭제합니다.
 *
 * @param {number} id 글 식별자 Post.Id
 *
 */
function deletePostApi(id) {
    return axios.delete(`/post/${id}`, { withCredentials: true });
}

function* deletePost(action) {
    try {
        const result = yield call(deletePostApi, action.data);
        yield put({
            type: DELETE_POST_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: DELETE_POST_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchDeletePost() {
    yield takeLatest(DELETE_POST_CALL, deletePost);
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

function uploadMyMediaFilesApi(data) {
    return axios.post('/me/media', data, { withCredentials: true });
}

function* uploadMyMediaFiles(action) {
    try {
        // console.log('==========> form data:', action.data);
        const result = yield call(uploadMyMediaFilesApi, action.data);

        yield put({
            type: UPLOAD_MY_MEDIA_FILES_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: UPLOAD_MY_MEDIA_FILES_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchUploadMyMediaFiles() {
    yield takeLatest(UPLOAD_MY_MEDIA_FILES_CALL, uploadMyMediaFiles);
}

function loadMediaFilesApi(pageToken, limit, keyword) {
    return axios.get(
        `/me/media/?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
        { withCredentials: true },
    );
}

function* loadMediaFiles(action) {
    try {
        const { pageToken, limit, keyword } = action.data;
        const result = yield call(
            loadMediaFilesApi,
            pageToken || '',
            limit || 10,
            keyword || '',
        );
        yield put({
            type: LOAD_MY_MEDIA_FILES_DONE,
            data: result.data,
            mediaFilesNextPageToken: pageToken,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_MY_MEDIA_FILES_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadMediaFiles() {
    yield takeLatest(LOAD_MY_MEDIA_FILES_CALL, loadMediaFiles);
}

function deleteMediaFileApi(id) {
    return axios.delete(`/me/media/${id}`, { withCredentials: true });
}

function* deleteMediaFile(action) {
    try {
        const result = yield call(deleteMediaFileApi, action.data);
        yield put({
            type: DELETE_MY_MEDIA_FILES_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: DELETE_MY_MEDIA_FILES_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchDeleteMediaFile() {
    yield takeLatest(DELETE_MY_MEDIA_FILES_CALL, deleteMediaFile);
}

function editCategoryApi(formData) {
    if (!!formData.id) {
        return axios.patch(`/me/category/${formData.id}`, formData, {
            withCredentials: true,
        });
    } else {
        return axios.post('/me/category', formData, { withCredentials: true });
    }
}

function* editCategory(action) {
    try {
        const result = yield call(editCategoryApi, action.data);
        yield put({
            type: EDIT_MY_CATEGORY_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: EDIT_MY_CATEGORY_FAIL,
            error: e,
            reason: e.respnse && e.response.data,
        });
    }
}

function* wacthEditCategory() {
    yield takeLatest(EDIT_MY_CATEGORY_CALL, editCategory);
}

function deleteCategoryApi(id) {
    return axios.delete(`/me/category/${id}`, { withCredentials: true });
}

function* deleteCategory(action) {
    try {
        const { id } = action.data;
        const result = yield call(deleteCategoryApi, id);
        yield put({
            type: DELETE_MY_CATEGORY_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: DELETE_MY_CATEGORY_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchDeleteCategory() {
    yield takeLatest(DELETE_MY_CATEGORY_CALL, deleteCategory);
}

function loadLikedPostsApi(query) {
    const { pageToken, limit, keyword } = query;

    return axios.get(
        `/me/liked?pageToken=${pageToken}&limit=${limit}&keyword=${encodeURIComponent(
            keyword,
        )}`,
        {
            withCredentials: true,
        },
    );
}

function* loadLikedPosts(action) {
    try {
        const result = yield call(loadLikedPostsApi, action.data);
        yield put({
            type: LOAD_LIKED_POSTS_DONE,
            data: result.data,
            keyword: action.data.keyword,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_LIKED_POSTS_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadLikedPosts() {
    yield takeLatest(LOAD_LIKED_POSTS_CALL, loadLikedPosts);
}

function loadStatGeneralApi(query) {
    return axios.get('/stat/general', { withCredentials: true });
}

function* loadStatGeneral(action) {
    try {
        const result = yield call(loadStatGeneralApi, action.data);
        yield put({
            type: LOAD_STAT_GENERAL_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_STAT_GENERAL_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadStatGeneral() {
    yield takeLatest(LOAD_STAT_GENERAL_CALL, loadStatGeneral);
}

function loadStatReadApi(query) {
    return axios.get('/stat/postread', { withCredentials: true });
}

function* loadStatRead(action) {
    try {
        const result = yield call(loadStatReadApi, action.data);
        yield put({
            type: LOAD_STAT_READ_DONE,
            data: result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOAD_STAT_READ_FAIL,
            error: e,
            reason: e.response && e.response.data,
        });
    }
}

function* watchLoadStatRead() {
    yield takeLatest(LOAD_STAT_READ_CALL, loadStatRead);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadMyPosts),
        fork(watchLoadMyPost),
        fork(watchWritePost),
        fork(watchEditPost),
        fork(watchDeletePost),
        fork(watchLoadCategories),
        fork(watchLoadTags),
        fork(watchWriteNewPost),
        fork(watchUploadMyMediaFiles),
        fork(watchLoadMediaFiles),
        fork(watchDeleteMediaFile),
        fork(wacthEditCategory),
        fork(watchDeleteCategory),
        fork(watchLoadLikedPosts),
        fork(watchLoadStatGeneral),
        fork(watchLoadStatRead),
    ]);
}
