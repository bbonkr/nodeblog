import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, Spin, Alert, Divider } from 'antd';
import DefaultLayout from '../components/DefaultLayout';
import { ContentWrapper } from '../styledComponents/Wrapper';
import Router from 'next/router';
import { VERIFY_EMAIL_CALL } from '../reducers/user';

const VerifyEmail = ({ email, code }) => {
    const dispatch = useDispatch();

    // TODO 로그인을 하지 않은 상태이면?
    const {
        verifyEmailInfo,
        verifyEmailLoading,
        verifyEmailErrorReason,
    } = useSelector(s => s.user);

    useEffect(() => {
        if (!!code) {
            dispatch({
                type: VERIFY_EMAIL_CALL,
                data: {
                    email: email,
                    code: code,
                },
            });
        }
    }, [code, dispatch, email]);

    const onClickGoToHome = useCallback(() => {
        Router.push('/');
    }, []);

    const onSubmitRetry = useCallback(e => {
        e.preventDefault();
    }, []);

    return (
        <DefaultLayout>
            <ContentWrapper>
                <PageHeader title="Verify Email" />
                <Divider />
                <Spin spinning={verifyEmailLoading}>
                    <Alert
                        message={
                            !!verifyEmailErrorReason ? 'Warning' : 'Success'
                        }
                        type={!!verifyEmailErrorReason ? 'warning' : 'success'}
                        showIcon={true}
                        description={
                            !!verifyEmailErrorReason ? (
                                <div>
                                    {' '}
                                    <div>{verifyEmailErrorReason}</div>{' '}
                                    <Form onSubmit={onSubmitRetry}>
                                        <Button
                                            type="primary"
                                            htmlType="submit">
                                            Retry
                                        </Button>
                                    </Form>
                                </div>
                            ) : (
                                <div>
                                    <div>{'Your email was verified.'}</div>
                                    <div>
                                        <Button onClick={onClickGoToHome}>
                                            Go to home
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    />
                </Spin>
            </ContentWrapper>
        </DefaultLayout>
    );
};

VerifyEmail.propTypes = {
    email: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
};

VerifyEmail.getInitialProps = async context => {
    const { email, code } = context.query;

    return { email, code };
};

export default VerifyEmail;
