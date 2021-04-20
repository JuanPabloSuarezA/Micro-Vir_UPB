import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "antd";
import vidLogo from "../../../assets/icons/vidIcon.png";
import "../../../App.css";
import { Container, Row, Col } from "react-bootstrap";
import "./video.css";
import axios from "axios";
import noVideosSvg from "../../../assets/icons/undraw_video_files_fu10.svg";
import { Form, Select } from "antd";
import {IP_SERVER, PORT} from "../../../api/cofig"
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
      .post(`http://${IP_SERVER}:${PORT}/videos`, formData)
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
    const { Option } = Select;

    const convertToDate = (val) => {
      if (val) {
        const date = new Date(val.createdAt);
        const stringDate = date.toISOString().substring(0, 10);

        return stringDate;
      }
      return "";
    };

    const ordenar = (value) => {
      if (value === "0") {
        this.setState({
          videos: this.state.videos.sort(function (a, b) {
            if (a.title > b.title) {
              return 1;
            }
            if (a.title < b.title) {
              return -1;
            }
            return 0;
          }),
        });
      } else if (value === "1") {
        this.setState({
          videos: this.state.videos.sort(function (a, b) {
            if (a.title > b.title) {
              return -1;
            }
            if (a.title < b.title) {
              return 1;
            }
            return 0;
          }),
        });
      } else if (value === "2") {
        this.setState({
          videos: this.state.videos.sort(function (a, b) {
            const date1 = new Date(a.createdAt);
            const date2 = new Date(b.createdAt);

            if (date1 > date2) {
              return 1;
            }
            if (date1 < date2) {
              return -1;
            }
            return 0;
          }),
        });
      } else if (value === "3") {
        this.setState({
          videos: this.state.videos.sort(function (a, b) {
            const date1 = new Date(a.createdAt);
            const date2 = new Date(b.createdAt);

            if (date1 > date2) {
              return -1;
            }
            if (date1 < date2) {
              return 1;
            }
            return 0;
          }),
        });
      }
    };
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block" }}>
            <Form name="control-ref">
              <Form.Item
                label="Ordenar por"
                name="access"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  placeholder="Selecciona el orden de visualización"
                  // onSelect={() => onRoleChange()}
                  onChange={ordenar}
                  allowClear
                  style={{ width: "315px" }}
                >
                  <Option value="0">Ordenar por título ascendente</Option>
                  <Option value="1">Ordenar por título descendente</Option>
                  <Option value="2">Ordenar por fecha ascendente</Option>
                  <Option value="3">Ordenar por fecha descendente</Option>
                </Select>
              </Form.Item>
            </Form>
          </span>
        </div>
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
                        title={video.title}
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
      </div>
    );
  }
}
