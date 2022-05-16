import { Modal, Table, Tag } from "antd";
import React, { useState } from "react";
import { Firebase, db } from "../../firebase.js";

function PackageItems(props) {
    const { modalContent, toggleModal, modalVisible } = props;

    const columns = [
        {
            title: "Item Name",
            dataIndex: "itemName",
            key: "itemName",
            render: (text) => text,
            width: "15rem",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: "5rem",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (categories) => {
                return categories.map((category) => {
                    return (
                        <Tag color="blue" key={category}>
                            {category}
                        </Tag>
                    );
                });
            },
            width: "10rem",
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
            width: "15rem",
        },
    ];

    return (
        <Modal
            title="Package Item Details"
            visible={modalVisible}
            onCancel={toggleModal}
            footer={null}
            width={"50rem"}
        >
            <Table
                bordered
                columns={columns}
                dataSource={modalContent}
                pagination={{ pageSize: 10 }}
                size="small"
            />
        </Modal>
    );
}

export default PackageItems;
