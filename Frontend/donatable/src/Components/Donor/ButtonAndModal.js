import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import { Firebase, db } from "../../firebase.js";
const { Column } = Table;

function ButtonAndModal(props) {
    const [visible, setVisible] = useState(false);
    const [itemData, setItemData] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            db.collection("Packages/" + props.packageID + "/Items")
                .get()
                .then((QuerySnapshot) => {
                    QuerySnapshot.forEach((DocumentSnapshot) => {
                        setItemData([...itemData, DocumentSnapshot.data()]);
                    });
                });
        };

        fetch();
    }, []);
    const showModal = () => {
        setVisible(true);
    };
    const hideModal = () => {
        setVisible(false);
    };
    return (
        <>
            <Button type="text" onClick={showModal}>
                {props.packageID}
            </Button>
            <Modal
                footer={null}
                title="Package Item Details"
                visible={visible}
                onCancel={hideModal}
                width={"40rem"}
                centered
                style={{ margin: "5rem" }}
            >
                <Table
                    bordered
                    dataSource={itemData}
                    size="small"
                    pagination={{ pageSize: 10 }}
                >
                    <Column
                        title="Item Name"
                        dataIndex="itemName"
                        key="itemName"
                    />
                    <Column
                        title="Quantity"
                        dataIndex="quantity"
                        key="quantity"
                        width="6rem"
                    />
                    <Column
                        title="Remarks"
                        dataIndex="remarks"
                        key="remarks"
                        width="14rem"
                    />
                </Table>
            </Modal>
        </>
    );
}
export default ButtonAndModal;
