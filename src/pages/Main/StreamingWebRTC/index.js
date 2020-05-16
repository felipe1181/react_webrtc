import React, { useEffect, useState, useReducer } from 'react';
import socketIOClient from 'socket.io-client';

import { Row, Col, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Video from './Video';
import './styles.css';

function StreamingWebRTC() {
    const [stateDisabledButton, dispatchDisabledButton] = useReducer(
        function reducer(state, action) {
            switch (action.type) {
                case 'camera':
                    return { camera: !state.camera };
                case 'streaming':
                    return { streaming: !state.streaming };
                default:
                    throw new Error();
            }
        },
        {
            camera: false,
            streaming: false,
        }
    );
    const [streamEmitter, setStreamEmitter] = useState(null);
    const [streamReceived, setStreamReceived] = useState(null);
    const [socket, setSocket] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    function handleDataDisponivel(event) {
        if (event.data && event.data.size > 0) {
            socket.emit('clienteResponse', event.data);
        }
    }

    function handleIniciarStreaming() {
        if (stateDisabledButton.streaming) {
            try {
                mediaRecorder.stop();
                dispatchDisabledButton({ type: 'streaming' });
                console.log(stateDisabledButton);
            } catch (err) {
                console.log(err);
            }
            return;
        }

        const options = { mimeType: 'video/webm;codecs=vp9' };
        try {
            const media = new MediaRecorder(streamEmitter, options);
            media.onstop = (event) => {
                console.log('Parar gravação: ', event);
                // restart media source
            };
            media.ondataavailable = handleDataDisponivel;
            media.start(100); // coletar 100ms de dados
            setMediaRecorder(media);
            dispatchDisabledButton({ type: 'streaming' });
            console.log('MediaRecorder iniciado!', mediaRecorder);
        } catch (e) {
            console.error('error:', e);
        }
    }

    useEffect(function main() {
        async function startMain() {
            try {
                const mediaStreamConstraints = {
                    audio: false,
                    video: true,
                };
                // pedir permissão da câmera
                const streamDevice = await navigator.mediaDevices.getUserMedia(
                    mediaStreamConstraints
                );
                // handlerSuccess - ser der certo
                const videoTracks = streamDevice.getVideoTracks();
                console.log('Abrindo stream com as opções:', mediaStreamConstraints);
                console.log(`Usando esse device: ${videoTracks[0].label}`);
                setStreamEmitter(streamDevice);
                dispatchDisabledButton({ type: 'camera' });
            } catch (err) {
                console.log(err);
            }
        }
        startMain();
    }, []);

    useEffect(function socketClient() {
        function startSocket() {
            try {
                const client = socketIOClient('http://127.0.0.1:3001');
                client.on('connection', (data) => {
                    console.log(data);
                });
                if (!socket) setSocket(client);
            } catch (err) {
                console.log(err);
            }
        }
        startSocket();
    }, []);

    useEffect(
        function startReceivedSocket() {
            function startReceived() {
                try {
                    const mediaSource = new MediaSource();
                    setStreamReceived(window.URL.createObjectURL(mediaSource));
                    mediaSource.addEventListener('sourceopen', () => {
                        const sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp9');
                        console.log('socket', socket);
                        socket.on('broadcast', (data) => {
                            if (!sourceBuffer.updating) {
                                sourceBuffer.appendBuffer(data);
                            }
                        });
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            startReceived();
        },
        [socket]
    );
    return (
        <>
            <Row>
                <Col span={12} className="camera-video-recording">
                    <Video src={streamEmitter} />
                    {stateDisabledButton.streaming && (
                        <Button type="danger" className="aovivo-video-recording">
                            <LoadingOutlined /> Ao vivo
                        </Button>
                    )}
                </Col>
                <Col span={12} className="camera-video-recording">
                    <Video buffer={streamReceived} />
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={12}>
                            <Button onClick={handleIniciarStreaming} block>
                                {!stateDisabledButton.streaming ? 'Iniciar gravação' : 'Parar'}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default StreamingWebRTC;
