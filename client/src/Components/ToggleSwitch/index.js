import React from "react";

export default function ToggleSwitch({ onChange, checked = false, className = "", style = {} }) {
    const classes = "toggle-switch " + className;
    return (
        <label className={classes} style={style}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider round"></span>
        </label>
    );
}
