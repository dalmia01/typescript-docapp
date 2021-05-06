import React from "react";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditDefFields = (props) => {
    const { defination, editLabelHandler, optionsChangeHandler, addToMultiOptions } = props;
    return (
        <div className="elements">
            {["input", "textarea"].includes(props.defination.field.operator) && (
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
                                    style={{ display: index === 0 && item === "Please Select" ? "none" : "inherit" }}
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
    );
};

export default EditDefFields;
