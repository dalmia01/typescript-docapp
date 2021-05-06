import React, { Component } from "react";
import { Table } from "reactstrap";

class VaccineChart extends Component {
    render() {
        const { dob, vaccinesData, getCardColor, showVaccineDetails, getDuration } = this.props;

        return (
            <Table className="vaccine-table" bordered>
                <thead>
                    <tr>
                        <th>{dob.format("DD/MM/YYYY")}</th>
                    </tr>
                </thead>
                <tbody>
                    {vaccinesData.vaccine_chart.map((vaccineGroup) => {
                        const row = [];
                        row.push(
                            <th scope="row" className="row-label">
                                {vaccinesData.ranges_details[vaccineGroup.range].range_label}
                            </th>
                        );
                        vaccineGroup.vaccines.forEach((vaccine) => {
                            const card = (
                                <div
                                    className={"vaccine-card clickable " + getCardColor(vaccine)}
                                    onClick={() => showVaccineDetails(vaccine)}
                                >
                                    {vaccine.medicine_name}
                                    <br />
                                    {getDuration(vaccine.range, dob)}
                                </div>
                            );
                            row.push(<td key={vaccine.medicine_name + vaccine.range}>{card}</td>);
                        });
                        return <tr className="vaccine-chart-row">{row}</tr>;
                    })}
                </tbody>
            </Table>
        );
    }
}

export default VaccineChart;
