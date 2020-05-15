import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

import { Row, Col, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Video from './Video';
import './styles.css';

function CapturaCamera() {
    const constraints = {
        audio: false,
        video: true,
    };

    const [disabledButton, setDisabledButton] = useState({
        camera: false,
        streaming: false,
    });
    const [stream, setStream] = useState(null);
    const [streamReceived, setStreamReceived] = useState(null);
    const [socket, setSocket] = useState({});
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const [recordedBlobs, setRecordedBlobs] = useState([]);

    const ENDPOINT = 'http://127.0.0.1:3001';

    function handleDataDisponivel(event) {
        if (event.data && event.data.size > 0) {
            socket.emit('clienteResponse', event.data);
        }
    }

    function handleIniciarStreaming() {
        if (disabledButton.streaming) {
            try {
                mediaRecorder.stop();
                setDisabledButton({
                    ...disabledButton,
                    streaming: !disabledButton.streaming,
                });
            } catch (err) {
                console.log(err);
            }
            return;
        }

        setRecordedBlobs([]);
        const options = { mimeType: 'video/webm;codecs=vp9' };
        try {
            const media = new MediaRecorder(stream, options);
            media.onstop = (event) => {
                console.log('Parar gravação: ', event);
                console.log('Blobs gravados: ', recordedBlobs);
            };
            media.ondataavailable = handleDataDisponivel;
            media.start(100); // coletar 100ms de dados
            setMediaRecorder(media);
            setDisabledButton({
                ...disabledButton,
                streaming: !disabledButton.streaming,
            });
            console.log('MediaRecorder iniciado!', mediaRecorder);
        } catch (e) {
            console.error('error:', e);
        }
    }

    function handleSuccess(streamDevice) {
        const videoTracks = streamDevice.getVideoTracks();
        console.log('Abrindo stream com as opções:', constraints);
        console.log(`Usando esse device: ${videoTracks[0].label}`);
        setStream(streamDevice);
    }

    useEffect(function initMain() {
        async function start() {
            try {
                // pedir permissão da câmera
                const streamDevice = await navigator.mediaDevices.getUserMedia(constraints);

                handleSuccess(streamDevice);

                setDisabledButton({
                    ...disabledButton,
                    camera: !disabledButton.camera,
                });
            } catch (err) {
                console.log(err);
            }
        }
        start();
    }, []);

    useEffect(function startSocket() {
        async function start() {
            try {
                const socketClient = await socketIOClient(ENDPOINT);
                socketClient.on('connection', (data) => {
                    console.log(data);
                });

                setSocket(socketClient);
                /**
                 * TO-DO CORREÇÕES:
                 * - MELHORAR QUESTÃO DO DELAY
                 * - CORRIGIR PROBLEMA DE PARAR/VOLTAR TRANSMISSÃO
                 * - REFATORAR CODIGO E DEIXA-LO MENOR
                 */
                const mediaSource = new MediaSource();
                setStreamReceived(window.URL.createObjectURL(mediaSource));
                mediaSource.addEventListener('sourceopen', () => {
                    const sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp9');
                    socketClient.on('broadcast', (data) => {
                        if (!sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(data);
                        }
                    });
                });
            } catch (err) {
                console.log(err);
            }
        }
        start();
    }, []);
    return (
        <>
            <Row>
                <Col span={12} className="camera-video-recording">
                    <Video src={stream} />
                    {disabledButton.streaming && (
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
                                {!disabledButton.streaming ? 'Iniciar gravação' : 'Parar'}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default CapturaCamera;
