import React from "react";

import { Input, FormGroup, Label } from "reactstrap";

export const SelectField = (props) => {
    return (
        <Input type="select" name={props.name} onChange={props.valuesChangeHandler} value={props.value}>
            {props.possible_values &&
                props.possible_values.map((option, index) => (
                    <option value={option} key={option} selected={option === props.value}>
                        {props.text ? props.text[index] : option}
                    </option>
                ))}
        </Input>
    );
};

export const InputField = (props) => (
    <Input
        type={props.inputType ? props.inputType : "input"}
        defaultValue={props.defaultValue}
        name={props.name}
        onChange={props.valuesChangeHandler}
        value={props.value}
        min={props.min}
        readOnly={props.someType === "timings" && props.readOnly}
    />
);

export const RadioField = (props) => (
    <FormGroup check inline>
        <Label check>
            <Input
                type="radio"
                name={props.name}
                onChange={props.valuesChangeHandler}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
            />
            {props.textValue || props.value}
        </Label>
    </FormGroup>
);

export const CheckField = (props) => (
    <FormGroup check inline>
        <Label check>
            <Input
                type="checkbox"
                name={props.name}
                onChange={props.valuesChangeHandler}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
            />
            {props.textValue || props.value}
        </Label>
    </FormGroup>
);

export const TextField = (props) => <Input type="textarea" name={props.name} onChange={props.valuesChangeHandler} value={props.value} />;
