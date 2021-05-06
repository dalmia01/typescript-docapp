import React from "react";

const SelectBox = (props) => {
    return (
        <select className="mb-2 form-control" onChange={props.selectDoctorHandler} value={props.value}>
            <option value="-1">Select Doctor</option>
            {props.doctors.users &&
                props.doctors.users.length > 0 &&
                props.doctors.users.map((user) => {
                    return (
                        <option key={"doctors" + user.id} value={user.id}>
                            {user.first_name} {user.last_name}
                        </option>
                    );
                })}
        </select>
    );
};

export default SelectBox;
