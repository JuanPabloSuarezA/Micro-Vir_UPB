import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

//Antd
import "antd/lib/notification/style/css";
import { Popconfirm, message, Button, notification, Modal, Form, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class InfoImagen extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      image: "",
      imageDelete: false,
      visible: false,
      shared:"",
      user: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  loadData(){
    const formData = new FormData();
    formData.append("Token", localStorage.getItem("authToken"));
    formData.append("tipo", "profile");
    axios
      .post("http://localhost:4000/profile", formData)
      .then((res) => {
        this.setState({
          user: res.data.usuario,
        });
        console.log(this.state);
      })
      .catch((err) => {
        console.log(err);
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
    this.state.user.email === this.state.image.author ? 
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
      }):
      axios
      .get(`http://localhost:4000/image/${this.props.match.params.id}/delete-shared`, {
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
      })

  }
  showModal = () => {
    this.setState({
      visible: true,
    });
    console.log(this.state.user)
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const onFinish = (e) => {
      axios
      .post(`http://localhost:4000/shared`, {
        params: {
          id: this.state.image._id,
          email: this.state.shared
        },
      })
      .then(async (response) => {
        console.log(response.data);
        if(response.data){
          notification.open({
            icon: <SmileOutlined/>,
            message: "Éxito",
            description: "La imagen fue compartida",
          });
        }else{
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
    }
    const handleShared = (e) => {
      this.setState({
        ...this.state,
        shared: e.target.value 
      })
    }
    return (
      <div style={{ paddingLeft: "100px" }}>
        <div className="card" style={{ width: "18rem" }}>
          <img
            src={`http://localhost:4000/images/${this.state.image.fileName}`}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{this.state.image.title}</h5>
            <p class="card-text">Autor: {this.state.image.author}</p>

            <Popconfirm
              title="Confirma si deseas eliminar"
              onConfirm={this.handleDelete}
              okText="Sí"
              cancelText="No"
            >
              <Button type="primary mb-2" block danger>Delete</Button>
              {/* {
                this.state.user.email === this.state.image.author ? 
                :
                <Button type="primary mb-2" block danger disabled>Delete</Button>
              } */}
              
            </Popconfirm>
            <Button type="primary" onClick={this.showModal} block>
              Compartir
            </Button>
            <Modal
              visible={this.state.visible}
              title="Compartir"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Cancelar
                </Button>,
              ]}
            >
              <Form
                name="basic"
                onFinish={onFinish}
              >
                <Form.Item
                  name="correo"
                  rules={[
                    {
                      required: true,
                      message: 'Ingresa el correo eléctronico!',
                    },
                  ]}
                >
                  <Input onChange={handleShared} placeholder="Correo eléctronico"/>
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
