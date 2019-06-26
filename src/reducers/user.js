import produce from 'immer';
import Router from 'next/router';
import { ShowNotification } from '../components/ShowNotification';

export const initialState = {
    me: null,
    signInFailMessage: '',
    signInInProcess: false,

    // sign Up
    signUpFailMessage: '',
    signUpInProcess: false,
    signUpSuccess: false,

    loadingChangePassword: false,
    changePasswordSuccess: false,

    loadingChangeInfo: false,
    changeInfoSuccess: false,

    // sign out
    signOutLoading: false,
    signOutErrorReason: '',
    signOutReturnUrl: '',

    // verify email
    verifyEmailInfo: {},
    verifyEmailLoading: false,
    verifyEmailErrorReason: '',

    // make verify email code
    makeVerifyEmailLoading: false,
    makeVerifyEmailErrorReason: '',

    // request reset password
    requestResetPasswordLoading: false,
    requestResetPasswordErrorReason: '',

    // reset password
    resetPasswordLoading: false,
    resetPasswordErrorReason: '',
    resetPasswordSuccess: false,

    // unregister
    unregisterLoading: false,
    unregisterErrorReason: '',
    unregisterSuccess: false,
};

export const SIGN_IN_PREPARE = 'SIGN_IN_PREPARE';
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

export const VERIFY_EMAIL_CALL = 'VERIFY_EMAIL_CALL';
export const VERIFY_EMAIL_DONE = 'VERIFY_EMAIL_DONE';
export const VERIFY_EMAIL_FAIL = 'VERIFY_EMAIL_FAIL';

/** 전자우편 확인 코드 생성 및 전자우편 전송 */
export const MAKE_VERIFY_EMAIL_CALL = 'MAKE_VERIFY_EMAIL_CALL';
export const MAKE_VERIFY_EMAIL_DONE = 'MAKE_VERIFY_EMAIL_DONE';
export const MAKE_VERIFY_EMAIL_FAIL = 'MAKE_VERIFY_EMAIL_FAIL';

export const REQUEST_RESET_PASSWORD_CALL = 'REQUEST_RESET_PASSWORD_CALL';
export const REQUEST_RESET_PASSWORD_DONE = 'REQUEST_RESET_PASSWORD_DONE';
export const REQUEST_RESET_PASSWORD_FAIL = 'REQUEST_RESET_PASSWORD_FAIL';

export const RESET_PASSWORD_CALL = 'RESET_PASSWORD_CALL';
export const RESET_PASSWORD_DONE = 'RESET_PASSWORD_DONE';
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL';

export const UNREGISTER_CALL = 'UNREGISTER_CALL';
export const UNREGISTER_DONE = 'UNREGISTER_DONE';
export const UNREGISTER_FAIL = 'UNREGISTER_FAIL';

const reducer = (state = initialState, action) =>
    produce(state, draft => {
        // console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);
        switch (action.type) {
            case SIGN_IN_PREPARE:
                draft.signInFailMessage = '';
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
                draft.signOutLoading = true;
                break;
            case SIGN_OUT_DONE:
                draft.me = null;
                // Router.push(!!action.returnUrl ? action.returnUrl : '/');
                draft.signOutLoading = false;
                draft.signOutReturnUrl = !!action.returnUrl
                    ? action.returnUrl
                    : '/';
                break;
            case SIGN_OUT_FAIL:
                draft.signOutLoading = false;
                draft.signOutErrorReason = action.reason;
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
                draft.signUpSuccess = false;
                break;
            case SIGN_UP_DONE:
                draft.signUpInProcess = false;
                // draft.me = action.data;
                draft.signUpSuccess = true;
                break;
            case SIGN_UP_FAIL:
                draft.signUpInProcess = false;
                draft.signUpSuccess = false;
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
                ShowNotification({
                    title: 'Fail to change account information',
                    message: action.reason,
                });
                break;

            case VERIFY_EMAIL_CALL:
                draft.verifyEmailLoading = true;
                draft.verifyEmailInfo = {};
                draft.verifyEmailErrorReason = 'Processing ...';
                break;
            case VERIFY_EMAIL_DONE:
                draft.verifyEmailInfo = action.data;
                draft.verifyEmailErrorReason = '';
                draft.verifyEmailLoading = false;

                if (draft.me) {
                    draft.me.isEmailConfirmed = true;
                }
                break;
            case VERIFY_EMAIL_FAIL:
                draft.verifyEmailErrorReason = action.reason;
                draft.verifyEmailLoading = false;
                break;

            case MAKE_VERIFY_EMAIL_CALL:
                draft.makeVerifyEmailErrorReason = '';
                draft.makeVerifyEmailLoading = true;
                break;
            case MAKE_VERIFY_EMAIL_DONE:
                draft.makeVerifyEmailLoading = false;
                break;
            case MAKE_VERIFY_EMAIL_FAIL:
                draft.makeVerifyEmailErrorReason = action.reason;
                draft.makeVerifyEmailLoading = false;
                ShowNotification({
                    title: 'Fail to make verify email code.',
                    message: action.reason,
                });
                break;

            case REQUEST_RESET_PASSWORD_CALL:
                draft.requestResetPasswordLoading = true;
                draft.requestResetPasswordErrorReason = '';
                break;
            case REQUEST_RESET_PASSWORD_DONE:
                draft.requestResetPasswordLoading = false;
                draft.requestResetPasswordErrorReason = '';
                ShowNotification({
                    title: 'Sent email that Reset password link.',
                    message: 'Please check your mailbox.',
                });
                break;
            case REQUEST_RESET_PASSWORD_FAIL:
                draft.requestResetPasswordLoading = false;
                draft.requestResetPasswordErrorReason = action.reason;
                ShowNotification({
                    title: 'Fail a request to reset password.',
                    message: action.reason,
                });
                break;

            case RESET_PASSWORD_CALL:
                draft.resetPasswordLoading = true;
                draft.resetPasswordErrorReason = '';
                draft.resetPasswordSuccess = false;
                break;
            case RESET_PASSWORD_DONE:
                draft.resetPasswordLoading = false;
                draft.resetPasswordErrorReason = '';
                draft.resetPasswordSuccess = true;
                break;
            case RESET_PASSWORD_FAIL:
                draft.resetPasswordLoading = false;
                draft.resetPasswordErrorReason = action.reason;
                ShowNotification({
                    title: 'Fail to reset password.',
                    message: action.reason,
                });
                break;
            case UNREGISTER_CALL:
                draft.unregisterLoading = true;
                draft.unregisterSuccess = false;
                break;
            case UNREGISTER_DONE:
                draft.unregisterLoading = false;
                // draft.me = null;
                draft.unregisterSuccess = true;
                // ShowNotification({
                //     title: 'Farewell my friend. Hope to See you again soon.',
                // });
                break;
            case UNREGISTER_FAIL:
                draft.unregisterLoading = false;
                draft.unregisterErrorReason = action.reason;
                draft.unregisterSuccess = false;
                break;
            default:
                break;
        }
    });

export default reducer;
