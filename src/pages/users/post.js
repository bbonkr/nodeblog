/**
 * /users/:user/posts
 */
import React from 'react';
import { useSelector } from 'react-redux';
import DefaultLayout from '../../components/DefaultLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import PropTypes from 'prop-types';
import { LOAD_SINGLE_POST_CALL } from '../../reducers/post';
import SinglePost from '../../components/SinglePost';
import { Skeleton, Spin } from 'antd';

const UsersPost = ({ user, slug }) => {
    const { loadingPost, singlePost } = useSelector(s => s.post);
    return (
        <DefaultLayout>
            <ContentWrapper>
                <div>/users/:user/posts/:slug</div>
                <Spin spinning={loadingPost} tip="loading ...">
                    {singlePost && !loadingPost ? (
                        <SinglePost post={singlePost} />
                    ) : (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    )}
                </Spin>
            </ContentWrapper>
        </DefaultLayout>
    );
};

UsersPost.propTypes = {
    user: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
};

UsersPost.getInitialProps = async context => {
    const { user, slug } = context.query;
    console.log('Post.getInitialize() ==> user: ', user);
    console.log('Post.getInitialize() ==> slug: ', slug);
    const decodedUser = user;
    const decodedSlug = decodeURIComponent(slug);
    context.store.dispatch({
        type: LOAD_SINGLE_POST_CALL,
        data: { user: decodedUser, slug: decodedSlug },
    });

    return {
        user,
        slug,
    };
};

export default UsersPost;
