import React from "react";

export default function SelectBox(props) {
    let { select, openContent, changeField, changelabel } = props;

    return (
        <div className="mainFieldSet">
            <div className="card-header-tab card-header">
                <div className="card-header-title">
                    <i className="header-icon lnr-pointer-up icon-gradient bg-tempting-azure"> </i>Dropdown
                </div>
                {select.arr.length < 1 && (
                    <div className="btn-actions-pane-right">
                        <button
                            type="button"
                            onClick={() => openContent("select")}
                            className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate"
                        >
                            <i className="pe-7s-plus"></i>
                        </button>
                    </div>
                )}
            </div>

            {select.arr.length > 0 && (
                <div className="inputFields select">
                    <div className="flex">
                        <input type="text" placeholder="label" value={select.label} onChange={(e) => changelabel(e, "selectlabel")} />
                        <i className="pe-7s-plus" onClick={() => openContent("select")}></i>
                    </div>
                    {select.arr.map((item, index) => {
                        return (
                            <input
                                type="text"
                                placeholder={`option`}
                                name="radio"
                                key={"selectoption" + index}
                                value={item.value}
                                onChange={(e) => changeField(e, "dynamicselect", index)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
