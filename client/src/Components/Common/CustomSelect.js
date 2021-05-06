import React from "react";
import "./_custom.scss";
import useOutsideClick from "../../Utils/CustomHooks/UseOutsideClick";

const CustomSelect = (props) => {
    let [dropDownVisibility, setDropDownVisibility] = React.useState(false);
    const ref = React.useRef();

    useOutsideClick(ref, () => {
        if (dropDownVisibility) setDropDownVisibility(false);
    });

    const settingSelectValue = (e, selectValue) => {
        setDropDownVisibility(false);
        props.valuesChangeHandler(selectValue);
    };

    return (
        <div class="select-dropdown js-dropdown">
            <span class="select-button select-button--dropdown " onClick={() => setDropDownVisibility(!dropDownVisibility)}>
                {props.value}
            </span>
            <ul class="select-dropdown__list" style={{ display: dropDownVisibility ? "block" : "none" }} ref={ref}>
                {props.possible_values &&
                    props.possible_values.map((selectValue, index) => {
                        return (
                            <li
                                name={props.name}
                                value={selectValue}
                                onClick={(e) => settingSelectValue(e, selectValue)}
                                key={`selectValue${index}`}
                                class="select-dropdown__item"
                            >
                                {selectValue}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default CustomSelect;
