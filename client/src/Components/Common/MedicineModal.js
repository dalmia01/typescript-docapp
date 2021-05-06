import React from "react";
import { Modal, Input } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { connect } from "react-redux";

import { ADD_MEDICINE_MUTATION, EDIT_MEDICINE_MUTATION } from "../../Utils/Graphql/commonDefinitionGraphql";
import { handleCommonError } from "../../Utils/validation";
import { setSelectedOption, setDefinitionList, setPrescription } from "../../reducers/DefinitionReducer";
import { setAuthLogout } from "../../actions/authActions";
import CustomSelect from "../Common/CustomSelect";
import { MEDICINE_FORMS } from "../../Utils/Constants/commonConstants";

const MedicineModal = (props) => {
    let [medicine, setMedicine] = React.useState({ name: "", description: "", dosageForm: "Please Select" });

    // adding mediocine defiantion , name & description - graphql request
    const [addMedicineMutation] = useMutation(ADD_MEDICINE_MUTATION, {
        update: async (_, data) => {
            props.setDefinitionList({
                all: [...props.definitionList.all, data.data.defination],
                selected: [...props.definitionList.selected, data.data.defination],
                nonSelected: [...props.definitionList.nonSelected],
            });
            props.setPrescription([...props.prescription, data.data.defination]);
            props.setSelectedOption(data.data.defination);
            toast.success(`${props.category} added successfully`);
            props.setModalVisibility(false);
        },
        onError: async (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // editing mediocine defiantion , name & description - graphql request
    const [editMedicineMutation] = useMutation(EDIT_MEDICINE_MUTATION, {
        update: async (_, data) => {
            let allsFilter = props.definitionList.all.filter((item) => item.id !== data.data.defination.id);
            let selectFilter = props.definitionList.selected.filter((item) => item.id !== data.data.defination.id);
            let alls = [...allsFilter, data.data.defination];
            let selected = [...selectFilter, data.data.defination];
            props.prescription.map((medicine) => {
                if (medicine.id === data.data.defination.id) {
                    medicine.description = data.data.defination.description;
                    medicine.dosageForm = data.data.defination.dosageForm;
                }
            });
            props.setPrescription([...props.prescription]);
            props.setDefinitionList({
                all: [...alls],
                selected: [...selected],
            });
            toast.success(`${props.category} updated successfully`);
            props.setModalVisibility(false);
        },
        onError: async (err) => {
            handleCommonError(err, props.setAuthLogout);
        },
    });
    // saving medicine name & description
    const saveMedicineName = (medicine) => {
        addMedicineMutation({ variables: { ...medicine, category: props.category } });
    };

    // editing medicine name & description
    const editMedicineName = (medicine) => {
        editMedicineMutation({ variables: { ...medicine, category: props.category } });
    };

    // close popup modal
    const closeModal = () => {
        setMedicine({ name: "", description: "", dosageForm: "Please Select" });
        props.setModalVisibility(false);
    };

    React.useEffect(() => {
        if (props.edit) {
            setMedicine({
                name: props.selectedOption.name,
                description: props.selectedOption.description || "",
                dosageForm: props.selectedOption.dosageForm || "Please Select",
            });
        }
    }, []);

    return (
        <Modal isOpen={props.isOpen}>
            <div className="modal-header">
                <h5 className="modal-title">{props.title}</h5>
                <button className="close" onClick={closeModal}>
                    ×
                </button>
            </div>
            <div className="modal-body">
                <form className="">
                    <div className="form-row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="exampleEmail11" className="">
                                    Name
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="add medicine name"
                                    value={medicine.name}
                                    onChange={(e) => setMedicine({ ...medicine, [e.target.name]: e.target.value })}
                                    readOnly={props.edit ? true : false}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="exampleEmail11" className="">
                                    Dosage Form
                                </label>
                                <CustomSelect
                                    name="dosageForm"
                                    value={medicine.dosageForm}
                                    possible_values={MEDICINE_FORMS}
                                    defaultValue={"Please Select"}
                                    valuesChangeHandler={(value) => setMedicine({ ...medicine, dosageForm: value })}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="exampleEmail11" className="">
                                    Description
                                </label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    placeholder="add medicine description"
                                    value={medicine.description}
                                    onChange={(e) => setMedicine({ ...medicine, [e.target.name]: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-link" onClick={closeModal}>
                    Cancel
                </button>

                {props.edit ? (
                    <button
                        type="button"
                        className="btn btn-success"
                        disabled={medicine.name.trim().length < 3 ? true : false}
                        onClick={() => editMedicineName(medicine)}
                    >
                        Update
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-success"
                        disabled={medicine.name.trim().length < 3 ? true : false}
                        onClick={() => saveMedicineName(medicine)}
                    >
                        Save
                    </button>
                )}
            </div>
        </Modal>
    );
};
const mapStateToProps = (state) => ({
    selectedOption: state.DefinitionReducer.selectedOption,
    definitionList: state.DefinitionReducer.definitionList,
    prescription: state.DefinitionReducer.prescription,
});

const mapDispatchToProps = (dispatch) => ({
    setSelectedOption: (selectedOption) => dispatch(setSelectedOption(selectedOption)),
    setAuthLogout: () => dispatch(setAuthLogout()),
    setDefinitionList: (definitionList) => dispatch(setDefinitionList(definitionList)),
    setPrescription: (prescription) => dispatch(setPrescription(prescription)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MedicineModal);
