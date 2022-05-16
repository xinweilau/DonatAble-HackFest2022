import { DonorLayout } from "../Layout/DonorLayout";

import React, { useState, useEffect } from "react";
import ButtonAndModal from "./ButtonAndModal";
import { Firebase, db } from "../../firebase.js";
import { Table, Card, Row, Divider, Col, Statistic, Tooltip, Tag } from "antd";
import {
    SyncOutlined,
    LayoutOutlined,
    RocketOutlined,
    SmileOutlined,
    StopOutlined,
} from "@ant-design/icons";

const { Column } = Table;

export const TrackDonations = () => {
    const [userPackageData, setUserPackageData] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            db.collection("Packages")
                .where("donorID", "==", Firebase.auth().currentUser.uid)
                .get()
                .then((QuerySnapshot) => {
                    QuerySnapshot.forEach((DocumentSnapshot) => {
                        let campaignID = DocumentSnapshot.data().campaignID;
                        db.collection("Campaigns")
                            .doc(campaignID)
                            .get()
                            .then((campaignDoc) => {
                                let data = {
                                    campaignName:
                                        campaignDoc.data().campaignName,
                                    packageID: DocumentSnapshot.id,
                                    status: DocumentSnapshot.data().status,
                                };

                                setUserPackageData([...userPackageData, data]);
                            });
                    });
                });
        };
        fetch();
    }, []);
    const countDropOff = () => {
        let count = 0;
        for (let i = 0; i < userPackageData.length; i++) {
            if (userPackageData[i].status === "Awaiting Collection") {
                count++;
            }
        }
        return count;
    };
    const countCollected = () => {
        let count = 0;
        for (let i = 0; i < userPackageData.length; i++) {
            if (userPackageData[i].status === "Collected") {
                count++;
            }
        }
        return count;
    };
    const countTransit = () => {
        let count = 0;
        for (let i = 0; i < userPackageData.length; i++) {
            if (userPackageData[i].status === "In Transit") {
                count++;
            }
        }
        return count;
    };
    const countPending = () => {
        let count = 0;
        for (let i = 0; i < userPackageData.length; i++) {
            if (userPackageData[i].status === "Pending") {
                count++;
            }
        }
        return count;
    };

    const countReturned = () => {
        let count = 0;
        for (let i = 0; i < userPackageData.length; i++) {
            if (userPackageData[i].status === "Returned") {
                count++;
            }
        }
        return count;
    };

    return (
        <DonorLayout>
            <>
                <Card title="Package Status Tracker" size="small">
                    <Row justify="space-evenly" gutter={[50, 50]}>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Statistic
                                title={
                                    <Tooltip
                                        overlayInnerStyle={{
                                            textAlign: "center",
                                        }}
                                        title="Package awaiting collection confirmation by organisation"
                                    >
                                        <span>Awaiting Collection</span>
                                    </Tooltip>
                                }
                                value={countDropOff()}
                                prefix={
                                    <SyncOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Statistic
                                title={
                                    <Tooltip
                                        overlayInnerStyle={{
                                            textAlign: "center",
                                        }}
                                        title="Package has been collected by the organisation"
                                    >
                                        <span>Collected</span>
                                    </Tooltip>
                                }
                                value={countCollected()}
                                prefix={
                                    <LayoutOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Statistic
                                title={
                                    <Tooltip
                                        overlayInnerStyle={{
                                            textAlign: "center",
                                        }}
                                        title="Package in transit to receipients of donation campaign"
                                    >
                                        <span>In Transit</span>
                                    </Tooltip>
                                }
                                value={countTransit()}
                                prefix={
                                    <RocketOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Statistic
                                title={
                                    <Tooltip
                                        overlayInnerStyle={{
                                            textAlign: "center",
                                        }}
                                        title="Package has been distributed to receipients of donation campaign"
                                    >
                                        <span>Distributed</span>
                                    </Tooltip>
                                }
                                value={countPending()}
                                prefix={
                                    <SmileOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                }
                            />
                        </Col>
                        <Col span={4} style={{ textAlign: "center" }}>
                            <Statistic
                                title={
                                    <Tooltip
                                        overlayInnerStyle={{
                                            textAlign: "center",
                                        }}
                                        title="Package returned to donor due to stated reasons"
                                    >
                                        <span>Returned</span>
                                    </Tooltip>
                                }
                                value={countReturned()}
                                prefix={
                                    <StopOutlined
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                }
                            />
                        </Col>
                    </Row>
                </Card>
                <Divider orientation="middle" />
                <>
                    <Table dataSource={userPackageData} bordered>
                        <Column
                            title="Package ID"
                            dataIndex="packageID"
                            key="packageID"
                            render={(packID) => {
                                return <ButtonAndModal packageID={packID} />;
                            }}
                            width="10rem"
                        />
                        <Column
                            title="Campaign"
                            dataIndex="campaignName"
                            key="campaignName"
                            width="20rem"
                        />

                        <Column
                            title="Drop Off Point"
                            dataIndex="dropOffPoint"
                            key="dropOffPoint"
                            width="13rem"
                        />
                        <Column
                            title="Status"
                            dataIndex="status"
                            key="status"
                            width="10rem"
                            render={(text) => {
                                if (text === "Awaiting Collection") {
                                    return <Tag color="blue">{text}</Tag>;
                                } else if (text === "Collected") {
                                    return <Tag color="purple">{text}</Tag>;
                                } else if (text === "In Transit") {
                                    return <Tag color="cyan">{text}</Tag>;
                                } else if (text === "Distributed") {
                                    return <Tag color="green">{text}</Tag>;
                                } else if (text === "Returned") {
                                    return <Tag color="red">{text}</Tag>;
                                } else {
                                    return <Tag color="grey">{text}</Tag>;
                                }
                            }}
                        />
                        <Column
                            title="Remarks"
                            dataIndex="remarks"
                            key="remarks"
                            width="25rem"
                        />
                    </Table>
                </>
            </>
        </DonorLayout>
    );
};

export default TrackDonations;
