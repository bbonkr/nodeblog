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
} from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
// import LoginForm from './LoginForm';
// import MyProfileCard from './MyProfileCard';
// import { LOAD_USER_REQUEST } from '../reducers/user';
import CategoryList from '../components/CategoryList';

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

    const onSearch = useCallback(
        async (value, e) => {
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
        },
        [searchModalVisible],
    );

    return (
        <div>
            <BackTop />
            <Affix offsetTop={0}>
                <Menu mode="horizontal">
                    <Menu.Item key="home">
                        <Link
                            href={{ pathname: '/', query: { home: true } }}
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
                </Menu>
            </Affix>

            <Row gutter={10}>
                <ContentLeft
                    xs={24}
                    md={6}
                    style={{ padding: '0.6em 1.0em 0.6em' }}>
                    {/* {me ? <MyProfileCard /> : <LoginForm />} */}
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
            </Row>

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

AppLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default AppLayout;
