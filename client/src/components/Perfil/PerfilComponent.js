import React from "react";
import "./PerfilComponent.css";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
//import userLogo from "../../assets/img/defUserLogo.png";
import { Button, Form, Input, notification } from "antd";
import {
  LockOutlined,
  SmileOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";

export default class PerfilComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      userName: "",
    };
  }
  LoadData() {
    const formData = new FormData();
    formData.append("Token", localStorage.getItem("authToken"));
    formData.append("tipo", "profile");

    axios
      .post("http://localhost:4000/profile", formData)
      .then((res) => {
        this.setState({
          user: res.data[0],
        });
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.LoadData();
  }

  render() {
    const rol = (valor) => {
      console.log(valor);
      if (valor === 1) {
        return "Cliente";
      } else {
        return "Administrador";
      }
    };

    const defLogo = (logo) => {
      if (logo) {
        return <img src={logo} alt="not found" />;
      }
      return (
        <img
          style={{ width: "150px", height: "150px", alignContent: "center" }}
          src={/*userLogo*/ null}
          alt="not found"
        />
      );
    };

    return (
      <Container className="perfil">
        <Row className="justify-content-md-center">
          <Col>
            {defLogo(this.state.user.logo)}
            <h3>
              <a>{this.state.user.userName}</a>
            </h3>
            <br></br>
            <p>
              <strong>Correo</strong>
              <br></br>
              {this.state.user.email}
            </p>
            <p>
              <strong>Nombres</strong>
              <br></br>
              {this.state.user.firstName}
            </p>
            <p>
              <strong>Apellidos</strong>
              <br></br>
              {this.state.user.lastName}
            </p>
            <p>
              <strong>Fecha de nacimiento </strong>
              <br></br>
              {this.state.user.birthDate}
            </p>

            <p>
              <strong>Tipo de acceso</strong>
              <br></br>
              <a>{rol(this.state.user.access)}</a>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}
