import produce from 'immer';

export const initialState = {
    myPosts: [],
    categories: [],
    tags: [],
    loadingCategories: false,
    loadingTags: false,
    loadingMyPosts: false,
    loadCategoriesErrorReason: '',
    loadTagsErrorReason: '',
    loadMyPostErrorReason: '',

    writingPost: false,
    writePostErrorReason: '',
};

export const LOAD_MY_POSTS_CALL = 'LOAD_MY_POSTS_CALL';
export const LOAD_MY_POSTS_DONE = 'LOAD_MY_POSTS_DONE';
export const LOAD_MY_POSTS_FAIL = 'LOAD_MY_POSTS_FAIL';

export const LOAD_MY_CATEGORIES_CALL = 'LOAD_MY_CATEGORIES_CALL';
export const LOAD_MY_CATEGORIES_DONE = 'LOAD_MY_CATEGORIES_DONE';
export const LOAD_MY_CATEGORIES_FAIL = 'LOAD_MY_CATEGORIES_FAIL';

export const LOAD_MY_TAGS_CALL = 'LOAD_MY_TAGS_CALL';
export const LOAD_MY_TAGS_DONE = 'LOAD_MY_TAGS_DONE';
export const LOAD_MY_TAGS_FAIL = 'LOAD_MY_TAGS_FAIL';

export const WRITE_POST_CALL = 'WRITE_POST_CALL';
export const WRITE_POST_DONE = 'WRITE_POST_DONE';
export const WRITE_POST_FAIL = 'WRITE_POST_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        // https://lannstark.github.io/nodejs/console/3
        console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);

        switch (action.type) {
            case LOAD_MY_POSTS_CALL:
                draft.loadingMyPosts = true;
                break;
            case LOAD_MY_POSTS_DONE:
                draft.loadingMyPosts = false;
                draft.myPosts = action.data;
                break;
            case LOAD_MY_POSTS_FAIL:
                draft.loadingMyPosts = false;
                break;

            case LOAD_MY_CATEGORIES_CALL:
                draft.loadingCategories = true;
                break;
            case LOAD_MY_CATEGORIES_DONE:
                draft.loadingCategories = false;
                draft.categories = action.data;
                break;
            case LOAD_MY_CATEGORIES_FAIL:
                draft.loadingCategories = false;
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
                console.log(action.data);
                break;
            case WRITE_POST_FAIL:
                draft.writingPost = false;
                break;
            default:
                break;
        }
    });

export default reducer;
