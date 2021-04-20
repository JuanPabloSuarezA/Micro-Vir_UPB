import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";
import { IP_SERVER, PORT } from "../../../api/cofig";
//CSS
import "./MenuSider.scss";
import axios from "axios";
//Antd
import { Button, Layout, Menu } from "antd";
import {
  PoweroffOutlined,
  MenuOutlined,
  HomeOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FileSyncOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

export default function MenuTop(props) {
  const logOut = () => {
    logOutApi();
    window.location.reload();
  };
  const { menuCollapsed } = props;

  const [admin, setAdmin] = useState(false);

  const LoadProfile = () => {
    if (!localStorage.getItem("authToken")) {
      return false;
    }

    axios
      .get(`http://${IP_SERVER}:${PORT}/profile`, {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        console.log(response.data.usuario.access);
        if (response.data.usuario.access === 2) {
          setAdmin(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return admin;
  };

  const { Sider } = Layout;
  return (
    <div>
      <Sider className="client-sider" collapsed={menuCollapsed}>
        <Menu theme="dark" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" className="client-sider_title">
            <Link to={"/"}>
              <HomeOutlined />
              <span>Home</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="2" className="client-sider_title">
            <Link to={"/upload"}>
              <UploadOutlined />
              <span>Compartir</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="3" className="client-sider_title">
            <Link to={"/profile"}>
              <UserOutlined />
              <span>Perfil</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4" className="client-sider_title">
            <Link to={"/videos"}>
              <VideoCameraOutlined />
              <span>Videos</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5" className="client-sider_title">
            <Link to={"/files"}>
              <FileSyncOutlined />
              <span>Archivos</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="6"
            className="client-sider_title"
            style={{ visibility: LoadProfile() ? "visible" : "hidden" }}
          >
            <Link to={"/admin"}>
              <SafetyCertificateOutlined />
              <span>Administrar</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
}
