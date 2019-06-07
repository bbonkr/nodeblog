import React, { Component, useEffect } from 'react';
import { compose } from 'redux';
import { useSelector, connect } from 'react-redux';
import Router from 'next/router';

const getDisplayName = Component =>
    Component.displayName || Component.name || 'Component';

// const mapStateToProps = state => {
//     const { me } = state.user;
//     return {
//         me,
//     };
// };

const withAuth2 = WrappedComponent =>
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
            const { url } = this.props;
            const state = this.props.store.getState();
            const { me } = state.user;

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

const withAuth = WrappedComponent => props => {
    console.log('withAuth');
    const { me } = useSelector(s => s.user);
    const { url } = props;

    useEffect(() => {
        if (!me) {
            console.log('로그인 페이지로 이동합니다.');
            Router.push({
                pathname: '/signin',
                query: {
                    returnUrl: !!url ? url : '/',
                },
            });
        }
    }, [me, url]);

    return <WrappedComponent {...props} />;
};

withAuth.getInitialProps = async ctx => {
    return {};
};

export { withAuth };
