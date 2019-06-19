import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { CHANGE_PASSWORD_CALL } from '../reducers/user';

const PASSWORD_LENGTH = 4;

const validator = {
    validatePassword(password) {
        if (!password || password.length === 0) {
            return {
                valid: false,
                message: 'Please input your current password.',
            };
        }

        if (password.length < PASSWORD_LENGTH) {
            return {
                valid: false,
                message: `Please input your password more than ${PASSWORD_LENGTH} characters.`,
            };
        }

        return {
            valid: true,
            message: '',
        };
    },
    checkCurrentPassword(formData) {
        const { currentPassword } = formData;

        return this.validatePassword(currentPassword.trim());
    },
    checkPassword(formData) {
        const { password } = formData;

        return this.validatePassword(password.trim());
    },
    checkPasswordConfirm(formData) {
        const { password, passwordConfirm } = formData;
        let result = this.validatePassword(passwordConfirm.trim());

        if (!result.valid) {
            return result;
        }

        if (password.trim() !== passwordConfirm.trim()) {
            return {
                valid: false,
                message: 'Please input same as password.',
            };
        }

        return result;
    },
    validate(formData) {
        const results = [];
        results.push(this.checkCurrentPassword(formData));
        results.push(this.checkPassword(formData));
        results.push(this.checkPasswordConfirm(formData));

        let valid = true;
        const messages = [];
        results.forEach(v => {
            valid &= v.valid;
            if (!v.valid) {
                messages.push(v.message);
            }
        });

        return {
            valid: valid,
            messages: messages,
        };
    },
};

const ChangePasswordForm = () => {
    const dispatch = useDispatch();
    const { loadingChangePassword, changePasswordSuccess } = useSelector(
        s => s.user
    );
    const [currentPassword, setCurrentPassword] = useState('');
    const [
        currentPasswordErrorMessage,
        setCurrentPasswordErrorMessage,
    ] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [
        passwordConfirmErrorMessage,
        setPasswordConfirmErrorMessage,
    ] = useState('');
    // const [canChange, setCanChange] = useState(false);

    const reset = () => {
        setCurrentPassword('');
        setCurrentPasswordErrorMessage('');
        setPassword('');
        setPasswordErrorMessage('');
        setPasswordConfirm('');
        setPasswordConfirmErrorMessage('');
    };

    useEffect(() => {
        if (changePasswordSuccess) {
            reset();
        }
    }, [changePasswordSuccess]);

    const onChangeCurrentPassword = useCallback(e => {
        const newValue = e.target.value;
        setCurrentPassword(newValue);

        const { message } = validator.checkCurrentPassword({
            currentPassword: newValue,
        });
        setCurrentPasswordErrorMessage(message);
    }, []);

    const onChangePassword = useCallback(e => {
        const newValue = e.target.value;
        setPassword(newValue);
        const { message } = validator.checkPassword({
            password: newValue,
        });
        setPasswordErrorMessage(message);
    }, []);

    const onChangePasswordConfirm = useCallback(
        e => {
            const newValue = e.target.value;
            setPasswordConfirm(newValue);
            const { message } = validator.checkPasswordConfirm({
                password: password,
                passwordConfirm: newValue,
            });
            setPasswordConfirmErrorMessage(message);
        },
        [password]
    );

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const formData = {
                currentPassword: currentPassword.trim(),
                password: password.trim(),
                passwordConfirm: passwordConfirm.trim(),
            };
            const result = validator.validate(formData);
            if (result.valid) {
                dispatch({
                    type: CHANGE_PASSWORD_CALL,
                    data: formData,
                });
            }
        },
        [currentPassword, dispatch, password, passwordConfirm]
    );

    return (
        <Form onSubmit={onSubmit}>
            <Form.Item
                label="Current password"
                hasFeedback={true}
                help={currentPasswordErrorMessage}
                validateStatus={
                    !currentPasswordErrorMessage ? 'success' : 'error'
                }>
                <Input.Password
                    value={currentPassword}
                    onChange={onChangeCurrentPassword}
                />
            </Form.Item>
            <Form.Item
                label="Password"
                hasFeedback={true}
                help={passwordErrorMessage}
                validateStatus={!passwordErrorMessage ? 'success' : 'error'}>
                <Input.Password value={password} onChange={onChangePassword} />
            </Form.Item>
            <Form.Item
                label="Password again"
                hasFeedback={true}
                help={passwordConfirmErrorMessage}
                validateStatus={
                    !passwordConfirmErrorMessage ? 'success' : 'error'
                }>
                <Input.Password
                    value={passwordConfirm}
                    onChange={onChangePasswordConfirm}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingChangePassword}>
                    Change Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ChangePasswordForm;
