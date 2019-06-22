import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader, Form, Input, Button, Icon, Divider } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import { ContentWrapper } from '../styledComponents/Wrapper';
import { signUpFormValidator } from '../helpers/formValidators';
import Router from 'next/router';
import { RESET_PASSWORD_CALL } from '../reducers/user';

const ResetPassword = ({ email, code }) => {
    const dispatch = useDispatch();
    const {
        resetPasswordLoading,
        resetPasswordErrorMessage,
        resetPasswordSuccess,
    } = useSelector(s => s.user);

    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [
        temporaryPasswordErrorMessage,
        setTemporaryPasswordErrorMessage,
    ] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [
        passwordConfirmErrorMessage,
        setPasswordConfirmErrorMessage,
    ] = useState('');

    useEffect(() => {
        if (resetPasswordSuccess) {
            Router.push('/signin');
        }
    }, [resetPasswordSuccess]);

    const onChangeTemporaryPassword = useCallback(e => {
        const newValue = e.target.value;
        setTemporaryPassword(newValue);
        const { message } = signUpFormValidator.checkPassword({
            password: newValue,
        });
        setTemporaryPasswordErrorMessage(message);
    }, []);

    const onChangePassword = useCallback(e => {
        const newValue = e.target.value;
        setPassword(newValue);
        const { message } = signUpFormValidator.checkPassword({
            password: newValue,
        });
        setPasswordErrorMessage(message);
    }, []);

    const onChangePasswordConfirm = useCallback(
        e => {
            const newValue = e.target.value;
            setPasswordConfirm(newValue);
            const { message } = signUpFormValidator.checkPasswordConfirm({
                password: password,
                passwordConfirm: newValue,
            });
            setPasswordConfirmErrorMessage(message);
        },
        [password],
    );

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const results = [];
            const messages = [];
            let valid = true;
            results.push(
                signUpFormValidator.checkPassword({
                    password: temporaryPassword,
                }),
            );
            results.push(
                signUpFormValidator.checkPassword({ password: password }),
            );
            results.push(
                signUpFormValidator.checkPasswordConfirm({
                    password: password,
                    passwordConfirm: passwordConfirm,
                }),
            );

            results.forEach(v => {
                valid &= v.valid;
                if (!v.valid) {
                    messages.push(v.message);
                }
            });

            if (valid) {
                dispatch({
                    type: RESET_PASSWORD_CALL,
                    data: {
                        email: email,
                        code: code,
                        password: temporaryPassword,
                        newPassword: password,
                    },
                });
            }
        },
        [code, dispatch, email, password, passwordConfirm, temporaryPassword],
    );

    return (
        <DefaultLayout>
            <ContentWrapper>
                <PageHeader title="Reset a password" />
                <Divider />
                <Form onSubmit={onSubmit}>
                    <Form.Item
                        label="Temporary password"
                        hasFeedback={true}
                        help={temporaryPasswordErrorMessage}
                        validateStatus={
                            !temporaryPasswordErrorMessage ? 'success' : 'error'
                        }>
                        <Input.Password
                            value={temporaryPassword}
                            onChange={onChangeTemporaryPassword}
                            placeholder="Input a temporary password."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        hasFeedback={true}
                        help={passwordErrorMessage}
                        validateStatus={
                            !passwordErrorMessage ? 'success' : 'error'
                        }>
                        <Input.Password
                            value={password}
                            onChange={onChangePassword}
                            placeholder="Input a new password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password (again)"
                        hasFeedback={true}
                        help={passwordConfirmErrorMessage}
                        validateStatus={
                            !passwordConfirmErrorMessage ? 'success' : 'error'
                        }>
                        <Input.Password
                            value={passwordConfirm}
                            onChange={onChangePasswordConfirm}
                            placeholder="Input a new password again"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={resetPasswordLoading}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </ContentWrapper>
        </DefaultLayout>
    );
};

ResetPassword.getInitialProps = async context => {
    const { email, code } = context.query;

    return {
        email,
        code,
    };
};

export default ResetPassword;
