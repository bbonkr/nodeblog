import produce from 'immer';

export const initialState = {
    /** posts */
    posts: [],
    /** posts loading */
    loadingPosts: false,
    hasMorePost: true,
    loadPostErrorReason: '',
    postsLimit: 3,
    nextPageToken: '',
    searchKeyword: '',
    /** singlePost */
    singlePost: null,
    loadSinglePostErrorReason: '',
    /** post loading  */
    loadingPost: false,
    isSinglePost: false,
    currentCategory: '',
    currentTag: '',

    myPosts: [],
    loadingMyPosts: false,
    loadMyPostErrorReason: '',

    writingPost: false,

    usersPosts: [],
    usersPostsPageToken: '',
    loadingUsersPosts: false,
    loadUsersPostsErrorReason: '',
    hasMoreUsersPosts: false,
    currentUser: '', // 현재 선택된 사용자
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

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        // https://lannstark.github.io/nodejs/console/3
        console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);

        switch (action.type) {
            case LOAD_POSTS_CALL:
            case LOAD_CATEGORY_POSTS_CALL:
            case LOAD_TAG_POSTS_CALL:
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
            case LOAD_TAG_POSTS_DONE:
                action.data.forEach(v => {
                    const postIndex = draft.posts.findIndex(x => x.id === v.id);
                    if (postIndex < 0) {
                        draft.posts.push(v);
                        draft.nextPageToken = `${v.id}`;
                    }
                });
                draft.hasMorePost = action.data.length === draft.postsLimit;
                draft.loadingPosts = false;
                draft.searchKeyword = action.keyword;
                draft.currentCategory = action.currentCategory;
                draft.currentTag = action.currentTag;
                break;
            case LOAD_POSTS_FAIL:
            case LOAD_CATEGORY_POSTS_FAIL:
            case LOAD_TAG_POSTS_FAIL:
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
                        x => x.id === v.id
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
                draft.loadSinglePostErrorReason = action.error;
                draft.loadingPost = false;
                break;
            default:
                break;
        }
    });

export default reducer;
