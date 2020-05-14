import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';

import './styles.css';

import headStyle from '../../assets/Images/head_style.svg';

const Login = () => {
    const history = useHistory();

    function handleSubmit(data) {
        localStorage.setItem(
            'user',
            JSON.stringify({ usuario: data.username, senha: data.password })
        );
        history.push('/');
    }

    return (
        <>
            <Row className="container-login">
                <Col
                    className="content-login"
                    xs={{ span: 22, offset: 1 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 12, offset: 6 }}
                    lg={{ span: 10, offset: 7 }}
                    xl={{ span: 8, offset: 8 }}
                >
                    <Col span={24}>
                        <Row>
                            <Col span={12} />
                            <Col span={12}>
                                <img width="100%" alt="tes" src={headStyle} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className="header-login" offset={4} span={16}>
                        <span>
                            <b>HANG</b>CARIRI
                        </span>
                    </Col>
                    <Col offset={2} span={20}>
                        <Form name="basic" onFinish={handleSubmit}>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Preencha o usuário!',
                                    },
                                ]}
                            >
                                <Input placeholder="Usuário" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Preencha uma senha!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Senha" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Entra ai vai!
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Col>
            </Row>
        </>
    );
};

export default Login;
