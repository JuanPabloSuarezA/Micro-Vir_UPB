import React from "react";
import axios from "axios";
import {IP_SERVER, PORT} from "../../api/cofig"

//Imports Antd
import "antd/lib/notification/style/css";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";
import userLogo from "../../assets/icons/submit.png";

window.URL = window.URL || window.webkitURL;

export default class UploadImages extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      image: "",
      description: "",
      maxShare: "",
    };
  }
  LoadData() {
    axios
      .get(`http://${IP_SERVER}:${PORT}/profile`, {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((res) => {
        this.setState({
          ...this.state,
          maxShare: res.data.maxShare,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.LoadData();
  }
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   this.LoadData();
  // }

  render() {
    const defLogo = () => {
      return (
        <img
          style={{
            width: "200px",
            height: "180px",
          }}
          src={userLogo}
          alt="not found"
        />
      );
    };

    const uploadImagenApi = async (e) => {
      e.preventDefault();
      if (
        this.state.title === "" ||
        this.state.image === "" ||
        this.state.description === ""
      ) {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Error",
          description: "Debes diligenciar los campos",
        });
      } else if (this.state.maxShare <= 0) {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Error",
          description:
            "El archivo no se ha cargado. Revisa tu cuota disponible",
        });
        console.log(this.state.maxShare);
      } else {
        const formData = new FormData();
        formData.append("image", this.state.image);
        formData.append("title", this.state.title);
        formData.append("description", this.state.description);
        formData.append("Token", localStorage.getItem("authToken"));
        formData.append("tipo", "upload");

        const esImagen = this.state.image.type.includes("image");
        axios
          .post(
            esImagen
              ? `http://${IP_SERVER}:${PORT}/upload`
              : `http://${IP_SERVER}:${PORT}/videos/upload`,
            formData
          )
          .then((res) => {
            if (res.data) {
              notification.open({
                icon: <SmileOutlined />,
                message: "Éxito",
                description: "El archivo fue compartido correctamente",
              });
              this.LoadData();
            } else {
              notification.open({
                icon: <SmileOutlined rotate={180} />,
                message: "Error",
                description:
                  "El archivo no se ha cargado. Revisa tu cuota disponible o ha ocurrido un error",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const handleImage = (e) => {
      this.setState({
        ...this.state,
        image: e.target.files[0],
      });
    };
    const handleTitle = async (e) => {
      await this.setState({
        ...this.state,
        title: e.target.value,
      });
    };
    const handleDescription = async (e) => {
      await this.setState({
        ...this.state,
        description: e.target.value,
      });
    };
    return (
      <Container className="videosContainer">
        <Row>
          <Col>{defLogo()}</Col>
        </Row>

        <Row className="justify-content-md-center">
          <div
            className="input-group"
            style={{ alignItems: "center", paddingLeft: "50px" }}
          >
            <form onSubmit={uploadImagenApi} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  onChange={handleTitle}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                  onChange={handleDescription}
                  type="text"
                  className="form-control"
                />
              </div>
              <input
                type="file"
                onChange={handleImage}
                name="image"
                className="form-control mb-3"
              />
              <button
                className="btn btn-outline-success"
                type="submit"
                id="inputGroupFileAddon04"
              >
                Subir archivo (imagen o video)
              </button>
            </form>
          </div>
        </Row>
      </Container>
    );
  }
}
