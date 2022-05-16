import React, { useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
function SignUpCard(props) {
    const isOrg = props.isOrg;
    useEffect(() => {}, [isOrg]);
    if (props.isOrg === false) {
        return (
            <div>
                <Card>
                    <Form
                        initialValues={{ remember: false }}
                        onFinish={props.signUpDonor}
                    >
                        <Form.Item
                            name="donorUserSign"
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
                            name="donorPassSign"
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
                            name="donorCfmPassSign"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Confirm Password!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                            />
                        </Form.Item>
                        <Form.Item style={{ margin: "1rem 1rem" }}>
                            <Button type="primary" htmlType="submit" block>
                                Sign Up
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
                        onFinish={props.signUpOrg}
                    >
                        <Form.Item
                            name="orgUserSign"
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
                            name="orgPassSign"
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
                            name="orgCfmPassSign"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Confirm Password!",
                                },
                            ]}
                            style={{ margin: "1rem 1rem" }}
                        >
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                            />
                        </Form.Item>
                        <Form.Item style={{ margin: "1rem 1rem" }}>
                            <Button type="primary" htmlType="submit" block>
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default SignUpCard;
