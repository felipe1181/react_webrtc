import React from 'react';
import ReactPlayer from 'react-player';
import { Row, Col } from 'antd';

import './styles.css';

function Video(props) {
    const { src } = props;

    return (
        <>
            <Row>
                <Col className="player-video-record">
                    <ReactPlayer url={src} playing />
                </Col>
            </Row>
        </>
    );
}

export default Video;
