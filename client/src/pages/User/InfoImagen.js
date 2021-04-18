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
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadImage = this.loadImage.bind(this);
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
          </div>
          {this.state.imageDelete ? <Redirect to={"/"} /> : null}
        </div>
      </div>
    );
  }
}
