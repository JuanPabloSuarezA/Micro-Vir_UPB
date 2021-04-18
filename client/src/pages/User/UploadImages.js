import React from "react";
import axios from "axios";

//Imports Antd
import "antd/lib/notification/style/css";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";

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
    const formData = new FormData();
    formData.append("Token", localStorage.getItem("authToken"));
    formData.append("tipo", "profile");

    axios
      .post("http://localhost:4000/profile", formData)
      .then((res) => {
        this.setState({
          ...this.state,
          maxShare: res.data.maxShare,
        });
        console.log(this.state);
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
      } else {
        const formData = new FormData();
        formData.append("image", this.state.image);
        formData.append("title", this.state.title);
        formData.append("description", this.state.description);
        formData.append("Token", localStorage.getItem("authToken"));
        formData.append("tipo", "upload");
        console.log(this.state.image);

        const esImagen = this.state.image.type.includes("image");
        axios
          .post(
            esImagen
              ? "http://localhost:4000/upload"
              : "http://localhost:4000/videos/upload",
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
              console.log(res);
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
      console.log(this.state.maxShare);
    };
    const handleDescription = async (e) => {
      await this.setState({
        ...this.state,
        description: e.target.value,
      });
    };
    return (
      <Container className="videosContainer">
        <Row className="justify-content-md-center">
          <div className="input-group" style={{ alignItems: "center" }}>
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
