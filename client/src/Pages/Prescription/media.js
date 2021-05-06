import React from "react";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/react-hooks";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { handleCommonError } from "../../Utils/validation";
import { GET_PATIENT_MEDIA } from "../../Utils/Graphql/patientsGraphql";
import "./media.scss";
import { getAPIBaseUrl } from "../../Utils/common";
import EmptyState from "../../Components/Common/EmptyState";

const Media = (props) => {
    const [file, setFile] = React.useState("");
    const [medialList, setMediaList] = React.useState([]);
    const [getPatientMedia] = useLazyQuery(GET_PATIENT_MEDIA, {
        onCompleted(response) {
            setMediaList(response.patient.media);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    React.useEffect(() => {
        // fetch all media for this patient here
        getPatientMedia({
            variables: {
                id: props.patient.id,
            },
        });
    }, []);

    const fileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("media", file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${getAPIBaseUrl()}/upload/media`, {
                method: "POST",
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                    "x-patient-id": props.patient.id,
                },
                body: formData,
            });
            if (res.status) {
                setFile("");
                toast.success(res.message);
            } else {
                toast.success(`${res.message} (${res.code})`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getImagePath = (media) => {
        return media.minetype === "application/pdf"
            ? "https://www.nicepng.com/png/detail/196-1963193_pdf-icon-icon-pdf-download.png"
            : `${getAPIBaseUrl()}/upload/file/${media.filename}`;
    };

    return (
        <React.Fragment>
            <Row>
                <Col md="12" className="upload-action-bar">
                    <input
                        name="media"
                        id="exampleFile"
                        type="file"
                        className="form-control-file"
                        onChange={fileChange}
                        accept="application/pdf,image/png,image/jpeg"
                    />
                    <Button className="upload-btn" onClick={uploadFile} disabled={file === ""}>
                        Upload
                    </Button>
                </Col>
            </Row>
            <Row className="media-container">
                {medialList.length ? (
                    <Col md="12 media-container-grid">
                        {medialList.map((media) => {
                            return (
                                <div className="media-card">
                                    <div className="media-content">
                                        <img className="mc-img" src={getImagePath(media)} alt="img" />
                                        <p className="mc-txt">{media.original_name}</p>
                                    </div>
                                    <i className="pe-7s-trash mc-delete" id="p-icon-edit" />
                                </div>
                            );
                        })}
                        <div className="media-card">
                            <div className="media-content">
                                <img
                                    className="mc-img"
                                    src="https://www.nicepng.com/png/detail/196-1963193_pdf-icon-icon-pdf-download.png"
                                    alt="img"
                                />
                                <p className="mc-txt">Detail about img</p>
                            </div>
                            <i className="pe-7s-trash mc-delete" id="p-icon-edit" />
                        </div>
                    </Col>
                ) : (
                    <Col md="12">
                        <EmptyState title="No results found" content="" />
                    </Col>
                )}
            </Row>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Media);
