import { DonorLayout } from "../Layout/DonorLayout";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState,useEffect } from "react";
import { Table, Tag, Space, Button, Modal, Select } from "antd";
import UserForm from "./UserForm.js";
import classes from "./DonateCampaign.module.css";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {db, Firebase} from "../../firebase"


export function DonateCampaign() {
    const {id:campaignID}=useParams()
   
    const [data, setData] = useState([]);
    const [dropOff, setDropOff] = useState("");
    const [options,setOptions]=useState([]);
    const [campName,setCampName]=useState("")
    const [cat,setCat]=useState([])
    const [count, setCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDropOff, setIsDropOff] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        db.collection("Campaigns").doc(campaignID).get().then((doc)=>{
            const array=doc.data().collPoints
            const catArray=doc.data().categories
            const tempOptions=[]
            const tempCat=[]
            for (const x in array){
                tempOptions.push({label:array[x],value:array[x]})
            }
            for (const x in catArray){
                tempCat.push({label:catArray[x], value:catArray[x]})
            }
            setOptions(tempOptions)
            setCampName(doc.data().campaignName)
            setCat(tempCat)
        })
    },[])
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleAdd = (props) => {
        setIsModalVisible(false);
        const newData = {
            key: count,
            ...props,
        };
        setData([...data, newData]);
        setCount(count + 1);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = (record) => {
        setData((pre) => {
            return pre.filter((x) => x.key !== record.key);
        });
    };

    const showDropOff = () => {
        setIsDropOff(true);
    };

    const cancelDropOff = () => {
        setIsDropOff(false);
    };

    const onChange = (value) => {
        setDropOff(value);
    };

    const handleConfirmation = () => {
        let newPackageRef= db.collection('Packages').doc()
        newPackageRef.set({
            campaignID:campaignID, //to get from props
            donorID: Firebase.auth().currentUser.uid,
            status:"Awaiting Collection",
            dropOffPoint:dropOff,
            remarks:""
        })
        let itemsRef=db.collection('Packages/'+newPackageRef.id+'/Items')
        data.map((oneItem)=>{
            delete oneItem['key']
            itemsRef.add(oneItem)
        })

        setIsDropOff(false);
        navigate("dropoff",{state:{packageID:newPackageRef.id}});
    };

    const columns = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            key: "itemName",
            width: "25rem",
        },
        {
            title: "Item Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: "8rem",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (tags) => (
                <>
                    {tags.map((tag) => (
                        <Tag color="blue" key={tag}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
            width: "35rem",
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <a>
                        <EditOutlined />
                    </a>
                    <a>
                        <DeleteOutlined onClick={() => handleDelete(record)} />
                    </a>
                </Space>
            ),
            width: "5rem",
        },
    ];

    return (
        <>
            <Modal
                title={"Add Donation Item"}
                visible={isModalVisible}
                width={"50rem"}
                okText="Add Item"
                cancelText="Cancel"
                footer={null}
                onCancel={handleCancel}
            >
                <UserForm onSubmit={handleAdd} onCancel={handleCancel} categories={cat}/>
            </Modal>
            <Modal
                title={"Drop Off Point"}
                visible={isDropOff}
                width={"20rem"}
                okText="Confirm"
                cancelText="Cancel"
                onCancel={cancelDropOff}
                onOk={handleConfirmation}
            >
                <h4>Select Drop Off Point</h4>
                <Select
                    style={{ width: "100%", marginTop: "0.2rem" }}
                    options={options}
                    onChange={onChange}
                    placeholder="Select drop off point"
                />
            </Modal>
            <DonorLayout>
                <div className={classes.header}>
                    You are donating to {campName}
                </div>
                <div className={classes.addBtnStyle}>
                    <Button onClick={showModal} block>
                        <PlusOutlined /> Add Item
                    </Button>
                </div>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{ position: ["none", "none"] }}
                    bordered
                />
                <div className={classes.confirmBtnStyle}>
                    <Button onClick={showDropOff} type="primary">
                        Confirm Donations
                    </Button>
                </div>
            </DonorLayout>
        </>
    );
}
