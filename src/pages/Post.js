import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin, Skeleton } from 'antd';
import SinglePost from '../components/SinglePost';
import { LOAD_SINGLE_POST_CALL } from '../reducers/post';

const Post = ({ slug }) => {
    const { singlePost, loadingPost } = useSelector(state => state.post);

    return (
        <div>
            <Spin spinning={loadingPost} tip="loading ...">
                {singlePost ? (
                    <SinglePost post={singlePost} />
                ) : (
                    <Skeleton active paragraph={{ rows: 4 }} />
                )}
            </Spin>
        </div>
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
