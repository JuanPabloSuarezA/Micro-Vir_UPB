import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "antd";
import vidLogo from "../../../assets/icons/vidIcon.png";
import "../../../App.css";
import { Container, Row, Col } from "react-bootstrap";
import "./video.css";
import axios from "axios";
import noVideosSvg from "../../../assets/icons/undraw_video_files_fu10.svg";

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
    const formData = new FormData();
    formData.append("token", localStorage.getItem("authToken"));
    axios
      .post("http://localhost:4000/videos", formData)
      .then((res) => {
        this.setState({ videos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });

    // try {
    //   const res = await fetch("http://localhost:4000/videos").then(
    //     (response) => {
    //       return response.json();
    //     }
    //   );
    //   this.setState({ videos: [...res] });
    // } catch (err) {
    //   console.log(err);
    // }
  }
  render() {
    return (
      <Container className="videosContainer">
        <Row className="justify-content-md-center">
          {this.state.videos.length === 0 ? (
            <div>
              <img className="svgNoVideos" src={noVideosSvg} />
              <h1 className="h1NoVideos">No tienes videos</h1>
            </div>
          ) : (
            this.state.videos.map((video) => (
              <Col sm>
                <Link to={`/videos/${video._id}`}>
                  <Card
                    hoverable
                    className="antd-card"
                    cover={<img src={vidLogo} alt="Not Found" />}
                    bordered={true}
                  >
                    <Meta
                      title={video.name}
                      description={"Duración: " + video.duration}
                      style={{
                        borderTop: "1px solid rgb(0, 72, 131)",
                        width: "100%",
                        textAlign: "center",
                      }}
                    ></Meta>
                  </Card>
                </Link>
              </Col>
            ))
          )}
        </Row>
      </Container>
    );
  }
}
