import React from 'react';

import { useSpring, animated } from 'react-spring';
import { List, Button, Layout, Row, Col, Menu } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import './styles.css';

function Header() {
    const history = useHistory();
    const [propsAnimatedMenuMobile, setPropsAnimatedMenuMobile] = useSpring(() => ({
        height: 0,
    }));

    function handlerInicio() {
        history.push('/');
    }
    function handlerMensagens() {
        console.log('mensagens');
    }
    function handlerConfiguracoes() {
        console.log('configurações');
    }
    function handlerSair() {
        localStorage.removeItem('user');
        history.push('/login');
    }
    function toggleCollapsed() {
        const valueMax = 190;
        const toogle = propsAnimatedMenuMobile.height.getValue() < valueMax / 2;
        setPropsAnimatedMenuMobile({ height: toogle ? valueMax : 0 });
    }
    const data = [
        {
            id: 0,
            title: 'Início',
            action: handlerInicio,
        },
        {
            id: 1,
            title: 'Mensagens',
            action: handlerMensagens,
        },
        {
            id: 2,
            title: 'Configurações',
            action: handlerConfiguracoes,
        },
        {
            id: 3,
            title: 'Sair',
            action: handlerSair,
        },
    ];

    return (
        <Layout className="container-header">
            <Row>
                <Col className="container-logo-header" span={3}>
                    <b>HANG</b>CARIRI
                </Col>
                <Col
                    xs={0}
                    sm={{ span: 16, offset: 5 }}
                    md={{ span: 12, offset: 9 }}
                    lg={{ span: 10, offset: 11 }}
                    xl={{ span: 8, offset: 13 }}
                >
                    <List
                        className="list-menu-header"
                        grid={{ column: 4 }}
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item className="list-item-header">
                                <Button
                                    type="link"
                                    className="btn-link-header"
                                    onClick={item.action}
                                >
                                    {item.title}
                                </Button>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col
                    xs={{ span: 3, offset: 16 }}
                    sm={{ span: 0, offset: 0 }}
                    md={{ span: 0, offset: 0 }}
                    lg={{ span: 0, offset: 0 }}
                    xl={{ span: 0, offset: 0 }}
                >
                    <Button type="link" className="btn-link-header" onClick={toggleCollapsed}>
                        <MenuUnfoldOutlined />
                    </Button>
                </Col>
                <Col
                    xs={{ span: 24 }}
                    sm={{ span: 0 }}
                    md={{ span: 0 }}
                    lg={{ span: 0 }}
                    xl={{ span: 0 }}
                    className="menu-mobile-header"
                >
                    <animated.div style={propsAnimatedMenuMobile}>
                        <Menu>
                            {data.map((option) => (
                                <Menu.Item key={option.id} onClick={option.action}>
                                    {option.title}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </animated.div>
                </Col>
            </Row>
        </Layout>
    );
}

export default Header;
