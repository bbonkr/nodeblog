import React from 'react';
import Link from 'next/link';
import { PageHeader, Button, Divider, Typography } from 'antd';
import { withAuth } from '../../utils/auth';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';

const Settings = () => {
    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Settings" />
                <Divider />
                <div>
                    <div>
                        <Typography.Title level={3}>
                            Change account information
                        </Typography.Title>
                        <Link href="/me/changeinfo">
                            <a>
                                <Button type="default">
                                    Change account information
                                </Button>
                            </a>
                        </Link>
                    </div>
                    <Divider dashed={true} />
                    <div>
                        <Typography.Title level={3}>
                            Change password
                        </Typography.Title>
                        <Link href="/me/changepassword">
                            <a>
                                <Button type="default">Change password</Button>
                            </a>
                        </Link>
                    </div>
                    <Divider dashed={true} />
                    <div>
                        <Typography.Title level={3}>
                            Unregister
                        </Typography.Title>
                        <Link href="/me/unregister">
                            <a>
                                <Button type="danger">Unregister</Button>
                            </a>
                        </Link>
                    </div>
                </div>
            </ContentWrapper>
        </MeLayout>
    );
};

export default withAuth(Settings);
