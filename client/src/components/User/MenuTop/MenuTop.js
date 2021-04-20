import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";
import axios from "axios";
import {IP_SERVER, PORT} from "../../../api/cofig"
//CSS
import "./MenuTop.css";

//Bootstrap
import { Nav, Navbar } from "react-bootstrap";

//Antd
import { Popconfirm, message, Button, notification, Modal } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default class MenuTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      user: "",
    };
  }

  logOut = () => {
    logOutApi();
    window.location.reload();
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    this.logOut();
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  LoadData() {
    const formData = new FormData();
    formData.append("Token", localStorage.getItem("authToken"));
    formData.append("tipo", "profile");

    axios
      .get(`http://${IP_SERVER}:${PORT}/profile`, {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        this.setState({
          user: response.data.usuario,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.LoadData();
  }

  render() {
    return (
      <div>
        <div className="btn-power">
          <Button type="link" onClick={this.showModal}>
            <PoweroffOutlined style={{ fontSize: "25px", color: "red" }} />
          </Button>
        </div>
        <Modal
          title="¿Deseas cerrar la sesión?"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="Confirmar"
          cancelText="Cancelar"
          onCancel={this.handleCancel}
          okButtonProps={{
            danger: true,
          }}
          cancelButtonProps={{ disabled: false }}
        >
          <p>
            {" "}
            <strong>Sesión actual: </strong> {this.state.user.email}
          </p>
        </Modal>
      </div>
    );
  }
  // <div className="btn-power">
  //   <Popconfirm
  //     title="¿Deseas cerrar sesión?"
  //     onConfirm={logOut}
  //     cancelText="No"
  //     okText="Sí"
  //   >
  //     <Button type="link">
  //       <PoweroffOutlined style={{ fontSize: "25px", color: "red" }} />
  //     </Button>
  //   </Popconfirm>
  // </div>
}
