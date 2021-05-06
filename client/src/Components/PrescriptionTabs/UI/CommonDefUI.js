import React from "react";
import { connect } from "react-redux";
import AddDefinationName from "./AddDefinationName";
import SelectedDefinations from "./SelectedDefinations";
import DefinationList from "./DefinationList";
import SelectedSection from "./SelectedSection";
import { setDefinitionList } from "../../../reducers/DefinitionReducer";

import { v4 as uuid } from "uuid";

const CommonDefUi = (props) => {
    // get definition list when the page is loaded.

    React.useEffect(() => {
        props.setSelectedOption({});
        props.setDefinitionList({ all: [], selected: [], nonSelected: [] });
        props.fetchDefinitions({
            variables: { category: props.category, someId: uuid() },
        });
    }, []);

    return (
        <div>
            <AddDefinationName category={props.category} addDefination={props.addDefination} />

            {
                <SelectedDefinations
                    category={props.category}
                    selectedDefinitions={props.selectedDefinitions}
                    selectedOption={props.selectedOption}
                    viewOption={props.viewOption}
                    removeFromSelectedOptions={props.removeFromSelectedOptions}
                />
            }

            <div className={Object.keys(props.selectedOption).length > 0 || props.specificLoad ? "select-grid" : "full-grid"}>
                {
                    <DefinationList
                        category={props.category}
                        filterSelect={props.filterSelect}
                        setFilterSelect={props.setFilterSelect}
                        selectedOption={props.selectedOption}
                        selectOptions={props.selectOptions}
                        addFromSelectOptions={props.addFromSelectOptions}
                        definitionList={props.definitionList}
                        viewOption={props.viewOption}
                        fetchFilteredDefinitons={props.fetchFilteredDefinitons}
                        fetchDefinitions={props.fetchDefinitions}
                    />
                }

                {/* selected definition */}

                {props.specificLoad ? (
                    <div>Loading ... </div>
                ) : Object.keys(props.selectedOption).length > 0 ? (
                    <SelectedSection
                        selectedOption={props.selectedOption}
                        category={props.category}
                        confirmItemDeleteHandler={props.confirmItemDeleteHandler}
                        editDefinition={props.editDefinition}
                        deleteDefinationField={props.deleteDefinationField}
                        setMedHistoryUiVisibility={props.setMedHistoryUiVisibility}
                        dynamic={["Symptoms", "Findings", "Diagnosis", "Investigations", "Instructions"].includes(props.category)}
                        favouriteMedicineValues={props.favouriteMedicineValues}
                    />
                ) : null}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    setDefinitionList: (selectedOption) => dispatch(setDefinitionList(selectedOption)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonDefUi);
