import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import { Row, Col, Card, Timeline, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";

const QRScannerPage = (props) => {
    let container;
    const [data, setData] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        if (data === "") {
            return;
        }

        navigate("../packages/modifyStatus", { state: { packageID: data } });
    }, [data]);
    return (
        <OrganisationLayout>
            <div
                style={{
                    marginBottom: "2rem",
                    width: "80%",
                    margin: "auto",
                }}
            >
                <Card title={"Update Package Tracking Status"}>
                    <Row justify="center">
                        <Col span={11}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    marginBottom: "2rem",
                                }}
                            >
                                Scan QR Code
                            </div>
                            <Timeline>
                                <Timeline.Item>
                                    Locate tracking label on package
                                </Timeline.Item>
                                <Timeline.Item>
                                    Place the entire label within the camera
                                    frame as shown on the right
                                </Timeline.Item>
                                <Timeline.Item>
                                    Ensure sufficient lighting in surroundings
                                    to allow scanner to work properly
                                </Timeline.Item>
                                <Timeline.Item>
                                    Contact support if invalid/fradulent label
                                    is detected
                                </Timeline.Item>
                            </Timeline>
                        </Col>
                        <Col span={1}>
                            <Divider
                                type="vertical"
                                style={{ height: "100%" }}
                            />
                        </Col>
                        <Col span={11}>
                            <div id="scanner">
                                <QrReader
                                    onResult={(result, error) => {
                                        if (!!result) {
                                            setData(result?.text);
                                            container =
                                                document.getElementById(
                                                    "scanner"
                                                );
                                            createRoot(container).unmount();
                                        }

                                        if (!!error) {
                                        }
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                    }}
                                    videoContainerStyle={{
                                        padding: "9rem",
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </OrganisationLayout>
    );
};
export default QRScannerPage;
