import React from "react";
import axios from "axios";
import { Route, Link, Redirect } from "react-router-dom";
import LayoutUser from "../../layouts/LayoutUser";
import App from "../../App";
import "./AdminHome.css";
import { Container, Row, Col } from "react-bootstrap";

import {
  Table,
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
  Select,
} from "antd";

import {
  CheckCircleFilled,
  CloseCircleFilled,
  LockOutlined,
  SmileOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export default class AdminHome extends React.Component {
  constructor() {
    super();
    this.wrapper = React.createRef();
    this.state = {
      user: "",
      users: [],
      opcionSeleccionada: "",
      exitoso: false,
      email: "",
      userName: "",
      access: "",
      diskQuota: "",
      usedQuota: "",
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmEliminar = this.confirmEliminar.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  LoadData() {
    axios
      .get("http://localhost:4000/profile", {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        this.setState({
          user: response.data.usuario,
        });

        if (response.data.usuario.access > 1) {
          axios
            .get("http://localhost:4000/profile/usersList", {
              params: {
                Token: localStorage.getItem("authToken"),
              },
            })
            .then((response) => {
              this.setState({
                users: response.data,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.LoadData();
  }

  confirmEliminar = (record) => {
    this.handleDelete(record);
  };

  handleDelete(datos) {
    // e.preventDefault();

    const formData = new FormData();
    formData.append("_id", datos._id);

    if (datos.access < 2) {
      axios
        .post("http://localhost:4000/profile/delete", formData)
        .then((res) => {
          this.setState({
            exitoso: true,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            exitoso: false,
          });
        });

      if (this.state.exitoso === true) {
        notification["success"]({
          message: "Eliminación exitosa ",
          icon: <CheckCircleFilled style={{ color: "greenyellow" }} />,
        });
        this.LoadData();
        this.setState({
          exitoso: false,
        });
      } else {
        notification["error"]({
          message: "Ha ocurrido un error",
          icon: <CloseCircleFilled style={{ color: "red" }} />,
        });
      }
    } else {
      notification["error"]({
        message: "No puedes eliminar administradores",
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    }
  }

  handleUpdate() {
    const wemail = this.wrapper.current.getFieldValue("email");
    var waccess = this.wrapper.current.getFieldValue("access");
    const wdiskQuota = this.wrapper.current.getFieldValue("diskQuota");

    var numeros = false;

    if (!waccess) {
      waccess = this.state.access;
    }

    try {
      Number(wdiskQuota);
      numeros = true;
      if (isNaN(Number(wdiskQuota)) || isNaN(Number(waccess))) {
        numeros = false;
      }
    } catch (error) {
      console.log(error);
    }

    if (!numeros) {
      notification["error"]({
        message: "Debes ingresar valores numéricos",
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    } else if (!Number.isInteger(Number(waccess))) {
      notification["error"]({
        message: "El acceso debe ser un entero",
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    } else if (Number(waccess) < 0 || Number(waccess) > 2) {
      notification["error"]({
        message: "Debes ingresar un acceso entre 0 y 2",
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    } else if (wdiskQuota < this.state.usedQuota) {
      notification["error"]({
        message:
          "El espacio máximo debe ser igual o mayor al usado actualmente",
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    } else {
      axios
        .get("http://localhost:4000/profile/updateUser", {
          params: {
            email: wemail,
            access: waccess,
            diskQuota: wdiskQuota,
          },
        })
        .then(async (response) => {
          notification["success"]({
            message: "Actualización exitosa ",
            icon: <CheckCircleFilled style={{ color: "greenyellow" }} />,
          });
          this.LoadData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  showModal = (record) => {
    this.setState({
      visible: true,
    });

    this.setState({
      email: record.email,
      userName: record.userName,
      diskQuota: record.diskQuota,
      usedQuota: record.usedQuota,
      access: record.access,
    });

    if (this.wrapper.current) {
      this.wrapper.current.setFieldsValue({
        email: record.email,
        userName: record.userName,
        diskQuota: record.diskQuota,
      });
    }
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });

    this.handleUpdate();
    this.wrapper.current.resetFields();
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });

    this.wrapper.current.resetFields();
  };

  render() {
    const { Column, ColumnGroup } = Table;

    const { Option } = Select;

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    function cancel(e) {
      message.error("Click on No");
    }

    if (this.state.user.access < 2) {
      return (
        <>
          <Route path="/" component={App} />
          <Redirect to="/" component={App} />
        </>
      );
    }

    const convertir = (value) => {
      const bla = Number.parseFloat(value).toFixed(2);
      return bla;
    };

    const onRoleChange = (value) => {
      switch (value) {
        case "2":
          this.wrapper.current.setFieldsValue({
            access: 2,
          });
          return;

        case "1":
          this.wrapper.current.setFieldsValue({
            access: 1,
          });
          return;
        case "0":
          this.wrapper.current.setFieldsValue({
            access: 0,
          });
          return;
      }
    };

    return (
      <div>
        <Table dataSource={this.state.users}>
          <Column
            title="Nombre de usuario"
            dataIndex="userName"
            key="userName"
            render={(text) => <a>{text}</a>}
          />
          <Column title="Email" dataIndex="email" key="email" />
          <Column
            title="Cuota de disco"
            dataIndex="diskQuota"
            key="diskQuota"
            render={(diskQuota) => {
              return <span>{diskQuota} GB</span>;
            }}
          />
          <Column
            title="Cuota usada"
            dataIndex="usedQuota"
            key="usedQuota"
            render={(usedQuota) => {
              const format = convertir(usedQuota);
              return <span>{format} GB</span>;
            }}
          />
          <Column
            title="Nivel de acceso"
            dataIndex="access"
            key="access"
            render={(access) => {
              let color = access === 2 ? "geekblue" : "green";
              if (access === 0) {
                color = "volcano";
                return (
                  <Tag color={color} key={access}>
                    BLOQUEADO
                  </Tag>
                );
              } else if (access === 1) {
                return (
                  <Tag color={color} key={access}>
                    CLIENTE
                  </Tag>
                );
              } else {
                return (
                  <Tag color={color} key={access}>
                    ADMINISTRADOR
                  </Tag>
                );
              }
            }}
          />
          <Column
            title="Acción"
            dataIndex="userName"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <Button type="primary" onClick={() => this.showModal(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Confirma si deseas eliminar"
                  onConfirm={() => this.confirmEliminar(record)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>

        <Modal
          title="Editar datos del usuario"
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
              email: this.state.email,
              userName: this.state.userName,
              diskQuota: this.state.diskQuota,
              usedQuota: this.state.usedQuota,
            }}
            {...layout}
          >
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                disabled={true}
                style={{
                  backgroundColor: "rgba(223, 223, 223, 0.651)",
                  color: "black",
                }}
              />
            </Form.Item>
            <Form.Item
              label="Nombre de usuario"
              name="userName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                disabled={true}
                style={{
                  backgroundColor: "rgba(223, 223, 223, 0.651)",
                  color: "black",
                }}
              />
            </Form.Item>
            <Form.Item
              label="Nivel de acceso"
              name="access"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                placeholder="Selecciona el rol para el usuario"
                onChange={() => onRoleChange}
                allowClear
              >
                <Option value="2" style={{ color: "blue" }}>
                  Administrador
                </Option>
                <Option value="1" style={{ color: "green" }}>
                  Cliente
                </Option>
                <Option value="0" style={{ color: "tomato" }}>
                  Bloqueado
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Cuota de disco (GB)  "
              name="diskQuota"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
