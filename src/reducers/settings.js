import produce from 'immer';

export const initialState = {
    currentUrl: '',
};

export const SET_CURRENT_URL = 'SET_CURRENT_URL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);
        switch (action.type) {
            case SET_CURRENT_URL:
                draft.currentUrl = action.data;
                break;
            default:
                break;
        }
    });

export default reducer;
