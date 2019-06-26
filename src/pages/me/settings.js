import React from 'react';
import Link from 'next/link';
import { PageHeader, Button } from 'antd';
import { withAuth } from '../../utils/auth';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';

const Settings = () => {
    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Settings" />

                <div>
                    <Link href="/me/unregister">
                        <a>
                            <Button type="danger">Unregister</Button>
                        </a>
                    </Link>
                </div>
            </ContentWrapper>
        </MeLayout>
    );
};

export default withAuth(Settings);
