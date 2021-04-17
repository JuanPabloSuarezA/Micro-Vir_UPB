import React from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";

//CSS
import "./MenuTop.css";

//Bootstrap
import { Nav, Navbar } from "react-bootstrap";

//Antd
import { Popconfirm, message, Button, notification } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

export default function MenuTop() {
  const logOut = () => {
    logOutApi();
    window.location.reload();
  };
  return (
    <div className="btn-power">
      <Popconfirm
        title="¿Deseas cerrar sesión?"
        onConfirm={logOut}
        cancelText="No"
        okText="Sí"
      >
        <Button type="link">
          <PoweroffOutlined style={{ fontSize: "25px", color: "red" }} />
        </Button>
      </Popconfirm>
    </div>
  );
}
