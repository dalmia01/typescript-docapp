import React from "react";

export default function CheckBox(props) {
    let { check, openContent, changeField, changelabel } = props;

    return (
        <div className="mainFieldSet">
            <div className="card-header-tab card-header">
                <div className="card-header-title">
                    <i className="header-icon lnr-spell-check icon-gradient bg-tempting-azure"> </i>Checkox
                </div>
                {check.arr.length < 1 && (
                    <div className="btn-actions-pane-right">
                        <button
                            type="button"
                            onClick={() => openContent("checkbox")}
                            className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate"
                        >
                            <i className="lnr-plus-circle"></i>
                        </button>
                    </div>
                )}
            </div>

            {check.arr.length > 0 && (
                <div className="inputFields select">
                    <div className="flex">
                        <input type="text" placeholder="label" value={check.label} onChange={(e) => changelabel(e, "checklabel")} />
                        <i className="lnr-plus-circle" onClick={() => openContent("checkbox")}></i>
                    </div>
                    {check.arr.map((item, index) => {
                        return (
                            <input
                                type="text"
                                placeholder={`option`}
                                name="check"
                                key={"checkoption" + index}
                                value={item.value}
                                onChange={(e) => changeField(e, "dynamiccheck", index)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
