import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
//Antd
import "antd/lib/notification/style/css";
import { Popconfirm, message, Button, notification, Space, Modal } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class VideoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idVideo: this.props.match.params.idVideo,
      videoInfo: "",
      sizeVideo: "",
      videoDelete: false,
      visible: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  async componentDidMount() {
    try {
      const res = await fetch(
        `http://localhost:4000/videos/${this.state.idVideo}/videoInfo`
      ).then((response) => {
        return response.json();
      });
      this.setState({ videoInfo: res, sizeVideo: res.size });
    } catch (err) {
      console.log(err);
    }
    console.log(this.state.videoInfo);
  }

  handleDelete(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/videos/${this.state.idVideo}/delete`, {
        params: {
          Token: localStorage.getItem("authToken"),
          sizeVideo: this.state.sizeVideo,
          id: this.state.idVideo,
        },
      })
      .then(async (response) => {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Éxito",
          description: "El video fue eliminado correctamente",
        });
        await this.setState({
          videoDelete: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleUpdate(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/videos/${this.state.idVideo}/update`, {
        params: {
          Token: localStorage.getItem("authToken"),
          title: this.state.videoInfo.name,
          description: "actualizado", //this.state.image.description,
          fileName: this.state.videoInfo.fileName,
          id: this.props.match.params.id,
        },
      })
      .then(async (response) => {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Éxito",
          description: "Los datos del video fueron actualizados correctamente",
        });
        this.componentDidMount();
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
      <div className="App">
        <header className="App-header">
          <div style={{ alignItems: "center" }}>
            <video
              controls
              autoPlay
              muted
              style={{ height: "350px", width: "600px" }}
            >
              <source
                src={`http://localhost:4000/videos/${this.state.idVideo}`}
                type="video/mp4"
              ></source>
            </video>
            <div
              style={{
                textAlign: "left",
                border: "solid black 1px",
                backgroundColor: "rgb(224, 224, 228)",
              }}
            >
              <h6>{"Título: " + this.state.videoInfo.name}</h6>
              <h6>{"Duración: " + this.state.videoInfo.duration}</h6>
              <h6>{"Descripción: " + this.state.videoInfo.description}</h6>
              <h6>{"Autor: " + this.state.videoInfo.author}</h6>
            </div>
            <hr></hr>

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

            {this.state.videoDelete ? <Redirect to={"/videos"} /> : null}
          </div>
        </header>
      </div>
    );
  }
}
