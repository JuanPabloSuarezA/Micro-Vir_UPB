import React from "react";
import "./PerfilComponent.css";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import userLogo from "../../assets/icons/userLogo.png";
import {IP_SERVER, PORT} from '../../api/cofig'
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
      diskQuotaa: "",
    };

    this.LoadProfile = this.LoadProfile.bind(this);
  }
  LoadProfile() {
    axios
      .get(`http://${IP_SERVER}:${PORT}/profile`, {
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

        const bla = Number.parseFloat(this.state.user.usedQuota).toFixed(2);
        const bla2 = Number.parseFloat(this.state.user.diskQuota).toFixed(2);
        this.setState({
          maxShare: bla,
          diskQuotaa: bla2,
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
        .get(`http://${IP_SERVER}:${PORT}/profile/updateProfile`, {
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
                  <>{this.state.user.email}</>
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
                  label="Espacio usado"
                  span={1}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Badge color="yellow" status="processing" size="default" />
                  {this.state.maxShare + " GB"}
                </Descriptions.Item>

                <Descriptions.Item
                  label="Espacio máximo"
                  span={1}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Badge status="processing" size="default" />
                  {this.state.diskQuotaa + " GB"}
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
    );
  }
}
