import React from "react";

export default function SelectedDefinations(props) {
    return (
        <div className="select-Multiple fixed-height">
            {props.selectedDefinitions && props.selectedDefinitions.length === 0 && (
                <span className="add-selectedDefinitions">Add {props.category}</span>
            )}

            {props.selectedDefinitions && props.selectedDefinitions.length > 0 && (
                <div className="selct-itemmain-div">
                    {props.selectedDefinitions.length > 0 &&
                        props.selectedDefinitions.map((item, index) => {
                            return (
                                <div
                                    className={item.id == props.selectedOption.id ? "active-option select-initem-div" : "select-initem-div"}
                                    key={index + item + "is"}
                                >
                                    <div className={"select-initem-span"} onClick={() => props.viewOption(item)}>
                                        <span>{item.name}</span>
                                    </div>

                                    <i
                                        className={item.id == props.selectedOption.id ? "fatimes active-times" : "fatimes"}
                                        onClick={(e) => props.removeFromSelectedOptions(e, item)}
                                    ></i>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
