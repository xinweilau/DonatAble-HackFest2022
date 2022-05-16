import classes from "./campaignsDashPage.module.css";
import React from "react";
import { Layout, Row, Col, Card, Progress, Carousel, Avatar, Space, DatePicker } from 'antd';
import {
    UserOutlined, EditOutlined
} from "@ant-design/icons";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import moment from 'moment';

const { Meta } = Card;
const contentStyle = {
    height: '250px',
    textAlign: 'center',
    background: '#364d79',
    color: '#fff',
    lineHeight: '250px',
};

const dateFormat = 'YYYY/MM/DD';

export function CampaignDetails({children}) {
    const { RangePicker } = DatePicker;
    return (
    <OrganisationLayout>
        <Layout.Content className={classes.contentWrapper}>
            <Row align="left">{children}</Row>
            <Row justify="center" gutter={[50,50]}>
                <Col className="gutter-row">
                    <Card
                        hoverable
                        style={{ width: 400 }}
                        cover={<Carousel autoplay>
                            <div>
                            <h3 style={contentStyle}>1</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>2</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>3</h3>
                            </div>
                            <div>
                            <h3 style={contentStyle}>4</h3>
                            </div>
                        </Carousel>}
                    >
                        <div className={classes.cardOrgStyle}><Avatar className={classes.cardAvatarStyle} size="small" icon={<UserOutlined />} />Organisation Name</div>
                        <div>
                            <Meta title="Campaign Name"/>
                            <EditOutlined />
                        </div>
                        <div>
                            <Space direction="vertical" size={3}>
                                <Meta title="Campaign Duration" description={
                                        <RangePicker 
                                            defaultValue={[moment('2022/05/11', dateFormat), moment('2022/12/31', dateFormat)]}
                                            format={dateFormat}
                                        />
                                }/>
                            </Space>
                        </div>
                        <div className={classes.cardDescStyle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <EditOutlined/></div>
                        <div className={classes.cardProgressStyle}>
                            <div>Campaign Progress</div>
                            <Progress  percent={50} size="small" status="active" showInfo={false}/>
                            <div className={classes.progressCounter}>50 Days Left</div>
                        </div>
                    </Card>
                </Col>
            </Row>
            
            
        </Layout.Content>
    </OrganisationLayout>)
};