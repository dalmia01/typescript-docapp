/* eslint-disable default-case */
import React from "react";

const MedicineView = (props) => {
    const medicineTimingsView = (medDoseType, checkDoseType, beforeVale, AfterValue, mealType) => {
        return (
            <React.Fragment>
                {medDoseType === checkDoseType ? (beforeVale && `Before ${mealType}`) || (AfterValue && `After ${mealType}`) || "" : ""}
            </React.Fragment>
        );
    };

    return props.medicinesList.map((item, index) => {
        let medicineData = {};

        return item[props.someFieldType].map((field, lastIndex) => {
            switch (field.name) {
                case "number":
                    medicineData[field.name] = field.value || "1";
                    break;
                default:
                    medicineData[field.name] = field.value || "";
                    break;
            }

            if (lastIndex === item[props.someFieldType].length - 1) {
                switch (true) {
                    case medicineData.dosageType === "meals":
                        medicineData.dosageTypeValue = medicineData.meals !== "-" ? medicineData.meals : "";
                        break;
                    case medicineData.dosageType === "timings":
                        medicineData.dosageTypeValue = medicineData.timings !== "-" ? medicineData.timings : "";
                        break;
                    case medicineData.dosageType === "frequency" && medicineData.frequency === "custom":
                        medicineData.dosageTypeValue = `Every ${medicineData.customFrequencyValue} ${medicineData.customFrequency}`;
                        break;
                    case medicineData.dosageType === "frequency":
                        medicineData.dosageTypeValue = medicineData.frequency !== "-" ? `Every ${medicineData.frequency} hours` : "";
                        break;
                }

                let durationTime = "";
                switch (true) {
                    case medicineData.duration[1] === "d":
                        if (medicineData.duration[0] < 2) {
                            durationTime = `${medicineData.duration[0]} day`;
                        } else {
                            durationTime = `${medicineData.duration[0]} days`;
                        }
                        break;
                    case medicineData.duration[1] === "w":
                        durationTime = `${medicineData.duration[0]} weeks`;
                        break;
                    case medicineData.duration[1] === "m":
                        durationTime = `${medicineData.duration[0]} months`;
                        break;
                }

                
                return (
                    <tr key={"table-data-medicines" + index}>
                        <td>{index + 1}</td>
                        <td>
                            <small>{item.dosageForm || "Tablet"}</small>{" "}
                            <b>
                                {item.name} <br />
                                <small>{item.description}</small>
                            </b>
                        </td>
                        <td>
                            {medicineData.dosageType === "frequency"
                                ? `${medicineData.dosageQuantity || ""} ${item.dosageForm || ""} (${
                                      medicineData.frequencyMealType || "After Meal"
                                  })`
                                : ""}
                        </td>
                        <td>
                            <b>
                                {medicineData.dosageType === "timings"
                                    ? (medicineData.timingsMorningBefore && medicineData.timingsMorningBefore) ||
                                      (medicineData.timingsMorningAfter && medicineData.timingsMorningAfter) ||
                                      0
                                    : 0}
                            </b>
                            <br />
                            {medicineTimingsView(
                                medicineData.dosageType,
                                "timings",
                                medicineData.timingsMorningBefore,
                                medicineData.timingsMorningAfter,
                                "Breakfast"
                            )}
                        </td>
                        <td>
                            <b>
                                {medicineData.dosageType === "timings"
                                    ? (medicineData.timingsAfternoonBefore && medicineData.timingsAfternoonBefore) ||
                                      (medicineData.timingsAfternoonAfter && medicineData.timingsAfternoonAfter) ||
                                      0
                                    : 0}
                            </b>
                            <br />
                            {medicineTimingsView(
                                medicineData.dosageType,
                                "timings",
                                medicineData.timingsAfternoonBefore,
                                medicineData.timingsAfternoonAfter,
                                "Lunch"
                            )}
                        </td>
                        <td>
                            <b>
                                {medicineData.dosageType === "timings"
                                    ? (medicineData.timingsNightBefore && medicineData.timingsNightBefore) ||
                                      (medicineData.timingsNightAfter && medicineData.timingsNightAfter) ||
                                      0
                                    : 0}
                            </b>
                            <br />
                            {medicineTimingsView(
                                medicineData.dosageType,
                                "timings",
                                medicineData.timingsNightBefore,
                                medicineData.timingsNightAfter,
                                "Dinner"
                            )}
                        </td>
                        <td>
                            {medicineData.dosageTypeValue ? `${medicineData.dosageTypeValue}` : ""} <br />
                        </td>
                        <td>{durationTime}</td>
                    </tr>
                );
            }
        });
    });
};

export default MedicineView;
