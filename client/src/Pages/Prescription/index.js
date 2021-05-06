import React, { useEffect } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";
import { Row, Col, ButtonGroup, Button } from "reactstrap";
import Prescription from "../../Components/Prescription";
import { GET_VACCINE_CHART } from "../../Utils/Graphql/patientsGraphql";
import { updateVaccineDetails } from "../../reducers/DefinitionReducer";
import { handleCommonError } from "../../Utils/validation";
import { setEnableClosedSidebar } from "../../reducers/ThemeOptions";
import MainSection from "./mainSection";
import history from "../../Utils/history";
import Vaccination from "../Vaccination";
import MedicalHistory from "../MedicalHistory";
import { useLazyQuery } from "@apollo/react-hooks";
import Media from "./media";

const PrescriptionPage = (props) => {
    let [rSelectedOption, setSelectedOption] = React.useState(1);

    if (Object.keys(props.patient).length <= 0) {
        history.push("/home");
        return null;
    }

    // fetch vaccine chart graphql query
    const [getVaccineChart] = useLazyQuery(GET_VACCINE_CHART, {
        onCompleted(data) {
            props.updateVaccineDetails(data.vaccine || []);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    useEffect(() => {
        getVaccineChart({
            variables: {
                id: props.patient.id,
            },
        });
    }, []);

    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <Row className="selection-tabs">
                <Col md="12">
                    <ButtonGroup size="sm">
                        <Button color="primary tab" onClick={() => setSelectedOption(1)} active={rSelectedOption === 1}>
                            Prescription
                        </Button>
                        <Button color="primary tab" onClick={() => setSelectedOption(2)} active={rSelectedOption === 2}>
                            Vaccination
                        </Button>
                        <Button color="primary tab" onClick={() => setSelectedOption(3)} active={rSelectedOption === 3}>
                            Medical History
                        </Button>
                        <Button color="primary tab" onClick={() => setSelectedOption(4)} active={rSelectedOption === 4}>
                            Media
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {rSelectedOption === 1 ? (
                <Row>
                    <Col md="5">
                        <Prescription patient={props.patient} favourite save delete isSmsEnabled />
                    </Col>
                    <Col md="7">
                        <MainSection />
                    </Col>
                </Row>
            ) : null}
            {rSelectedOption === 2 ? <Vaccination /> : null}
            {rSelectedOption === 3 ? <MedicalHistory setRSelectedOption={setSelectedOption} /> : null}
            {rSelectedOption === 4 ? <Media /> : null}
        </ReactCSSTransitionGroup>
    );
};

const mapStateToProps = (state) => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    patient: state.DefinitionReducer.patient,
});

const mapDispatchToProps = (dispatch) => ({
    setEnableClosedSidebar: (enable) => dispatch(setEnableClosedSidebar(enable)),
    updateVaccineDetails: (details) => dispatch(updateVaccineDetails(details)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionPage);
