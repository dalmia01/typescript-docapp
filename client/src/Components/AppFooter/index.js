import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const AppFooter = (props) => {
    return (
        <Fragment>
            <div className="app-footer">
                <div className="app-footer__inner">
                    <div className="app-footer-left">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link to="/">Footer Link 1</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/">Footer Link 2</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="app-footer-right">
                        <ul className="nav">
                            <li className="nav-item">
                                <Link to="/">Footer Link 3</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/">
                                    <div className="badge badge-success mr-1 ml-0">
                                        <small>NEW</small>
                                    </div>
                                    Footer Link 4
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AppFooter;
