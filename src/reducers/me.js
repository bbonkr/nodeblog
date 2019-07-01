import produce, { finishDraft } from 'immer';
import { ShowNotification } from '../components/ShowNotification';
import Router from 'next/router';

export const initialState = {
    myPosts: [],
    postsLimit: 10,
    hasMorePost: false,
    searchKeyword: '',
    nextPageToken: '',
    postsCount: 0,

    // category
    categories: [],
    loadingCategories: false,
    loadCategoriesErrorReason: '',
    hasMoreCategories: false,
    categorySearchKeyword: '',
    categoryNextPageToken: '',
    categoryLimit: 10,
    categoriesCount: 0,

    // tag
    tags: [],
    myPost: {},
    loadingMyPost: false,

    loadingTags: false,
    loadingMyPosts: false,

    loadTagsErrorReason: '',
    loadMyPostsErrorReason: '',
    loadMyPostErrorReadon: '',
    writingPost: false,
    writePostErrorReason: '',

    // media
    mediaFiles: [],
    mediaFilesNextPageToken: '',
    mediaFilesSearchKeyword: '',
    mediaFilesCount: 0,
    mediaFilesLimit: 10,
    hasMoreMediaFiles: false,
    loadingMediaFiles: false,
    loadMediaFilesErrorReason: '',
    uploading: false,

    // menu
    sideMenuCollapsed: false,

    // liked
    likedPosts: [],
    likedPostsLoading: false,
    likedPostsKeyword: '',
    likedPostsErrorReason: '',
    likedPostsLimit: 3,
    LikedPostsHasMore: false,
    likedPostsPageToken: '',
    likedPostsTotal: 0,

    // stat - general
    statGeneral: {},
    statGeneralLoading: false,
    statGeneralErrorReason: '',

    statRead: {},
    statReadLoading: false,
    statReadErrorReason: '',
};

export const LOAD_MY_POSTS_CALL = 'LOAD_MY_POSTS_CALL';
export const LOAD_MY_POSTS_DONE = 'LOAD_MY_POSTS_DONE';
export const LOAD_MY_POSTS_FAIL = 'LOAD_MY_POSTS_FAIL';

export const LOAD_MY_POST_CALL = 'LOAD_MY_POST_CALL';
export const LOAD_MY_POST_DONE = 'LOAD_MY_POST_DONE';
export const LOAD_MY_POST_FAIL = 'LOAD_MY_POST_FAIL';

export const LOAD_MY_CATEGORIES_CALL = 'LOAD_MY_CATEGORIES_CALL';
export const LOAD_MY_CATEGORIES_DONE = 'LOAD_MY_CATEGORIES_DONE';
export const LOAD_MY_CATEGORIES_FAIL = 'LOAD_MY_CATEGORIES_FAIL';

export const LOAD_MY_TAGS_CALL = 'LOAD_MY_TAGS_CALL';
export const LOAD_MY_TAGS_DONE = 'LOAD_MY_TAGS_DONE';
export const LOAD_MY_TAGS_FAIL = 'LOAD_MY_TAGS_FAIL';

export const WRITE_NEW_POST_CALL = 'WRITE_NEW_POST_CALL';
export const WRITE_NEW_POST_DONE = 'WRITE_NEW_POST_DONE';
export const WRITE_NEW_POST_FAIL = 'WRITE_NEW_POST_FAIL';

export const WRITE_POST_CALL = 'WRITE_POST_CALL';
export const WRITE_POST_DONE = 'WRITE_POST_DONE';
export const WRITE_POST_FAIL = 'WRITE_POST_FAIL';

export const EDIT_POST_CALL = 'EDIT_POST_CALL';
export const EDIT_POST_DONE = 'EDIT_POST_DONE';
export const EDIT_POST_FAIL = 'EDIT_POST_FAIL';

export const DELETE_POST_CALL = 'DELETE_POST_CALL';
export const DELETE_POST_DONE = 'DELETE_POST_DONE';
export const DELETE_POST_FAIL = 'DELETE_POST_FAIL';

export const LOAD_MY_MEDIA_FILES_CALL = 'LOAD_MY_MEDIA_FILES_CALL';
export const LOAD_MY_MEDIA_FILES_DONE = 'LOAD_MY_MEDIA_FILES_DONE';
export const LOAD_MY_MEDIA_FILES_FAIL = 'LOAD_MY_MEDIA_FILES_FAIL';

