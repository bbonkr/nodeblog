import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader, Form, Input, Button, Icon, Divider } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import { ContentWrapper } from '../styledComponents/Wrapper';
import { signUpFormValidator } from '../helpers/formValidators';
import { REQUEST_RESET_PASSWORD_CALL } from '../reducers/user';

const RequestResetPassword = () => {
    const dispatch = useDispatch();
    const { requestResetPasswordLoading } = useSelector(s => s.user);

    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const onChangeEmail = useCallback(e => {
        const newValue = e.target.value;
        setEmail(newValue);
        const { message } = signUpFormValidator.checkEmail({ email: newValue });
        setEmailErrorMessage(message);
    }, []);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const formData = { email: email };
            const { valid, message } = signUpFormValidator.checkEmail(formData);

            if (valid) {
                dispatch({
                    type: REQUEST_RESET_PASSWORD_CALL,
                    data: formData,
                });
            }
        },
        [dispatch, email],
    );

    return (
        <DefaultLayout>
            <ContentWrapper>
                <PageHeader title="Reset Password Request" />
                <Divider />
                <Form onSubmit={onSubmit}>
                    <Form.Item
                        label="Email address"
                        hasFeedback={true}
                        help={emailErrorMessage}
                        validateStatus={
                            !emailErrorMessage ? 'success' : 'error'
                        }>
                        <Input
                            value={email}
                            onChange={onChangeEmail}
                            placeholder="Input your email address"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={requestResetPasswordLoading}>
                            Send a Reset Password Request
                        </Button>
                    </Form.Item>
                </Form>
            </ContentWrapper>
        </DefaultLayout>
    );
};

export default RequestResetPassword;
