import produce from 'immer';

export const initialState = {
    categories: [],
    loadingCategories: false,
};

export const LOAD_CATEGORIES_CALL = 'LOAD_CATEGORIES_CALL';
export const LOAD_CATEGORIES_DONE = 'LOAD_CATEGORIES_DONE';
export const LOAD_CATEGORIES_FAIL = 'LOAD_CATEGORIES_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case LOAD_CATEGORIES_CALL:
                draft.categories = [];
                draft.loadingCategories = true;
                break;
            case LOAD_CATEGORIES_DONE:
                draft.categories = action.data;
                draft.loadingCategories = false;
                break;
            case LOAD_CATEGORIES_FAIL:
                draft.loadingCategories = false;
                break;
            default:
                break;
        }
    });

export default reducer;
