import classes from "./campaignsDashPage.module.css";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase.js";
import {
    Layout,
    Row,
    Col,
    Input,
    Collapse,
    DatePicker,
    Select,
    Divider,
} from "antd";

import { DonorLayout } from "../Layout/DonorLayout";
import { CampaignCard } from "../campaignCard/campaignCard";
import { SearchOutlined } from "@ant-design/icons";
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

function callback(key) {
    console.log(key);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

export const DonorCampaignsDashPage = () => {
    const render = useRef(null); // used to prevent another instance of callback from being created when component updates
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        if (!render.current) {
            db.collection("Campaigns")
                .where("approval", "==", true)
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

    return (
        <DonorLayout>
            <Layout.Content className={classes.contentWrapper}>
                <Collapse
                    defaultActiveKey={["1"]}
                    onChange={callback}
                    style={{ margin: "1rem 0" }}>
                    <Panel header="Filter Campaigns" key="1">
                        <Row
                            justify="space-evenly"
                            gutter={[10, 10]}
                            align="middle">
                            <Col
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <span style={{ margin: "0 1rem" }}>Name:</span>
                                <Input
                                    placeholder="Search"
                                    suffix={
                                        <SearchOutlined
                                            style={{ color: "lightgrey" }}
                                        />
                                    }
                                    allowClear
                                />
                            </Col>
                            <Col>
                                <span style={{ margin: "0 1rem" }}>
                                    Date Range:
                                </span>
                                <RangePicker />
                            </Col>
                            <Col>
                                <span style={{ margin: "0 1rem" }}>
                                    Organisation:
                                </span>
                                <Select
                                    style={{ width: "15rem" }}
                                    onChange={handleChange}
                                    placeholder="Organisation"
                                    allowClear>
                                    <Option value="ymca">
                                        YMCA of Singapore
                                    </Option>
                                    <Option value="salvationarmy">
                                        Salvation Army
                                    </Option>
                                    <Option value="sgredcross">
                                        Singapore Red Cross Society
                                    </Option>
                                </Select>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
                <Divider />
                <div style={{ marginTop: "1rem ", marginBottom: "3rem" }}>
                    <Row justify="space-between" gutter={[50, 50]}>
                        {campaigns.map((campaign) => {
                            return (
                                <Col className="gutter-row" key={campaign.id}>
                                    <CampaignCard data={campaign} />
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            </Layout.Content>
        </DonorLayout>
    );
};

export default DonorCampaignsDashPage;
