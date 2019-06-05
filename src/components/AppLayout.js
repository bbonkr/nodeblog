import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Affix,
    BackTop,
    Menu,
    Input,
    Row,
    Col,
    Button,
    Icon,
    Modal,
    Divider,
    Layout,
    Avatar,
} from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
// import LoginForm from './LoginForm';
// import MyProfileCard from './MyProfileCard';
// import { LOAD_USER_REQUEST } from '../reducers/user';
import CategoryList from '../components/CategoryList';
import SubMenu from 'antd/lib/menu/SubMenu';
import { SIGN_OUT_CALL } from '../reducers/user';

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
    const { categories } = useSelector(s => s.category);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchKeywordText, setSearchKeywordText] = useState('');
    const { me } = useSelector(s => s.user);
    // Server side rendering 은 페이지에서 적용해야 한다.
    // _app.js 로 이동
    // useEffect(() => {
    //     if (!me) {
    //         dispatch({ type: LOAD_USER_REQUEST });
    //     }
    // }, []);

    const onClickShowSearchModal = useCallback(e => {
        setSearchKeywordText('');
        setSearchModalVisible(true);
    }, []);

    const onSearchModalCancel = useCallback(e => {
        setSearchModalVisible(false);
    }, []);

    const onChangeSearchKeywordText = useCallback(e => {
        setSearchKeywordText(e.target.value);
    }, []);

    const onSearch = useCallback(async (value, e) => {
        e.preventDefault();

        if (value) {
            setSearchModalVisible(false);
            await Router.push(
                {
                    pathname: '/search',
                    query: { keyword: value },
                },
                `/search/${value}`,
            );
        }
    }, []);

    const onClickSignOut = useCallback(() => {
        dispatch({
            type: SIGN_OUT_CALL,
        });
    }, [dispatch]);

    return (
        <div>
            <BackTop />
            <Layout className="layout-height">
                <Layout.Header
                    style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '64px' }}>
                        <Menu.Item key="home">
                            <Link
                                href={{
                                    pathname: '/',
                                    query: { home: true },
                                }}
                                as="/">
                                <a>NodeBlog</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="profile">
                            <Link href="/profile">
                                <a>Profile</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="search">
                            {/* <Input.Search
                            enterButton
                            style={{ verticalAlign: 'middle' }}
                            onSearch={onSearch}
                        /> */}
                            <Button
                                icon="search"
                                style={{ verticalAlign: 'middle' }}
                                onClick={onClickShowSearchModal}>
                                Search
                            </Button>
                        </Menu.Item>
                        {!me && (
                            <Menu.Item
                                key="signin"
                                style={{ textAlign: 'right' }}>
                                <Link href="/signin">
                                    <a>Sign in</a>
                                </Link>
                            </Menu.Item>
                        )}
                        {!me && (
                            <Menu.Item
                                key="signup"
                                style={{ textAlign: 'right' }}>
                                <Link href="/signup">
                                    <a>Sign up</a>
                                </Link>
                            </Menu.Item>
                        )}
                        {me && (
                            <SubMenu
                                key="user"
                                title={<Avatar>{me.displayName[0]}</Avatar>}>
                                <Menu.Item key="user-me">
                                    <Link href="/me">
                                        <a>Profile</a>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item onClick={onClickSignOut}>
                                    Sign out
                                </Menu.Item>
                            </SubMenu>
                        )}
                    </Menu>
                </Layout.Header>
                <Layout.Content style={{ marginTop: '64px' }}>
                    {/*style={{ padding: '0 50px', marginTop: 64 }}*/}
                    <article>{children}</article>
                    {/* style={{ padding: '0.75rem' }} */}
                </Layout.Content>
                <Layout.Footer />
            </Layout>

            <Modal
                title="Search"
                icon={<Icon type="search" />}
                style={{ top: '30px' }}
                visible={searchModalVisible}
                onCancel={onSearchModalCancel}
                footer={null}>
                <Input.Search
                    enterButton
                    value={searchKeywordText}
                    onChange={onChangeSearchKeywordText}
                    onSearch={onSearch}
                />
            </Modal>

            {/* {me ? <MyProfileCard /> : <LoginForm />} */}
            {/* <Row gutter={10}>
                <ContentLeft
                    xs={24}
                    md={6}
                    style={{ padding: '0.6em 1.0em 0.6em' }}>
                    
                    <CategoryList categories={categories} />
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
            </Row>  */}
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default AppLayout;
