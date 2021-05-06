import React from "react";

import InputBox from "./InputBox";
import SelectBox from "./SelectBox";
import RadioBox from "./RadioBox";
import CheckBox from "./CheckBox";
import TextBox from "./TextBox";

const AddDefFields = (props) => {
    const { input, openContent, changeField, select, radio, check, textarea, changelabel } = props;
    return (
        <React.Fragment>
            <InputBox input={input} openContent={openContent} changeField={changeField} />

            <SelectBox select={select} openContent={openContent} changeField={changeField} changelabel={changelabel} />

            <RadioBox radio={radio} openContent={openContent} changeField={changeField} changelabel={changelabel} />

            <CheckBox check={check} openContent={openContent} changeField={changeField} changelabel={changelabel} />

            <TextBox textarea={textarea} openContent={openContent} changeField={changeField} />
        </React.Fragment>
    );
};

export default AddDefFields;
