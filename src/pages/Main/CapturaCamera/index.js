import React, { useEffect, useState, useReducer } from 'react';
import socketIOClient from 'socket.io-client';

import { Row, Col, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Video from './Video';
import './styles.css';

function CapturaCamera() {
    const mediaStreamConstraints = {
        audio: false,
        video: true,
    };
    const ENDPOINT = 'http://127.0.0.1:3001';

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
            console.log(stateDisabledButton);
            console.log('MediaRecorder iniciado!', mediaRecorder);
        } catch (e) {
            console.error('error:', e);
        }
    }

    function handleSuccess(streamDevice) {
        const videoTracks = streamDevice.getVideoTracks();
        console.log('Abrindo stream com as opções:', mediaStreamConstraints);
        console.log(`Usando esse device: ${videoTracks[0].label}`);
        setStreamEmitter(streamDevice);
    }

    useEffect(function initMain() {
        async function start() {
            try {
                // pedir permissão da câmera
                const streamDevice = await navigator.mediaDevices.getUserMedia(
                    mediaStreamConstraints
                );

                handleSuccess(streamDevice);

                dispatchDisabledButton({ type: 'camera' });
            } catch (err) {
                console.log(err);
            }
        }
        start();
    }, []);

    useEffect(function startSocket() {
        function start() {
            try {
                const socketClient = socketIOClient(ENDPOINT);
                socketClient.on('connection', (data) => {
                    console.log(data);
                });
                setSocket(socketClient);
            } catch (err) {
                console.log(err);
            }
        }
        start();
    }, []);

    useEffect(
        function startReceivedSocket() {
            function start() {
                try {
                    if (!stateDisabledButton.streaming) return;

                    /**
                     * TO-DO CORREÇÕES:
                     * - CORRIGIR PROBLEMA DE PARAR/VOLTAR TRANSMISSÃO
                     * - REFATORAR CODIGO E DEIXA-LO MENOR
                     */
                    if (!streamReceived) {
                        const mediaSource = new MediaSource();
                        setStreamReceived(window.URL.createObjectURL(mediaSource));
                        mediaSource.addEventListener('sourceopen', () => {
                            const sourceBuffer = mediaSource.addSourceBuffer(
                                'video/webm;codecs=vp9'
                            );

                            socket.on('broadcast', (data) => {
                                if (!sourceBuffer.updating) {
                                    sourceBuffer.appendBuffer(data);
                                }
                            });
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            start();
        },
        [socket, stateDisabledButton.streaming]
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

export default CapturaCamera;
