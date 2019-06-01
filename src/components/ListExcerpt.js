import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { List, Avatar, Button } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import IconText from './IconText';
import { LOAD_POSTS_CALL } from '../reducers/post';

const FullWidthButton = styled(Button)`
    width: 100%;
`;

const ListExcerpt = () => {
    const dispatch = useDispatch();
    const {
        posts,
        loadingPosts,
        nextPageToken,
        postsLimit,
        searchKeyword,
        hasMorePost,
    } = useSelector(s => s.post);

    // console.log('hasMorePost:', hasMorePost);

    const onClickLoadMorePosts = useCallback(
        e => {
            dispatch({
                type: LOAD_POSTS_CALL,
                data: {
                    pageToken: nextPageToken,
                    limit: postsLimit,
                    keyword: searchKeyword,
                },
            });
        },
        [nextPageToken, postsLimit, searchKeyword, hasMorePost],
    );

    return (
        <article>
            <List
                itemLayout="vertical"
                size="large"
                loadMore={
                    hasMorePost && (
                        <FullWidthButton
                            loading={loadingPosts}
                            onClick={onClickLoadMorePosts}>
                            더 보기
                        </FullWidthButton>
                    )
                }
                loading={loadingPosts}
                dataSource={posts}
                renderItem={item => {
                    const { slug, title, excerpt, createdAt } = item;
                    const { displayName } = item.User;
                    return (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText
                                    type="clock-circle"
                                    text={moment(createdAt).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                />,
                            ]}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar>
                                        {displayName[0].toUpperCase()}
                                    </Avatar>
                                }
                                title={
                                    <Link
                                        href={{
                                            pathname: '/post',
                                            query: { slug: slug },
                                        }}
                                        as={`/post/${slug}`}>
                                        <a>{title}</a>
                                    </Link>
                                }
                                description={excerpt}
                            />
                        </List.Item>
                    );
                }}
            />
        </article>
    );
};

ListExcerpt.propTypes = {
    // post: PropTypes.object.isRequired,
};

export default ListExcerpt;
