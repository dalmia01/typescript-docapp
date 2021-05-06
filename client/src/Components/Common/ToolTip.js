import React, { Fragment, useState } from "react";
import { Tooltip } from "reactstrap";

const TooltipItem = (props) => {
    let [toolTipOpen, setToolTipOpen] = useState(false);

    const toggle = () => {
        setToolTipOpen(!toolTipOpen);
    };

    return (
        <Fragment>
            {props.children}
            <Tooltip className={props.className} placement={props.placement} isOpen={toolTipOpen} target={props.id} toggle={toggle}>
                {props.toolTipContent}
            </Tooltip>
        </Fragment>
    );
};

export default TooltipItem;
