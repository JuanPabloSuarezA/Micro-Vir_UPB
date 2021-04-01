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
      videoInfo: {},
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
      this.setState({ videoInfo: res });
    } catch (err) {
      console.log(err);
    }
  }

  handleDelete(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/videos/${this.state.idVideo}/delete`, {
        params: {
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
          <div style={{ border: "solid black 1px" }}>
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
            <h6>{this.state.videoInfo.name}</h6>
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
