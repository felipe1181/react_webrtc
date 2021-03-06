import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import Video from './Video';

import './styles.css';

function CapturaCamera() {
    const constraints = {
        audio: false,
        video: true,
    };

    const [disabledButton, setDisabledButton] = useState({
        camera: false,
        gravar: false,
        download: false,
    });
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState({});
    const [recordedBlobs, setRecordedBlobs] = useState([]);

    function handleDataDisponivel(event) {
        console.log('handleDataDisponivel', event);
        if (event.data && event.data.size > 0) {
            setRecordedBlobs((recordblob) => {
                return [...recordblob, event.data];
            });
        }
    }

    async function handleIniciarGravacao() {
        const isCamera = disabledButton.gravar ? !disabledButton.camera : disabledButton.camera;
        setDisabledButton({
            ...disabledButton,
            gravar: !disabledButton.gravar,
            camera: isCamera,
            download: !isCamera,
        });
        if (!disabledButton.gravar) {
            setRecordedBlobs([]);
            const options = { mimeType: 'video/webm;codecs=vp9' };
            try {
                const media = new MediaRecorder(stream, options);
                media.onstop = (event) => {
                    console.log('Parar gravação: ', event);
                    console.log('Blobs gravados: ', recordedBlobs);
                };
                media.ondataavailable = handleDataDisponivel;
                media.start(10); // coletar 10ms de dados
                setMediaRecorder(media);
                console.log('MediaRecorder iniciado!', mediaRecorder);
            } catch (e) {
                console.error('error:', e);
            }
        } else {
            mediaRecorder.stop();
        }
    }

    function handleFazerDownload() {
        if (!disabledButton.download || stream === null || !recordedBlobs.length) return;
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${new Date()}_teste.webm`;
        a.click();
    }

    function handleSuccess(streamDevice) {
        const videoTracks = streamDevice.getVideoTracks();
        console.log('Abrindo stream com as opções:', constraints);
        console.log(`Usando esse device: ${videoTracks[0].label}`);
        setStream(streamDevice);
    }

    useEffect(async function init() {
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
    }, []);

    return (
        <>
            <Row>
                <Col span={24} className="camera-video-recording">
                    <Video src={stream} />
                    {disabledButton.camera && (
                        <Button type="danger" className="aovivo-video-recording">
                            <b>o</b>Ao vivo
                        </Button>
                    )}
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={12}>
                            <Button
                                disabled={!disabledButton.camera}
                                onClick={handleIniciarGravacao}
                                block
                            >
                                {!disabledButton.gravar ? 'Iniciar gravação' : 'Parar'}
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                disabled={!disabledButton.download}
                                onClick={handleFazerDownload}
                                block
                            >
                                Fazer Download
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default CapturaCamera;
