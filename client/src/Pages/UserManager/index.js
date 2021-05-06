import React, { Fragment } from "react";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { Row, Col, Card } from "reactstrap";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FETCH_CLINICS } from "../../Utils/Graphql/clinicsGraphql";
import { FETCH_USERS, DELETE_USER, USER_ACTIVE_STATUS } from "../../Utils/Graphql/usersGraphql";
import ConfirmModal from "../../Components/Common/ConfirmModal";
import { DEFAULT_DELETED_SUCCESS, DEFAULT_UPDATED_SUCCESS } from "../../Utils/Constants/messageConstants";
import { setAuthLogout } from "../../actions/authActions";
import { setPopUpModal } from "../../reducers/ThemeOptions";
import EmptyState from "../../Components/Common/EmptyState";
import { handleCommonError } from "../../Utils/validation";

const UserManager = (props) => {
    let [users, setUsers] = React.useState([]);

    /**
     *  graphql request to fetch all users on page load an adding new user
     */

    const [fetchUsers] = useLazyQuery(FETCH_USERS, {
        onCompleted(data) {
            setUsers(data.users);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    React.useEffect(() => {
        fetchUsers({ variables: { filter: "all users", unique_id: uuid() } });
    }, []);

    React.useEffect(() => {
        fetchUsers({ variables: { filter: "all users", unique_id: uuid() } });
    }, [props.popUpModalContent]);

    /**
     *  graphql request to fetch all users on page load an adding new user
     */

    /**
     *  graphql request to delete a user
     */

    const [deleteUser] = useMutation(DELETE_USER, {
        update(_, data) {
            users = users.filter((user) => {
                return user.phone !== data.data.phone;
            });

            toast.success(DEFAULT_DELETED_SUCCESS);

            setUsers(users);
        },
        onError(err) {
            handleCommonError(err, props.setAuthLogout);
        },
    });

    // confirm user delete handle operation
    let [confirmDelete, setConfirmDelete] = React.useState({ visibility: false, user: {} });
    const confirmDeleteHandler = (user) => {
        setConfirmDelete({ visibility: true, user: user });
    };

    const deleteUserHandler = () => {
        deleteUser({ variables: { phone: confirmDelete.user.phone } });
        setConfirmDelete({ visibility: false, user: {} });
    };

    /** Activating & deactivating a user */

    const [userActiveStatus] = useMutation(USER_ACTIVE_STATUS, {
        update(_, data) {
            for (let user of users) {
                if (user.id === data.data.user.id) {
                    user.active_status = data.data.user.active_status;
                    break;
                }
            }
            toast.success(DEFAULT_UPDATED_SUCCESS);
            setUsers(users);
        },
        onError(err) {
            console.log(err);
            handleCommonError(err, props.setAuthLogout);
        },
    });

    const confirmActivationStatus = (user) => {
        userActiveStatus({ variables: { userId: user.id, activeStatus: !user.active_status } });
    };

    /**
     *  graphql request to delete a user
     */

    /**
     *  open popup modal to add new user or edit a current user details
     */

    const addNewUser = () => {
        props.setPopUpModal({ visibility: true, type: "add user", content: {} });
    };

    const editUser = (user) => {
        props.setPopUpModal({ visibility: true, type: "edit user", content: { user } });
    };
    /**
     *  open popup modal to add new user or edit a current user details
     */

    /**
     * all users list && jsx
     */

    let allUsers = [];

    if (users.length > 0) {
        allUsers = users.map((user, index) => {
            return (
                <tr key={user.id}>
                    <td className=" text-muted">{index + 1}</td>
                    <td>
                        <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                                <div className="widget-content-left flex2">
                                    <div className="widget-heading">
                                        {user.first_name} {user.last_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="">{user.role}</td>
                    <td className="">
                        <div className="">{user.designation}</div>
                    </td>
                    <td>{user.phone}</td>
                    <td className="">
                        <span onClick={() => editUser(user)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </span>

                        <span onClick={() => confirmActivationStatus(user)}>
                            <button class="mb-2 mr-2 btn btn-link active">
                                {user.active_status ? "click to inactivate" : "click to activate"}
                            </button>
                        </span>
                    </td>
                </tr>
            );
        });
    }

    /**
     *  all users list && jsx
     */

    return (
        <Fragment>
            <ConfirmModal
                isOpen={confirmDelete.visibility}
                titleContent="Are You Sure You Want To Delete?"
                setConfirmDelete={setConfirmDelete}
                deleteConfirmHandler={deleteUserHandler}
            />

            <Row>
                <Col md="12">
                    <Card className="main-card mb-3 text-capitalize">
                        <div className="card-header">
                            Users
                            <div className="btn-actions-pane-right">
                                <div role="group" className="btn-group-sm btn-group">
                                    <button className="active btn btn-info" onClick={addNewUser}>
                                        Add User
                                    </button>
                                </div>
                            </div>
                        </div>
                        {allUsers.length > 0 ? (
                            <div className="table-responsive">
                                <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th className="">#</th>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Designation</th>
                                            <th>Phone number</th>
                                            <th className="">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <React.Fragment>{allUsers}</React.Fragment>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState content="No users found" />
                        )}
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({ popUpModalContent: state.ThemeOptions.popUpModalContent });

const mapDispatchToProps = (dispatch) => ({
    setPopUpModal: (popUpModal) => dispatch(setPopUpModal(popUpModal)),
    setAuthLogout: () => dispatch(setAuthLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManager);
