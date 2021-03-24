import React from "react";
import {Link} from 'react-router-dom';

//CSS
import './MenuTop.css'

//Bootstrap
import {Nav, Navbar} from 'react-bootstrap';


export default function MenuTop() {
    return (
        <>
            <Nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Micro-vir</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#NavbarUser" aria-controls="basic-navbar-nav"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="NavbarUser">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={"/"} style={{textDecoration: "none"}}>
                                    <a className="nav-link" aria-current="page" href="#">Home</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/upload"} style={{textDecoration: "none"}}>
                                    <a className="nav-link" href="#">Compartir</a>
                                </Link>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </Nav>
        </>
        
    )
}