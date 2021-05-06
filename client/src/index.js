import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import moment from "moment";
import "./assets/base.scss";
import Main from "./Pages/Main";
import configureStore from "./config/configureStore";
import history from "./Utils/history";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import { setAuthLogout } from "./actions/authActions";

import { userValidation } from "./Utils/validation";
import { getAPIBaseUrl } from "./Utils/common";

// eslint-disable-next-line no-extend-native
Date.prototype.toJSON = function () {
    return moment(this).format();
};

Sentry.init({
    dsn: "https://ead92d46d14348ab902f15a5fad5f7f2@o501014.ingest.sentry.io/5581599",
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

const store = configureStore();

const httpLink = createHttpLink({
    uri: `${getAPIBaseUrl()}/graphql`,
});

const defaultOptions = {
    watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    },
    query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
    },
};

const authLink = setContext(async () => {
    const token = localStorage.getItem("token");
    const userInfo = await userValidation();

    if (userInfo.user) {
        return {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };
    } else {
        setAuthLogout();
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});

const rootElement = document.getElementById("root");

const renderApp = (Component) => {
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Provider store={store}>
                <Router history={history}>
                    <Component />
                </Router>
            </Provider>
        </ApolloProvider>,
        rootElement
    );
};

renderApp(Main);

if (module.hot) {
    module.hot.accept("./Pages/Main", () => {
        const NextApp = require("./Pages/Main").default;
        renderApp(NextApp);
    });
}
