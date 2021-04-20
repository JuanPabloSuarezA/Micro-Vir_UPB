import React from "react";
import LoginComponent from "../../components/Login";
import './Login.css';
import RegisterForm from "../../components/RegisterForm";
import backImg from "../../assets/icons/BackLogin.jpg";
import MicroVir from "../../assets/icons/MicriVir.png"

//Antd
import { Tabs } from 'antd';

//Bootstrap
import {Container} from 'react-bootstrap'

const { TabPane } = Tabs;

export default class Login extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <>
        <div className="Login">
          <img className="Login__Background"src={backImg} alt="imgLogin"/>
          <div>
            <img className="Login__MicroVir"src={MicroVir} alt="MicroVir"/>
          
              <div className="Tabs position-absolute top-50 start-50 translate-middle
              rounded-3 border border-info mx-auto p-sm-5
              shadow p-3 mb-5 bg-body">
                  <Tabs centered="true" type="card" defaultActiveKey="1">
                      <TabPane tab={<span>Iniciar sesión</span>} key="1">
                          <LoginComponent />
                      </TabPane>
                      <TabPane tab={<span>Registrarse</span>} key="2">
                          <RegisterForm />
                      </TabPane>
                  </Tabs>
              </div>
            </div>
          </div>
      </>
    );
  }
}
