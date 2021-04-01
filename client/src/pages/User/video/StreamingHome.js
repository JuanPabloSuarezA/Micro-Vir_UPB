import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "antd";
import vidLogo from "../../../assets/img/vidIcon.png";
import "../../../App.css";

// import "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.css";
const { Meta } = Card;

export default class StreamingHome extends Component {
  constructor() {
    super();
    this.state = {
      videos: [],
    };
  }
  async componentDidMount() {
    try {
      const res = await fetch("http://localhost:4000/videos").then(
        (response) => {
          return response.json();
        }
      );
      this.setState({ videos: [...res] });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    return (
      <div className="App App-header">
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="row">
            {this.state.videos.map((video) => (
              <span
                style={{
                  paddingRight: "20px",
                  height: "100px",
                  width: "200px",
                }}
                key={video._id}
              >
                <Link to={`/videos/${video._id}`}>
                  <Card
                    hoverable
                    className="antd-card"
                    cover={<img src={vidLogo} alt="Not Found" />}
                    bordered={true}
                  >
                    <Meta
                      title={video.name}
                      description={video.duration}
                      style={{
                        borderTop: "1px solid rgb(0, 72, 131)",
                        width: "100%",
                      }}
                    ></Meta>
                  </Card>
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
