import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Row, Col ,Select} from "antd";





const UserForm = ({ onSubmit, onCancel ,categories}) => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState("horizontal");
    const options=categories
    const onChange = (value) => {
        console.log(value);
    };

    const onFormLayoutChange = ({ layout }) => {
        setFormLayout(layout);
    };

    const formSubmit = (values) => {
        form.resetFields();
        onSubmit(values);
    };

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 19,
        },
    };

    return (
        <Form
            {...formItemLayout}
            layout={formLayout}
            form={form}
            onFinish={formSubmit}
            initialValues={{
                layout: formLayout,
            }}
            onValuesChange={onFormLayoutChange}
        >
            <Form.Item label="Item Name" name="itemName">
                <Input placeholder="Enter name of item" />
            </Form.Item>
            <Form.Item label="Item Quantity" name="quantity">
                <InputNumber
                    style={{ width: "10rem" }}
                    placeholder="Enter item quantity"
                />
            </Form.Item>
            <Form.Item label="Category" name="category">
                <Select
                    style={{ width: "100%" }}
                    options={options}
                    onChange={onChange}
                    mode="multiple"
                    placeholder="Select item categories"
                />
            </Form.Item>
            <Form.Item label="Remarks" name="remarks">
                <Input.TextArea rows={4} placeholder="Enter remarks, if any" />
            </Form.Item>
            <Form.Item>
                <Row gutter={[10]}>
                    <Col
                        span={15}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={onCancel}>Cancel</Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
