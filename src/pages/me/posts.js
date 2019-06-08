import React from 'react';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';

const Post = () => {
    return (
        <MeLayout>
            <ContentWrapper>
                <h1>Posts</h1>
                <div>list of posts</div>
            </ContentWrapper>
        </MeLayout>
    );
};

export default withAuth(Post);
