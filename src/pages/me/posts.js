import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { List, Card } from 'antd';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import { LOAD_MY_POSTS_CALL } from '../../reducers/me';

const Posts = () => {
    const { myPosts } = useSelector(state => state.me);

    return (
        <MeLayout>
            <ContentWrapper>
                <h1>Posts</h1>
                <div>
                    <List
                        dataSource={myPosts}
                        renderItem={post => {
                            return (
                                <List.Item key={post.id}>
                                    <Card>
                                        <Card.Meta
                                            title={
                                                <Link
                                                    href={{
                                                        pathname: '/me/write',
                                                        query: { id: post.id },
                                                    }}>
                                                    <a>
                                                        <h3>{post.title}</h3>
                                                    </a>
                                                </Link>
                                            }
                                        />
                                    </Card>
                                </List.Item>
                            );
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
