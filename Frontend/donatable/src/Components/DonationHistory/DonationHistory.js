import {
    Table,
    Card,
    Row,
    Divider,
    Col,
    Statistic,
    Tooltip,
    Tag,
    Button,
} from "antd";
import {
    SyncOutlined,
    LayoutOutlined,
    RocketOutlined,
    SmileOutlined,
    StopOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { DonorLayout } from "../Layout/DonorLayout";
import PackageItems from "./PackageItems";
import { Firebase, db } from "../../firebase.js";

export function DonationHistory() {
    // const user = Firebase.auth().currentUser;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [history, setHistory] = useState([]);

    const retrieveDonationHistory = () => {
        return db
            .collection("Packages")
            .where("donorID", "==", Firebase.auth().currentUser.uid) // replace with retrieved user id
            .get()
            .then((PackageQuerySnapshot) => {
                let ds = [];

                PackageQuerySnapshot.forEach((PackageDocumentSnapshot) => {
                    const data = PackageDocumentSnapshot.data();
                    const packageId = PackageDocumentSnapshot.ref.id;

                    ds.push({
                        key: packageId,
                        docRef: PackageDocumentSnapshot.ref,
                        campaignID: data.campaignID,
                        packageId: packageId,
                        status: data.status,
                        dropOffPoint: data.dropOffPoint,
                        remarks: data.remarks || "-",
                    });
                });

                return ds;
            })
            .then((packages) => {
                return packages.map(async (item) => {
                    return db
                        .collection("Campaigns")
                        .doc(item.campaignID)
                        .get()
                        .then((CampaignSnapshot) => {
                            return {
                                ...item,
                                campaignName:
                                    CampaignSnapshot.data().campaignName,
                            };
                        });
                });
            });
    };

    useState(() => {
        retrieveDonationHistory().then((donations) => {
            return Promise.all(donations).then((res) => {
                setHistory(res);
            });
        });
    }, []);

    const columns = [
        {
            title: "Package ID",
            dataIndex: "packageId",
            key: "packageId",
            render: (text, row) => (
                <Button
                    type="link"
                    style={{ margin: 0, padding: 0 }}
                    onClick={() => toggleModal(row)}>
                    {text}
                </Button>
            ),
            width: "12rem",
        },
        {
            title: "Campaign",
            dataIndex: "campaignName",
            key: "campaignName",
            render: (text) => text,
            width: "20rem",
        },
        {
            title: "Drop Off Point",
            dataIndex: "dropOffPoint",
            key: "dropOffPoint",
            width: "13rem",
            render: (text) => text,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => {
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
            },
            width: "10rem",
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
            render: (text) => text,
            width: "25rem",
        },
    ];

    const toggleModal = (row) => {
        if (!modalVisible && row !== undefined) {
            row.docRef
                .collection("Items")
                .get()
                .then((QuerySnapshot) => {
                    setModalContent(() => {
                        const items = [];
                        QuerySnapshot.forEach((DocumentSnapshot) => {
                            let data = DocumentSnapshot.data();

                            items.push({ ...data, key: DocumentSnapshot.id });
                        });

                        return items;
                    });

                    setModalVisible(!modalVisible);
                });
        } else {
            setModalVisible(!modalVisible);
        }
    };

    const countDropOff = () => {
        let count = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === "Awaiting Collection") {
                count++;
            }
        }
        return count;
    };
    const countCollected = () => {
        let count = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === "Collected") {
                count++;
            }
        }
        return count;
    };
    const countTransit = () => {
        let count = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === "In Transit") {
                count++;
            }
        }
        return count;
    };
    const countPending = () => {
        let count = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === "Distributed") {
                count++;
            }
        }
        return count;
    };

    const countReturned = () => {
        let count = 0;
        for (let i = 0; i < history.length; i++) {
            if (history[i].status === "Returned") {
                count++;
            }
        }
        return count;
    };

    return (
        <DonorLayout>
            <Card title="Package Status Tracker" size="small">
                <Row justify="space-evenly" gutter={[50, 50]}>
                    <Col span={4} style={{ textAlign: "center" }}>
                        <Statistic
                            title={
                                <Tooltip
                                    overlayInnerStyle={{
                                        textAlign: "center",
                                    }}
                                    title="Package awaiting collection confirmation by organisation">
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
                                    title="Package has been collected by the organisation">
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
                                    title="Package in transit to receipients of donation campaign">
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
                                    title="Package has been distributed to receipients of donation campaign">
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
                                    title="Package returned to donor due to stated reasons">
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
            <Row>
                <Col span={24}>
                    <Table bordered columns={columns} dataSource={history} />
                </Col>
            </Row>

            <PackageItems
                modalContent={modalContent}
                modalVisible={modalVisible}
                toggleModal={toggleModal}
            />
        </DonorLayout>
    );
}
