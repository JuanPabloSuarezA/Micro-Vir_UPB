import React from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";

//CSS
import "./MenuSider.scss";

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
} from "@ant-design/icons";

export default function MenuTop(props) {
  const logOut = () => {
    logOutApi();
    window.location.reload();
  };
  const { menuCollapsed } = props;

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
        </Menu>
      </Sider>
    </div>
  );
}
