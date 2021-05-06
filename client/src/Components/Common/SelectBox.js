import React from "react";

const SelectBox = (props) => {
    return (
        <select className="mb-2 form-control" onChange={props.selectHandler} value={props.value} disabled={props.disabled}>
            <option value="-1">{props.defaultText}</option>
            {props.options &&
                props.options.map((option) => {
                    return (
                        <option key={option.key || option} value={option.value || option}>
                            {option.text || option}
                        </option>
                    );
                })}
        </select>
    );
};

export default SelectBox;