export const UPLOAD_MY_MEDIA_FILES_CALL = 'UPLOAD_MY_MEDIA_FILES_CALL';
export const UPLOAD_MY_MEDIA_FILES_DONE = 'UPLOAD_MY_MEDIA_FILES_DONE';
export const UPLOAD_MY_MEDIA_FILES_FAIL = 'UPLOAD_MY_MEDIA_FILES_FAIL';

export const EDIT_MY_MEDIA_FILES_CALL = 'EDIT_MY_MEDIA_FILES_CALL';
export const EDIT_MY_MEDIA_FILES_DONE = 'EDIT_MY_MEDIA_FILES_DONE';
export const EDIT_MY_MEDIA_FILES_FAIL = 'EDIT_MY_MEDIA_FILES_FAIL';

export const DELETE_MY_MEDIA_FILES_CALL = 'DELETE_MY_MEDIA_FILES_CALL';
export const DELETE_MY_MEDIA_FILES_DONE = 'DELETE_MY_MEDIA_FILES_DONE';
export const DELETE_MY_MEDIA_FILES_FAIL = 'DELETE_MY_MEDIA_FILES_FAIL';

export const EDIT_MY_CATEGORY_CALL = 'EDIT_MY_CATEGORY_CALL';
export const EDIT_MY_CATEGORY_DONE = 'EDIT_MY_CATEGORY_DONE';
export const EDIT_MY_CATEGORY_FAIL = 'EDIT_MY_CATEGORY_FAIL';

export const DELETE_MY_CATEGORY_CALL = 'DELETE_MY_CATEGORY_CALL';
export const DELETE_MY_CATEGORY_DONE = 'DELETE_MY_CATEGORY_DONE';
export const DELETE_MY_CATEGORY_FAIL = 'DELETE_MY_CATEGORY_FAIL';

export const SIDE_MENU_COLLAPSE = 'SIDE_MENU_COLLAPSE';

export const LOAD_LIKED_POSTS_CALL = 'LOAD_LIKED_POSTS_CALL';
export const LOAD_LIKED_POSTS_DONE = 'LOAD_LIKED_POSTS_DONE';
export const LOAD_LIKED_POSTS_FAIL = 'LOAD_LIKED_POSTS_FAIL';

export const LOAD_STAT_GENERAL_CALL = 'LOAD_STAT_GENERAL_CALL';
export const LOAD_STAT_GENERAL_DONE = 'LOAD_STAT_GENERAL_DONE';
export const LOAD_STAT_GENERAL_FAIL = 'LOAD_STAT_GENERAL_FAIL';

