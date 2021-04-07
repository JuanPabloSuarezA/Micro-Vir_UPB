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
    <>
      <Nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand">Micro-vir</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#NavbarUser"
            aria-controls="basic-navbar-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="NavbarUser">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to={"/admin"} style={{ textDecoration: "none" }}>
                  <a className="nav-link" aria-current="page">
                    Administración de usuarios
                  </a>
                </Link>
              </li>
            </ul>
            <form className="d-flex">
              <Button onClick={logOut} type="link">
                <PoweroffOutlined style={{ fontSize: "19px" }} />
              </Button>
            </form>
          </div>
        </div>
      </Nav>
    </>
  );
}
