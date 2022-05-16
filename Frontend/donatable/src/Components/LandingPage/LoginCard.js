import React, { useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
function LoginCard(props) {
    const isOrg = props.isOrg;
    useEffect(() => {}, [isOrg]);
    if (props.isOrg === false) {
        return (
            <div>
                <Card>
                    <Form
                        initialValues={{ remember: false }}
                        onFinish={props.loginDonor}
                    >
                        <Form.Item
                            name="donorUserLog"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Email!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input placeholder="Email Address" />
                        </Form.Item>
                        <Form.Item
                            name="donorPassLog"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            style={{
                                margin: "1rem 1rem",
                            }}
                        >
                            <Button type="primary" htmlType="submit" block>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    } else {
        return (
            <div>
                <Card>
                    <Form
                        initialValues={{ remember: false }}
                        onFinish={props.loginOrg}
                    >
                        <Form.Item
                            name="orgUserLog"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your Organisational Email!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input placeholder="Organisational Email Address" />
                        </Form.Item>
                        <Form.Item
                            name="orgPassLog"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item style={{ margin: "1rem 1rem" }}>
                            <Button type="primary" htmlType="submit" block>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default LoginCard;
