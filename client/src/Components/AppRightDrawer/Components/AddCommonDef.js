import React from "react";
import { Button } from "reactstrap";

import InputBox from "./InputBox";
import SelectBox from "./SelectBox";
import RadioBox from "./RadioBox";
import CheckBox from "./CheckBox";
import TextBox from "./TextBox";

const AddCommonDef = (props) => {
    const { closeForm, input, openContent, changeField, select, radio, check, textarea, buildForm, changelabel } = props;

    return (
        <nav className="right-navigation">
            <div className="center bold head">
                <div className="modal-header">
                    <h5 className="modal-title">Add Fields</h5>
                    <button className="close" onClick={closeForm}>
                        &times;
                    </button>
                </div>
            </div>
            <div className="elements">
                <InputBox input={input} openContent={openContent} changeField={changeField} />

                <SelectBox select={select} openContent={openContent} changeField={changeField} changelabel={changelabel} />

                <RadioBox radio={radio} openContent={openContent} changeField={changeField} changelabel={changelabel} />

                <CheckBox check={check} openContent={openContent} changeField={changeField} changelabel={changelabel} />

                <TextBox textarea={textarea} openContent={openContent} changeField={changeField} />
            </div>
            <div className="center bold btns foot">
                <Button color="info" onClick={buildForm}>
                    Save
                </Button>
            </div>
        </nav>
    );
};

export default AddCommonDef;
