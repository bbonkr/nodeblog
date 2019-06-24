import produce from 'immer';
import { ShowNotification } from '../components/ShowNotification';

export const initialState = {
    /** posts */
    posts: [],
    /** posts loading */
    loadingPosts: false,
    hasMorePost: true,
    loadPostErrorReason: '',
    postsLimit: 10,
    nextPageToken: '',
    searchKeyword: '',

    /** singlePost */
    singlePost: null,
    loadSinglePostErrorReason: '',
    /** post loading  */
    loadingPost: false,
    isSinglePost: false,
    currentCategory: '',

    writingPost: false,

    /** users posts */
    usersPosts: [],
    usersPostsPageToken: '',
    loadingUsersPosts: false,
    loadUsersPostsErrorReason: '',
    hasMoreUsersPosts: false,
    currentUser: '', // 현재 선택된 사용자; 데이터 소스 초기화에 사용

    /** users category posts */
    userCategoryPosts: [],
    userCategoryPostsPageToken: '',
    userCategoryPostsLoading: false,
    userCategoryPostsErrorReason: '',
    userCategoryPostsHasMore: false,
    userCategoryPostsKeyword: '',
    currentUserCategory: '', // 현재 사용자 분류; `${user}${category}`; 데이터 소스 초기화에 사용
    userCategoryPostsUser: {},
    userCategoryPostsCategory: {},

    /** tag posts */
    tagPosts: [],
    tagPostsPageToken: '',
    tagPostsLoading: false,
    tagPostsErrorReason: '',
    tagPostsHasMore: false,
    tagPostsKeyword: '',
    currentTag: {},
    currentTagSlug: '',

    /** search posts */
    searchPosts: [],
    searchPostsPageToken: '',
    searchPostsLoading: false,
    searchPostsErrorReason: '',
    searchPostsHasMore: false,
    searchPostsKeyword: '',

    /** like post */
    likePostLoading: false,
    likePostErrorMessage: '',
};

export const LOAD_POSTS_CALL = 'LOAD_POSTS_CALL';
export const LOAD_POSTS_DONE = 'LOAD_POSTS_DONE';
export const LOAD_POSTS_FAIL = 'LOAD_POSTS_FAIL';

export const LOAD_SINGLE_POST_CALL = 'LOAD_SINGLE_POST_CALL';
export const LOAD_SINGLE_POST_DONE = 'LOAD_SINGLE_POST_DONE';
export const LOAD_SINGLE_POST_FAIL = 'LOAD_SINGLE_POST_FAIL';

export const LOAD_USERS_POSTS_CALL = 'LOAD_USERS_POSTS_CALL';
export const LOAD_USERS_POSTS_DONE = 'LOAD_USERS_POSTS_DONE';
export const LOAD_USERS_POSTS_FAIL = 'LOAD_USERS_POSTS_FAIL';

export const LOAD_CATEGORY_POSTS_CALL = 'LOAD_CATEGORY_POSTS_CALL';
export const LOAD_CATEGORY_POSTS_DONE = 'LOAD_CATEGORY_POSTS_DONE';
export const LOAD_CATEGORY_POSTS_FAIL = 'LOAD_CATEGORY_POSTS_FAIL';

export const LOAD_TAG_POSTS_CALL = 'LOAD_TAG_POSTS_CALL';
export const LOAD_TAG_POSTS_DONE = 'LOAD_TAG_POSTS_DONE';
export const LOAD_TAG_POSTS_FAIL = 'LOAD_TAG_POSTS_FAIL';

export const LOAD_USER_CATEGORY_POSTS_CALL = 'LOAD_USER_CATEGORY_POSTS_CALL';
export const LOAD_USER_CATEGORY_POSTS_DONE = 'LOAD_USER_CATEGORY_POSTS_DONE';
export const LOAD_USER_CATEGORY_POSTS_FAIL = 'LOAD_USER_CATEGORY_POSTS_FAIL';

export const LOAD_SEARCH_POSTS_CALL = 'LOAD_SEARCH_POSTS_CALL';
export const LOAD_SEARCH_POSTS_DONE = 'LOAD_SEARCH_POSTS_DONE';
export const LOAD_SEARCH_POSTS_FAIL = 'LOAD_SEARCH_POSTS_FAIL';

export const ADD_LIKE_POST_CALL = 'ADD_LIKE_POST_CALL';
export const ADD_LIKE_POST_DONE = 'ADD_LIKE_POST_DONE';
export const ADD_LIKE_POST_FAIL = 'ADD_LIKE_POST_FAIL';

