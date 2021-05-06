import React from "react";
import { Button } from "reactstrap";

import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditCommonDef = (props) => {
    const { closeForm, defination, editLabelHandler, optionsChangeHandler, addToMultiOptions, editForm } = props;

    return (
        <nav className="right-navigation">
            <div className="center bold head">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Field</h5>
                    <button className="close" onClick={closeForm}>
                        &times;
                    </button>
                </div>
            </div>
            <div className="elements">
                {["input", "textarea"].includes(defination.field.operator) && (
                    <div className="inputFields" key={defination.field.id}>
                        <input
                            type="text"
                            name={defination.field.name}
                            placeholder="label"
                            value={defination.field.label}
                            onChange={editLabelHandler}
                        />
                    </div>
                )}
                {["select", "radio", "checkbox"].includes(defination.field.operator) && (
                    <div className="inputFields select">
                        <div className="flex">
                            <input type="text" placeholder="label" value={defination.field.label} onChange={editLabelHandler} />
                            <FontAwesomeIcon icon={faPlusCircle} onClick={() => addToMultiOptions()} />
                        </div>
                        {defination.field.possible_values.map((item, index) => {
                            if (defination.field.operator === "select") {
                                return (
                                    <input
                                        type="text"
                                        placeholder={`option`}
                                        name="radio"
                                        key={defination.field.id + index}
                                        value={item}
                                        onChange={(e) => optionsChangeHandler(e, index)}
                                        style={{ display: index === 0 ? "none" : "inherit" }}
                                    />
                                );
                            } else {
                                return (
                                    <input
                                        type="text"
                                        placeholder={`option`}
                                        name="radio"
                                        key={defination.field.id + index}
                                        value={item}
                                        onChange={(e) => optionsChangeHandler(e, index)}
                                    />
                                );
                            }
                        })}
                    </div>
                )}
            </div>
            <div className="center bold btns foot">
                <Button color="info" onClick={editForm}>
                    Save
                </Button>
            </div>
        </nav>
    );
};

export default EditCommonDef;
