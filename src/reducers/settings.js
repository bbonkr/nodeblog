import produce from 'immer';

export const initialState = {
    currentUrl: '',
};

export const SET_CURRENT_URL = 'SET_CURRENT_URL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SET_CURRENT_URL:
                draft.currentUrl = action.data;
                break;
            default:
                break;
        }
    });

export default reducer;
