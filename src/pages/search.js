import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Divider } from 'antd';
import ListExcerpt from '../components/ListExcerpt';
import { LOAD_POSTS_CALL, LOAD_SEARCH_POSTS_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';
import DefaultLayout from '../components/DefaultLayout';

const KEYWORD_INPUT_PLACEHOLDER = 'Searching keyword';

const Search = ({ keyword }) => {
    const dispatch = useDispatch();
    const [keywordText, setKeywordText] = useState(keyword);
    const {
        searchPosts,
        searchPostsHasMore,
        searchPostsLoading,
        searchPostsKeyword,
        postsLimit,
    } = useSelector(s => s.post);
    const onChangeKeyword = useCallback(e => {
        setKeywordText(e.target.value);
    }, []);

    const onSearch = useCallback(
        (value, e) => {
            if (value) {
                dispatch({
                    type: LOAD_SEARCH_POSTS_CALL,
                    data: {
                        pageToken: null,
                        limit: postsLimit,
                        keyword: value,
                    },
                });
            }
        },
        [dispatch, postsLimit],
    );

    const loadMoreHandler = useCallback(() => {
        const pageToken =
            searchPosts &&
            searchPosts.length > 0 &&
            searchPosts[searchPosts.length - 1].id;
        dispatch({
            type: LOAD_SEARCH_POSTS_CALL,
            data: {
                pageToken: `${pageToken}`,
                limit: postsLimit,
                keyword: searchPostsKeyword,
            },
        });
    }, [dispatch, postsLimit, searchPosts, searchPostsKeyword]);

    return (
        <DefaultLayout>
            <ContentWrapper>
                <Input.Search
                    enterButton
                    name="keyword"
                    value={keywordText}
                    onChange={onChangeKeyword}
                    onSearch={onSearch}
                    placeholder={KEYWORD_INPUT_PLACEHOLDER}
                />

                <Divider />
                <ListExcerpt
                    posts={searchPosts}
                    hasMore={searchPostsHasMore}
                    loading={searchPostsLoading}
                    loadMoreHandler={loadMoreHandler}
                />
            </ContentWrapper>
        </DefaultLayout>
    );
};

Search.getInitialProps = async context => {
    const keyword = decodeURIComponent(context.query.keyword);

    if (keyword) {
        const state = context.store.getState();
        const { postsLimit } = state.post;
        context.store.dispatch({
            type: LOAD_SEARCH_POSTS_CALL,
            data: {
                pageToken: null,
                limit: postsLimit,
                keyword: keyword,
            },
        });
    }

    return {
        keyword,
    };
};

Search.defaultProps = {
    keyword: '',
};

Search.propTypes = {
    keyword: PropTypes.string,
};

export default Search;
