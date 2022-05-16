import React, { useEffect, useRef, useState } from "react";
import {
    Layout,
    Modal,
    Segmented,
    Carousel,
    Row,
    Col,
    Divider,
    message,
    Button,
} from "antd";
import PreLoginNavBar from "./PreLoginNavBar";
import LoginCard from "./LoginCard";
import SignUpCard from "./SignUpCard";
import LandingCampaignCard from "../campaignCard/landingCampaignCard";
import {
    CaretLeftFilled,
    CaretRightFilled,
    UserOutlined,
    BankOutlined,
} from "@ant-design/icons";

import classes from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";
import { Firebase, db } from "../../firebase.js";

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                color: "black",
                fontSize: "0px",
                lineHeight: "0px",
            }}
            onClick={onClick}>
            <CaretRightFilled className={classes.arrowStyle} />
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                color: "black",
                fontSize: "0px",
                lineHeight: "0px",
            }}
            onClick={onClick}>
            <CaretLeftFilled className={classes.arrowStyle} />
        </div>
    );
};

function LandingPage(props) {
    const [isLogin, setIsLogin] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOrg, setIsOrg] = useState(false);

    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        db.collection("Campaigns")
            .where("approval", "==", true)
            .get()
            .then((QuerySnapshot) => {
                const campaigns = [];
                QuerySnapshot.forEach((DocumentSnapshot) => {
                    const campaign = DocumentSnapshot.data();
                    campaign.id = DocumentSnapshot.id;
                    campaigns.push(campaign);
                });

                const help = campaigns.map((c) => {
                    return <LandingCampaignCard key={c.id} campaign={c} />;
                });

                setCampaigns(() => {
                    return (
                        <Carousel
                            autoplay
                            arrows
                            nextArrow={<NextArrow />}
                            prevArrow={<PrevArrow />}>
                            {help}
                        </Carousel>
                    );
                });
            });
    }, []);

    const navigate = useNavigate();

    const showLoginModal = () => {
        setIsLogin(true);
    };

    const showSignUpModal = () => {
        setIsSignUp(true);
    };

    const hideLoginModal = () => {
        setIsLogin(false);
        setIsOrg(false);
    };

    const hideSignUpModal = () => {
        setIsSignUp(false);
        setIsOrg(false);
    };

    const checkEmailPasswordInput = (email, password) => {
        if (email.length > 0 && password.length > 0) {
            return true;
        }
    };

    const loginDonor = (event) => {
        const email = event.donorUserLog;
        const password = event.donorPassLog;
        let validInput = checkEmailPasswordInput(email, password);
        if (validInput) {
            Firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    const uid = res.user.uid;
                    const userRef = Firebase.firestore().collection("Donor");
                    userRef
                        .doc(uid)
                        .get()
                        .then((firestoreDoc) => {
                            if (!firestoreDoc.exists) {
                                message.info("User does not exist");
                            } else {
                                // const user = firestoreDoc.data();
                                navigate("/campaigns");
                                message.info("User logged in successfully!");
                            }
                        });
                });
            return;
        }
    };
    const loginOrg = (event) => {
        const email = event.orgUserLog;
        const password = event.orgPassLog;
        let validInput = checkEmailPasswordInput(email, password);
        if (validInput) {
            Firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    const uid = res.user.uid;
                    const userRef =
                        Firebase.firestore().collection("Organisations");
                    userRef
                        .doc(uid)
                        .get()
                        .then((firestoreDoc) => {
                            if (!firestoreDoc.exists) {
                                message.info("User does not exist");
                            } else {
                                // const user = firestoreDoc.data();
                                navigate("/campaigns/org");
                                message.info("User logged in successfully!");
                            }
                        });
                });
            return;
        }
    };
    const checkPassword = (p1, p2) => {
        return p1 === p2;
    };
    const signUpDonor = (event) => {
        const email = event.donorUserSign;
        const password = event.donorPassSign;
        const cfmPassword = event.donorCfmPassSign;
        let validPassword = checkPassword(password, cfmPassword);
        console.log(validPassword);
        if (validPassword) {
            Firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    const uid = res.user.uid;
                    const data = {
                        id: uid,
                        email: email,
                    };
                    const donerRef = db.collection("Donor");
                    donerRef
                        .doc(uid)
                        .set(data)
                        .then(() => {
                            navigate("/campaigns");
                        });
                });
        }
        return;
    };
    const signUpOrg = (event) => {
        const email = event.orgUserSign;
        const password = event.orgPassSign;
        const cfmPassword = event.orgCfmPassSign;
        let validPassword = checkPassword(password, cfmPassword);
        console.log(validPassword);
        if (validPassword) {
            Firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    const uid = res.user.uid;
                    const data = {
                        id: uid,
                        email: email,
                    };
                    const donerRef = db.collection("Organisations");
                    donerRef
                        .doc(uid)
                        .set(data)
                        .then(() => {
                            navigate("/campaigns");
                        });
                });
        }
        return;
    };

    const toggleView = (value) => {
        if (value === "Donor") setIsOrg(false);
        else setIsOrg(true);
    };
    const { Header, Content } = Layout;
    return (
        <div>
            <Layout style={{ backgroundColor: "white" }}>
                <Header
                    style={{
                        backgroundColor: "white",
                        boxShadow:
                            "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                        position: "fixed",
                        width: "100%",
                        zIndex: 1,
                    }}>
                    <PreLoginNavBar
                        showSignUpModal={showSignUpModal}
                        showLoginModal={showLoginModal}
                    />
                </Header>
                <Row
                    justify="center"
                    className={classes.bgImg}
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)",
                    }}>
                    <Col>
                        <div className={classes.introMsg1}>
                            In the mood of giving?
                        </div>
                        <div className={classes.introMsg2}>
                            DonatAble is your one-stop platform to exploring the
                            giving side of you
                        </div>
                        <div className={classes.introMsg3}>
                            Explore over{" "}
                            <span className={classes.subMsg}>
                                300 ongoing donation campaigns
                            </span>{" "}
                            held by over{" "}
                            <span className={classes.subMsg}>
                                200 organisations
                            </span>{" "}
                            all over the world
                        </div>
                        <div className={classes.introMsg5}>
                            <Button
                                onClick={showSignUpModal}
                                type={"primary"}
                                shape={"round"}
                                className={classes.buttonStyle}>
                                Become a giver today!
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Content className={classes.pageStyle}>
                    <Modal
                        visible={isLogin}
                        footer={null}
                        onCancel={hideLoginModal}
                        destroyOnClose
                        closable={false}>
                        <Segmented
                            block
                            options={[
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <UserOutlined
                                                style={{
                                                    marginRight: "0.5rem",
                                                }}
                                            />
                                            Donor
                                        </div>
                                    ),
                                    value: "Donor",
                                },
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <BankOutlined
                                                style={{
                                                    marginRight: "0.5rem",
                                                }}
                                            />
                                            Organisation
                                        </div>
                                    ),
                                    value: "Organisation",
                                },
                            ]}
                            onChange={toggleView}
                        />
                        <LoginCard
                            isOrg={isOrg}
                            loginDonor={loginDonor}
                            loginOrg={loginOrg}
                        />
                    </Modal>
                    <Modal
                        visible={isSignUp}
                        footer={null}
                        onCancel={hideSignUpModal}
                        destroyOnClose
                        closable={false}>
                        <Segmented
                            block
                            options={[
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <UserOutlined
                                                style={{
                                                    marginRight: "0.5rem",
                                                }}
                                            />
                                            Donor
                                        </div>
                                    ),
                                    value: "Donor",
                                },
                                {
                                    label: (
                                        <div style={{ padding: 4 }}>
                                            <BankOutlined
                                                style={{
                                                    marginRight: "0.5rem",
                                                }}
                                            />
                                            Organisation
                                        </div>
                                    ),
                                    value: "Organisation",
                                },
                            ]}
                            onChange={toggleView}
                        />
                        <SignUpCard
                            isOrg={isOrg}
                            signUpDonor={signUpDonor}
                            signUpOrg={signUpOrg}
                        />
                    </Modal>
                    <Divider />
                    <Row>
                        <Col className={classes.campaignHeader}>
                            Check out the popular campaigns right now!
                        </Col>
                    </Row>
                    <Row>
                        <Col>{campaigns}</Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
}
export default LandingPage;
