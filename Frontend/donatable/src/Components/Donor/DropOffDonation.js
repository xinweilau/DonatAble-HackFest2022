import { DonorLayout } from "../Layout/DonorLayout";
import React from "react";
import classes from "./DropOffDonation.module.css";
import { Row, Col, Button, Timeline, Upload } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import {QRCodeCanvas} from "qrcode.react"
export const DropOffDonation = () => {
    const navigate = useNavigate();
    const location=useLocation();
    const submit = () => {
        navigate("/donations");
    };
    const downloadQR=()=>{
        const canvas = document.getElementById("qr-gen");
        console.log(canvas)
        const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrCode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <DonorLayout>
            <Row justify="center">
                <Col className={classes.header}>
                    One last step to confirm your donation!
                </Col>
            </Row>
            <Row justify="center" gutter={[40, 40]} align="middle">
                <Col>
                    <div>
                        <QRCodeCanvas
                            id="qr-gen"
                           value={location.state.packageID}
                        />
                    </div>
                </Col>
                <Col justify="center" className={classes.desc} span={7}>
                    <Timeline>
                        <Timeline.Item>
                            Download the package tracking label
                        </Timeline.Item>
                        <Timeline.Item>
                            Paste it on your donation package
                        </Timeline.Item>
                        <Timeline.Item>
                            Take a picture of your package with the tracking
                            label
                        </Timeline.Item>
                    </Timeline>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={downloadQR}>
                        Package Tracking Label
                    </Button>
                </Col>
            </Row>
            <Row justify="center">
                <Col className={classes.uploadHeader}>Upload Photos:</Col>
            </Row>
            <Row justify="center">
                <Col span={10} align="middle">
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        maxCount={3}
                    >
                        <Button icon={<UploadOutlined />}>
                            Upload (Max 3)
                        </Button>
                    </Upload>
                </Col>
            </Row>
            <Row justify="center">
                <Button
                    className={classes.doneBtn}
                    onClick={submit}
                    type="primary"
                >
                    Complete Donation
                </Button>
            </Row>
        </DonorLayout>
    );
};
