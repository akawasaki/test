import { MainServer } from '../MainServer';
import * as express from 'express';
import { SimpleController } from './SimpleController';

export class Router {
  constructor(
    private readonly server: MainServer,
    private readonly simpleController: SimpleController
  ) {}

  init() {
    return this.exposeRestApi();
  }

  private exposeRestApi() {
    for (const [Class, fieldMap] of childRouteMap) {
      for (const [field, { method, childRoute }] of fieldMap) {
        const methodName = method.toLowerCase();
        const handler = this.createExpressHandler(childRoute, Class, field);
        this.server.app[methodName](childRoute, handler);
      }
    }
    return this;
  }

  private createExpressHandler(
    route: string,
    Class: Constructor,
    field: FieldName
  ) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = Object.assign(req.params, req.query, req.body);
        res.send(await this.simpleController[field](params));
      } catch (err) {
        res.status(err.statusCode).send(err);
      }
    };
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Constructor = new (...args: any[]) => any;
type Route = string;
type FieldName = string;

interface RouteInfo {
  method: HttpMethod;
  childRoute: Route;
}

const childRouteMap = new Map<Constructor, Map<FieldName, RouteInfo>>();
function createMethod(method: HttpMethod) {
  return (childRoute: Route) => (Class: any, field: FieldName) => {
    const fieldMap =
      childRouteMap.get(Class.constructor) ?? new Map<FieldName, RouteInfo>();
    childRouteMap.set(Class.constructor, fieldMap);
    if (fieldMap.has(field)) {
      throw new Error('Duplicated FieldName');
    }
    fieldMap.set(field, { method, childRoute });
  };
}
export const Get = createMethod('GET');
export const Post = createMethod('POST');
export const Put = createMethod('PUT');
