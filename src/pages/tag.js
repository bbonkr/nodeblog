import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, PageHeader } from 'antd';
import ListExcerpt from '../components/ListExcerpt';
import { LOAD_TAG_POSTS_CALL } from '../reducers/post';
import DefaultLayout from '../components/DefaultLayout';
import { ContentWrapper } from '../styledComponents/Wrapper';

const Tag = ({ slug }) => {
    const dispatch = useDispatch();
    const {
        tagPosts,
        tagPostKeyword,
        tagPostsLoading,
        tagPostsHasMore,
        postsLimit,
        currentTag,
    } = useSelector(s => s.post);
    const loadMoreHandler = useCallback(() => {
        const pageToken =
            tagPosts && tagPosts.length > 0 && tagPosts[tagPosts.length - 1].id;

        dispatch({
            type: LOAD_TAG_POSTS_CALL,
            data: {
                pageToken: `${pageToken}`,
                limit: postsLimit || 10,
                keyword: '',
                tag: slug,
            },
        });
    }, [dispatch, postsLimit, slug, tagPosts]);
    return (
        <DefaultLayout>
            <ContentWrapper>
                <PageHeader title={`TAG: ${!!currentTag && currentTag.name}`} />
                <Divider />
                <ListExcerpt
                    posts={tagPosts}
                    hasMore={tagPostsHasMore}
                    loading={tagPostsLoading}
                    loadMoreHandler={loadMoreHandler}
                />
            </ContentWrapper>
        </DefaultLayout>
    );
};

Tag.propTypes = {
    slug: PropTypes.string.isRequired,
};

Tag.getInitialProps = async context => {
    const state = context.store.getState();
    const slug = decodeURIComponent(context.query.slug);
    const { postsLimit } = state.post;

    context.store.dispatch({
        type: LOAD_TAG_POSTS_CALL,
        data: {
            pageToken: null,
            limit: postsLimit,
            keyword: '',
            tag: slug,
        },
    });

    return { slug };
};

export default Tag;
