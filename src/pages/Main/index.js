import React from 'react';
import { Row, Col, Button, Divider } from 'antd';

import Header from '../../components/Header';
import CapturaCamera from './CapturaCamera';

import './styles.css';

export default function App() {
    return (
        <Row className="App">
            <Col span={24}>
                <Header />
            </Col>
            <Divider />
            <Col offset={1} span={22} style={{}}>
                <Row>
                    <Col span={12}>
                        <CapturaCamera />
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Button type="primary" block>
                            CONTEUDO DO SITE
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
