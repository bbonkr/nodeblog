import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import Validator from '../helpers/validator';
import { SIGN_UP_CALL } from '../reducers/user';
import Router from 'next/router';
import { ErrorMessageWrapper } from '../styledComponents/Wrapper';

const PLACEHOLDER_EMAIL = 'Input your email address';
const PLACEHOLDER_PASSWORD = 'Input your password';
const PLACEHOLDER_PASSWORD_CONFIRM = 'Input your password again';
const PLACEHOLDER_DISPLAYNAME = 'Input your display name';

const LABEL_EMAIL = 'E-mail';
const LABEL_PASSWORD = 'Password';
const LABEL_PASSWORD_CONFIRM = 'Confirm Password';
const LABEL_DISPLAYNAME = 'Display name';

const DISPLAYNAME_MIN_LENGTH = 4;
const formValues = {
    email: '',
    password: '',
    passwordConfirm: '',
    displayName: '',
    agreement: false,
};
const formValidator = () => {
    const passwordCheck = formValues => {
        const { password, passwordConfirm } = formValues;

        if (password.trim() !== passwordConfirm.trim()) {
            return {
                valid: false,
                message: 'Please check your two passwords',
            };
        }

        return { valid: true, message: '' };
    };

    const email = formValues => {
        const { email } = formValues;
        if (!email || email.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input your email address',
            };
        }

        if (!Validator.email(email)) {
            return {
                valid: false,
                message: 'Please input a valid formatted email address',
            };
        }

        return {
            valid: true,
            message: '',
        };
    };
    const password = formValues => {
        const { password } = formValues;
        if (!password || password.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input your password',
            };
        }

        // return passwordCheck(formValues);
        return {
            valid: true,
            message: '',
        };
    };
    const passwordConfirm = formValues => {
        const { passwordConfirm } = formValues;
        if (!passwordConfirm || passwordConfirm.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input your password again',
            };
        }

        return passwordCheck(formValues);
    };

    const displayName = formValues => {
        const { displayName } = formValues;
        if (!displayName || displayName.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input your display name',
            };
        }

        if (displayName.trim().length < DISPLAYNAME_MIN_LENGTH) {
            return {
                valid: false,
                message: `Please input your display name longer than ${DISPLAYNAME_MIN_LENGTH}`,
            };
        }

        return {
            valid: true,
            message: '',
        };
    };
    const validate = formValues => {
        const results = [];

        results.push(email(formValues));
        results.push(password(formValues));
        results.push(passwordConfirm(formValues));
        results.push(displayName(formValues));

        let valid = true;
        const messages = [];
        results.forEach(v => {
            valid = valid && v.valid;
            if (!v.valid) {
                messages.push(v.message);
            }
        });

        return {
            valid: valid,
            messages: messages,
        };
    };
    return {
        email,
        password,
        passwordConfirm,
        displayName,
        validate,
    };
};

const SignUpForm = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [
        passwordConfirmErrorMessage,
        setPasswordConfirmErrorMessage,
    ] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [agreementErrorMessage, setAgreementErrorMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDirty, setConfirmDirty] = useState(false);
    const { me, signUpInProcess, signUpFailMessage } = useSelector(s => s.user);

    useEffect(() => {
        if (me) {
            Router.push('/me');
        }
    }, [me]);

    const onChangeEmail = useCallback(e => {
        const newValue = e.target.value;
        setEmail(newValue);

        const { message } = formValidator().email({ email: newValue });
        setEmailErrorMessage(message);
    }, []);

    const onChangePassword = useCallback(
        e => {
            const newValue = e.target.value;
            setPassword(newValue);

            const { message } = formValidator().password({
                password: newValue,
                passwordConfirm,
            });
            setPasswordErrorMessage(message);
        },
        [passwordConfirm],
    );

    const onChangePasswordConfirm = useCallback(
        e => {
            const newValue = e.target.value;
            setPasswordConfirm(newValue);

            const { message } = formValidator().passwordConfirm({
                password,
                passwordConfirm: newValue,
            });
            setPasswordConfirmErrorMessage(message);
        },
        [password],
    );

    const onChangeDisplayName = useCallback(e => {
        const newValue = e.target.value;
        setDisplayName(newValue);

        const { message } = formValidator().displayName({
            displayName: newValue,
        });
        setDisplayNameErrorMessage(message);
    }, []);

    const onChangeAgreement = useCallback(e => {
        setAgreement(e.target.checked);
    }, []);

    const isFormValid = useCallback(() => {
        const formValues = {
            email,
            password,
            passwordConfirm,
            displayName,
        };
        const { valid, messages } = formValidator().validate(formValues);
        return valid && agreement;
    }, [agreement, displayName, email, password, passwordConfirm]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const formValues = {
                email,
                password,
                passwordConfirm,
                displayName,
            };
            const { valid, messages } = formValidator().validate(formValues);

            console.log('valid: ', valid);
            console.log('messages: ', messages);

            if (valid) {
                dispatch({
                    type: SIGN_UP_CALL,
                    data: formValues,
                });
            }
        },
        [dispatch, displayName, email, password, passwordConfirm],
    );

    if (me) {
        return <div>Loading ...</div>;
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Item
                label={LABEL_EMAIL}
                hasFeedback={true}
                validateStatus={emailErrorMessage ? 'error' : 'success'}
                help={emailErrorMessage}>
                <Input
                    value={email}
                    onChange={onChangeEmail}
                    placeholder={PLACEHOLDER_EMAIL}
                />
            </Form.Item>
            <Form.Item
                label={LABEL_PASSWORD}
                hasFeedback={true}
                validateStatus={passwordErrorMessage ? 'error' : 'success'}
                help={passwordErrorMessage}>
                <Input.Password
                    value={password}
                    onChange={onChangePassword}
                    placeholder={PLACEHOLDER_PASSWORD}
                />
            </Form.Item>
            <Form.Item
                label={LABEL_PASSWORD_CONFIRM}
                hasFeedback={true}
                validateStatus={
                    passwordConfirmErrorMessage ? 'error' : 'success'
                }
                help={passwordConfirmErrorMessage}>
                <Input.Password
                    value={passwordConfirm}
                    onChange={onChangePasswordConfirm}
                    placeholder={PLACEHOLDER_PASSWORD_CONFIRM}
                />
            </Form.Item>
            <Form.Item
                label={LABEL_DISPLAYNAME}
                hasFeedback={true}
                validateStatus={displayNameErrorMessage ? 'error' : 'success'}
                help={displayNameErrorMessage}>
                <Input
                    value={displayName}
                    onChange={onChangeDisplayName}
                    placeholder={PLACEHOLDER_DISPLAYNAME}
                />
            </Form.Item>
            <Form.Item>
                <Checkbox checked={agreement} onChange={onChangeAgreement}>
                    I have read the agreement
                </Checkbox>
                {!!signUpFailMessage && (
                    <ErrorMessageWrapper>
                        {signUpFailMessage}
                    </ErrorMessageWrapper>
                )}
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!isFormValid()}
                    loading={signUpInProcess}>
                    Sign up
                </Button>
            </Form.Item>
        </Form>
    );
};

SignUpForm.getInitialProps = async context => {
    return {};
};

export default SignUpForm;
