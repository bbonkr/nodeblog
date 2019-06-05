import produce from 'immer';
import Router from 'next/router';
export const initialState = {
    me: null,
    signInFailMessage: '',
};

export const SIGN_IN_CALL = 'SIGN_IN_CALL';
export const SIGN_IN_DONE = 'SIGN_IN_DONE';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const SIGN_OUT_CALL = 'SIGN_OUT_CALL';
export const SIGN_OUT_DONE = 'SIGN_OUT_DONE';
export const SIGN_OUT_FAIL = 'SIGN_OUT_FAIL';
export const ME_CALL = 'ME_CALL';
export const ME_DONE = 'ME_DONE';
export const ME_FAIL = 'ME_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SIGN_IN_CALL:
                break;
            case SIGN_IN_DONE:
                draft.me = action.data;
                // Router.push({ pathname: '/' });
                break;
            case SIGN_IN_FAIL:
                draft.signInFailMessage = action.reason
                    ? action.reason
                    : action.error;
                break;
            case SIGN_OUT_CALL:
                draft.me = null;
                break;
            case SIGN_OUT_DONE:
                // Router.push({ pathname: '/' });
                break;
            case SIGN_OUT_FAIL:
                break;
            case ME_CALL:
                break;
            case ME_DONE:
                draft.me = action.data;
                break;
            case ME_FAIL:
                draft.me = null;
                Router.push({ pathname: '/signin' });
                break;
            default:
                break;
        }
    });

export default reducer;
