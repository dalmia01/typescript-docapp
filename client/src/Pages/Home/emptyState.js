import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Row, Col } from "reactstrap";

import EmptyStateImg from "../../assets/utils/images/page-list-empty-state.svg";

import "./index.scss";

const EmptyState = () => {
    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <Row className="empty-state">
                <Col md="12">
                    <img alt="Empty state" src={EmptyStateImg} className="img" />
                    <p className="msg">
                        <i className="pe-7s-angle-left-circle icon"></i>
                        Select a Patient.
                    </p>
                </Col>
            </Row>
        </ReactCSSTransitionGroup>
    );
};

export default EmptyState;
