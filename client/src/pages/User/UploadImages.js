import React, { useState } from "react";
import axios from "axios";

//Imports Antd
import "antd/lib/notification/style/css";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import Dir from "../../components/forms/Dir"

window.URL = window.URL || window.webkitURL;

export default function UploadImages() {
  const [newImage, setNewImage] = useState({
    title: "",
    image: "",
    description: "",
  });

  const uploadImagenApi = (e) => {
    e.preventDefault();
    if (
      newImage.title === "" ||
      newImage.image === "" ||
      newImage.description === ""
    ) {
      notification.open({
        icon: <SmileOutlined rotate={180} />,
        message: "Error",
        description: "Debes diligenciar los campos",
      });
    } else {
      const formData = new FormData();
      formData.append("image", newImage.image);
      formData.append("title", newImage.title);
      formData.append("description", newImage.description);
      formData.append("Token", localStorage.getItem("authToken"));
      formData.append("tipo", "upload");
      console.log(newImage.image);

      const esImagen = newImage.image.type.includes("image");
      axios
        .post(
          esImagen
            ? "http://localhost:4000/upload"
            : "http://localhost:4000/videos/upload",
          formData
        )
        .then((res) => {
          notification.open({
            icon: <SmileOutlined />,
            message: "Éxito",
            description: "El archivo fue compartido correctamente",
          });
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleImage = (e) => {
    setNewImage({
      ...newImage,
      image: e.target.files[0],
    });
  };
  const handleTitle = async (e) => {
    await setNewImage({
      ...newImage,
      title: e.target.value,
    });
  };
  const handleDescription = async (e) => {
    await setNewImage({
      ...newImage,
      description: e.target.value,
    });
  };

  return (
    <div>
      <div style={{ marginTop: 95, marginLeft: 500 }} className="input-group">
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
      <Dir path="\"/>
    </div>
  );
}
