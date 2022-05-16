import classes from "./campaignCard.module.css";
import { Divider, Progress, Carousel, Col, Row, Avatar, Card } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import moment from "moment";

const LandingCampaignCard = ({ campaign }) => {
    const [organisation, setOrganisation] = useState({});
    const [donationStats, setDonationStats] = useState({});

    const contentStyle = {
        height: "15rem",
        color: "#fff",
        lineHeight: "15rem",
        textAlign: "center",
        background: "#364d79",
    };

    useEffect(() => {
        db.collection("Organisations")
            .doc(campaign.organisationID)
            .get()
            .then((DocumentSnapshot) => {
                setOrganisation(DocumentSnapshot.data());
            });

        getDonatedPackages(campaign.id);
    }, [campaign]);

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

    const getDonatedPackages = (campaignID) => {
        const packages = [];
        const donors = new Set();

        db.collection("Packages")
            .where("campaignID", "==", campaignID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    const data = documentSnapshot.data();

                    packages.push(
                        documentSnapshot.ref
                            .collection("Items")
                            .get()
                            .then((querySnapshot) => {
                                let quantity = 0;

                                querySnapshot.forEach((documentSnapshot) => {
                                    quantity +=
                                        +documentSnapshot.data().quantity;
                                });

                                return quantity;
                            })
                    );
                    donors.add(data.donorID);
                });
            })
            .then(() => {
                let quantity = 0;
                console.log(donors);
                const output = {
                    totalItems: quantity,
                    totalDonors: donors.size,
                };

                Promise.all(packages)
                    .then((res) => {
                        res.forEach((item) => {
                            quantity += item;
                        });

                        output.totalItems = quantity;
                    })
                    .then(() => {
                        setDonationStats(output);
                    });
            });
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Carousel autoplay>
                        {campaign.campaignImage.map((image) => {
                            return (
                                <div key={image}>
                                    <div style={contentStyle}>
                                        <img
                                            src={image}
                                            style={{
                                                objectFit: "cover",
                                                width: "100%",
                                            }}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                </Col>
            </Row>
            <Card>
                <Row gutter={[20]}>
                    <Col span={7}>
                        <div className={classes.cardOrgStyle}>
                            <Avatar
                                className={classes.cardAvatarStyle}
                                size="small"
                                icon={<UserOutlined />}
                            />
                            {organisation ? organisation.name : ""}
                        </div>
                        <div className={classes.calendarStyle}>
                            <CalendarOutlined
                                style={{
                                    marginRight: "1rem",
                                }}
                            />
                            {getDatePeriod(
                                campaign.startDate,
                                campaign.endDate
                            )}
                        </div>
                        <div className={classes.cardProgressStyle}>
                            <div className={classes.itemCounter}>
                                {`${donationStats.totalItems} items collected from ${donationStats.totalDonors} donors`}
                            </div>
                            <div style={{ fontWeight: "bold" }}>
                                Campaign Progress
                            </div>
                            <Progress
                                percent={calculatePercentDays(
                                    campaign.startDate,
                                    campaign.endDate
                                )}
                                size="small"
                                status="active"
                                showInfo={false}
                            />
                            <div className={classes.progressCounter}>
                                {`${calculateRemainingDays(
                                    campaign.endDate
                                )} Days Left`}
                            </div>
                        </div>
                    </Col>
                    <Col span={1}>
                        <Divider type="vertical" style={{ height: "100%" }} />
                    </Col>
                    <Col span={16}>
                        <div className={classes.cardHeader}>
                            {campaign.campaignName}
                        </div>
                        <div className={classes.cardDescStyle}>
                            {campaign.description}
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default LandingCampaignCard;
