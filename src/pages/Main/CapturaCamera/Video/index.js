import React from 'react';
import ReactPlayer from 'react-player';
import { Row, Col } from 'antd';

import './styles.css';

function Video(props) {
    const { src } = props;
    const { buffer } = props;
    console.log('buffer:', buffer);
    return (
        <>
            <Row>
                <Col className="player-video-record">
                    {src && <ReactPlayer url={src} playing />}
                    {buffer && <ReactPlayer url={buffer} playing />}
                </Col>
            </Row>
        </>
    );
}

export default Video;
