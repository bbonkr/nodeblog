import React, { Component, useEffect } from 'react';
import { compose } from 'redux';
import { useSelector, connect } from 'react-redux';
import Router from 'next/router';

const getDisplayName = Component =>
    Component.displayName || Component.name || 'Component';

const withAuth = WrappedComponent =>
    class extends Component {
        static displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

        static async getInitialProps(ctx) {
            const componentProps =
                WrappedComponent.getInitialProps &&
                (await WrappedComponent.getInitialProps(ctx));

            return { ...componentProps };
        }

        componentDidMount() {
            // const state = this.props.store.getState();
            // const { me } = state.user;
            // const me = this.props.me;
            const { url, me } = this.props;

            if (!me) {
                console.log('로그인 페이지로 이동합니다.');
                Router.push({
                    pathname: '/signin',
                    query: {
                        returnUrl: !!url ? url : '/',
                    },
                });
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

export { withAuth };
