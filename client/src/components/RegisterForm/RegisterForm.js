import React from "react";
import { getAccessToken } from "../../api/auth";
import { Button, Form, Input, notification } from "antd";
import {
  LockOutlined,
  SmileOutlined,
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

export default class RegisterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDate: "",
    };
  }
  render() {
    if (getAccessToken()) {
      return <Redirect to={"/"} />;
    }

    const onChange = (e) => {
      e.preventDefault();
      this.setState({
        ...this.setState,
        [e.target.name]: e.target.value,
      });
    };

    const registerApi = async () => {
      if (this.state.password === this.state.confirmPassword) {
        const config = {
          header: {
            "Content-Type": "application/json",
          },
        };
        const params = {
          userName: this.state.userName,
          email: this.state.email.toLowerCase(),
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          birthDate: this.state.birthDate,
        };
        try {
          const { data } = await axios.post(
            "http://localhost:4000/auth/register",
            params,
            config
          );
          localStorage.setItem("authToken", data.token);
          window.location.href = "/";
        } catch (e) {
          notification.open({
            icon: <SmileOutlined rotate={180} />,
            message: "Error",
            description:
              "Puede que el usuario ya exista o que el formato del email sea incorrecto. " +
              "Por favor verifica los datos ingresados.",
          });
          console.log(e);
        }
      } else {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Error",
          description: "Las contraseñas deben ser iguales.",
        });
      }
    };

    return (
      <div>
        <Form
          className="login-form"
          style={{ maxWidth: "350px", margin: "0 auto", marginTop: "100px" }}
          name="basic"
          onFinish={registerApi}
          onChange={onChange}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Ingresa tu nombre de usuario!" },
            ]}
          >
            <Input
              name="userName"
              prefix={<SmileOutlined className="site-form-item-icon" />}
              placeholder="Nombre de usuario"
            />
          </Form.Item>

          <Form.Item
            name="firstname"
            rules={[{ required: true, message: "Ingresa tus nombres!" }]}
          >
            <Input
              name="firstName"
              prefix={<SmileOutlined className="site-form-item-icon" />}
              placeholder="Nombres"
            />
          </Form.Item>

          <Form.Item
            name="lastname"
            rules={[{ required: true, message: "Ingresa tus apellidos!" }]}
          >
            <Input
              name="lastName"
              prefix={<SmileOutlined className="site-form-item-icon" />}
              placeholder="Apellidos"
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            rules={[
              { required: true, message: "Ingresa tu fecha de nacimiento!" },
            ]}
          >
            <Input
              name="birthDate"
              prefix={<SmileOutlined className="site-form-item-icon" />}
              placeholder="Fecha de nacimiento"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Ingresa tu email!" }]}
          >
            <Input
              name="email"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Ingresa la contraseña!" }]}
          >
            <Input
              name="password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Repite tu contraseña!" }]}
          >
            <Input
              name="confirmPassword"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirma tu contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Registrarse
            </Button>
            ¿Ya tienes una cuenta?. <Link to={"/login"}>Ingresa ahora!</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
