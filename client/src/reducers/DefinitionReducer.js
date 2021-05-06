export const SET_SELECTED_OPTION = "DEFINITION_REDUCER/SET_SELECTED_OPTION";
export const SET_PRESCRIPTION = "DEFINITION_REDUCER/SET_PRESCRIPTION";
export const SET_DEFINATION = "DEFINITION_REDUCER/SET_DEFINATION";
export const SET_ALL_PRESCRIPTIONS = "DEFINITION_REDUCER/SET_ALL_PRESCRIPTIONS";
export const SET_VIEW_PRESCRIPTION = "DEFINITION_REDUCER/SET_VIEW_PRESCRIPTION";
export const SET_SPECIFIC_PATIENT = "DEFINITION_REDUCER/SET_SPECIFIC_PATIENT";
export const SET_DEFINITION_LIST = "DEFINITION_REDUCER/SET_DEFINITION_LIST";
export const UPDATE_VACCINE_DETAILS = "DEFINITION_REDUCER/UPDATE_VACCINE_DETAILS";
export const SET_MEDICAL_HISTORY = "DEFINITION_REDUCER/SET_MEDICAL_HISTORY";
export const SET_HOME_RIGHT_SIDE_CONTENT = "DEFINITION_REDUCER/SET_HOME_RIGHT_SIDE_CONTENT";
export const SET_FILTERED_PATIENTS = "DEFINITION_REDUCER/SET_FILTERED_PATIENTS";

export const setSelectedOption = (selectedOption) => ({
    type: SET_SELECTED_OPTION,
    selectedOption,
});

export const setPrescription = (prescription) => ({
    type: SET_PRESCRIPTION,
    prescription,
});

export const setDefinition = (defination) => ({
    type: SET_DEFINATION,
    defination,
});

export const setAllPrescriptions = (allPrescriptions) => ({
    type: SET_ALL_PRESCRIPTIONS,
    allPrescriptions,
});

export const setViewPrescription = (viewPrescription) => ({
    type: SET_VIEW_PRESCRIPTION,
    viewPrescription,
});

export const setSpecificPatient = (patient) => ({
    type: SET_SPECIFIC_PATIENT,
    patient,
});

export const setDefinitionList = (definitionList) => ({
    type: SET_DEFINITION_LIST,
    definitionList,
});

export const updateVaccineDetails = (details) => ({
    type: UPDATE_VACCINE_DETAILS,
    vaccine: details,
});

export const setMedicalHistory = (medicalHistory) => ({
    type: SET_MEDICAL_HISTORY,
    medicalHistory,
});

export const setHomeRightSideContent = (homeContent, patient = {}) => ({
    type: SET_HOME_RIGHT_SIDE_CONTENT,
    homeContent,
    patient,
});

export const setFilteredPatients = (filtered_patients = []) => ({
    type: SET_FILTERED_PATIENTS,
    filtered_patients,
});

export default function reducer(
    state = {
        selectOptions: [],
        selectedOption: {},
        prescription: [], // prescription in-progress (creation)
        defination: {},
        vaccine: [], // vaccine details of a patient
        allPrescriptions: [], // list of prescription of a patient
        viewPrescription: {}, // selected prescription from list of prescription
        patient: {},
        filtered_patients: [],
        definitionList: {
            all: [],
            selected: [],
            nonSelected: [],
        },
        medicalHistory: [],
        homeContent: "selectCustom",
    },
    action
) {
    switch (action.type) {
        case SET_SELECTED_OPTION:
            return {
                ...state,
                selectedOption: action.selectedOption,
            };
        case SET_PRESCRIPTION:
            return {
                ...state,
                prescription: action.prescription,
            };
        case SET_DEFINATION:
            return {
                ...state,
                defination: action.defination,
            };
        case SET_ALL_PRESCRIPTIONS:
            return {
                ...state,
                allPrescriptions: action.allPrescriptions,
            };
        case SET_VIEW_PRESCRIPTION:
            return {
                ...state,
                viewPrescription: action.viewPrescription,
            };
        case SET_SPECIFIC_PATIENT:
            return {
                ...state,
                patient: action.patient,
            };
        case SET_DEFINITION_LIST:
            return {
                ...state,
                definitionList: { ...state.definitionList, ...action.definitionList },
            };
        case UPDATE_VACCINE_DETAILS:
            return {
                ...state,
                vaccine: action.vaccine,
            };
        case SET_MEDICAL_HISTORY:
            return {
                ...state,
                medicalHistory: action.medicalHistory,
            };
        case SET_HOME_RIGHT_SIDE_CONTENT:
            return {
                ...state,
                homeContent: action.homeContent,
                patient: action.patient,
            };
        case SET_FILTERED_PATIENTS:
            return {
                ...state,
                filtered_patients: action.filtered_patients,
            };
        default:
            return state;
    }
}
