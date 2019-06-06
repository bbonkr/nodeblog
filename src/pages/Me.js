import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withAuth } from '../utils/auth';
import Router from 'next/router';
import { ME_CALL } from '../reducers/user';

const Me = () => {
    const { me } = useSelector(state => state.user);

    // useEffect(() => {
    //     if (!me) {
    //         // goto Signin
    //         Router.push({ pathname: '/signin' });
    //     }
    // }, [me]);

    if (!me) {
        return <div>loading ...</div>;
    }

    return (
        <div>
            <h1>Me</h1>
            <div>{me && me.displayName}</div>
        </div>
    );
};

Me.getInitialProps = async context => {
    return {};
};

export default withAuth(Me);
