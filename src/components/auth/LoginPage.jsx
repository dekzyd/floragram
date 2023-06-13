import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Auth } from "aws-amplify";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function LoginPage(props) {
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");

  console.log(props.isAuthenticated);

  const handleLogin = async () => {
    try {
      await Auth.signIn(username, password);

      props.updateAuthStatus(true);
      // navigate("/profile");
    } catch (err) {
      setIsError(err);
      console.log(err);
    }
  };

  return (
    <Container>
      <Row className="px-4 my-5">
        <Col>
          <h1>Login</h1>
          {isError && (
            <p
              style={{ color: "red", marginTop: "1rem", marginBottom: "-1rem" }}
            >
              {isError.message}. please try again.
            </p>
          )}
        </Col>
      </Row>
      <Row className="px-4 align-items-center g-5">
        {/* <Col sm={6} xs={4}>
          <Image src="/img/logo.png" fluid />
        </Col> */}
        <Col sm={6}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={(evt) => setUserName(evt.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                minLength="8"
                placeholder="Enter Password"
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleLogin}>
              Login &gt;&gt;
            </Button>
            &nbsp;&nbsp;
            <Link to="/register">
              <Button variant="outline-primary">Register</Button>
            </Link>
            &nbsp;&nbsp;
            <Link to="/">
              <Button variant="outline-primary">Cancel</Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
