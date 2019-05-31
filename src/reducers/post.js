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
    /** post loading  */
    loadingPost: false,
};

export const LOAD_POSTS_CALL = 'LOAD_POSTS_CALL';
export const LOAD_POSTS_DONE = 'LOAD_POSTS_DONE';
export const LOAD_POSTS_FAIL = 'LOAD_POSTS_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case LOAD_POSTS_CALL:
                draft.posts = action.data.pageToken ? draft.posts : [];
                draft.hasMorePost = action.data.pageToken
                    ? draft.hasMorePost
                    : true;
                draft.loadingPosts = true;
                draft.loadPostErrorReason = '';
                break;
            case LOAD_POSTS_DONE:
                action.data.forEach(v => {
                    draft.posts.push(v);
                    draft.nextPageToken = `${v.id}`;
                });
                draft.hasMorePost = action.data.length === draft.postsLimit;
                draft.loadingPosts = false;
                draft.searchKeyword = action.keyword;
                break;
            case LOAD_POSTS_FAIL:
                draft.loadingPosts = false;
                draft.loadPostErrorReason = action.error;
                break;
            default:
                break;
        }
    });

export default reducer;
