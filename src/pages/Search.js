import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Divider } from 'antd';
import ListExcerpt from '../components/ListExcerpt';
import { LOAD_POSTS_CALL } from '../reducers/post';

const KEYWORD_INPUT_PLACEHOLDER = 'Searching keyword';

const Search = ({ keyword }) => {
    const dispatch = useDispatch();
    const [keywordText, setKeywordText] = useState(keyword);
    const { pageToken, postsLimit } = useSelector(s => s.post);
    const onChangeKeyword = useCallback(e => {
        setKeywordText(e.target.value);
    }, []);

    const onSearch = useCallback((value, e) => {
        if (value) {
            dispatch({
                type: LOAD_POSTS_CALL,
                data: {
                    pageToken: null,
                    limit: postsLimit,
                    keyword: value,
                },
            });
        }
    }, []);

    return (
        <div>
            <Input.Search
                enterButton
                name="keyword"
                value={keywordText}
                onChange={onChangeKeyword}
                onSearch={onSearch}
                placeholder={KEYWORD_INPUT_PLACEHOLDER}
            />

            <Divider />
            <ListExcerpt />
        </div>
    );
};

Search.getInitialProps = async context => {
    const { keyword } = context.query;

    console.log('keyword', keyword);

    if (keyword) {
        const state = context.store.getState();
        const { postsLimit } = state.post;
        context.store.dispatch({
            type: LOAD_POSTS_CALL,
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
