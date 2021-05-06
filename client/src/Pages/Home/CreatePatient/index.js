import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Col, Row, Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { validateDate, formatDate } from "../../../Utils/validation";
import moment from "moment";
import { setHomeRightSideContent } from "../../../reducers/DefinitionReducer";
import { setSpecificPatient, setFilteredPatients } from "../../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../../actions/authActions";
import { CREATE_PATIENT, EDIT_PATIENT } from "../../../Utils/Graphql/patientsGraphql";
import { handleCommonError } from "../../../Utils/validation";
import { DEFAULT_CREATED_SUCCESS, DEFAULT_UPDATED_SUCCESS } from "../../../Utils/Constants/messageConstants";
import "./_index.scss";

const CreatePatient = (props) => {
    let propsPatientKeysLength = Object.keys(props.patient).length > 0;

    let title = "mrs",
        sex = "female",
        fname = "",
        lname = "",
        patient_serial_id = "",
        dob = null,
        bloodGroup = "NA",
        email = "",
        phone = "",
        line_1 = "",
        area = "",
        city = "",
        state = "",
        pincode = "";

    if (propsPatientKeysLength) {
        title = props.patient.salutation || "mrs";
        sex = props.patient.sex || "female";
        fname = props.patient.first_name || "";
        lname = props.patient.last_name || "";
        patient_serial_id = props.patient.patient_serial_id || "";
        dob = props.patient.dob || null;
        bloodGroup = props.patient.blood_grp || "NA";
        email = props.patient.email || "";
        phone = props.patient.phone || "";
        line_1 = props.patient.address.line_1 || "";
        area = props.patient.address.area || "";
        city = props.patient.address.city || "";
        state = props.patient.address.state || "";
        pincode = String(props.patient.address.pincode) || "";
    }

    const [errors, setErrors] = React.useState({ date: "" });

    const [formValues, setFormValues] = React.useState({
        title: title,
        sex: sex,
        fname: fname,
        lname: lname,
        patient_serial_id: patient_serial_id,
        dob: moment(dob).format("YYYY-MM-DD"),
        bloodGroup: bloodGroup,
        email: email,
        phone: phone,
        line_1: line_1,
        area: area,
        city: city,
        state: state,
        pincode: pincode,
    });

    const [btnAbility, setBtnAbility] = React.useState(false);

    const datePickerRef = React.useRef(null);

    /**
     *  on page load checking and setting local state based on creating or updating  patient
     */

    React.useEffect(() => {
        if (!propsPatientKeysLength) {
            setFormValues({
                title: "mrs",
                sex: "female",
                fname: "",
                lname: "",
                patient_serial_id: "",
                dob: null,
                bloodGroup: "NA",
                email: "",
                phone: "",
                line_1: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
            });
        }
    }, [props.patient]);

    /**
     *  on page load checking and setting local state based on creating or updating  patient
     */

    /**
     *  graphql request to add new patient
     */

    const [createPatient] = useMutation(CREATE_PATIENT, {
        update: (_, data) => {
            toast.success(DEFAULT_CREATED_SUCCESS);
            props.setHomeRightSideContent("selectCustom", {});
            props.setFilteredPatients([...props.filtered_patients, data.data.patient]);
        },
        variables: formValues,
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
            setBtnAbility(false);
        },
    });

    /**
     *  graphql request to add new patient
     */

    /**
     *  graphql request to edit patient details
     */
    const [editPatient] = useMutation(EDIT_PATIENT, {
        update: (_, data) => {
            toast.success(DEFAULT_UPDATED_SUCCESS);
            const updatedPatientData = { ...props.patient, ...data.data.patient };
            props.setHomeRightSideContent("specificPatient", updatedPatientData);
            props.setSpecificPatient(updatedPatientData);
        },
        variables: { ...formValues, id: props.patient.id },
        onError: (err) => {
            handleCommonError(err, props.setAuthLogout);
            setBtnAbility(false);
        },
    });

    /**
     *  graphql request to edit patient details
     */

    /**
     *  on fields values change set local state
     */

    const onChange = (e) => {
        if (["phone"].includes(e.target.name)) {
            setFormValues({ ...formValues, [e.target.name]: e.target.value.replace(/\D/, "") });
        } else {
            setFormValues({ ...formValues, [e.target.name]: e.target.value });
        }
    };

    /**
     *  on fields values change set local state
     */

    /**
     *  submit form (conditional check done, based on add, or edit patient)
     */

    const onSubmit = (e) => {
        e.preventDefault();
        if (formValues.dob) {
            setErrors({ ...errors, dob: "" });
        } else {
            setErrors({ ...errors, dob: "Date of Birth is Required" });
            window.scrollTo(0, 0);
            return false;
        }

        setBtnAbility(true);

        if (propsPatientKeysLength) {
            editPatient();
        } else {
            createPatient();
        }
    };

    /**
     *  submit form (conditional check done, based on add, or edit patient)
     */

    // date of birth
    const settingDateHandler = (e) => {
        if(e.target.value) {
            setErrors({ ...errors, dob: "" });
            setFormValues({ ...formValues, dob: e.target.value });
        }
    };

    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <Card className="main-card mb-3">
                <CardBody>
                    <CardTitle>
                        {propsPatientKeysLength ? "Modify Patient Details" : "Add New Patient"}
                        <button className="close" onClick={() => props.setHomeRightSideContent("selectCustom", {})}>
                            &times;
                        </button>
                    </CardTitle>
                    <Form onSubmit={onSubmit}>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="title">Title</Label>
                                    <Input type="select" name="title" id="title" value={formValues.title} onChange={onChange}>
                                        <option value="mrs">Mrs</option>
                                        <option value="mr">Mr</option>
                                        <option value="master">Master</option>
                                        <option value="miss">Miss</option>
                                        <option value="others">Others</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="gender">Gender</Label>
                                    <Input type="select" name="sex" id="sex" value={formValues.sex} onChange={onChange}>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="transgender">Transgender</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="dob">Date of Birth</Label>
                                    <br />
                                    {errors.dob !== "" && <span style={{ color: "red" }}>{errors.dob}</span>}
                                    <Input
                                        type="date"
                                        name="dob"
                                        id="customDate"
                                        placeholder="MM/DD/YYYY"
                                        value={formValues.dob || ""}
                                        onChange={settingDateHandler}
                                        pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="fname">First Name</Label>
                                    <Input
                                        type="text"
                                        required
                                        name="fname"
                                        id="fname"
                                        placeholder="First Name"
                                        value={formValues.fname}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="lname">Last Name</Label>
                                    <Input
                                        type="text"
                                        required
                                        name="lname"
                                        id="lname"
                                        placeholder="last Name"
                                        value={formValues.lname}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="patient_serial_id">Patient Id ( For old Patients)</Label>
                                    <Input
                                        type="number"
                                        name="patient_serial_id"
                                        id="patient_serial_id"
                                        placeholder="Patient Id"
                                        value={formValues.patient_serial_id}
                                        onChange={onChange}
                                        min={1}
                                        max={9999}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="email">Email Address</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Email Address"
                                        value={formValues.email}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="phone">Phone Number</Label>
                                    <Input
                                        type="text"
                                        required
                                        name="phone"
                                        id="phone"
                                        placeholder="Phone number"
                                        value={formValues.phone}
                                        onChange={onChange}
                                        pattern="[0-9]*"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="bloodGroup">Blood Group</Label>
                                    <Input
                                        type="select"
                                        name="bloodGroup"
                                        id="bloodGroup"
                                        value={formValues.bloodGroup}
                                        onChange={onChange}
                                    >
                                        <option value="NA">Please Select</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="line_1">Line 1</Label>
                                    <Input
                                        type="text"
                                        name="line_1"
                                        id="line_1"
                                        placeholder="Line 1"
                                        value={formValues.line_1}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="area">Area</Label>
                                    <Input
                                        type="text"
                                        name="area"
                                        id="area"
                                        placeholder="Area"
                                        value={formValues.area}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="city">city</Label>
                                    <Input
                                        type="text"
                                        name="city"
                                        id="city"
                                        placeholder="city"
                                        value={formValues.city}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="state">State</Label>
                                    <Input
                                        type="text"
                                        name="state"
                                        id="state"
                                        placeholder="State"
                                        value={formValues.state}
                                        onChange={onChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="pincode">Pincode</Label>
                                    <Input
                                        type="text"
                                        name="pincode"
                                        id="pincode"
                                        placeholder="Pincode"
                                        value={formValues.pincode}
                                        onChange={onChange}
                                        pattern="[0-9]*"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Button type="submit" color="primary" disabled={btnAbility}>
                            {propsPatientKeysLength ? "Modify" : "Add"}
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </ReactCSSTransitionGroup>
    );
};

const mapStatetoProps = (state) => ({
    patient: state.DefinitionReducer.patient,
    filtered_patients: state.DefinitionReducer.filtered_patients,
});

const mapDispatchToProps = (dispatch) => ({
    setHomeRightSideContent: (homeContent, patient) => dispatch(setHomeRightSideContent(homeContent, patient)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setSpecificPatient: (patient) => dispatch(setSpecificPatient(patient)),
    setFilteredPatients: (filtered_patients) => dispatch(setFilteredPatients(filtered_patients)),
});

export default connect(mapStatetoProps, mapDispatchToProps)(CreatePatient);
