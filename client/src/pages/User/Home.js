import React from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
//CSS
import './Home.css'
//SVG
import noImagesSvg from '../../assets/svg/undraw_No_data_re_kwbl.svg'

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      // noImages: ""
    };
    this.handleInfo = this.handleInfo.bind(this);
  }

  loadData() {
    const formData = new FormData();
    formData.append("token", localStorage.getItem("authToken"));
    axios
      .post("http://localhost:4000/", formData)
      .then((res) => {
        this.setState({
          ...this.state,  
          images: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async componentDidMount() {
    this.loadData();
  }

  handleInfo(e, img) {
    e.preventDefault();
    axios
      .get(`http://localhost:4000/image/${img._id}`, {
        params: {
          id: img._id,
        },
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <div className="container p-4">
          <div className="row">
            {
              this.state.images.length === 0 ?
                  <div>
                    <img className="svgNoImages" src={noImagesSvg}/>
                    <h1 className="h1NoImages">No tienes imágenes</h1>
                  </div>
                  :
                  this.state.images.map((image) => (
                      <div key={image._id} className="col-sm-4">
                        <div className="card mb-4">
                          <img
                              alt={image.filename}
                              className="card-img-top"
                              src={`http://localhost:4000/images/${image.fileName}`} //{image.path}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{image.title}</h5>
                          </div>
                          <Link
                              to={`/image/${image._id}`}
                              style={{ textDecoration: "none" }}
                          >
                            <div className="d-grid gap-2">
                              <button type="button" className="btn btn-outline-info">
                                Info
                              </button>
                            </div>
                          </Link>
                        </div>
                      </div>
                  ))
            }
          </div>
        </div>
      </div>
    );
  }
}
