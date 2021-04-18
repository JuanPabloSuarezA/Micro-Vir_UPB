import React from "react";
import "./PerfilComponent.css";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import userLogo from "../../assets/icons/userLogo.png";
import {
  Popconfirm,
  message,
  Button,
  notification,
  Space,
  Modal,
  Form,
  Input,
  Checkbox,
  Descriptions,
  Badge,
  Tag,
  DatePicker,
} from "antd";

import {
  LockOutlined,
  SmileOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";

export default class PerfilComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      user: "",
      maxShare: "",
      userName: "",
      birthDate: "",
    };

    this.LoadProfile = this.LoadProfile.bind(this);
  }
  LoadProfile() {
    axios
      .get("http://localhost:4000/profile", {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        this.setState({
          user: response.data.usuario,
          maxShare: response.data.maxShare.toFixed(2),
          userName: response.data.usuario.userName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.LoadProfile();
  }

  handleUpdate(e) {
    e.preventDefault();

    const wuserName = this.wrapper.current.getFieldValue("userName");
    const wfirstName = this.wrapper.current.getFieldValue("firstName");
    const wlastName = this.wrapper.current.getFieldValue("lastName");
    const wbirthDate = this.state.birthDate;

    if (wuserName === "" || wfirstName === "" || wlastName === "") {
      notification.open({
        icon: <SmileOutlined rotate={180} />,
        message: "Error",
        description: "No puedes dejar campos vacíos",
      });
    } else {
      axios
        .get("http://localhost:4000/profile/updateProfile", {
          params: {
            Token: localStorage.getItem("authToken"),
            userName: wuserName,
            firstName: wfirstName,
            lastName: wlastName,
            birthDate: wbirthDate ? wbirthDate : this.state.user.birthDate,
          },
        })
        .then(async (response) => {
          notification.open({
            icon: <SmileOutlined rotate={180} />,
            message: "Éxito",
            description: "Tu información se actualizó correctamente",
          });
          this.LoadProfile();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.handleUpdate(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const rol = (valor) => {
      if (valor === 1) {
        return (
          <Tag color="green" key={valor}>
            CLIENTE
          </Tag>
        );
      } else {
        return (
          <Tag color="geekblue" key={valor}>
            ADMINISTRADOR
          </Tag>
        );
      }
    };

    const defLogo = (logo) => {
      if (logo) {
        return <img src={logo} alt="not found" />;
      }
      return (
        <img
          style={{
            width: "200px",
            height: "180px",
          }}
          src={userLogo}
          alt="not found"
        />
      );
    };

    const onFinish = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const dateChange = (date, dateString) => {
      this.setState({
        ...this.setState,
        birthDate: dateString,
      });
    };

    return (
      <div>
        <Container className="perfilContainer">
          <Row className="justify-content-md-center">
            <Col>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "inline-block" }}>
                  {defLogo(this.state.user.logo)}
                </span>
              </div>
              <h3>Mi perfil </h3>

              <Descriptions
                layout="vertical"
                bordered
                key={this.state.user.access}
              >
                <Descriptions.Item
                  label="Correo"
                  span={2}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {this.state.user.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Nombre de usuario"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {this.state.user.userName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Nombres"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {this.state.user.firstName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Apellidos"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {this.state.user.lastName}
                </Descriptions.Item>

                <Descriptions.Item
                  label="Fecha de nacimiento"
                  span={2}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {this.state.user.birthDate}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Cuota máxima"
                  span={2}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Badge status="processing" />
                  {this.state.maxShare >= 0
                    ? `Te quedan ${this.state.maxShare} Gb de espacio disponible.`
                    : `Te quedan 0.00 Gb de espacio disponible, elimina algunos archivos o cambia de plan.`}
                </Descriptions.Item>

                <Descriptions.Item
                  label="Tipo de acceso"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {rol(this.state.user.access)}
                </Descriptions.Item>
              </Descriptions>
              <br></br>
              <Button type="primary" onClick={this.showModal}>
                Editar
              </Button>
            </Col>
          </Row>
        </Container>

        <Modal
          title="Editar mis datos"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="Confirmar"
          cancelText="Cancelar"
          onCancel={this.handleCancel}
          okButtonProps={{
            disabled: false,
          }}
          cancelButtonProps={{ disabled: false }}
        >
          <Form
            ref={this.wrapper}
            name="control-ref"
            initialValues={{
              userName: this.state.user.userName,
              firstName: this.state.user.firstName,
              lastName: this.state.user.lastName,
              birthDate: this.state.user.birthDate,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            {...layout}
          >
            <Form.Item
              label="Nombre de usuario"
              name="userName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Nombres"
              name="firstName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Apellidos"
              name="lastName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Fecha de nacimiento"
              name="birthDate"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Space direction="vertical">
                <DatePicker
                  prefix={<SmileOutlined />}
                  name="birthDate"
                  placeholder=""
                  style={{ width: "315px" }}
                  onChange={dateChange}
                />
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      // <Container className="perfil">
      //   <Row className="justify-content-md-center">
      //     <Col>
      //       {defLogo(this.state.user.logo)}
      //       <h3>
      //         <a>{this.state.user.userName}</a>
      //       </h3>
      //       <br></br>
      //       <p>
      //         <strong>Correo</strong>
      //         <br></br>
      //         {this.state.user.email}
      //       </p>
      //       <p>
      //         <strong>Nombres</strong>
      //         <br></br>
      //         {this.state.user.firstName}
      //       </p>
      //       <p>
      //         <strong>Apellidos</strong>
      //         <br></br>
      //         {this.state.user.lastName}
      //       </p>
      //       <p>
      //         <strong>Fecha de nacimiento </strong>
      //         <br></br>
      //         {this.state.user.birthDate}
      //       </p>
      //       <p>
      //         <strong>Cuota máxima</strong>
      //         <br></br>
      //         {this.state.maxShare >= 0
      //           ? `Te quedan ${this.state.maxShare} Gb de espacio disponible.`
      //           : `Te quedan 0.00 Gb de espacio disponible, elimina algunos archivos o cambia de plan.`}
      //       </p>

      //       <p>
      //         <strong>Tipo de acceso</strong>
      //         <br></br>
      //         <a>{rol(this.state.user.access)}</a>
      //       </p>

      //       <Button type="primary" onClick={this.handleUpdate}>
      //         Editar
      //       </Button>
      //     </Col>
      //   </Row>
      // </Container>
    );
  }
}
