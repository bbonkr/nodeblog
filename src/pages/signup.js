import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Row, Col } from 'antd';
import {
    ContentWrapper,
    ErrorMessageWrapper,
} from '../styledComponents/Wrapper';
import SignUpForm from '../components/SignUpForm';
import DefaultLayout from '../components/DefaultLayout';

const SignUp = () => {
    return (
        <DefaultLayout>
            <ContentWrapper>
                <Row type="flex" justify="center" align="middle">
                    <Col xs={24} sm={24} md={12}>
                        <div>sign up</div>
                        <SignUpForm />
                    </Col>
                </Row>
            </ContentWrapper>
        </DefaultLayout>
    );
};

export default SignUp;
