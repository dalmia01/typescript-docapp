import React, {Fragment} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const WelcomeBackModal = ({renderForm, renderFooter}) => {
    return (
        <Fragment>
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <div className="h-100 bg-plum-plate bg-animation">
            <div
              className="d-flex h-100 justify-content-center"
              style={{ paddingTop: 50 }}
            >
              <div className="mx-auto app-login-box col-md-8">
                <div className="modal-dialog w-100 mx-auto">
                  <div className="modal-content">
                    <div
                      className="modal-body"
                      style={{ padding: "1rem 2rem" }}
                    >
                      <div className="h5 modal-title text-center">
                        <h4 className="mt-2">
                          <div className="welcome-txt">Welcome back!</div>
                        </h4>
                      </div>
                      <div className="divider"></div>
                      {renderForm}
                    </div>
                    <div className="modal-footer clearfix">
                      {renderFooter}
                    </div>
                  </div>
                </div>
                <div className="text-center text-white opacity-8 mt-3">
                  Copyright © DPV 2020
                </div>
              </div>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </Fragment>
    )
};

export default WelcomeBackModal;