import React from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";

//CSS
import "./MenuSider.scss";

//Antd
import { Button, Layout, Menu } from "antd";
import {
  ProfileOutlined,
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
            <Link to={"/admin"}>
              <ProfileOutlined />
              <span>Administración</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2" className="client-sider_title">
            <Link to={"/"}>
              <HomeOutlined />
              <span>Home</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
}
