import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';

const withAuth = WrappedComponent => props => {
    console.log('withAuth');
    const { me } = useSelector(s => s.user);
    const { url } = props;

    useEffect(() => {
        if (!me) {
            console.log('로그인 페이지로 이동합니다.');
            Router.push({
                pathname: '/signin',
                query: {
                    returnUrl: !!url ? url : '/',
                },
            });
        }
    }, [me, url]);

    return <WrappedComponent {...props} />;
};

withAuth.getInitialProps = async ctx => {
    return {};
};

export { withAuth };
