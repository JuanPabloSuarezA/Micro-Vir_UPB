import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

//Antd
import "antd/lib/notification/style/css";
import { Popconfirm, message, Button, notification, Space, Modal } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class InfoImagen extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      image: "",
      imageDelete: false,
      visible: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  loadImage() {
    axios
      .get(`http://localhost:4000/image/${this.props.match.params.id}`, {
        params: {
          id: this.props.match.params.id,
        },
      })
      .then((response) => {
        this.setState({
          image: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.loadImage();
  }

  handleDelete(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/image/${this.props.match.params.id}/delete`, {
        params: {
          Token: localStorage.getItem("authToken"),
          imageSize: this.state.image.size,
          id: this.props.match.params.id,
        },
      })
      .then(async (response) => {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Éxito",
          description: "La imagen fue eliminada correctamente",
        });
        await this.setState({
          imageDelete: response.data,
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleUpdate(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/image/${this.props.match.params.id}/update`, {
        params: {
          Token: localStorage.getItem("authToken"),
          title: this.state.image.title,
          description: "actualizado", //this.state.image.description,
          fileName: this.state.image.fileName,
          id: this.props.match.params.id,
        },
      })
      .then(async (response) => {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Éxito",
          description:
            "Los datos de la imagen fueron actualizados correctamente",
        });
        this.loadImage();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div style={{ paddingLeft: "100px" }}>
        <div className="card" style={{ width: "18rem" }}>
          <h1>{console.log(this.state.image)}</h1>
          <img
            src={`http://localhost:4000/images/${this.state.image.fileName}`}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">
              {"Título: " + this.state.image.title}
            </h5>
            <h6>{"Descripción: " + this.state.image.description}</h6>
            <h6>{"Autor: " + this.state.image.author}</h6>

            <Space size="middle">
              <Button type="primary" onClick={this.showModal}>
                Editar
              </Button>

              <Popconfirm
                title="Confirma si deseas eliminar"
                onConfirm={this.handleDelete}
                okText="Sí"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            </Space>

            <Modal
              title="Editar video"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okButtonProps={{ disabled: false }}
              cancelButtonProps={{ disabled: false }}
            >
              <p>Eeeee</p>
            </Modal>
          </div>
          {this.state.imageDelete ? <Redirect to={"/"} /> : null}
        </div>
      </div>
    );
  }
}
