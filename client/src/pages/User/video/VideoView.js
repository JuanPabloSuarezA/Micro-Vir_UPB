import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
//Antd
import "antd/lib/notification/style/css";
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
} from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class VideoView extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      idVideo: this.props.match.params.idVideo,
      videoInfo: "",
      sizeVideo: "",
      videoDelete: false,
      visible: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadVideo = this.loadVideo.bind(this);
  }

  loadVideo() {
    axios
      .get(`http://localhost:4000/videos/${this.state.idVideo}/videoInfo`, {
        params: {
          id: this.state.idVideo,
        },
      })
      .then((response) => {
        this.setState({ videoInfo: response.data, sizeVideo: response.size });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.loadVideo();
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

    const wtitle = this.wrapper.current.getFieldValue("title");
    const wdescription = this.wrapper.current.getFieldValue("description");
    axios
      .get(`http://localhost:4000/videos/${this.state.idVideo}/update`, {
        params: {
          Token: localStorage.getItem("authToken"),
          title: wtitle,
          description: wdescription,
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
        this.loadVideo();
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
                  title: this.state.videoInfo.name,
                  description: this.state.videoInfo.description,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                {...layout}
              >
                <Form.Item
                  label="Título"
                  name="title"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Descripción"
                  name="description"
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

            {this.state.videoDelete ? <Redirect to={"/videos"} /> : null}
          </div>
        </header>
      </div>
    );
  }
}
