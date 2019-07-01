import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    PageHeader,
    Divider,
    Row,
    Col,
    Statistic,
    Spin,
    Card,
    Icon,
} from 'antd';
import moment from 'moment';
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    ResponsiveContainer,
} from 'recharts';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import { LOAD_STAT_GENERAL_CALL, LOAD_STAT_READ_CALL } from '../../reducers/me';

const Me = () => {
    const { me } = useSelector(state => state.user);
    const {
        statGeneral,
        statGeneralLoading,
        statRead,
        statReadLoading,
    } = useSelector(s => s.me);

    // useEffect(() => {

    // }, []);

    if (!me) {
        return <div>loading ...</div>;
    }

    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Dashboard" />
                <Divider />

                <Row gutter={16}>
                    <Col span={8}>
                        <Spin spinning={statGeneralLoading}>
                            <Card>
                                <Statistic
                                    title="Latest writing"
                                    value={
                                        (statGeneral &&
                                            moment(
                                                new Date(
                                                    statGeneral.latestPost,
                                                ),
                                                'YYYY-MM-DD HH:mm:ss',
                                            ).fromNow()) ||
                                        'N/A'
                                    }
                                    // suffix={moment(
                                    //     new Date(statGeneral.latestPost),
                                    // ).format('YYYY-MM-DD HH:mm:ss')}
                                />
                            </Card>
                        </Spin>
                    </Col>
                    <Col span={8}>
                        <Spin spinning={statGeneralLoading}>
                            <Card>
                                <Statistic
                                    title="Posts"
                                    value={
                                        (statGeneral && statGeneral.posts) || 0
                                    }
                                />
                            </Card>
                        </Spin>
                    </Col>
                    <Col span={8}>
                        <Spin spinning={statGeneralLoading}>
                            <Card>
                                <Statistic
                                    title="Liked"
                                    value={
                                        (statGeneral && statGeneral.liked) || 0
                                    }
                                    prefix={<Icon type="heart" />}
                                />
                            </Card>
                        </Spin>
                    </Col>
                </Row>
                <Divider dashed={true} />
                <Row gutter={16}>
                    <Col span={24}>
                        <Spin spinning={statReadLoading}>
                            <Card title="Readers">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={statRead && statRead.stat}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="xAxis" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="read" fill="#8884d8" />
                                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Spin>
                    </Col>
                </Row>
            </ContentWrapper>
        </MeLayout>
    );
};

Me.getInitialProps = async context => {
    context.store.dispatch({
        type: LOAD_STAT_GENERAL_CALL,
        data: '',
    });

    context.store.dispatch({
        type: LOAD_STAT_READ_CALL,
        data: '',
    });

    return {};
};

export default withAuth(Me);
