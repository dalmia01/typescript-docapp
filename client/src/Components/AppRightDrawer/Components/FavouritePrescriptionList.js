import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import React from "react";

import { GET_FAVOURITE_PRESCRIPTIONS, REMOVE_FAVOURITE_PRESCRIPTION } from "../../../Utils/Graphql/prescriptionGraphql";

const FavouritePrescriptionList = (props) => {
    const [favPrescription, setFavPrescriptions] = React.useState([]);

    // fetching favourite prescriptions from backend
    const [getFavouritePrescriptions, { loading }] = useLazyQuery(GET_FAVOURITE_PRESCRIPTIONS, {
        onCompleted: (data, err) => {
            setFavPrescriptions(data.prescription);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    // remove favourite prescription graphql request
    const [removeFavouritePrescription] = useMutation(REMOVE_FAVOURITE_PRESCRIPTION, {
        update: (_, data) => {
            setFavPrescriptions(data.data.prescriptions);
        },
        onError: (err) => {
            console.log(err);
        },
    });
    // removing from favourite prescriptions
    const removeFavouritePrescriptionHandler = (id) => {
        removeFavouritePrescription({ variables: { id: id } });
    };

    React.useEffect(() => {
        getFavouritePrescriptions();
    }, []);

    if (loading) {
        return (
            <div>
                <ul class="list-group">Loading ... </ul>
            </div>
        );
    }

    return (
        <div>
            <ul class="list-group">
                {favPrescription.length > 0 &&
                    favPrescription.map((prescription) => (
                        <li class="list-group-item" key={"fav_prescription" + prescription.id}>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input
                                        name="radio1"
                                        type="radio"
                                        class="form-check-input"
                                        checked={props.selectedFavPrescription.id === prescription.id}
                                        onChange={() => props.setselectedFavPrescription(prescription)}
                                    />
                                    {prescription.fav_name}
                                </label>
                                <i
                                    class="pe-7s-trash"
                                    style={{ float: "right" }}
                                    onClick={() => removeFavouritePrescriptionHandler(prescription.id)}
                                ></i>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default FavouritePrescriptionList;