export const LOAD_STAT_READ_CALL = 'LOAD_STAT_READ_CALL';
export const LOAD_STAT_READ_DONE = 'LOAD_STAT_READ_DONE';
export const LOAD_STAT_READ_FAIL = 'LOAD_STAT_READ_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        // https://lannstark.github.io/nodejs/console/3
        // console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);

        switch (action.type) {
            case LOAD_MY_POSTS_CALL:
                draft.myPosts = action.data.pageToken ? draft.myPosts : [];
                draft.hasMorePost = action.data.pageToken
                    ? draft.hasMorePost
                    : true;
                draft.loadingMyPosts = true;
                draft.loadMyPostsErrorReason = '';

                break;
            case LOAD_MY_POSTS_DONE:
                draft.loadingMyPosts = false;
                // draft.myPosts = action.data;

                action.data.posts.forEach(v => {
                    const postIndex = draft.myPosts.findIndex(
                        x => x.id === v.id,
                    );
                    if (postIndex < 0) {
                        draft.myPosts.push(v);
                        draft.nextPageToken = `${v.id}`;
                    }
                });
                draft.hasMorePost = action.data.length === draft.postsLimit;
                draft.loadingMyPosts = false;
                draft.searchKeyword = action.keyword;
                draft.postsCount = action.data.postsCount;
                break;
            case LOAD_MY_POSTS_FAIL:
                draft.loadingMyPosts = false;
                draft.loadMyPostsErrorReason = action.reason;
                break;

            case LOAD_MY_POST_CALL:
                draft.loadingMyPost = true;
                draft.loadMyPostErrorReason = '';
                break;
            case LOAD_MY_POST_DONE:
                draft.loadingMyPost = false;
                draft.myPost = action.data;
                break;
            case LOAD_MY_POST_FAIL:
                draft.loadingMyPost = false;
                draft.loadMyPostErrorReason = action.reason;
                break;

            case LOAD_MY_CATEGORIES_CALL:
                draft.loadingCategories = true;
                draft.categories = action.data.pageToken
                    ? draft.categories
                    : [];
                draft.hasMoreCategories = action.data.pageToken
                    ? draft.hasMoreCategories
                    : true;
                draft.loadCategoriesErrorReason = '';
                break;
            case LOAD_MY_CATEGORIES_DONE:
                draft.loadingCategories = false;
                // draft.categories = action.data;

                action.data.items.forEach(v => {
                    const postIndex = draft.categories.findIndex(
                        x => x.id === v.id,
                    );
                    if (postIndex < 0) {
                        draft.categories.push(v);
                        draft.categoryNextPageToken = `${v.id}`;
                    }
                });
                draft.categoriesCount = action.data.total;
                draft.hasMoreCategories =
                    action.data.items.length === draft.categoryLimit;
                draft.categorySearchKeyword = action.keyword;
                draft.categoriesCount = action.data.total;

                break;
            case LOAD_MY_CATEGORIES_FAIL:
                draft.loadingCategories = false;
                draft.loadCategoriesErrorReason = action.reason;
                break;

            case LOAD_MY_TAGS_CALL:
                draft.loadingTags = true;
                break;
            case LOAD_MY_TAGS_DONE:
                draft.loadingTags = false;
                draft.tags = action.data;
                break;
            case LOAD_MY_TAGS_FAIL:
                draft.loadingTags = false;
                break;

            case WRITE_POST_CALL:
                draft.writingPost = true;
                break;
            case WRITE_POST_DONE:
                draft.writingPost = false;
                // draft.myPost = action.data;
                ShowNotification({
                    title: 'Saved.',
                    message: 'Your request is success.',
                });
                Router.push({
                    pathname: '/me/write',
                    query: { id: action.data.id },
                    as: `/me/write/${action.data.id}`,
                });
                break;
            case WRITE_POST_FAIL:
                draft.writingPost = false;
                break;
            case EDIT_POST_CALL:
                draft.writingPost = true;
                break;
            case EDIT_POST_DONE:
                draft.writingPost = false;
                // draft.myPost = action.data;
                ShowNotification({
                    title: 'Saved.',
                    message: 'Your request is success.',
                });
                Router.push({
                    pathname: '/me/write',
                    query: { id: action.data.id },
                    as: `/me/write/${action.data.id}`,
                });
                break;
            case EDIT_POST_FAIL:
                draft.writingPost = false;
                break;
            case WRITE_NEW_POST_CALL:
                // draft.myPost = null;
                break;
            case WRITE_NEW_POST_DONE:
                draft.myPost = null;
                break;
            case WRITE_NEW_POST_FAIL:
                break;

            case DELETE_POST_CALL:
                draft.loadingMyPosts = true;
                break;
            case DELETE_POST_DONE:
                const index = draft.myPosts.findIndex(
                    x => x.id === action.data.id,
                );
                draft.myPosts.splice(index, 1);
                draft.loadingMyPosts = false;
                break;
            case DELETE_POST_FAIL:
                // console.log(action.reason);
                draft.loadingMyPosts = false;
                break;

            case LOAD_MY_MEDIA_FILES_CALL:
                draft.mediaFiles = action.data.pageToken
                    ? draft.mediaFiles
                    : [];
                draft.hasMoreMediaFiles = action.data.pageToken
                    ? draft.hasMoreMediaFiles
                    : true;
                draft.loadingMediaFiles = true;
                draft.loadMediaFilesErrorReason = '';
                break;
            case LOAD_MY_MEDIA_FILES_DONE:
                action.data.forEach(v => {
                    const mediaIndex = draft.mediaFiles.findIndex(
                        x => x.id === v.id,
                    );
                    if (mediaIndex < 0) {
                        draft.mediaFiles.push(v);
                        draft.mediaFilesNextPageToken = `${v.id}`;
                    }
                });

                draft.hasMoreMediaFiles =
                    action.data.length === draft.mediaFilesLimit;
                draft.loadingMediaFiles = false;
                draft.mediaFilesSearchKeyword = action.keyword;
                break;
            case LOAD_MY_MEDIA_FILES_FAIL:
                draft.loadingMediaFiles = true;
                draft.loadMediaFilesErrorReason = action.reason;
                break;
            case UPLOAD_MY_MEDIA_FILES_CALL:
                draft.uploading = true;
                break;
            case UPLOAD_MY_MEDIA_FILES_DONE:
                draft.mediaFiles = action.data.concat(draft.mediaFiles);
                draft.uploading = false;
                break;
            case UPLOAD_MY_MEDIA_FILES_FAIL:
                draft.uploading = false;
                break;
            case DELETE_MY_MEDIA_FILES_CALL:
                draft.uploading = true;
                break;
            case DELETE_MY_MEDIA_FILES_DONE:
                const foundId = draft.mediaFiles.findIndex(
                    x => x.id === action.data.id,
                );
                draft.mediaFiles.splice(foundId, 1);
                draft.uploading = false;
                break;
            case DELETE_MY_MEDIA_FILES_FAIL:
                draft.uploading = false;
                break;

            // edit category
            case EDIT_MY_CATEGORY_CALL:
                draft.loadingCategories = true;
                break;
            case EDIT_MY_CATEGORY_DONE:
                const foundCategoryIndex = draft.categories.findIndex(
                    v => v.id === action.data.id,
                );
                if (foundCategoryIndex < 0) {
                    draft.categories.push(action.data);
                    draft.categoriesCount = draft.categoriesCount + 1;
                } else {
                    draft.categories[foundCategoryIndex] = action.data;
                }

                draft.categories
                    .filter(
                        v =>
                            v.id !== action.data.id &&
                            v.ordinal >= action.data.ordinal,
                    )
                    .forEach(v => {
                        v.ordinal = v.ordinal + 1;
                    });

                draft.categories = draft.categories
                    .sort((a, b) => {
                        return a.ordinal > b.ordinal ? 1 : -1;
                    })
                    .map((v, i) => {
                        v.ordinal = i + 1;
                        return v;
                    });

                draft.loadingCategories = false;
                break;
            case EDIT_MY_CATEGORY_FAIL:
                draft.loadingCategories = false;

                break;

            // delete category
            case DELETE_MY_CATEGORY_CALL:
                draft.loadingCategories = true;
                break;
            case DELETE_MY_CATEGORY_DONE:
                const foundDeletedCategoryIndex = draft.categories.findIndex(
                    v => v.id === action.data.id,
                );
                draft.categories.splice(foundDeletedCategoryIndex, 1);

                draft.categories = draft.categories
                    .sort((a, b) => {
                        return a.ordinal > b.ordinal ? 1 : -1;
                    })
                    .map((v, i) => {
                        v.ordinal = i + 1;
                        return v;
                    });
                draft.categoriesCount = draft.categoriesCount - 1;
                draft.loadingCategories = false;
                break;
            case DELETE_MY_CATEGORY_FAIL:
                draft.loadingCategories = false;
                break;

            case SIDE_MENU_COLLAPSE:
                draft.sideMenuCollapsed = action.data;
                break;

            case LOAD_LIKED_POSTS_CALL:
                draft.likedPostsLoading = true;
                draft.likedPosts = action.data.pageToken
                    ? draft.likedPosts
                    : [];
                draft.LikedPostsHasMore = action.data.pageToken
                    ? draft.LikedPostsHasMore
                    : true;
                draft.likedPostsErrorReason = '';
                break;
            case LOAD_LIKED_POSTS_DONE:
                action.data.records.forEach(x => {
                    const post = draft.likedPosts.find(
                        v => v.UserId === x.UserId && v.PostId === x.PostId,
                    );
                    if (!post) {
                        draft.likedPosts.push(x);
                        draft.likedPostsPageToken = `${x.UserId}|${x.PostId}`;
                    }
                });
                draft.likedPostsTotal = action.data.total;
                draft.likedPostsHasMore =
                    action.data.records.length === draft.likedPostsLimit;
                draft.likedPostsKeyword = action.keyword;
                draft.likedPostsLoading = false;
                break;
            case LOAD_LIKED_POSTS_FAIL:
                draft.likedPostsLoading = false;
                draft.likedPostsErrorReason = action.reason;
                break;

            // 통계
            case LOAD_STAT_GENERAL_CALL:
                draft.statGeneralLoading = true;
                break;
            case LOAD_STAT_GENERAL_DONE:
                draft.statGeneral = action.data;
                draft.statGeneralLoading = false;
                break;
            case LOAD_STAT_GENERAL_FAIL:
                draft.statGeneralLoading = false;
                draft.statGeneralErrorReason = action.reason;
                break;

            // 통계 읽은수
            case LOAD_STAT_READ_CALL:
                draft.statReadLoading = true;
                break;
            case LOAD_STAT_READ_DONE:
                draft.statRead = action.data;
                draft.statReadLoading = false;
                break;
            case LOAD_STAT_READ_FAIL:
                draft.statReadErrorReason = action.reason;
                draft.statReadLoading = false;
                break;

            default:
                break;
        }
    });

export default reducer;
