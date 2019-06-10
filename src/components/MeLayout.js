import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Icon, Avatar } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import { withAuth } from '../utils/auth';
import { SIGN_OUT_CALL } from '../reducers/user';
const { Header, Content, Sider } = Layout;

const MeLayout = ({ children }) => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [selectedMenuKey, setSelectedMenuKey] = useState('me');
    const onMenuCollapsed = useCallback(collapsed => {
        setMenuCollapsed(collapsed);
    }, []);

    useEffect(() => {
        if (me) {
            const { pathname } = Router;
            const index = pathname.indexOf('?');
            let pathnameOnly = pathname;
            if (index > 0) {
                pathnameOnly = pathnameOnly.slice(0, index);
            }
            let paths = pathnameOnly.split('/').filter(c => !!c);

            let key = 'me';
            if (paths.length > 0) {
                key = paths[paths.length - 1];
            }

            setSelectedMenuKey(key);
        }
    }, [me]);

    const onCollapse = useCallback((collapsed, type) => {
        setMenuCollapsed(collapsed);
    }, []);
    const onBreakPoint = useCallback(broken => {}, []);
    const onClickMenu = useCallback(
        ({ item, key, keyPath, domEvent }) => {
            switch (key) {
                case 'me':
                    Router.push('/me');
                    setSelectedMenuKey('me');
                    break;
                case 'posts':
                    Router.push('/me/posts');
                    setSelectedMenuKey('posts');
                    break;
                case 'signout':
                    dispatch({
                        type: SIGN_OUT_CALL,
                        returnUrl: '/',
                    });
                    break;
                default:
                    break;
            }
        },
        [dispatch],
    );

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Layout.Header
                style={{ position: 'fixed', zIndex: 500, width: '100%' }}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: '64px' }}
                    defaultSelectedKeys={['me']}
                    selectedKeys={[selectedMenuKey]}
                    onClick={onClickMenu}>
                    <Menu.Item key="home">
                        <Link href="/">
                            <a>NodeBlog</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="me">
                        <Icon type="user" /> <span>Me</span>
                    </Menu.Item>
                    <Menu.Item key="posts">
                        <Icon type="container" /> <span>Posts</span>
                    </Menu.Item>
                    <Menu.Item key="signout">Sign out</Menu.Item>
                </Menu>
            </Layout.Header>
            <Layout.Content
                style={{
                    marginTop: '64px',
                    minHeight: '100%',
                }}>
                <Layout>
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: '0',
                        }}
                        collapsible={true}
                        collapsed={menuCollapsed}
                        onCollapse={onCollapse}>
                        <Menu mode="inline" defaultSelectedKeys={['me']}>
                            <Menu.Item key="me">
                                <Link href="/me">
                                    <a>Dashboard</a>
                                </Link>
                            </Menu.Item>
                            <Menu.SubMenu key="post" title="Posts">
                                <Menu.Item key="posts">
                                    <Link href="/me/posts">
                                        <a>My Posts</a>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="write">
                                    <Link href="/me/write">
                                        <a>New Post</a>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>Category</Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item>Settings</Menu.Item>
                            <Menu.Item>Menu 3</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout style={{ marginLeft: '200px' }}>
                        {/* <Layout.Header /> */}
                        <Layout.Content>
                            <article>{children}</article>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </Layout.Content>
            <Layout.Footer />
        </Layout>
    );
};

MeLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default MeLayout;
