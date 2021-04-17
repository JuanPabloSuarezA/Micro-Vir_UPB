import React from "react";
import axios from "axios";
import { Route, Link, Redirect } from "react-router-dom";
import LayoutUser from "../../layouts/LayoutUser";
import App from "../../App";
import "./AdminHome.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  notification,
} from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

export default class AdminHome extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      users: [],
      opcionSeleccionada: "",
      exitoso: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmEliminar = this.confirmEliminar.bind(this);
  }
  LoadData() {
    const formData = new FormData();
    formData.append("Token", localStorage.getItem("authToken"));
    formData.append("tipo", "profile");

    axios
      .post("http://localhost:4000/profile", formData)
      .then((res) => {
        this.setState({
          user: res.data.usuario,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post("http://localhost:4000/profile/usersList", formData)
      .then((res) => {
        this.setState({
          users: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.LoadData();
  }

  confirmEliminar = (record) => {
    console.log(record);
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

  render() {
    if (this.state.user.access < 2) {
      return (
        <>
          <Route path="/" component={App} />
          <Redirect to="/" component={App} />
        </>
      );
    }

    const { Column, ColumnGroup } = Table;

    function cancel(e) {
      console.log(e);
      message.error("Click on No");
    }

    return (
      <div>
        <Table
          // columns={columns}
          dataSource={this.state.users}
          // onRow={(record, rowIndex) => {
          //   // console.log(record);
          //   return {
          //     onClick: (e) => {
          //       // console.log(e);
          //       if (e.target.innerText === "Eliminar") {
          //         console.log("Exito BORRADO");
          //         // this.handleDelete(e, record);
          //       } else if (e.target.innerText === "Editar") {
          //         console.log("Exito editado");
          //       }
          //     },
          //   };
          // }}
        >
          <Column
            title="Nombre de usuario"
            dataIndex="userName"
            key="userName"
            render={(text) => <a>{text}</a>}
          />
          <Column title="Email" dataIndex="email" key="email" />
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
                <Button type="primary">Editar</Button>
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
      </div>
    );
  }
}
