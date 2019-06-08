import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

const { Header, Content, Sider } = Layout;

const MeLayout = ({ children }) => {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const [selectedMenuKey, setSelectedMenuKey] = useState('me');
    const onMenuCollapsed = useCallback(collapsed => {
        setMenuCollapsed(collapsed);
    }, []);

    useEffect(() => {
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
    }, []);

    const onCollapse = useCallback((collapsed, type) => {}, []);
    const onBreakPoint = useCallback(broken => {}, []);
    const onClickMenu = useCallback(({ item, key, keyPath, domEvent }) => {
        switch (key) {
            case 'me':
                Router.push('/me');
                setSelectedMenuKey('me');
                break;
            case 'posts':
                Router.push('/me/posts');
                setSelectedMenuKey('posts');
                break;
            default:
                break;
        }
    }, []);
    return (
        <Layout>
            <Sider
                width={200}
                breakpoint="md"
                collapsedWidth={0}
                onBreakpoint={onBreakPoint}
                onCollapse={onCollapse}>
                <Menu
                    mode="inline"
                    style={{ height: '100%', borderRight: 0 }}
                    defaultSelectedKeys={['me']}
                    selectedKeys={[selectedMenuKey]}
                    onClick={onClickMenu}>
                    <Menu.Item key="me">
                        <Icon type="user" /> <span>Basic information</span>
                    </Menu.Item>
                    <Menu.Item key="posts">
                        <Icon type="container" /> <span>Posts</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content>{children}</Content>
            </Layout>
        </Layout>
    );
};

MeLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default MeLayout;
