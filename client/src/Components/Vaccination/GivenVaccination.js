import React from "react";
import DatePicker from "react-datepicker";
import { Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";
import moment from "moment";
import { useLazyQuery } from "@apollo/react-hooks";
import { FILTER_VACCINE_GIVEN_PATIENT } from "../../Utils/Graphql/vaccineGraphql";
import { handleCommonError } from "../../Utils/validation";
import { setAuthLogout } from "../../actions/authActions";
import DatePickerView from "../Common/DatePickerView";
import VaccinesTable from "./VaccinesTable";

const GivenVaccination = (props) => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [givenVaccinePatients, setGivenVaccinePatients] = React.useState([]);

    /**
     *  setting date handler
     */

    const settingDateHandler = (date) => {
        setStartDate(date);
        getData({
            variables: {
                filter: JSON.stringify({
                    start: moment(date).add(-1, "days").format("YYYY-MM-DD"),
                    end: moment(date).format("YYYY-MM-DD"),
                }),
            },
        });
    };

    // get patients on filter - graphql request to get patients data
    const [getData, { loading }] = useLazyQuery(FILTER_VACCINE_GIVEN_PATIENT, {
        onCompleted(patientData) {
            setGivenVaccinePatients(patientData.patients);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    React.useEffect(() => {
        getData({
            variables: {
                filter: JSON.stringify({
                    start: moment(startDate).add(-1, "days").format("YYYY-MM-DD"),
                    end: moment(startDate).format("YYYY-MM-DD"),
                }),
            },
        });
    }, []);

    return (
        <div>
            <Row>
                <Col md="4">
                    <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={startDate}
                        onChange={(date) => settingDateHandler(date)}
                        popperClassName="datepicker-poper"
                        showPopperArrow={false}
                        showYearDropdown
                        showMonthDropdown
                        customInput={<DatePickerView />}
                    />
                </Col>
            </Row>

            <VaccinesTable
                vaccinedPatients={givenVaccinePatients}
                noDataContent="No vaccines given to patients"
                title="Already Given Vaccinations"
            />
        </div>
    );
};

const mapStateToProps = (state) => ({});

const maspDispatchToProsp = (dispatch) => ({
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, maspDispatchToProsp)(GivenVaccination);
