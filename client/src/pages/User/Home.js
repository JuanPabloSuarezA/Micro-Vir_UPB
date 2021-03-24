import React from 'react';
import axios from "axios";
import {Link, Redirect} from "react-router-dom";

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            images: [],
        }
        this.handleInfo = this.handleInfo.bind(this)
    }

    loadData() {
        axios({
            method: "get",
            url: "http://localhost:4000/"
        }).then((res) => {
            this.setState({images: res.data});
        }).catch((err) => {
            console.log(err)
        })
    }

    componentDidMount() {
        this.loadData()
    }

    handleInfo(e, img){
        e.preventDefault()
        axios.get(`http://localhost:4000/image/${img._id}`, {
            params:{
                id: img._id,
            }
        }).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.log(error);
        })
    }
    render() {
        return (

            <div>
                <div className="container p-4">
                    <div className="row">
                        {
                            this.state.images.map((image) => (
                                <div key={image._id} className="col-sm-4">
                                    <div className="card mb-4">
                                        <img alt={image.filename} className="card-img-top" src={image.path}/>
                                        <div className="card-body">
                                            <h5 className="card-title">{image.title}</h5>
                                        </div>
                                        <Link to={`/image/${image._id}`} 
                                              style={{textDecoration: "none"}}>
                                            <div className="d-grid gap-2">
                                                <button type="button" className="btn btn-outline-info">Info</button>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}