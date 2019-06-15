import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';

const Me = () => {
    const { me } = useSelector(state => state.user);

    useEffect(() => {}, []);

    if (!me) {
        return <div>loading ...</div>;
    }

    return (
        <MeLayout>
            <ContentWrapper>
                <h1>Me</h1>
                <div>{me && me.username}</div>
            </ContentWrapper>
        </MeLayout>
    );
};

Me.getInitialProps = async context => {
    return {};
};

export default withAuth(Me);
