import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { v4 as uuid } from "uuid";

import PopUpModalUI from "./UI";
import { setPopUpModal } from "../../reducers/ThemeOptions";
import { setAuthLogout } from "../../actions/authActions";

import { CREATE_USER, EDIT_USER } from "../../Utils/Graphql/usersGraphql";
import { handleCommonError } from "../../Utils/validation";
import { DEFAULT_CREATED_SUCCESS, DEFAULT_UPDATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { ADD_CLINIC, FETCH_CLINICS } from "../../Utils/Graphql/clinicsGraphql";
const PopUpModal = (props) => {
    const [formValues, setFormValues] = React.useState({
        title: "mrs",
        sex: "female",
        age: "",
        role: "admin",
        designation: "",
        password: "",
        fname: "",
        lname: "",
        email: "",
        phone: "",
        line: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        clinics: "",
    });

    const [clinicsValues, setClinicsValues] = React.useState({
        clinicName: "",
        address: "",
        phoneNum: "",
        website: "",
    });

    // on page load checking and setting local state based on creating or updating  user
    React.useEffect(() => {
        if (props.popUpModalContent.type === "edit user") {
            const {user} = props.popUpModalContent.content
            setFormValues({
                title: user.title || "mrs",
                sex: user.gender || "female",
                age: user.age || "",
                role: user.role || "admin",
                designation: user.designation || "",
                password: "",
                fname: user.first_name || "",
                lname: user.last_name || "",
                email: user.email || "",
                phone: user.phone || "",
                line: (user.address && user.address.line) || "",
                area: (user.address && user.address.area) || "",
                city: (user.address && user.address.city) || "",
                state: (user.address && user.address.state) || "",
                pincode: (user.address && user.address.pincode) || "",
                clinics: (user.clinic && user.clinic.id) || "",
            });
        }
    }, []);
    
    // graphql request to create user
    let [createUser] = useMutation(CREATE_USER, {
        update(_, data) {
            props.setPopUpModal({});
            toast.success(DEFAULT_CREATED_SUCCESS);
        },
        variables: formValues,
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });
    
    // graphql request to edit user details
    let [editUser] = useMutation(EDIT_USER, {
        update(_, data) {
            props.setPopUpModal({});
            toast.success(DEFAULT_UPDATED_SUCCESS);
        },
        variables: formValues,
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });
    
    // on fields values change set local state formValues
    const onChange = (e) => {
        if (Object.keys(formValues).includes(e.target.name)) {
            if (["age", "phone"].includes(e.target.name)) {
                setFormValues({ ...formValues, [e.target.name]: e.target.value.replace(/\D/, "") });
            } else {
                setFormValues({ ...formValues, [e.target.name]: e.target.value });
            }
        } else if (Object.keys(clinicsValues).includes(e.target.name)) {
            if (["phoneNum"].includes(e.target.name)) {
                setClinicsValues({ ...clinicsValues, [e.target.name]: e.target.value.replace(/\D/, "") });
            } else {
                setClinicsValues({ ...clinicsValues, [e.target.name]: e.target.value });
            }
        }
    };

    // submit form (conditional check done, based on add, or edit user)
    const onSubmit = (e) => {
        e.preventDefault();

        // eslint-disable-next-line default-case
        switch (props.popUpModalContent.type) {
            case "add user":
                createUser();
                break;
            case "edit user":
                editUser();
                break;
            case "Update Clinic":
                addClinic();
                break;
        }
    };

    // close pop up modal
    const closeModal = () => {
        props.setPopUpModal({});
    };

    // graphql request to add clinic
    let [addClinic] = useMutation(ADD_CLINIC, {
        update(_, data) {
            props.setPopUpModal({});
            toast.success(DEFAULT_CREATED_SUCCESS);
        },
        variables: clinicsValues,
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    /** fetch clinics */

    let [clinics, setClinics] = React.useState([]);

    const [fetchClinics] = useLazyQuery(FETCH_CLINICS, {
        onCompleted(data) {
            data.clinics && setClinics(data.clinics);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
        fetchPolicy: "network-only",
    });

    React.useEffect(() => {
        fetchClinics({ variables: { filter: "all clinics" } });
    }, [props.popUpModalContent]);

    return (
        <PopUpModalUI
            closeModal={closeModal}
            formValues={formValues}
            setFormValues={setFormValues}
            clinicsValues={clinicsValues}
            setClinicsValues={setClinicsValues}
            onChange={onChange}
            onSubmit={onSubmit}
            popUpModalContent={props.popUpModalContent}
            clinics={clinics}
        />
    );
};

const mapStateToProps = (state) => ({
    popUpModalContent: state.ThemeOptions.popUpModalContent,
});

const mapDispatchToProps = (dispatch) => ({
    setPopUpModal: (popUpModal) => dispatch(setPopUpModal(popUpModal)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopUpModal);
