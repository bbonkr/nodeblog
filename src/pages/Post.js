/**
 * 사용되지 않습니다.
 * /:slug 은 /content/:slug 에서 처리합니다.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin, Skeleton } from 'antd';
import SinglePost from '../components/SinglePost';
import { LOAD_SINGLE_POST_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';

const Post = ({ slug }) => {
    const { singlePost, loadingPost } = useSelector(state => state.post);

    return (
        <ContentWrapper>
            <Spin spinning={loadingPost} tip="loading ...">
                {singlePost ? (
                    <SinglePost post={singlePost} />
                ) : (
                    <Skeleton active paragraph={{ rows: 4 }} />
                )}
            </Spin>
        </ContentWrapper>
    );
};

Post.propTypes = {
    slug: PropTypes.string.isRequired,
};

Post.getInitialProps = async context => {
    const slug = context.query.slug;

    context.store.dispatch({
        type: LOAD_SINGLE_POST_CALL,
        data: slug,
    });

    return { slug };
};

export default Post;
