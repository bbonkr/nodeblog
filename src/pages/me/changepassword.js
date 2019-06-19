import React from 'react';
import { withAuth } from '../../utils/auth';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import { PageHeader } from 'antd';

const ChangePassword = () => {
    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Change my password">
                    Change my password.
                    <ol>
                        <li>Input current password.</li>
                        <li>Input password to wish changing.</li>
                        <li>Input password again to wish changing.</li>
                    </ol>
                </PageHeader>
                <ChangePasswordForm />
            </ContentWrapper>
        </MeLayout>
    );
};

export default withAuth(ChangePassword);
