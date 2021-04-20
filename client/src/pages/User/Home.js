import React from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
//CSS
import "./Home.css";
//SVG
import noImagesSvg from "../../assets/icons/undraw_No_data_re_kwbl.svg";

import { Form, Select, Card } from "antd";
const { Meta } = Card;

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      // noImages: ""
    };
  }

  loadData() {
    const formData = new FormData();
    formData.append("token", localStorage.getItem("authToken"));
    axios
      .post("http://localhost:4000/", formData)
      .then((res) => {
        this.setState({
          ...this.state,
          images: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async componentDidMount() {
    this.loadData();
  }

  render() {
    const convertToDate = (val) => {
      if (val) {
        const date = new Date(val.createdAt);
        const stringDate = date.toISOString().substring(0, 10);

        return stringDate;
      }
      return "";
    };
    const { Option } = Select;

    const ordenar = (value) => {
      if (value === "0") {
        this.setState({
          images: this.state.images.sort(function (a, b) {
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
          images: this.state.images.sort(function (a, b) {
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
          images: this.state.images.sort(function (a, b) {
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
          images: this.state.images.sort(function (a, b) {
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
            {this.state.images.length === 0 ? (
              <div>
                <img className="svgNoImages" src={noImagesSvg} />
                <h1 className="h1NoImages">No tienes imágenes</h1>
              </div>
            ) : (
              this.state.images.map((image) => (
                <Col sm>
                  <Card
                    className="antd-card-images"
                    cover={
                      <img
                        alt={image.filename}
                        className="card-img-top"
                        src={`http://localhost:4000/images/${image.fileName}`} //{image.path}
                      />
                    }
                    bordered={true}
                  >
                    <Meta
                      title={image.title}
                      style={{
                        width: "100%",
                        textAlign: "center",
                      }}
                    ></Meta>

                    <Link
                      to={`/image/${image._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <br></br>
                      <div className="d-grid gap-2">
                        <button type="button" className="btn btn-outline-info">
                          Info
                        </button>
                      </div>
                    </Link>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
        {console.log(convertToDate(this.state.images[0]))}
      </div>
    );
  }
}
