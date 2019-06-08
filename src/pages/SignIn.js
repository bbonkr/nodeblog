import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Form, Input, Checkbox, Button, Icon, Row, Col } from 'antd';
import styled from 'styled-components';
import Validator from '../helpers/validator';
import { SIGN_IN_CALL } from '../reducers/user';
import Router from 'next/router';
import PropTypes from 'prop-types';
import {
    ERROR_COLOR,
    ContentWrapper,
    ErrorMessageWrapper
} from '../styledComponents/Wrapper';

const INPUT_EMAIL_PLACEHOLDER = 'Your email Address';
const INPUT_PASSWORD_PLACEHOLDER = 'Your password';

const MESSAGE_INVALID_EMAIL = 'Invalid email address.';
const MESSAGE_REQUIRED_EMAIL = 'Please Input your email address';
const MESSAGE_REQUIRED_PASSWORD = 'Please Input your password';

const SignIn = ({ returnUrl }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [remember, setRemember] = useState(false);
    const { me, signInFailMessage } = useSelector(s => s.user);

    useEffect(() => {
        if (me && me.id) {
            // Router.push({ pathname: '/', query: { home: true } });
            Router.push(returnUrl);
        }
    }, [me, returnUrl]);

    const onEmailChange = useCallback(e => {
        const value = e.target.value;
        setEmail(value);

        if (value.trim().length === 0) {
            setEmailError(MESSAGE_REQUIRED_EMAIL);
        } else if (!Validator.email(value)) {
            setEmailError(MESSAGE_INVALID_EMAIL);
        } else {
            setEmailError('');
        }

        // if (!Validator.email(e.target.value, setEmailError, '')) {
        //     setEmailError('Invalid format');
        // }
    }, []);

    const onPasswordChange = useCallback(e => {
        const value = e.target.value;
        setPassword(value);

        if (value.trim().length === 0) {
            setPasswordError(MESSAGE_REQUIRED_PASSWORD);
        } else {
            setPasswordError('');
        }
    }, []);

    const onRememberChange = useCallback(e => {
        setRemember(e.target.checked);
    }, []);

    const isSubmitButtonDisabled = useCallback(() => {
        return !!(emailError || passwordError);
    }, [emailError, passwordError]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            if (!isSubmitButtonDisabled()) {
                setEmailError('');
                setPasswordError('');

                if (!email || email.trim().length === 0) {
                    setEmailError(MESSAGE_REQUIRED_EMAIL);
                } else if (!Validator.email(email)) {
                    setEmailError(MESSAGE_INVALID_EMAIL);
                } else if (!password || password.trim().length === 0) {
                    setPasswordError(MESSAGE_REQUIRED_PASSWORD);
                } else {
                    dispatch({
                        type: SIGN_IN_CALL,
                        data: {
                            email: email,
                            password: password,
                            remember: remember
                        },
                        returnUrl: returnUrl
                    });
                }
            }
        },
        [dispatch, email, isSubmitButtonDisabled, password, remember, returnUrl]
    );

    if (me) {
        return <ContentWrapper>Redirect to default page.</ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <Row type='flex' justify='center' align='middle'>
                <Col xs={24} sm={24} md={12}>
                    {signInFailMessage && (
                        <ErrorMessageWrapper>
                            <h4>Please check your input.</h4>
                            {signInFailMessage}
                        </ErrorMessageWrapper>
                    )}
                    <Form onSubmit={onSubmit}>
                        <Form.Item>
                            <Input
                                style={{ width: '100%' }}
                                value={email}
                                onChange={onEmailChange}
                                placeholder={INPUT_EMAIL_PLACEHOLDER}
                                prefix={
                                    <Icon
                                        type='mail'
                                        style={{
                                            color: 'rgba(0,0,0,0.25)'
                                        }}
                                    />
                                }
                            />
                            {emailError && (
                                <span>
                                    <Icon
                                        type='alert'
                                        style={{ color: ERROR_COLOR }}
                                    />
                                    <span style={{ color: ERROR_COLOR }}>
                                        {emailError}
                                    </span>
                                </span>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Input.Password
                                style={{ width: '100%' }}
                                value={password}
                                onChange={onPasswordChange}
                                placeholder={INPUT_PASSWORD_PLACEHOLDER}
                                prefix={
                                    <Icon
                                        type='lock'
                                        style={{
                                            color: 'rgba(0,0,0,0.25)'
                                        }}
                                    />
                                }
                            />
                            {passwordError && (
                                <span>
                                    <Icon
                                        type='alert'
                                        style={{ color: errorColor }}
                                    />
                                    <span style={{ color: errorColor }}>
                                        {passwordError}
                                    </span>
                                </span>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Checkbox
                                checked={remember}
                                onChange={onRememberChange}
                            >
                                Remember me
                            </Checkbox>
                            <Link href='/findpassword'>
                                <a style={{ float: 'right' }}>
                                    Forgot password
                                </a>
                            </Link>
                            <Button
                                type='primary'
                                htmlType='submit'
                                style={{ width: '100%' }}
                                disabled={isSubmitButtonDisabled()}
                            >
                                Log in
                            </Button>
                            {'Or '}
                            <Link href='/signup'>
                                <a>Register now!</a>
                            </Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </ContentWrapper>
    );
};

SignIn.getInitialProps = async context => {
    const { returnUrl } = context.query;
    return {
        doNotSetCurrentUrl: true,
        returnUrl
    };
};

SignIn.propTypes = {
    returnUrl: PropTypes.string
};

export default SignIn;
