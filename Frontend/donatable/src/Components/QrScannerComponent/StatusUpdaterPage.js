import React, { useState, useEffect } from "react";
import { OrganisationLayout } from "../Layout/OrganisationLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, Card, Row, Col } from "antd";
import { db } from "../../firebase";

const { Option } = Select;
function StatusUpdaterPage() {
    const [formLayout, setFormLayout] = useState("horizontal");
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const packageID = location.state.packageID;
    const [doc, setDoc] = useState(null); //use doc.data().remarks to get initial remarks etc, but only available after useeffect
    useEffect(() => {
        const fetch = async () => {
            db.collection("Packages")
                .doc(packageID)
                .get()
                .then((packageDoc) => {
                    setDoc(packageDoc);
                });
        };
        fetch();
    }, [packageID]);
    const submitForm = (data) => {
        db.collection("Packages").doc(packageID).update(data);
        navigate("../campaigns/org");
    };

    const formItemLayout =
        formLayout === "horizontal"
            ? {
                  labelCol: {
                      span: 2,
                  },
                  wrapperCol: {
                      span: 22,
                  },
              }
            : null;

    const buttonItemLayout =
        formLayout === "horizontal"
            ? {
                  wrapperCol: {
                      span: 24,
                      offset: 0,
                  },
              }
            : null;

    return (
        <OrganisationLayout>
            <div
                style={{
                    marginBottom: "2rem",
                    width: "60%",
                    margin: "auto",
                }}
            >
                <Card title={"Update Package Tracking Status"}>
                    <div
                        style={{
                            marginBottom: "2rem",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                        }}
                    >
                        Package ID: {packageID}
                    </div>
                    <Form
                        {...formItemLayout}
                        layout={formLayout}
                        form={form}
                        initialValues={{
                            layout: formLayout,
                        }}
                        onFinish={submitForm}
                    >
                        <Form.Item
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Status",
                                },
                            ]}
                            label="Status"
                        >
                            <Select>
                                <Option value="Awaiting Collection">
                                    Awaiting Collection
                                </Option>
                                <Option value="Collected">Collected</Option>
                                <Option value="In Transit">In Transit</Option>
                                <Option value="Distributed">Distributed</Option>
                                <Option value="Returned">Returned</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="remarks" label="Remarks">
                            <Input.TextArea
                                rows={4}
                                placeholder="Enter remarks, if any"
                            />
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Row justify="center">
                                <Col>
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </OrganisationLayout>
    );
}
export default StatusUpdaterPage;
