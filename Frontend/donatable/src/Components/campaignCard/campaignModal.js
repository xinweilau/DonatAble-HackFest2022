import classes from "./campaignCard.module.css";
import {
    Divider,
    Progress,
    Carousel,
    Col,
    Row,
    Avatar,
    Card,
    Button,
    Timeline,
    List,
} from "antd";
import { Link } from "react-router-dom";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { db } from "../../firebase.js";
import { useState } from "react";

export const CampaignModal = ({
    campaign,
    organisation,
    campaignProgress,
    campaignDaysLeft,
    campaignDatePeriod,
    isOrg,
}) => {
    const [donationStats, setDonationStats] = useState({});
    const [updates, setUpdates] = useState([]);
    const contentStyle = {
        height: "21rem",
        color: "#fff",
        lineHeight: "21rem",
        textAlign: "center",
        background: "#364d79",
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

    const fetchAllUpdates = (campaignID) => {
        db.collection("Campaigns")
            .doc(campaignID)
            .collection("Posts")
            .get()
            .then((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((documentSnapshot) => {
                    data.push(documentSnapshot.data());
                });

                setUpdates(data);
            });
    };

    useState(() => {
        getDonatedPackages(campaign.id);
        fetchAllUpdates(campaign.id);
    }, []);

    return (
        <div style={{ margin: "1rem 4rem" }}>
            <Row gutter={[20, 20]}>
                <Col span={8}>
                    <Card>
                        <div className={classes.cardOrgStyle}>
                            <Avatar
                                className={classes.cardAvatarStyle}
                                size="small"
                                icon={<UserOutlined />}
                            />
                            {`${organisation.name}`}
                        </div>
                        <div className={classes.calendarStyle}>
                            <CalendarOutlined />
                            {`Period: ${campaignDatePeriod}`}
                        </div>
                        <div className={classes.cardProgressStyle}>
                            <div className={classes.itemCounter}>
                                {`${donationStats.totalItems} items collected from ${donationStats.totalDonors} donors`}
                            </div>
                            <div style={{ fontWeight: "bold" }}>
                                Campaign Progress
                            </div>
                            <Progress
                                percent={campaignProgress}
                                size="small"
                                status="active"
                                showInfo={false}
                            />
                            <div className={classes.progressCounter}>
                                {`${campaignDaysLeft} Days Left`}
                            </div>
                        </div>
                    </Card>
                    <Link to={`/campaigns/${campaign.id}/donate`}>
                        <Button
                            style={{
                                marginTop: "1rem",
                                height: "3rem",
                                fontSize: "1.5rem",
                            }}
                            type="primary"
                            block
                            disabled={isOrg}
                        >
                            Donate Now
                        </Button>
                    </Link>
                </Col>
                <Col span={16}>
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
                                                height: "100%",
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
            <Divider>Campaign Overview</Divider>
            <Row gutter={[20, 20]} justify="space-evenly">
                <Col span={11}>
                    <div className={classes.cardHeader}>About Campaign</div>
                    <div className={classes.cardDescStyle}>
                        {campaign.description}
                    </div>
                </Col>
                <Col span={1} style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: "100%" }} />
                </Col>
                <Col span={11}>
                    {/* <div className={classes.cardHeader}>Campaign Timeline</div>
                    <Timeline style={{ margin: "2rem 0" }} mode="left">
                        <Timeline.Item color="green">
                            2022-05-11 Start Campaign
                        </Timeline.Item>
                        <Timeline.Item>
                            2022-07-11 Stage 1: Set up logistic line with
                            receipient country
                        </Timeline.Item>
                        <Timeline.Item color="gray">
                            2022-09-11 Stage 2: Send first batch of donor items
                            to receipients
                        </Timeline.Item>
                        <Timeline.Item color="gray">
                            2022-12-31 Stage 3: Complete donation campaign
                        </Timeline.Item>
                    </Timeline>
                    <Divider /> */}
                    <div className={classes.cardHeader}>Latest Updates</div>
                    <List
                        style={{ height: "25rem", overflow: "auto" }}
                        itemLayout="horizontal"
                        dataSource={updates}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.postTitle}
                                    description={item.postDescription}
                                />
                                {item.content}
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Divider />
            <Row gutter={[20, 20]} justify="space-evenly">
                <Col span={14}>
                    <div className={classes.cardHeader}>About Organisation</div>
                    <div className={classes.cardDescStyle}>
                        {organisation.description}
                    </div>
                </Col>
                <Col span={1} style={{ textAlign: "center" }}>
                    <Divider type="vertical" style={{ height: "100%" }} />
                </Col>
                <Col span={8}>
                    <Card title={"Contact Us"} size="small">
                        <Row gutter={[10, 10]}>
                            <Col style={{ textAlign: "right" }} span={5}>
                                Phone:
                            </Col>
                            <Col
                                span={19}
                            >{`+${organisation.phoneCC} ${organisation.phoneNo}`}</Col>
                        </Row>
                        <Row gutter={[10, 10]}>
                            <Col style={{ textAlign: "right" }} span={5}>
                                Email:
                            </Col>
                            <Col span={19}>{organisation.email}</Col>
                        </Row>
                        <Row gutter={[10, 10]}>
                            <Col style={{ textAlign: "right" }} span={5}>
                                Address:
                            </Col>
                            <Col span={19}>{organisation.address}</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CampaignModal;
