import React, { useEffect } from "react";
import classes from "./layout.module.css";
import { Avatar, Button, Dropdown, Layout, Menu, Space } from "antd";
import logo from "../../logo.svg";
import { Link, useLocation,useNavigate } from "react-router-dom";
import {
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Firebase, db } from "../../firebase.js";
import { message } from "antd";

const { Header, Content } = Layout;

export function DonorLayout({ children }) {

    const navigate = useNavigate();
    const location = useLocation();
    const options = [
        { key: "/campaigns", label: "Campaigns" },
        // { key: "/donations", label: "Track Donations" },
        { key: "/donations", label: "Track Donations" },
    ];

    const getUserName = () => {
        let uid = Firebase.auth().currentUser.uid;
        const userRef = db.collection("Donor").doc(uid);
        console.log(Firebase.auth().currentUser)
        userRef.get().then((doc) => {
            const userName = doc.data().name;
            return userName;
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        return Firebase.auth().currentUser.email
    }

    const signOut = () => {
        Firebase.auth().signOut().then((res) => {
            // Sign-out successful.
            navigate("/");
          }).catch((error) => {
            // An error happened.
            message.info(error);
          });
    }

    const menu = (
        <Menu
            items={[
                {
                    label: (
                        <Button type="link" style={{ color: "black" }} onClick={signOut}>
                            Logout
                        </Button>
                    ),
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    );

    return (
        <Layout style={{ backgroundColor: "white" }}>
            <Header className={classes.header}>
                <div className={classes.logo}>
                    <img src={logo} alt="logo" />
                </div>
                <Menu
                    style={{ borderBottom: 0, flexGrow: 1 }}
                    mode="horizontal"
                    defaultSelectedKeys={[location.pathname]}
                >
                    {options.map((option) => {
                        return (
                            <Menu.Item key={option.key}>
                                <Link to={option.key}>{option.label}</Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
                <Dropdown overlay={menu}>
                    <div className={classes.avatar}>
                        <Avatar size="medium" icon={<UserOutlined />} />
                        {getUserName()}
                    </div>
                </Dropdown>
            </Header>
            <Content style={{ width: "90%", margin: "auto", paddingTop: 100 }}>
                {children}
            </Content>
        </Layout>
    );
}
