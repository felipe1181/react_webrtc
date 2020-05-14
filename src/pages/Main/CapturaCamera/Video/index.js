import React, { useEffect, useState } from 'react';
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
                    {buffer && (
                        <ReactPlayer
                            progressInterval={10000}
                            url={[{ src: buffer, type: 'video/webm' }]}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
}

export default Video;
