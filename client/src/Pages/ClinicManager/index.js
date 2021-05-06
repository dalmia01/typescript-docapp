import React, { Fragment } from "react";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import { Row, Col, Card } from "reactstrap";
import { useLazyQuery } from "@apollo/react-hooks";
import ConfirmModal from "../../Components/Common/ConfirmModal";
import { setAuthLogout } from "../../actions/authActions";
import { setPopUpModal } from "../../reducers/ThemeOptions";
import EmptyState from "../../Components/Common/EmptyState";
import { handleCommonError } from "../../Utils/validation";
import { FETCH_CLINICS } from "../../Utils/Graphql/clinicsGraphql";
const ClinicManager = (props) => {
    let [clinics, setClinics] = React.useState([]);

    /**
     *  graphql request to fetch all clinics on page load and new clinic add
     */

    const [fetchClinics] = useLazyQuery(FETCH_CLINICS, {
        onCompleted(data) {
            data.clinics && setClinics(data.clinics);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    React.useEffect(() => {
        fetchClinics({ variables: { filter: "all clinics", unique_id: uuid() } });
    }, []);

    React.useEffect(() => {
        fetchClinics({ variables: { filter: "all clinics", unique_id: uuid() } });
    }, [props.popUpModalContent]);

    /**
     *  open popup modal to add new clinic
     */

    const addNewClinic = () => {
        props.setPopUpModal({ visibility: true, type: "Update Clinic", content: {} });
    };

    /**
     * all clinics list && jsx
     */

    let allClinics = [];

    if (clinics.length > 0) {
        allClinics = clinics.map((clinic, index) => {
            return (
                <tr key={clinic.id}>
                    <td className=" text-muted">{index + 1}</td>
                    <td>
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left flex2">
                                    <div className="widget-heading">{clinic.clinic_name}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="">{clinic.phone_num}</td>
                    <td className="">
                        <div className="">{clinic.address}</div>
                    </td>
                    <td>{clinic.website}</td>
                </tr>
            );
        });
    }

    /**
     *  all users list && jsx
     */

    return (
        <Fragment>
            <Row>
                <Col md="12">
                    <Card className="main-card mb-3 text-capitalize">
                        <div className="card-header">
                            Clinics
                            <div className="btn-actions-pane-right">
                                <div role="group" className="btn-group-sm btn-group">
                                    <button className="active btn btn-info" onClick={addNewClinic}>
                                        Add Clinic Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        {allClinics.length > 0 ? (
                            <div className="table-responsive">
                                <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="">#</th>
                                            <th>Name</th>
                                            <th>phone Number</th>
                                            <th>Address</th>
                                            <th>Website</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <React.Fragment>{allClinics}</React.Fragment>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState content="No clinics found" />
                        )}
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({ popUpModalContent: state.ThemeOptions.popUpModalContent });

const mapDispatchToProps = (dispatch) => ({
    setPopUpModal: (popUpModal) => dispatch(setPopUpModal(popUpModal)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClinicManager);
