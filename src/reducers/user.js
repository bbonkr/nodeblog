import produce from 'immer';
export const initialState = {
    me: null,
    signInFailMessage: '',
    signInInProcess: false,
    signUpFailMessage: '',
    signUpInProcess: false,
};

export const SIGN_IN_CALL = 'SIGN_IN_CALL';
export const SIGN_IN_DONE = 'SIGN_IN_DONE';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const SIGN_OUT_CALL = 'SIGN_OUT_CALL';
export const SIGN_OUT_DONE = 'SIGN_OUT_DONE';
export const SIGN_OUT_FAIL = 'SIGN_OUT_FAIL';
export const SIGN_UP_CALL = 'SIGN_UP_CALL';
export const SIGN_UP_DONE = 'SIGN_UP_DONE';
export const SIGN_UP_FAIL = 'SIGN_UP_FAIL';
export const ME_CALL = 'ME_CALL';
export const ME_DONE = 'ME_DONE';
export const ME_FAIL = 'ME_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SIGN_IN_CALL:
                draft.signInInProcess = true;
                break;
            case SIGN_IN_DONE:
                draft.signInInProcess = false;
                draft.me = action.data;
                break;
            case SIGN_IN_FAIL:
                draft.signInInProcess = false;
                draft.signInFailMessage = action.reason
                    ? action.reason
                    : action.error;
                break;
            case SIGN_OUT_CALL:
                break;
            case SIGN_OUT_DONE:
                draft.me = null;
                break;
            case SIGN_OUT_FAIL:
                break;
            case ME_CALL:
                break;
            case ME_DONE:
                draft.me = action.data;
                break;
            case ME_FAIL:
                break;
            case SIGN_UP_CALL:
                draft.signUpFailMessage = '';
                draft.signUpInProcess = true;
                break;
            case SIGN_UP_DONE:
                draft.signUpInProcess = false;
                draft.me = action.data;
                break;
            case SIGN_UP_FAIL:
                draft.signUpInProcess = false;
                draft.signUpFailMessage = action.reason
                    ? action.reason
                    : action.error;
                break;
            default:
                break;
        }
    });

export default reducer;
