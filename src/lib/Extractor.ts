
import express from 'express';
import _ from 'lodash';

// express doesn't really provide us with proper typings :(
interface IRouteOrRouter {
    name?: string;

    handle?: { stack?: IRouteOrRouter };

    route?: {
        path?: string
    };

    regexp?: IRegexp;
}
interface IRegexp {
    fast_slash?: boolean;
}

class Extractor {

    public extractUris(app: express.Application) {
        return _(app._router.stack)
            .map(routeOrRouter => this.extractUriFromRoutes('', routeOrRouter))
            .flatten()
            .value();
    }

    private extractUriFromRoutes(basePath: string, routeOrRouter: IRouteOrRouter): string | string[] {
        const isRoute = !_.isEmpty(routeOrRouter?.route);
        const isRouter = routeOrRouter?.name === 'router' && !!routeOrRouter?.handle?.stack;

        switch (true) {
            case isRoute:
                return basePath + routeOrRouter?.route?.path;

            case isRouter:
                return _(routeOrRouter?.handle?.stack)
                    .map(
                        nestedRouteOrRouter => this.extractUriFromRoutes(basePath + this.extractRouterUri(routeOrRouter?.regexp), nestedRouteOrRouter)
                    )
                    .flatten()
                    .value();

            default:
                return [];
        }
    }

    private extractRouterUri(regexPattern: IRegexp): string {
        switch (true) {
            case regexPattern?.fast_slash:
                return '';

            default:
                return regexPattern.toString().replace('/^\\', '').replace('\\/?(?=\\/|$)/i', '').replace('\\/', '/');
        }
    }

}

export default new Extractor();