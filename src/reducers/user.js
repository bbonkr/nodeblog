import produce from 'immer';
import Router from 'next/router';
import { ShowNotification } from '../components/ShowNotification';

export const initialState = {
    me: null,
    signInFailMessage: '',
    signInInProcess: false,
    signUpFailMessage: '',
    signUpInProcess: false,

    loadingChangePassword: false,
    changePasswordSuccess: false,

    loadingChangeInfo: false,
    changeInfoSuccess: false,
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

export const CHANGE_PASSWORD_CALL = 'CHANGE_PASSWORD_CALL';
export const CHANGE_PASSWORD_DONE = 'CHANGE_PASSWORD_DONE';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';

export const CHANGE_INFO_CALL = 'CHANGE_INFO_CALL';
export const CHANGE_INFO_DONE = 'CHANGE_INFO_DONE';
export const CHANGE_INFO_FAIL = 'CHANGE_INFO_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);
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
                Router.push(!!action.returnUrl ? action.returnUrl : '/');
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
            case CHANGE_PASSWORD_CALL:
                draft.loadingChangePassword = true;
                draft.changePasswordSuccess = false;
                break;
            case CHANGE_PASSWORD_DONE:
                draft.loadingChangePassword = false;
                draft.changePasswordSuccess = true;
                ShowNotification({
                    title: 'Your password was Changed.',
                });
                break;
            case CHANGE_PASSWORD_FAIL:
                draft.loadingChangePassword = false;
                draft.changePasswordSuccess = false;
                ShowNotification({
                    title: 'Fail to change a password.',
                    message: action.reason,
                });
                break;
            case CHANGE_INFO_CALL:
                draft.loadingChangeInfo = true;
                draft.changeInfoSuccess = false;
                break;
            case CHANGE_INFO_DONE:
                draft.loadingChangeInfo = false;
                draft.changeInfoSuccess = true;
                draft.me = action.data;
                break;
            case CHANGE_INFO_FAIL:
                draft.loadingChangeInfo = false;
                draft.changeInfoSuccess = false;
                break;

            default:
                break;
        }
    });

export default reducer;
