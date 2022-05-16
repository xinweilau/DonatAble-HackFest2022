import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Row, Col, Card, message } from "antd";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";

const { TextArea } = Input;

export const AddPost = () => {
    const { campaignId } = useParams();

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState("horizontal");

    const onCancel = () => {
        navigate(-1);
    };

    const onFormComplete = (values) => {
        message.loading({ content: "Posting...", key: "posting" }, 0);
        db.collection("Campaigns")
            .doc(campaignId)
            .collection("Posts")
            .add(values)
            .then(() => {
                message.success({
                    content: "Post added successfully",
                    key: "posting",
                });
                navigate(-1);
            })
            .catch(() => {
                message.error({ content: "Error adding post", key: "posting" });
            });
    };

    const formItemLayout =
        formLayout === "horizontal"
            ? {
                  labelCol: {
                      span: 4,
                  },
                  wrapperCol: {
                      span: 20,
                  },
              }
            : null;

    const buttonItemLayout =
        formLayout === "horizontal"
            ? {
                  wrapperCol: {
                      span: 20,
                      offset: 4,
                  },
              }
            : null;
    return (
        <>
            <OrganisationLayout>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <Card title={"Add Campaign Post"} style={{ width: "60%" }}>
                        <Form
                            {...formItemLayout}
                            layout={formLayout}
                            form={form}
                            initialValues={{
                                layout: formLayout,
                            }}
                            onFinish={onFormComplete}>
                            <Form.Item
                                label="Post Title"
                                name="postTitle"
                                rules={[{ required: true }]}>
                                <Input placeholder="Enter Post Title" />
                            </Form.Item>
                            <Form.Item
                                label="Post Description"
                                name="postDescription"
                                rules={[{ required: true }]}>
                                <TextArea
                                    rows={4}
                                    placeholder="Enter Post Description"
                                />
                            </Form.Item>
                            <Form.Item {...buttonItemLayout}>
                                <Row justify="end" gutter={[10]}>
                                    <Col>
                                        <Button
                                            type="primary"
                                            htmlType="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={onCancel}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </OrganisationLayout>
        </>
    );
};
