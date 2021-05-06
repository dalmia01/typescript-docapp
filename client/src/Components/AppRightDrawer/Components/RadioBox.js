import React from "react";

export default function RadioBox(props) {
    let { radio, openContent, changeField, changelabel } = props;

    return (
        <div className="mainFieldSet">
            <div className="card-header-tab card-header">
                <div className="card-header-title">
                    <i className="header-icon lnr-pointer-up icon-gradient bg-tempting-azure"> </i>Radio
                </div>
                {radio.arr.length < 1 && (
                    <div className="btn-actions-pane-right">
                        <button
                            type="button"
                            onClick={() => openContent("radio")}
                            className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate"
                        >
                            <i className="lnr-plus-circle"></i>
                        </button>
                    </div>
                )}
            </div>

            {radio.arr.length > 0 && (
                <div className="inputFields select">
                    <div className="flex">
                        <input type="text" placeholder="label" value={radio.label} onChange={(e) => changelabel(e, "radiolabel")} />
                        <i className="lnr-plus-circle" onClick={() => openContent("radio")}></i>
                    </div>
                    {radio.arr.map((item, index) => {
                        return (
                            <input
                                type="text"
                                placeholder={`option`}
                                name="radio"
                                key={"radiooption" + index}
                                value={item.value}
                                onChange={(e) => changeField(e, "dynamicradio", index)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
