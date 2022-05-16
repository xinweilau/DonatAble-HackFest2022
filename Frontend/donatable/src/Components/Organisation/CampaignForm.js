import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    message,
    DatePicker,
    Space,
    Alert,
    Spin,
    Upload,
    Select,
    Modal,
    Row,
    Col,
} from "antd";
import { DownOutlined, InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Firebase, db, storageRef } from "../../firebase.js";

const { Option } = Select;

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const CampaignForm = ({ data, onSubmit }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const [formLayout, setFormLayout] = useState("horizontal");
    const [fileList, setFileList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(false);
    const [previewTitle, setPreviewTitle] = useState(false);

    const onCancel = () => {
        navigate(-1);
    };

    const locations = [
        {
            label: "Sembawang",
            value: "Sembawang",
        },
        {
            label: "Serangoon",
            value: "Serangoon",
        },
        {
            label: "Chinatown",
            value: "Chinatown",
        },
    ];

    useEffect(() => {
        if (data !== undefined) {
            form.setFieldsValue(data);
        }
    }, [form, data]);

    const normFile = (e) => {
        console.log("Upload event:", e);

        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };

    const onFormComplete = async (values) => {
        try {
            setSubmitting(true);
            const organisationID = Firebase.auth().currentUser.uid;
            const campaignName = values.campaignName;
            const campaignDescription = values.campaignDescription;
            const collPoint = values.collectionPoint;
            const itemCategories = values.itemCategories;
            const campaignPeriod = values.campaignPeriod;
            const startDate = campaignPeriod[0].toDate();
            const endDate = campaignPeriod[1].toDate();

            const campaignRef = db.collection("Campaigns");

            let imageArray = [];
            console.log(fileList);

            await Promise.all(
                fileList.map(async (file) => {
                    const fileName = `uploads/images/${Date.now()}-${
                        file.name
                    }`;
                    const fileRef = storageRef.child(fileName);
                    try {
                        const designFile = await fileRef.put(
                            file.originFileObj
                        );
                        const downloadUrl =
                            await designFile.ref.getDownloadURL();
                        imageArray.push(downloadUrl);
                    } catch (e) {
                        console.log(e);
                    }
                })
            );

            console.log("Before image array??");
            console.log(imageArray);

            Promise.all(imageArray).then((res) => {
                console.log("after promises are made...");
                console.log(res);
            });

            let campaignData = {
                approval: true,
                organisationID: organisationID,
                campaignName: campaignName,
                campaignImage: imageArray,
                collPoints: collPoint,
                categories: itemCategories,
                description: campaignDescription,
                startDate: startDate,
                endDate: endDate,
            };

            await campaignRef.add(campaignData).then(() => {
                message.info("Campaign Created Successfully");
                navigate("/campaigns/org");
            });
        } catch (err) {
            console.log(err);
            message.error(`Error adding images.`, 2);
        } finally {
            setSubmitting(false);
        }
    };

    const beforeUpload = (file) => {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            message.error(`${file.name} is not a valid image type`, 2);
            return null;
        }
        return false;
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const handleChange = ({ fileList }) =>
        setFileList(fileList.filter((file) => file.status !== "error"));

    const onRemove = async (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);

        setFileList(newFileList);
    };

    const formItemLayout =
        formLayout === "horizontal"
            ? {
                  labelCol: {
                      span: 4,
                  },
                  wrapperCol: {
                      span: 14,
                  },
              }
            : null;

    const buttonItemLayout =
        formLayout === "horizontal"
            ? {
                  wrapperCol: {
                      span: 14,
                      offset: 4,
                  },
              }
            : null;

    return (
        <>
            {submitting && (
                <Spin tip="Loading...">
                    <Alert
                        message="Please wait for a moment"
                        description="We are creating your campaign"
                        type="info"
                    />
                </Spin>
            )}
            <Form
                {...formItemLayout}
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
                onFinish={onSubmit || onFormComplete}>
                <Form.Item
                    label="Name of campaign"
                    name="campaignName"
                    rules={[{ required: true }]}>
                    <Input placeholder="Enter name of campaign" />
                </Form.Item>
                {!onSubmit && (
                    <Form.Item label="Campaign Image" name="uploadedImages">
                        <Form.Item
                            name="campaignImage"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle>
                            <Upload.Dragger
                                name="files"
                                fileList={fileList}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                onRemove={onRemove}
                                multiple={true}
                                maxCount={4}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Click or drag file to this area to upload
                                </p>
                                <p className="ant-upload-hint">
                                    Support for a single or bulk upload.
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                )}
                <Form.Item
                    label="Campaign Description"
                    name="campaignDescription"
                    rules={[{ required: true }]}>
                    <Input placeholder="Enter details of campaign" />
                </Form.Item>
                <Form.Item
                    label="Campaign Period"
                    name="campaignPeriod"
                    rules={[{ required: true }]}>
                    <RangePicker />
                </Form.Item>
                <Form.Item
                    label="Campaign Collection Point"
                    name="collectionPoint"
                    rules={[{ required: true }]}>
                    {/* <Select placeholder="Type a collection point">
                        {locations.map((location) => {
                            return (
                                <Option key={location.value} value={location.value}>
                                    {location.label}
                                </Option>
                            );
                        })}
                    </Select> */}
                    <Select
                        mode="tags"
                        placeholder="Type a collection point"
                        tokenSeparators={[","]}
                        style={{ width: "100%" }}></Select>
                </Form.Item>
                <Form.Item
                    label="Accepted categories"
                    name="itemCategories"
                    rules={[{ required: true }]}>
                    <Select
                        mode="tags"
                        placeholder="Please select"
                        tokenSeparators={[","]}
                        style={{ width: "100%" }}></Select>
                </Form.Item>

                <Form.Item {...buttonItemLayout}>
                    <Row justify="end" gutter={[10]}>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={onCancel}>Cancel</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </>
    );
};

export default CampaignForm;
