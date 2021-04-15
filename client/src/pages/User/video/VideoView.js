import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

//Antd
import "antd/lib/notification/style/css";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

export default class VideoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idVideo: this.props.match.params.idVideo,
      videoInfo: "",
      sizeVideo: "",
      videoDelete: false,
    };
    this.handleDelete = this.handleDelete.bind(this);
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
          sizeVideo:this.state.sizeVideo,
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ alignItems: "center" }}>
            <video
              controls
              autoPlay
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
            <a className="btn btn-danger" onClick={this.handleDelete}>
              Delete
            </a>
            {this.state.videoDelete ? <Redirect to={"/videos"} /> : null}
          </div>
        </header>
      </div>
    );
  }
}
