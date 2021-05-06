import React from "react";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import "./_timepicker.scss";

import { WEEK_DAYS } from "../../Utils/Constants/commonConstants";

export const TableHead = (props) => {
    return (
        Object.keys(props.timeSlots).length > 0 &&
        Object.keys(props.timeSlots).map((day, index) => {
            return (
                <th key={"dayname" + index} className="">
                    <div className="flex-content">
                        <span>{day}</span> <i className="pe-7s-plus icon" onClick={() => props.addTime(day)} />
                    </div>
                </th>
            );
        })
    );
};

export const TimePickers = (props) => {
    return WEEK_DAYS.map((day, indexI) => {
        return (
            <td key={"day-keypicker-" + indexI}>
                {props.timeSlots[day] &&
                    props.timeSlots[day].map((times, index) => {
                        let timeValue = moment(times, "HH:mm a");
                        timeValue = timeValue.isValid() ? timeValue : "";

                        return (
                            <div key={"keypicker-" + index} className="timepicker-container">
                                <TimePicker
                                    showSecond={false}
                                    use12Hours
                                    onChange={(e) => props.changeTime(e, day, index)}
                                    value={timeValue}
                                    allowEmpty
                                />
                                <i className="pe-7s-trash icon" onClick={() => props.deleteTime(day, index)} />
                            </div>
                        );
                    })}
            </td>
        );
    });
};
