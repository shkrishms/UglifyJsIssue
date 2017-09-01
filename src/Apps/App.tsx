import * as React from "react";

import { BrowserRouter, Route } from "react-router-dom";

import { OspApp } from "./OspApp";
import { Provider } from "mobx-react";
import { RouteStore } from "../Stores/RouteStore";

export class App extends React.Component<{}, {}> {
    private store = new RouteStore();

    public render() {
        return (
            <Provider routeStore={this.store}>
                <BrowserRouter >
                    <div>
                        <Route path="/" component={OspApp} />
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}