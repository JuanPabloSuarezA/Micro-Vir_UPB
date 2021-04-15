import React from "react";
import { getAccessToken } from "../../api/auth";
import "./LoginComponent.css";
//Import Andt
import "antd/dist/antd.css";
import { Form, Input, Button, notification } from "antd";
import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "axios";
<<<<<<< HEAD
import {Redirect} from "react-router-dom";


export default class LoginComponent extends React.Component{
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }
    render() {
        if (getAccessToken()){
            return <Redirect to={"/"}/>
        }
        
        const loginApi = async () => {
            const config = {
                header: {
                    "Content-Type": "application/json"
                }
            }
            const params = {
                email: this.state.email.toLowerCase(),
                password: this.state.password
            }
            try {
                const {data} = await axios.post("http://localhost:4000/auth/login", params, config);
                localStorage.setItem("authToken", data.token);
                window.location.href = "/";
            }catch (e) {
                notification.open({
                    icon: <SmileOutlined rotate={180}/>,
                    message: 'Error',
                    description: 'Usuario o contraseña incorrecta.'
                })
                console.log(e)
            }
            
        };
        const onChange = (e) => {
            e.preventDefault();
            this.setState({
                ...this.state,
                [e.target.name]: e.target.value
            })
        }
        return(
                <Form
                    className="login-form"
                    style={{maxWidth: "350px", margin:"0 auto", marginTop:"100px"}}
                    name="basic"
                    onFinish={loginApi}
                    onChange={onChange}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Ingresa tu email!' }]}>
                        <Input name="email" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Ingresa la contraseña!' }]}>
                        <Input
                            name="password"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Contraseña"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{width: "100%"}} type="primary" htmlType="submit" className="login-form-button">
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>
        )
=======
import { Redirect, Link } from "react-router-dom";

export default class LoginComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }
  render() {
    if (getAccessToken()) {
      return <Redirect to={"/"} />;
>>>>>>> 4768760b74b1a1b2284e0546fc6a79be4dc40bb3
    }

    const loginApi = async () => {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
      const params = {
        email: this.state.email.toLowerCase(),
        password: this.state.password,
      };
      try {
        const { data } = await axios.post(
          "http://localhost:4000/auth/login",
          params,
          config
        );
        localStorage.setItem("mail", params.email);
        localStorage.setItem("authToken", data.token);
        window.location.href = "/";
      } catch (e) {
        notification.open({
          icon: <SmileOutlined rotate={180} />,
          message: "Error",
          description: "Usuario o contraseña incorrecta.",
        });
        console.log(e);
      }
    };
    const onChange = (e) => {
      e.preventDefault();
      this.setState({
        ...this.state,
        [e.target.name]: e.target.value,
      });
    };
    return (
      <Form
        className="login-form"
        style={{ maxWidth: "350px", margin: "0 auto", marginTop: "100px" }}
        name="basic"
        onFinish={loginApi}
        onChange={onChange}
      >
        <Form.Item
          name="username"
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
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Ingresar
          </Button>
          O <Link to={"/register"}>registrate ahora!</Link>
        </Form.Item>
      </Form>
    );
  }
}
