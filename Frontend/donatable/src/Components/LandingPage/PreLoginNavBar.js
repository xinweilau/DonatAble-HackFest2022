import { Button, Row, Col } from "antd";
import logo from "../../logo.svg";
function PreLoginNavBar(props) {
    return (
        <div>
            <Row>
                <Col span={8}></Col>
                <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                        <img src={logo} style={{ width: "120px" }} />
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: "right" }}>
                        <Button type="link" onClick={props.showLoginModal}>
                            Log In
                        </Button>
                        <Button type="link" onClick={props.showSignUpModal}>
                            Sign Up
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default PreLoginNavBar;
