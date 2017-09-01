/* tslint:disable:no-import-side-effect */

import "babel-polyfill";

import * as Highcharts from "highcharts";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./Apps/App";

/* tslint:enable:no-import-side-effect */

/* tslint:disable */
const { AppContainer } = require("react-hot-loader");

require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/treemap")(Highcharts);

declare var module: { hot: any };
/* tslint:enable */

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <AppContainer>
        < App />
    </AppContainer>,
    document.getElementById("index"));