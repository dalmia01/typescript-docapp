import React, { Fragment } from "react";
import { Row, Col } from "reactstrap";

import FileManagerMenuBar from "../../Components/FileManagerMenuBar";
import DirectoryButton from "../../Components/DirectoryButton";

export default function FileManager(props) {
    return (
        <Fragment>
            <FileManagerMenuBar heading="Your space" icon="pe-7s-wallet icon-gradient bg-amy-crisp" />
            <Row className="directory-container">
                <Col md="12 directory-container-grid">
                    <DirectoryButton name="Picture" />
                    <DirectoryButton name="Picture" />
                    <DirectoryButton name="Picture" />
                    <DirectoryButton name="Picture" />
                </Col>
            </Row>
        </Fragment>
    );
}
