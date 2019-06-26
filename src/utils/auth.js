import React from 'react';
import Router from 'next/router';
import { Spin } from 'antd';
import { normalizeReturnUrl } from '../helpers/stringHelper';
const { Component } = React;

const withAuth = WrappedComponent => {
    return class extends Component {
        static async getInitialProps(ctx) {
            // const url = ctx.isServer
            //     ? ctx.req.url
            //     : !!ctx.asPath
            //     ? ctx.asPath
            //     : normalizeReturnUrl(ctx.pathname, ctx.query);

            // console.log('withAuth ==> url: ', url);

            const state = ctx.store.getState();
            // const { store } = ctx;
            const { me } = state.user;
            let pageProps = {};

            if (WrappedComponent.getInitialProps) {
                pageProps = (await WrappedComponent.getInitialProps(ctx)) || {};
            }

            return {
                ...pageProps,
                me,
                // returnUrl: url,
            };
        }

        constructor(props) {
            super(props);

            this.state = {
                loading: true,
            };
        }

        componentDidMount() {
            if (!this.props.me) {
                const returnUrl = encodeURIComponent(
                    !!this.props.returnUrl ? this.props.returnUrl : '/',
                );

                Router.push(`/signin?returnUrl=${returnUrl}`);
            }

            this.setState({ loading: false });
        }

        render() {
            if (this.state.loading) {
                // TODO Add loading page
                return <Spin spinning={true}>Loading...</Spin>;
            }
            return <WrappedComponent {...this.props} />;
        }
    };
};

export { withAuth };
