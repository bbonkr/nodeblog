import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Spin, Skeleton } from 'antd';
import SinglePost from '../components/SinglePost';
import { LOAD_SINGLE_POST_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';
import DefaultLayout from '../components/DefaultLayout';

const Post = ({ slug }) => {
    const { loadingPost, singlePost } = useSelector(s => s.post);
    return (
        <DefaultLayout>
            <ContentWrapper>
                <Spin spinning={loadingPost} tip="loading ...">
                    {singlePost ? (
                        <SinglePost post={singlePost} />
                    ) : (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    )}
                </Spin>
            </ContentWrapper>
        </DefaultLayout>
    );
};

Post.propTypes = {
    slug: PropTypes.string.isRequired,
};

Post.getInitialProps = async context => {
    const { slug } = context.query;

    context.store.dispatch({
        type: LOAD_SINGLE_POST_CALL,
        data: slug,
    });

    return {
        slug: slug,
    };
};

export default Post;
