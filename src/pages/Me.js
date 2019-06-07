import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withAuth } from '../utils/auth';
import Router from 'next/router';
import { ME_CALL } from '../reducers/user';
import { ContentWrapper } from '../styledComponents/Wrapper';

const Me = () => {
    const { me } = useSelector(state => state.user);

    if (!me) {
        return <div>loading ...</div>;
    }

    return (
        <ContentWrapper>
            <h1>Me</h1>
            <div>{me && me.displayName}</div>
        </ContentWrapper>
    );
};

Me.getInitialProps = async context => {
    return {};
};

export default withAuth(Me);
