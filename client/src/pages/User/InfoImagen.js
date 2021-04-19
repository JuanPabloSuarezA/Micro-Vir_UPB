import React from "react";
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
  Radio
} from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class InfoImagen extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      image: "",
      imageDelete: false,
      visible: false,
      visibleD: false,
      user:"",
      shared: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadImage = this.loadImage.bind(this);
  }
  loadData() {
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
      })
      .catch((error) => {
        console.log(error);
      });
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
    this.loadData();
    this.loadImage();
    
  }

  handleDelete(e) {
    e.preventDefault();
    this.state.user.email === this.state.image.author
      ? axios
          .get(
            `http://localhost:4000/image/${this.props.match.params.id}/delete`,
            {
              params: {
                Token: localStorage.getItem("authToken"),
                imageSize: this.state.image.size,
                id: this.props.match.params.id,
              },
            }
          )
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
          })
      : axios
          .get(
            `http://localhost:4000/image/${this.props.match.params.id}/delete-shared`,
            {
              params: {
                Token: localStorage.getItem("authToken"),
                imageSize: this.state.image.size,
                id: this.props.match.params.id,
              },
            }
          )
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
        .get(
          `http://localhost:4000/image/${this.props.match.params.id}/update`,
          {
            params: {
              Token: localStorage.getItem("authToken"),
              title: wtitle,
              description: wdescription,
              fileName: this.state.image.fileName,
              id: this.props.match.params.id,
            },
          }
        )
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
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    console.log(this.state.image.author)
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

    const valid = () => {
      if (this.state.image.fileName) {
        return (
          <img
            src={`http://localhost:4000/images/${this.state.image.fileName}`}
            className="card-img-top"
            alt="..."
          />
        );
      }
    };

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
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

    const onFinishD = (e) => {
      axios
        .post(`http://localhost:4000/shared`, {
          params: {
            id: this.state.image._id,
            email: this.state.shared,
          },
        })
        .then(async (response) => {
          console.log(response.data);
          if (response.data) {
            notification.open({
              icon: <SmileOutlined />,
              message: "Éxito",
              description: "La imagen fue compartida",
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

    const handleSharedD = (e) => {
      this.setState({
        ...this.state,
        shared: e.target.value,
      });
    };

    return (
      <div style={{ paddingLeft: "100px" }}>
        <div className="card" style={{ width: "18rem" }}>
          {/* <img
            src={`http://localhost:4000/images/${this.state.image.fileName}`}
            className="card-img-top"
            alt="..."
          /> */}
          {valid()}
          <div className="card-body">
            <h5 className="card-title">
              {"Título: " + this.state.image.title}
            </h5>
            <h6>{"Descripción: " + this.state.image.description}</h6>
            <h6>{"Autor: " + this.state.image.author}</h6>

            <Space size="middle">
              <Radio.Group buttonStyle="solid">
                {
                  this.state.user.email === this.state.image.author ?
                  <>
                    <Radio.Button onClick={this.showModal}>
                      Editar
                    </Radio.Button>
                    <Radio.Button  onClick={showModalD}>
                      Compartir
                    </Radio.Button>
                  </>
                  :
                  <>
                    <Radio.Button onClick={this.showModal} disabled>
                      Editar
                    </Radio.Button>
                    <Radio.Button  onClick={showModalD} disabled>
                      Compartir
                    </Radio.Button>  
                  </>
                  
                }
                 <Popconfirm
                  title="Confirma si deseas eliminar"
                  onConfirm={this.handleDelete}
                  okText="Sí"
                  cancelText="No"
                >
                <Radio.Button >
                    Eliminar
                </Radio.Button>
                </Popconfirm>
              </Radio.Group>
            </Space>

            <Modal
              title="Editar imagen"
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
                  title: this.state.image.title,
                  description: this.state.image.description,
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
          {this.state.imageDelete ? <Redirect to={"/"} /> : null}
        </div>
      </div>
    );
  }
}
