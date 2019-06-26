import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Menu, Input, Col, Button, Icon, Modal, Layout, Avatar } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import CategoryList from '../components/CategoryList';
import SubMenu from 'antd/lib/menu/SubMenu';
import { SIGN_OUT_CALL } from '../reducers/user';
import UserAvatar from './UserAvatar';

const ContentLeft = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

const ContentMain = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

const ContentRight = styled(Col)`
    padding: 0.6em 1em 0.6em;
`;

/**
 * 기본 레이아웃 컴포넌트입니다.
 *
 * @param {element} 자식 요소
 * @param {string}
 */
const DefaultLayout = ({ children }) => {
    const dispatch = useDispatch();

    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchKeywordText, setSearchKeywordText] = useState('');
    const { me } = useSelector(s => s.user);
    const { currentUrl } = useSelector(state => state.settings);

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
                `/search/${encodeURIComponent(value)}`,
            );
        }
    }, []);

    const onClickSignOut = useCallback(
        e => {
            dispatch({
                type: SIGN_OUT_CALL,
                returnUrl: currentUrl,
            });
        },
        [currentUrl, dispatch],
    );

    return (
        <div style={{ minHeight: '100%' }}>
            <Layout style={{ minHeight: '100%' }}>
                <Layout.Header
                    style={{ position: 'fixed', zIndex: 500, width: '100%' }}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '64px' }}>
                        <Menu.Item key="home">
                            <Link href="/">
                                <a>NodeBlog</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="profile">
                            <Link href="/me">
                                <a>Profile</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="search">
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
                                <Link
                                    href={{
                                        pathname: '/signin',
                                        query: {
                                            returnUrl: currentUrl,
                                        },
                                    }}>
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
                                title={<UserAvatar user={me} />}>
                                <Menu.Item key="user-me">
                                    <Link href="/me">
                                        <a>Profile</a>
                                    </Link>
                                </Menu.Item>
                                {/* <Menu.Item onClick={onClickSignOut}>
                                    Sign out
                                </Menu.Item> */}
                                <Menu.Item>
                                    <Link href="/signout">
                                        <a>Sign out</a>
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        )}
                    </Menu>
                </Layout.Header>
                <Layout.Content
                    style={{
                        marginTop: '64px',
                        minHeight: '100vh',
                    }}>
                    <article>{children}</article>
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
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default DefaultLayout;
