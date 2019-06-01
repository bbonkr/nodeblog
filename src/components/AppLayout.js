import React, { useEffect } from 'react';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
// import LoginForm from './LoginForm';
// import MyProfileCard from './MyProfileCard';
// import { LOAD_USER_REQUEST } from '../reducers/user';

const ContentLeft = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

const ContentMain = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

const ContentRight = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

const AppLayout = ({ children }) => {
    const dispatch = useDispatch();
    // const { me } = useSelector(state => state.user);

    // Server side rendering 은 페이지에서 적용해야 한다.
    // _app.js 로 이동
    // useEffect(() => {
    //     if (!me) {
    //         dispatch({ type: LOAD_USER_REQUEST });
    //     }
    // }, []);

    const onSearch = value => {
        Router.push(
            {
                pathname: '/hashtag',
                query: { tag: value },
            },
            `/hashtag/${value}`,
        );
    };

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home">
                    <Link href="/">
                        <a>NodeBlog</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="profile">
                    <Link href="/profile">
                        <a>Profile</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search
                        enterButton
                        style={{ verticalAlign: 'middle' }}
                        onSearch={onSearch}
                    />
                </Menu.Item>
            </Menu>

            <Row gutter={10}>
                <ContentLeft
                    xs={24}
                    md={6}
                    style={{ padding: '0.6em 1.0em 0.6em' }}>
                    {/* {me ? <MyProfileCard /> : <LoginForm />} */}
                    <div>Left</div>
                </ContentLeft>
                <ContentMain
                    xs={24}
                    md={12}
                    style={{ padding: '0.6em 1.0em 0.6em' }}>
                    {children}
                </ContentMain>
                <ContentRight
                    xs={24}
                    md={6}
                    style={{ padding: '0.6em 1.0em 0.6em' }}>
                    <a href="https://github.com/bbonkr">bbon</a>
                </ContentRight>
            </Row>
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default AppLayout;
