import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Spin, Skeleton } from 'antd';
import SinglePost from '../components/SinglePost';
import { LOAD_SINGLE_POST_CALL } from '../reducers/post';

const Content = ({ slug }) => {
    const { loadingPost, singlePost } = useSelector(s => s.post);
    return (
        <article>
            <Spin spinning={loadingPost} tip="loading ...">
                {singlePost ? (
                    <SinglePost post={singlePost} />
                ) : (
                    <Skeleton active paragraph={{ rows: 4 }} />
                )}
            </Spin>
        </article>
    );
};

Content.propTypes = {
    slug: PropTypes.string.isRequired,
};

Content.getInitialProps = async context => {
    const { slug } = context.query;

    context.store.dispatch({
        type: LOAD_SINGLE_POST_CALL,
        data: slug,
    });

    return {
        slug: slug,
    };
};

export default Content;
