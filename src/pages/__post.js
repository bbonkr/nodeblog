import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Spin, Skeleton } from 'antd';
import SinglePost from '../components/SinglePost';
import { LOAD_SINGLE_POST_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';
import DefaultLayout from '../components/DefaultLayout';

const Post = () => {
    const siteName = 'nodeblog';
    const { loadingPost, singlePost } = useSelector(s => s.post);

    if (!singlePost) {
        return (
            <Spin spinning={loadingPost} tip="loading ...">
                Loading ...
            </Spin>
        );
    }

    return (
        <>
            <Helmet
                title={`${singlePost.title} | ${
                    singlePost.User.displayName
                } | ${siteName}`}
                description={singlePost.excerpt}
            />
            <DefaultLayout>
                <ContentWrapper>
                    {singlePost && <SinglePost post={singlePost} />}
                    {/* <Spin spinning={loadingPost} tip="loading ...">
                    
                    {singlePost && !loadingPost ? (
                        <SinglePost post={singlePost} />
                    ) : (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    )}
                </Spin> */}
                </ContentWrapper>
            </DefaultLayout>
        </>
    );
};

Post.propTypes = {};

Post.getInitialProps = async context => {
    const { user, slug } = context.query;
    // console.log('Post.getInitialize() ==> user: ', user);
    // console.log('Post.getInitialize() ==> slug: ', slug);
    const decodedUser = user;
    const decodedSlug = decodeURIComponent(slug);
    context.store.dispatch({
        type: LOAD_SINGLE_POST_CALL,
        data: { user: decodedUser, slug: decodedSlug },
    });

    return {};
};

export default Post;
