import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cx from "classnames";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import MenuBarActions from "./actions";

const FileManagerMenuBar = (props) => {
    let { heading, icon } = props;

    return (
        <div className="app-page-title menu-bar-container">
            <div className="page-title-wrapper menu-bar">
                <div className="page-title-heading">
                    <div className={cx("page-title-icon")}>
                        <i className={icon} />
                    </div>
                    <div>
                        {heading}
                        <Breadcrumb className="custom-breadcrumb">
                            <BreadcrumbItem>
                                <Link to="/">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link to="/">Picture</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>Data</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="page-title-actions">
                    <MenuBarActions />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FileManagerMenuBar);
