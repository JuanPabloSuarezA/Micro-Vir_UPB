import React from "react";
import axios from "axios";
import { Route, Link, Redirect } from "react-router-dom";
import LayoutUser from "../../layouts/LayoutUser";
import App from "../../App";
import "./AdminHome.css";
import { Container, Row, Col } from "react-bootstrap";
import { Table, Tag, Space, Button } from "antd";

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
        console.log(res.data.usuario);
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

  handleDelete(e, datos) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_id", datos._id);

    if (datos.access < 2) {
      axios
        .post("http://localhost:4000/profile/delete", formData)
        .then((res) => {
          this.setState({
            exitoso: true,
          });
          console.log(this.state.exitoso);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    window.location.reload();
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

    const columns = [
      {
        title: "Nombre de usuario",
        dataIndex: "userName",
        key: "userName",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      // {
      //   title: "Cuota de disco",
      //   dataIndex: "diskQuota",
      //   key: "diskQuota",
      // },
      {
        title: "Nivel de acceso",
        key: "access",
        dataIndex: "access",
        render: (access) => {
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
        },
      },
      {
        title: "Acción",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Button type="primary" danger>
              Eliminar
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.users}
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
                this.handleDelete(e, record);
              },
            };
          }}
        />
      </div>
    );
  }
}
