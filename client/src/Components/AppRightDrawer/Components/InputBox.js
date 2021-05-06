import React from "react";

export default function InputBox(props) {
    let { input, openContent, changeField } = props;

    return (
        <div className="mainFieldSet">
            <div className="card-header-tab card-header">
                <div className="card-header-title">
                    <i className="header-icon lnr-line-spacing icon-gradient bg-tempting-azure"> </i>Small text box
                </div>
                {input.arr.length < 1 && (
                    <div className="btn-actions-pane-right">
                        <button
                            type="button"
                            onClick={() => openContent("input")}
                            className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate"
                        >
                            <i className="pe-7s-plus"></i>
                        </button>
                    </div>
                )}
            </div>
            <div>
                {input.arr.map((item, index) => {
                    return (
                        <div className="inputFields" key={"input" + index}>
                            <input
                                type="text"
                                name="dynamicinput"
                                placeholder="label"
                                value={item.value}
                                onChange={(e) => changeField(e, "dynamicinput")}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
