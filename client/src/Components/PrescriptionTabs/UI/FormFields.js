import React from "react";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "reactstrap";
export const InputField = (props) => {
    return (
        <div className="formElement">
            <label className="row-flex">
                {props.item.label}
                <span>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                </span>
            </label>
            <Input type="text" name={props.item.name} value={props.value} onChange={props.inputChange} />
        </div>
    );
};

export const Select = (props) => {
    return (
        <div className="formElement">
            <label className="row-flex">
                {props.item.label}
                <span>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                </span>
            </label>
            <Input type="select" name={props.item.name} onChange={props.inputChange}>
                {props.item.possible_values &&
                    props.item.possible_values.map((option, index) => (
                        <option value={option} key={option} selected={option === props.value}>
                            {option}
                        </option>
                    ))}
            </Input>
        </div>
    );
};

export const Radio = (props) => {
    return (
        <div className="formElement">
            <label className="row-flex">
                {props.item.label}
                <span>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                </span>
            </label>
            <div className="mrg20">
                {props.item.possible_values &&
                    props.item.possible_values.map((option, index) => (
                        <label key={option + index}>
                            <span>{option}</span>
                            <input
                                type="radio"
                                value={option}
                                key={option}
                                name={props.item.name}
                                onChange={props.inputChange}
                                checked={option === props.value}
                            />
                        </label>
                    ))}
            </div>
        </div>
    );
};

export const CheckBox = (props) => {
    return (
        <div className="formElement">
            <label className="row-flex">
                {props.item.label}
                <span>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                </span>
            </label>
            <div className="mrg20">
                {props.item.possible_values &&
                    props.item.possible_values.map((option, index) => (
                        <label key={option + index}>
                            <span>{option}</span>
                            <input
                                type="checkbox"
                                value={option}
                                key={option}
                                name={props.item.name}
                                onChange={props.inputChange}
                                checked={option === props.value}
                            />
                        </label>
                    ))}
            </div>
        </div>
    );
};

export const TextArea = (props) => {
    return (
        <div className="formElement">
            <label className="row-flex">
                {props.item.label}
                <span>
                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                </span>
            </label>
            <Input type="textarea" name={props.item.name} onChange={props.inputChange} value={props.value} />
        </div>
    );
};
