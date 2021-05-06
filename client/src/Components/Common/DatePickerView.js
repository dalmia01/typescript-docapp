import React from "react";
import { Button } from "reactstrap";

class DatePickerView extends React.Component {
    render() {
        return (
            <Button outline className="mb-2 mr-2 btn-transition" color="primary" onClick={this.props.onClick}>
                {this.props.value}
            </Button>
        );
    }
}

export default DatePickerView;
