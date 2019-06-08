import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { ME_CALL } from '../../reducers/user';
import { withAuth } from '../../utils/auth';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';

const Me = () => {
    const { me } = useSelector(state => state.user);

    if (!me) {
        return <div>loading ...</div>;
    }

    return (
        <MeLayout>
            <ContentWrapper>
                <h1>Me</h1>
                <div>{me && me.displayName}</div>
            </ContentWrapper>
        </MeLayout>
    );
};

Me.getInitialProps = async context => {
    return {};
};

export default withAuth(Me);
