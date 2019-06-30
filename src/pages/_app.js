import React from 'react';
import App, { Container } from 'next/app';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';
import withReduxSaga from 'next-redux-saga';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import Helmet from 'react-helmet';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers/index';
import rootSaga from '../sagas';
import { normalizeReturnUrl } from '../helpers/stringHelper';
import { ME_CALL } from '../reducers/user';
import stringHelper from '../helpers/stringHelper';
import { SET_CURRENT_URL, SET_BASE_URL } from '../reducers/settings';

import '../styles/styles.scss';
// const normalizeReturnUrl = stringHelper.normalizeReturnUrl;

const NodeBlog = ({ Component, store, pageProps, returnUrl }) => {
    // console.log('pageProps', pageProps);
    // FIXME:
    // 구성값을 데이터베이스에서 가져와야 합니다.
    const fbAdmin = process.env.FB_ADMIN;
    const siteName = process.env.SITE_NAME || 'nodeblog';
    return (
        <Container>
            <Provider store={store}>
                <Helmet
                    title="NodeBlog"
                    htmlAttributes={{ lang: 'ko' }}
                    meta={[
                        { charset: 'UTF-8' },
                        {
                            name: 'viewport',
                            content:
                                'width=device-width,minimum-scale=1,initial-scale=1',
                        },
                        { 'http-equiv': 'X-UA-Compatible', content: 'IE-edge' },
                        { name: 'description', content: siteName },
                        { name: 'og:title', content: siteName },
                        { name: 'og:site_name', content: '' },
                        { name: 'og:description', content: siteName },
                        { name: 'og:type', content: 'website' },
                        { name: 'fb:admins', content: fbAdmin },
                        {
                            name: 'og:site_name',
                            content: siteName,
                        },
                    ]}
                    link={[
                        {
                            rel: 'shortcut icon',
                            href: '/favicon.ico',
                            type: 'image/x-icon',
                        },
                        {
                            rel: 'apple-touch-icon',
                            href: '/bbon-icon.png',
                            sizes: '512x512',
                        },
                        {
                            rel: 'me',
                            href: 'https://www.facebook.com/bbonkr',
                        },
                        {
                            rel: 'author',
                            type: 'text/plain',
                            href: '/humans.txt',
                        },
                        {
                            rel: 'stylesheet',
                            href:
                                'https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.2/antd.css',
                        },
                        {
                            rel: 'stylesheet',
                            href:
                                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
                            type: 'text/css',
                            charset: 'UTF-8',
                        },
                        {
                            rel: 'stylesheet',
                            href:
                                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
                            type: 'text/css',
                            charset: 'UTF-8',
                        },
                        {
                            rel: 'stylesheet',
                            // href: '/_next/static/css/styles.chunk.css',
                            href: '/_next/static/css/styles.css',
                            type: 'text/css',
                            charset: 'UTF-8',
                        },
                    ]}
                    script={[
                        {
                            src:
                                'https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.2/antd.js',
                        },
                    ]}
                />
                <AppLayout>
                    <Component {...pageProps} returnUrl={returnUrl} />
                </AppLayout>
            </Provider>
        </Container>
    );
};

NodeBlog.getInitialProps = async context => {
    const { ctx, Component } = context;

    let pageProps = {};

    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    const { me } = state.user;
    const { baseUrl } = state.settings;

    let url = '';

    let apiBaseUrl = '';
    if (ctx.isServer) {
        const { req } = ctx;
        apiBaseUrl = `${req.protocol}://${req.get('host')}/api`;
        if (!baseUrl) {
            ctx.store.dispatch({
                type: SET_BASE_URL,
                data: `${req.protocol}://${req.get('host')}`,
            });
        }
    } else {
        apiBaseUrl = '/api';
    }

    axios.defaults.baseURL = apiBaseUrl;

    // HTTP 요청시 쿠키 추가
    if (ctx.isServer && cookie) {
        axios.defaults.headers.Cookie = cookie;

        if (!me) {
            ctx.store.dispatch({
                type: ME_CALL,
            });
        }
    }

    // if (ctx.isServer) {
    //     ctx.store.dispatch({
    //         type: LOAD_CATEGORIES_CALL,
    //         data: '',
    //     });
    // }

    if (Component.getInitialProps) {
        pageProps = (await Component.getInitialProps(ctx)) || {};
    }

    if (pageProps.doNotSetCurrentUrl) {
        // signIn page
        url = ctx.query.returnUrl;
    } else {
        url = ctx.isServer
            ? ctx.req.url
            : !!ctx.asPath
            ? ctx.asPath
            : normalizeReturnUrl(ctx.pathname, ctx.query);

        ctx.store.dispatch({
            type: SET_CURRENT_URL,
            data: url,
        });
    }

    return { pageProps, returnUrl: url };
};

NodeBlog.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.any,
    returnUrl: PropTypes.string,
};

const loggingMiddleware = store => next => action => {
    // 액션확인
    // console.log(action);
    // console.log('\u001b[34mdispatch ==> \u001b[0m', action.type);
    next(action);
};

const configureStore = (initialState, options) => {
    // customize a store.

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, loggingMiddleware];
    const enhancers =
        process.env.NODE_ENV === 'production'
            ? compose(applyMiddleware(...middlewares))
            : compose(
                  applyMiddleware(...middlewares),
                  !options.isServer &&
                      window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
                      ? window.__REDUX_DEVTOOLS_EXTENSION__()
                      : f => f,
              );

    const store = createStore(reducer, initialState, enhancers);

    // next-redux-saga
    store.sagaTask = sagaMiddleware.run(rootSaga);

    return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBlog));
