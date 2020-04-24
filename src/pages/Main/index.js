import React from 'react';
import { Row, Col, Button } from 'antd';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import logo from '../../assets/Images/logo.svg';
import './styles.css';

export default function App() {
    return (
        <Row className="App">
            <Col span={8}>session01 col-8</Col>
            <Col span={8}>
                <Row>
                    <Col span={24}>
                        <input src={logo} className="App-logo" alt="logo-main" type="image" />
                    </Col>
                    <Col span={24}>
                        <Button type="primary" block>
                            TEMPLATE REACT FELIPE1181
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={8}>session03 col-8</Col>
        </Row>
    );
}
