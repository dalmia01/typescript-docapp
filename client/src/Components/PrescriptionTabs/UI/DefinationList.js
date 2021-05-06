import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import EmptyState from "../../Common/EmptyState";
import { v4 as uuid } from "uuid";

export default function DefinationList(props) {
    // on defination option select from defination list
    const definationItem = (e, item) => {
        props.setFilterSelect("");

        props.addFromSelectOptions(e, item);
        if (props.category === "MedicalHistory") {
            props.viewOption(item);
        }
    };
    let definitionOptions = [];
    if (props.filterSelect.trim().length > 2) {
        definitionOptions = props.selectOptions.filter((item) => {
            if (item.name.toLowerCase().includes(props.filterSelect.toLowerCase())) {
                return item;
            }
        });
    } else {
        definitionOptions = [...props.selectOptions];
    }

    const filterFromOptions = (e) => {
        props.setFilterSelect(e);
        if (props.filterSelect.length >= 2) {
            props.fetchFilteredDefinitons({
                variables: { category: props.category, someId: uuid(), filteredValue: e },
            });
        }
    };

    return (
        <div className="card mb-3 widget-chart">
            <div className="widget-chart-content card-custom">
                <div className={" no-flex input-field show-box "}>
                    <input
                        type="text"
                        required
                        className="filter-select"
                        value={props.filterSelect}
                        onChange={(e) => filterFromOptions(e.target.value)}
                    />

                    <span className="filter-select-Placeholder">
                        <i className="pe-7s-search"></i>&nbsp; Search {props.category}
                    </span>
                </div>

                {props.definitionList && props.definitionList.all.length > 0 ? (
                    <ListGroup
                        className={
                            props.selectedOption !== ""
                                ? "select-Multiple  no-flex show-box "
                                : "select-Multiple  no-flex show-box  wrap-flex"
                        }
                    >
                        {definitionOptions.length > 0 &&
                            definitionOptions.map((item, index) => {
                                return (
                                    <ListGroupItem className={"selct-single-item "} key={item.id} onClick={(e) => definationItem(e, item)}>
                                        <span style={{ width: "100%" }}>{item.name}</span>
                                    </ListGroupItem>
                                );
                            })}
                    </ListGroup>
                ) : (
                    <div
                        className={
                            props.selectedOption !== ""
                                ? "select-Multiple  no-flex show-box empty-state"
                                : "select-Multiple  no-flex show-box  wrap-flex empty-state"
                        }
                    >
                        <EmptyState content="Nothing found" />
                    </div>
                )}
            </div>
        </div>
    );
}
