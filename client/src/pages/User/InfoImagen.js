import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

//Antd
import "antd/lib/notification/style/css";
import { Popconfirm, message, Button, notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class InfoImagen extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      image: "",
      imageDelete: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
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
            <h5 className="card-title">{this.state.image.title}</h5>

            <Popconfirm
              title="Confirma si deseas eliminar"
              onConfirm={this.handleDelete}
              okText="Sí"
              cancelText="No"
            >
              <a className="btn btn-danger">Delete</a>
            </Popconfirm>
          </div>
          {this.state.imageDelete ? <Redirect to={"/"} /> : null}
        </div>
      </div>
    );
  }
}
