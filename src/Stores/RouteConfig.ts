import * as React from "react";

import { HealthDashboardApp } from "../Apps/HealthDashboardApp";

export interface OspRouteProperties {
    title: string;
    path: string;
    app: React.ComponentClass;
    hidden?: boolean;
}

export interface IOspRoutes {
    [Id: string]: OspRouteProperties;
}

const ospCoreRoutes: IOspRoutes = {

    HealthDashboard: {
        title: "Health",
        path: "/healthdashboard",
        app: HealthDashboardApp
    },

};

export { ospCoreRoutes as OspCoreRoutes };
