import { OspCoreRoutes } from "./RouteConfig";

export class RouteStore {
    private ospRoutes = OspCoreRoutes;

    public getRoutePath(routeName: string) {
        return this.ospRoutes[routeName].path;
    }

    public get routes() {
        return { ...this.ospRoutes };
    }

    public getCurrentRouteConfig(path: string) {
        let result: { key: string, value: {} };

        Object.keys(this.routes).forEach(key => {
            if (this.routes[key].path.toLowerCase() === path.toLowerCase()) {
                result = { key, value: this.routes[key] };
            }
        });

        return result;
    }

}