export const REMOVE_LIKE_POST_CALL = 'REMOVE_LIKE_POST_CALL';
export const REMOVE_LIKE_POST_DONE = 'REMOVE_LIKE_POST_DONE';
export const REMOVE_LIKE_POST_FAIL = 'REMOVE_LIKE_POST_FAIL';

/**
 * 글의 좋아요 사용자를 갱신합니다.
 * @param {*} source Array<Post> 또는 Post object
 * @param {*} update Likers 가 업데이트된 Post object
 */
const updatePostLikers = (source, update) => {
    if (source == null) {
        return;
    }

    let post = {};

    if (Array.isArray(source)) {
        // posts
        post = source.find(x => x.id === update.id);
    } else {
        post = source;
    }

    if (post == null) {
        return;
    }

    post.Likers = update.Likers;
};

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        // https://lannstark.github.io/nodejs/console/3
        // console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);

        switch (action.type) {
            case LOAD_POSTS_CALL:
            case LOAD_CATEGORY_POSTS_CALL:
                draft.posts = action.data.pageToken ? draft.posts : [];
                draft.hasMorePost = action.data.pageToken
                    ? draft.hasMorePost
                    : true;
                draft.loadingPosts = true;
                draft.loadPostErrorReason = '';
                draft.isSinglePost = false;
                break;
            case LOAD_POSTS_DONE:
            case LOAD_CATEGORY_POSTS_DONE:
                action.data.records.forEach(v => {
                    const postIndex = draft.posts.findIndex(x => x.id === v.id);
                    if (postIndex < 0) {
                        draft.posts.push(v);
                        draft.nextPageToken = `${v.id}`;
                    }
                });
                draft.hasMorePost =
                    action.data.records.length === draft.postsLimit;
                draft.loadingPosts = false;
                draft.searchKeyword = action.keyword;
                draft.currentCategory = action.currentCategory;
                draft.currentTag = action.currentTag;
                break;
            case LOAD_POSTS_FAIL:
            case LOAD_CATEGORY_POSTS_FAIL:
                draft.loadingPosts = false;
                draft.loadPostErrorReason = action.error;
                break;

            // users/:user/posts
            case LOAD_USERS_POSTS_CALL:
                draft.usersPosts = action.data.pageToken
                    ? draft.usersPosts
                    : [];
                draft.hasMoreUsersPosts = action.data.pageToken
                    ? draft.hasMoreUsersPosts
                    : true;
                draft.loadingUsersPosts = true;
                draft.loadUsersPostsErrorReason = '';
                draft.currentUser = action.data.user;
                break;
            case LOAD_USERS_POSTS_DONE:
                action.data.forEach(v => {
                    const postIndex = draft.usersPosts.findIndex(
                        x => x.id === v.id,
                    );
                    if (postIndex < 0) {
                        draft.usersPosts.push(v);
                        draft.usersPostsPageToken = `${v.id}`;
                    }
                });
                draft.hasMoreUsersPosts =
                    action.data.length === draft.postsLimit;
                draft.loadingUsersPosts = false;
                break;
            case LOAD_USERS_POSTS_FAIL:
                draft.loadingUsersPosts = false;
                draft.loadUsersPostsErrorReason = action.reason;
                break;

            case LOAD_USER_CATEGORY_POSTS_CALL:
                draft.userCategoryPostsLoading = true;
                draft.userCategoryPosts = action.data.pageToken
                    ? draft.userCategoryPosts
                    : [];
                draft.userCategoryPostsHasMore = action.data.pageToken
                    ? draft.userCategoryPostsHasMore
                    : true;
                draft.userCategoryPostsErrorReason = '';

                draft.currentUserCategory = `${action.data.user}${
                    action.data.category
                }`;
                draft.userCategoryPostsKeyword = action.data.keyword;
                // draft.userCategoryPostsUser = null;
                // draft.userCategoryPostsCategory = null;
                break;
            case LOAD_USER_CATEGORY_POSTS_DONE:
                action.data.records.forEach(v => {
                    const index = draft.userCategoryPosts.findIndex(
                        x => x.id === v.id,
                    );
                    if (index < 0) {
                        draft.userCategoryPosts.push(v);
                        draft.userCategoryPostsPageToken = `${v.id}`;
                    }
                });
                draft.userCategoryPostsHasMore =
                    action.data.records.length === draft.postsLimit;
                draft.userCategoryPostsUser = action.data.user;
                draft.userCategoryPostsCategory = action.data.category;
                draft.userCategoryPostsLoading = false;
                break;
            case LOAD_USER_CATEGORY_POSTS_FAIL:
                draft.userCategoryPostsErrorReason = action.reason;
                draft.userCategoryPostsLoading = false;
                break;
            // single post
            case LOAD_SINGLE_POST_CALL:
                draft.singlePost = null;
                draft.isSinglePost = true;
                draft.loadSinglePostErrorReason = '';
                draft.loadingPost = true;
                break;
            case LOAD_SINGLE_POST_DONE:
                draft.singlePost = action.data;
                draft.loadingPost = false;
                break;
            case LOAD_SINGLE_POST_FAIL:
                draft.loadSinglePostErrorReason = action.reason;
                draft.loadingPost = false;
                break;
            // tag posts
            case LOAD_TAG_POSTS_CALL:
                draft.tagPosts = action.data.pageToken ? draft.tagPosts : [];
                draft.hasMorePost = action.data.pageToken
                    ? draft.tagPostsHasMorePost
                    : true;
                draft.tagPostsLoading = true;
                draft.tagPostsErrorReason = '';
                break;
            case LOAD_TAG_POSTS_DONE:
                action.data.records.forEach(v => {
                    const index = draft.tagPosts.findIndex(x => x.id === v.id);
                    if (index < 0) {
                        draft.tagPosts.push(v);
                        draft.tagPostsPageToken = `${v.id}`;
                    }
                });
                draft.tagPostsHasMorePost =
                    action.data.records.length === draft.postsLimit;
                draft.tagPostsLoading = false;
                draft.tagPostsKeyword = action.keyword;
                draft.currentTag = action.data.tag;
                draft.currentTagSlug = action.tag;
                break;
            case LOAD_TAG_POSTS_FAIL:
                draft.tagPostsLoading = false;
                draft.tagPostsErrorReason = action.reason;
                break;
            case LOAD_SEARCH_POSTS_CALL:
                draft.searchPostsLoading = true;
                draft.searchPostsErrorReason = '';
                draft.searchPosts = action.data.pageToken
                    ? draft.searchPosts
                    : [];
                draft.searchPostsHasMore = action.data.pageToken
                    ? draft.searchPostsHasMore
                    : true;
                break;
            case LOAD_SEARCH_POSTS_DONE:
                draft.searchPostsLoading = false;
                action.data.records.forEach(v => {
                    const index = draft.searchPosts.findIndex(
                        x => x.id === v.id,
                    );
                    if (index < 0) {
                        draft.searchPosts.push(v);
                        draft.searchPostsPageToken = `${v.id}`;
                    }
                });
                draft.searchPostsHasMore =
                    action.data.records.length === draft.postsLimit;
                draft.searchPostsKeyword = action.keyword;
                break;
            case LOAD_SEARCH_POSTS_FAIL:
                draft.searchPostsLoading = false;
                draft.searchPostsErrorReason = action.reason;
                break;

            case ADD_LIKE_POST_CALL:
                draft.likePostLoading = true;
                draft.likePostErrorMessage = '';
                break;
            case ADD_LIKE_POST_DONE:
                updatePostLikers(draft.posts, action.data);
                updatePostLikers(draft.singlePost, action.data);
                updatePostLikers(draft.usersPosts, action.data);
                updatePostLikers(draft.tagPosts, action.data);
                updatePostLikers(draft.userCategoryPosts, action.data);
                updatePostLikers(draft.searchPosts, action.data);

                draft.likePostLoading = false;
                draft.likePostErrorMessage = '';

                break;
            case ADD_LIKE_POST_FAIL:
                draft.likePostLoading = false;
                draft.likePostErrorMessage = action.reason;

                ShowNotification({
                    title: 'Notification',
                    message: action.reason,
                });
                break;

            case REMOVE_LIKE_POST_CALL:
                draft.likePostLoading = true;
                draft.likePostErrorMessage = '';
                break;
            case REMOVE_LIKE_POST_DONE:
                updatePostLikers(draft.posts, action.data);
                updatePostLikers(draft.singlePost, action.data);
                updatePostLikers(draft.usersPosts, action.data);
                updatePostLikers(draft.tagPosts, action.data);
                updatePostLikers(draft.userCategoryPosts, action.data);
                updatePostLikers(draft.searchPosts, action.data);

                draft.likePostLoading = false;
                draft.likePostErrorMessage = '';
                break;
            case REMOVE_LIKE_POST_FAIL:
                draft.likePostLoading = false;
                draft.likePostErrorMessage = action.reason;

                ShowNotification({
                    title: 'Notification',
                    message: action.reason,
                });
                break;

            default:
                break;
        }
    });

export default reducer;
