import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {IP_SERVER, PORT} from "../../../api/cofig"
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
  Radio,
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
      user: "",
      shared: "",
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadVideo = this.loadVideo.bind(this);
  }

  loadData() {
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

  loadVideo() {
    axios
      .get(`http://${IP_SERVER}:${PORT}/videos/${this.state.idVideo}/videoInfo`, {
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
    this.loadData();
    this.loadVideo();
  }

  handleDelete(e) {
    e.preventDefault();

    this.state.user.email === this.state.videoInfo.author
      ? axios
          .get(`http://${IP_SERVER}:${PORT}/videos/${this.state.idVideo}/delete`, {
            params: {
              Token: localStorage.getItem("authToken"),
              sizeVideo: this.state.videoInfo.size,
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
          })
      : axios
          .get(
            `http://${IP_SERVER}:${PORT}/videos/${this.state.idVideo}/delete-shared`,
            {
              params: {
                Token: localStorage.getItem("authToken"),
                id: this.state.idVideo,
              },
            }
          )
          .then(async (response) => {
            notification.open({
              icon: <SmileOutlined />,
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

    if (wtitle === "" || wdescription === "") {
      notification.open({
        icon: <SmileOutlined rotate={180} />,
        message: "Error",
        description: "No puedes dejar campos vacíos",
      });
    } else {
      axios
        .get(`http://${IP_SERVER}:${PORT}/videos/${this.state.idVideo}/update`, {
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
            description:
              "Los datos del video fueron actualizados correctamente",
          });
          this.loadVideo();
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

    const onFinishD = (e) => {
      console.log(this.state);
      axios
        .post(`http://${IP_SERVER}:${PORT}/videos/sharedVideo`, {
          params: {
            id: this.state.idVideo,
            email: this.state.shared,
          },
        })
        .then(async (response) => {
          console.log(response.data);
          if (response.data) {
            notification.open({
              icon: <SmileOutlined />,
              message: "Éxito",
              description: "El video fue compartido",
            });
          } else {
            notification.open({
              icon: <SmileOutlined rotate={180} />,
              message: "Error",
              description: "El usuario no existe",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const handleOkD = (e) => {
      this.handleUpdate(e);
      this.setState({
        visibleD: false,
      });
    };

    const handleCancelD = () => {
      this.setState({ visibleD: false });
    };

    const showModalD = () => {
      this.setState({
        visibleD: true,
      });
    };
    const handleSharedD = (e) => {
      this.setState({
        ...this.state,
        shared: e.target.value,
      });
    };
    const convertToDate = (val) => {
      if (val) {
        const date = new Date(val.createdAt);
        const stringDate = date.toISOString().substring(0, 10);

        return stringDate;
      }
      return "";
    };

    return (
      <div className="App">
        <header className="App-header">
          <div
            style={{ alignItems: "center", maxWidth: "60%", height: "auto" }}
          >
            <video
              controls
              autoPlay
              muted
              style={{ maxWidth: "100%", height: "auto" }}
              // style={{ height: "350px", width: "600px" }}
            >
              <source
                src={`http://${IP_SERVER}:${PORT}/videos/${this.state.idVideo}`}
                type="video/mp4"
              ></source>
            </video>
            <div
              style={{
                textAlign: "left",
                border: "solid black 1px",
                borderRadius: "20px",
                backgroundColor: "rgb(234 234 247)",
                paddingLeft: "10px",
              }}
            >
              <p>
                {" "}
                <strong>Título: </strong> {this.state.videoInfo.title}
              </p>
              <p>
                {" "}
                <strong>Duración: </strong> {this.state.videoInfo.duration}
              </p>
              <p>
                {" "}
                <strong>Descripción: </strong>{" "}
                {this.state.videoInfo.description}
              </p>
              <p>
                {" "}
                <strong>Autor: </strong> {this.state.videoInfo.author}
              </p>
              <p>
                {" "}
                <strong>Fecha de creación:</strong>{" "}
                {convertToDate(this.state.videoInfo)}
              </p>

              <div
                style={{
                  textAlign: "center",
                }}
              >
                {this.state.user.email === this.state.videoInfo.author ? (
                  <>
                    <Space size="middle">
                      <Button type="primary" onClick={this.showModal}>
                        Editar
                      </Button>

                      <Button
                        type="primary"
                        onClick={showModalD}
                        style={{ background: "green", borderColor: "green" }}
                      >
                        Compartir
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
                  </>
                ) : (
                  <>
                    <Space size="middle">
                      <Button
                        type="primary"
                        onClick={this.showModal}
                        disabled={true}
                      >
                        Editar
                      </Button>

                      <Button
                        type="primary"
                        onClick={showModalD}
                        disabled={true}
                        style={{ background: "green", borderColor: "green" }}
                      >
                        Compartir
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
                  </>
                )}

                <Modal
                  title="Editar video"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  okText="Confirmar"
                  cancelText="Cancelar"
                  okButtonProps={{ disabled: false }}
                  cancelButtonProps={{ disabled: false }}
                >
                  <Form
                    ref={this.wrapper}
                    name="control-ref"
                    initialValues={{
                      title: this.state.videoInfo.title,
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
                {/*-------------- Compartir ---------------------- */}

                <Modal
                  visible={this.state.visibleD}
                  title="Compartir"
                  onOk={handleOkD}
                  onCancel={handleCancelD}
                  footer={[
                    <Button key="back" onClick={handleCancelD}>
                      Cancelar
                    </Button>,
                  ]}
                >
                  <Form name="basic" onFinish={onFinishD}>
                    <Form.Item
                      name="correo"
                      rules={[
                        {
                          required: true,
                          message: "Ingresa el correo eléctronico!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleSharedD}
                        placeholder="Correo electrónico"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Compartir
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            </div>
            <hr></hr>
            {this.state.videoDelete ? <Redirect to={"/videos"} /> : null}
          </div>
        </header>
      </div>
    );
  }
}
