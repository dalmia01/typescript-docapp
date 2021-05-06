import React from "react";
import { Input } from "reactstrap";

const PatientSearch = (props) => {
    const { searchText, onSearchTextChange } = props;

    return <Input type="text" placeholder="Search using name or number" onChange={onSearchTextChange} value={searchText} />;
};

export default PatientSearch;
