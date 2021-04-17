import React from "react";
import { Link } from "react-router-dom";
import { logOutApi } from "../../../api/auth";

//CSS
import "./MenuTop.css";

//Bootstrap
import { Nav, Navbar } from "react-bootstrap";

//Antd
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

export default function MenuTop() {
  const logOut = () => {
    logOutApi();
    window.location.reload();
  };
  return (
    <div className="btn-power">
      <Button onClick={logOut} type="link">
        <PoweroffOutlined style={{ fontSize: "25px" }} />
      </Button>
    </div>
  );
}
