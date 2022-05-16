import classes from "./campaignCard.module.css";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Progress, Carousel, Avatar, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CampaignModal from "./campaignModal";
import moment from "moment";
import { db } from "../../firebase";

const { Meta } = Card;

const contentStyle = {
    height: "200px",
    textAlign: "center",
    background: "#364d79",
    color: "#fff",
    lineHeight: "200px",
};

export const CampaignCard = ({ data }) => {
    const [organisation, setOrganisation] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        db.collection("Organisations")
            .doc(data.organisationID)
            .get()
            .then((DocumentSnapshot) => {
                setOrganisation(DocumentSnapshot.data());
            });
    }, [data]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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

    return (
        <>
            <Modal
                title={`${data.campaignName}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                width={"90%"}
                footer={null}
                centered
                style={{ margin: "5% 0" }}>
                <CampaignModal
                    campaign={data}
                    organisation={organisation}
                    campaignProgress={calculatePercentDays(
                        data.startDate,
                        data.endDate
                    )}
                    campaignDaysLeft={calculateRemainingDays(data.endDate)}
                    campaignDatePeriod={getDatePeriod(
                        data.startDate,
                        data.endDate
                    )}
                />
            </Modal>
            <Card
                onClick={showModal}
                hoverable
                style={{ width: 400 }}
                cover={
                    <Carousel autoplay>
                        {data.campaignImage.map((image) => {
                            return (
                                <div key={image}>
                                    <div style={contentStyle}>
                                        <img
                                            src={image}
                                            style={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                }>
                <div className={classes.cardOrgStyle}>
                    <Avatar
                        className={classes.cardAvatarStyle}
                        size="small"
                        icon={<UserOutlined />}
                    />
                    {organisation ? organisation.name : ""}
                </div>
                <Meta
                    title={`${data.campaignName}`}
                    description={`Period: ${getDatePeriod(
                        data.startDate,
                        data.endDate
                    )}`}
                />
                <div className={classes.cardDescStyle}>{data.description}</div>
                <div className={classes.cardProgressStyle}>
                    <div style={{ fontWeight: "bold" }}>Campaign Progress</div>
                    <Progress
                        percent={calculatePercentDays(
                            data.startDate,
                            data.endDate
                        )}
                        size="small"
                        status="active"
                        showInfo={false}
                    />
                    <div
                        className={
                            classes.progressCounter
                        }>{`${calculateRemainingDays(
                        data.endDate
                    )} Days Left`}</div>
                </div>
                <Link to={`/campaigns/${data.id}/donate`}>
                    <Button
                        type="primary"
                        className={classes.cardDonateBtn}
                        block>
                        Donate Now
                    </Button>
                </Link>
            </Card>
        </>
    );
};

export default CampaignCard;
