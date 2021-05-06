import React from "react";

export default function InputBox(props) {
    let { textarea, openContent, changeField } = props;

    return (
        <div className="mainFieldSet">
            <div className="card-header-tab card-header">
                <div className="card-header-title">
                    <i className="header-icon lnr-text-align-justify icon-gradient bg-tempting-azure"> </i>Big Input Box
                </div>
                {textarea.arr.length < 1 && (
                    <div className="btn-actions-pane-right">
                        <button
                            type="button"
                            onClick={() => openContent("textarea")}
                            className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate"
                        >
                            <i className="pe-7s-plus"></i>
                        </button>
                    </div>
                )}
            </div>

            <div>
                {textarea.arr.map((item, index) => {
                    return (
                        <div className="inputFields" key={"input" + index}>
                            <input
                                type="text"
                                name="dynamictextarea"
                                placeholder="label"
                                value={item.value}
                                onChange={(e) => changeField(e, "dynamictextarea")}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
