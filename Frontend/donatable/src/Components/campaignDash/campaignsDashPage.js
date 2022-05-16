import classes from "./campaignsDashPage.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Table, Divider, Tooltip, Button, Modal } from "antd";
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    QrcodeOutlined,
} from "@ant-design/icons";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import { Link } from "react-router-dom";
import { db,Firebase } from "../../firebase.js";
import moment from "moment";
import CampaignModal from "../campaignCard/campaignModal";

export const CampaignsDashPage = () => {
    const render = useRef(null); // used to prevent another instance of callback from being created when component updates
    const [campaigns, setCampaigns] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    const calculatePercentDays = (start, end) => {
        const now = moment();
        const startDate = moment(start.toDate());
        const endDate = moment(end.toDate());

        const totalDays = moment.duration(endDate.diff(startDate)).asDays();
        const numDays = moment.duration(endDate.diff(now)).asDays();

        const range = 100 - (numDays / totalDays) * 100;

        return range;
    };

    const calculateRemainingDays = (end) => {
        const startDate = moment();
        const endDate = moment(end.toDate());

        return Math.floor(moment.duration(endDate.diff(startDate)).asDays());
    };

    const getDatePeriod = (start, end) => {
        const startDate = moment(start.toDate());
        const endDate = moment(end.toDate());

        return `${startDate.format("DD/MM/YYYY")} - ${endDate.format(
            "DD/MM/YYYY"
        )}`;
    };

    const handleDelete = (record) => {
        setCampaigns((pre) => {
            return pre.filter((x) => x.key !== record.key);
        });
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        if (!render.current) {
            db.collection("Campaigns")
                .where("approval", "==", true).where("organisationID","==",Firebase.auth().currentUser.uid)
                .onSnapshot(
                    {
                        // Listen for document metadata changes
                        includeMetadataChanges: true,
                    },
                    (QuerySnapshot) => {
                        const campaigns = [];
                        QuerySnapshot.forEach((DocumentSnapshot) => {
                            const campaign = DocumentSnapshot.data();
                            campaign.id = DocumentSnapshot.id;
                            campaigns.push(campaign);
                        });

                        setCampaigns(campaigns);
                    }
                );

            render.current = true;
        }
    }, []);

    const toggleModal = (row) => {
        if (!modalVisible && row !== undefined) {
            // row.docRef
            //     .collection("Items")
            //     .get()
            //     .then((QuerySnapshot) => {
            //         setModalContent(() => {
            //             const items = [];
            //             QuerySnapshot.forEach((DocumentSnapshot) => {
            //                 let data = DocumentSnapshot.data();

            //                 items.push({ ...data, key: DocumentSnapshot.id });
            //             });

            //             return items;
            //         });
            db.collection("Organisations")
                .doc(row.organisationID)
                .get()
                .then((DocumentSnapshot) => {
                    return DocumentSnapshot.data();
                })
                .then((res) => {
                    setSelectedRow(() => {
                        const campaign = { ...row };

                        const newData = {
                            campaign: campaign,
                            campaignProgress: calculatePercentDays(
                                row.startDate,
                                row.endDate
                            ),
                            campaignDaysLeft: calculateRemainingDays(
                                row.endDate
                            ),
                            campaignDatePeriod: getDatePeriod(
                                row.startDate,
                                row.endDate
                            ),
                            organisation: res,
                        };

                        return newData;
                    });

                    setModalVisible(!modalVisible);
                });
        } else {
            setModalVisible(!modalVisible);
        }
    };

    const columns = [
        {
            title: "Campaign ID",
            dataIndex: "id",
            key: "id",
            render: (text, row) => (
                <Tooltip title="Preview Campaign Page">
                    <Button
                        type="link"
                        style={{ margin: 0, padding: 0 }}
                        onClick={() => toggleModal(row)}>
                        {text}
                    </Button>
                </Tooltip>
            ),
            width: "13rem",
        },
        {
            title: "Campaign",
            dataIndex: "campaignName",
            key: "campaignName",
            render: (text) => text,
            width: "20rem",
        },
        {
            title: "Period",
            dataIndex: ["startDate", "endDate"],
            key: "period",
            render: (_, record) =>
                `${moment(record.startDate.toDate()).format(
                    "DD-MM-YYYY"
                )} - ${moment(record.endDate.toDate()).format("DD-MM-YYYY")}`,
            width: "13rem",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => text,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (text, record) => (
                <Row gutter={[20, 20]}>
                    <Col>
                        <Tooltip title="Edit Campaign">
                            <Link to={`${record.id}/edit`}>
                                <EditOutlined />
                            </Link>
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title="Scan QR">
                            <Link to={"scan"}>
                                <QrcodeOutlined />
                            </Link>
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title="Upload Post">
                            <Link to={`${record.id}/post`}>
                                <PlusCircleOutlined />
                            </Link>
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title="Delete Campaign">
                            <a>
                                <DeleteOutlined
                                    onClick={() => handleDelete(record)}
                                />
                            </a>
                        </Tooltip>
                    </Col>
                </Row>
            ), // key is used to determine route to edit
            width: "10rem",
        },
    ];

    return (
        <>
            <Modal
                title={`${
                    selectedRow.campaign
                        ? selectedRow.campaign.campaignName
                        : ""
                }`}
                visible={modalVisible}
                onCancel={handleCancel}
                width={"90%"}
                footer={null}
                centered
                style={{ margin: "5% 0" }}>
                <CampaignModal
                    {...selectedRow}
                    isOrg={true}
                    // organisation={organisation}
                />
            </Modal>
            <OrganisationLayout>
                <Row>
                    <Col span={24}>
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "1.7rem",
                            }}>
                            Organisation Campaigns
                        </div>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={24}>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={campaigns}
                        />
                    </Col>
                </Row>
            </OrganisationLayout>
        </>
    );
};
