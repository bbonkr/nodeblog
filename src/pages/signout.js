import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { ContentWrapper } from '../styledComponents/Wrapper';
import { PageHeader, Button, Spin, Divider } from 'antd';
import Router from 'next/router';
import { SIGN_OUT_CALL } from '../reducers/user';

const SignOut = () => {
    const {
        me,
        signOutLoading,
        signOutErrorReason,
        signOutReturnUrl,
    } = useSelector(s => s.user);

    useEffect(() => {
        if (!me) {
            Router.push(signOutReturnUrl || '/');
        }
    }, [me, signOutReturnUrl]);

    const onClickNavigateToHome = useCallback(
        e => {
            Router.push(signOutReturnUrl || '/');
        },
        [signOutReturnUrl],
    );

    return (
        <DefaultLayout>
            <ContentWrapper>
                <PageHeader title="Sign out" />
                <Divider />
                <Spin spinning={signOutLoading}>
                    <p>
                        Click a 'Navigate to Home' button if does not navigate
                        to home.
                    </p>
                    <Button onClick={onClickNavigateToHome}>
                        Navigate to Home
                    </Button>
                </Spin>
            </ContentWrapper>
        </DefaultLayout>
    );
};

SignOut.getInitialProps = async context => {
    context.store.dispatch({
        type: SIGN_OUT_CALL,
    });

    return {};
};

export default SignOut;
