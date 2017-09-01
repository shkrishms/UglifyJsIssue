import * as React from "react";

import { inject, observer } from "mobx-react";

@inject("routeStore") @observer
export class OspApp extends React.Component<{}, {}> {

    public render() {
        return (
            <div>
                "This is a test"
            </div>
        );
    }
}