import React from "react";
import './PerfilComponent.css';
import axios from "axios";
import {notification} from "antd";
import {SmileOutlined} from "@ant-design/icons";

export default class PerfilComponent extends React.Component{
    constructor() {
        super();
        this.state = {
            userName: "",
            email: ""
        }
    }
    LoadData(){
        const formData = new FormData();
        formData.append('Token', localStorage.getItem("authToken"));
        formData.append('tipo','profile');

        axios.post('http://localhost:4000/upload', formData).then(res=>{
            this.setState({
                userName: res.data.userName
            })
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }
    componentDidMount() {
        this.LoadData();
    }

    render() {
        return(
            <div>
                {this.state.userName}
            </div>
        )
        
    }
}