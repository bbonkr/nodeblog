import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { List, Card, Tag, Table, Pagination } from 'antd';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import { LOAD_MY_POSTS_CALL } from '../../reducers/me';
import moment from 'moment';
import { formatNumber } from '../../helpers/stringHelper';

const Posts = () => {
    const dispatch = useDispatch();
    const {
        myPosts,
        postsCount,
        loadingMyPosts,
        postsLimit,
        nextPageToken,
    } = useSelector(state => state.me);

    const [currentPage, setCurrentPage] = useState(1);

    const onChangePagination = useCallback(
        (current, size) => {
            setCurrentPage(current);
            dispatch({
                type: LOAD_MY_POSTS_CALL,
                data: {
                    pageToken: nextPageToken,
                    limit: size || postsLimit || 10,
                    keyword: '',
                },
            });
        },
        [dispatch, nextPageToken, postsLimit],
    );

    const onShowSizeChangePagination = useCallback(
        (current, size) => {
            setCurrentPage(current);
            dispatch({
                type: LOAD_MY_POSTS_CALL,
                data: {
                    pageToken: nextPageToken,
                    limit: size,
                    keyword: '',
                },
            });
        },
        [dispatch, nextPageToken],
    );

    const columns = [
        {
            key: 'title',
            title: 'title',
            dataIndex: 'title',
            render: (text, record, index) => {
                return (
                    <Link
                        href={{
                            pathname: '/me/write',
                            query: { id: record.id },
                        }}>
                        <a title={`Click to edit the ${text} post`}>{text}</a>
                    </Link>
                );
            },
            whidh: '40%',
        },
        {
            key: 'createdAt',
            title: 'Created',
            dataIndex: 'createdAt',
            render: createdAt => (
                <span>
                    {moment(
                        new Date(createdAt),
                        'YYYY-MM-DD HH:mm:ss',
                    ).fromNow()}
                </span>
            ),
            whidh: '20%',
        },
        {
            key: 'Categories',
            title: 'Categories',
            dataIndex: 'Categories',
            render: Categories => (
                <span>
                    {Categories.map(category => {
                        return <Tag key={category.slug}>{category.name}</Tag>;
                    })}
                </span>
            ),
            whidh: '20%',
        },
        {
            key: 'Tags',
            title: 'Tags',
            dataIndex: 'Tags',
            render: Tags => (
                <span>
                    {Tags.map(tag => {
                        return <Tag key={tag.slug}>{tag.name}</Tag>;
                    })}
                </span>
            ),
            whidh: '20%',
        },
    ];
    return (
        <MeLayout>
            <ContentWrapper>
                <h1>Posts</h1>
                <div>
                    <Table
                        title={currentPageData => {
                            return (
                                <div>
                                    {`${formatNumber(postsCount)} post(s).`}
                                </div>
                            );
                        }}
                        rowKey={record => record.id}
                        dataSource={myPosts}
                        columns={columns}
                        loading={loadingMyPosts}
                        pagination={{
                            total: postsCount,
                            current: currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '50', '100'],
                            onChange: onChangePagination,
                            onShowSizeChange: onShowSizeChangePagination,
                            position: 'both',
                        }}
                    />
                </div>
            </ContentWrapper>
        </MeLayout>
    );
};

Posts.getInitialProps = async context => {
    const state = context.store.getState();
    const { postsLimit, myPosts } = state.me;
    const lastPost =
        myPosts && myPosts.length > 0 && myPosts[myPosts.length - 1];

    context.store.dispatch({
        type: LOAD_MY_POSTS_CALL,
        data: {
            pageToken: null,
            limit: postsLimit || 10,
            keyword: '',
        },
    });

    return {};
};

export default withAuth(Posts);
