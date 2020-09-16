import * as express from 'express';
import { container, DependencyContainer, singleton } from 'tsyringe';
import { MainServer } from '../MainServer';

type Constructor = new (...args: any[]) => any;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

@singleton()
export class Router {
  constructor(private readonly server: MainServer) {}

  init() {
    return this.exposeRestApi();
  }

  private exposeRestApi() {
    console.log('1111111111111111111111111');
    for (const [Class, fieldMap] of childRouteMap) {
      const parentRoute = parentRouteMap.get(Class);
      const optionMap = childOptionMap.get(Class);
      for (const [field, { method, childRoute }] of fieldMap) {
        const route = parentRoute ? `${parentRoute}${childRoute}` : childRoute;
        const option: RouteOption = optionMap?.get(field) ?? {};
        const methodName = method.toLowerCase();
        const handler = this.createExpressHandler(route, Class, field);
        this.server.app[methodName](route, handler);
        if (!option.private) {
          this.server.app[methodName](route, handler);
        }
      }
    }
    return this;
  }

  private createExpressHandler(route: string, Class: Constructor, field: FieldName) {
    return async (req: express.Request, res: express.Response) => {
      try {
        const params = Object.assign(req.params, req.query, req.body);
        const child = container.createChildContainer();
        //this.logger.debug('received request', route);
        res.send(await processRequest(child, Class, field, params));
      } catch (err) {
        res.status(err.statusCode).send(err);
      }
    };
  }
}

async function processRequest(container: DependencyContainer, Class: Constructor, field: FieldName, params: {}) {
  //const logger = container.resolve(Logger);
  try {
    const controller = container.resolve(Class);
    return await controller[field](params);
  } catch (err) {
    //logger.debug('Error!', err);
    //logger.error('Unexpected error', err);
  }
}

type Route = string;
type FieldName = string;

interface RouteInfo {
  method: HttpMethod;
  childRoute: Route;
}
interface RouteOption {
  auth?: boolean; // default true
  debug?: boolean; // default false
  private?: boolean; // default false
}

const parentRouteMap = new Map<Constructor, Route>();
const childRouteMap = new Map<Constructor, Map<FieldName, RouteInfo>>();
const childOptionMap = new Map<Constructor, Map<FieldName, RouteOption>>();

export function Route(parentRoute: Route) {
  return (Class: Constructor) => {
    parentRouteMap.set(Class, parentRoute);
  };
}

function createMethod(method: HttpMethod) {
  return (childRoute: Route) => (Class: any, field: FieldName) => {
    const fieldMap = childRouteMap.get(Class.constructor) ?? new Map<FieldName, RouteInfo>();
    childRouteMap.set(Class.constructor, fieldMap);
    if (fieldMap.has(field)) {
      throw new Error(`Duplicate REST endpoint ${field}`);
    }
    fieldMap.set(field, { method, childRoute });
  };
}

export const Get = createMethod('GET');
export const Post = createMethod('POST');
export const Put = createMethod('PUT');
export const Delete = createMethod('DELETE');

function createOptions(key: keyof RouteOption) {
  return (value = true) => (Class: any, field: FieldName) => {
    const fieldMap = childOptionMap.get(Class.constructor) ?? new Map<FieldName, RouteOption>();
    childOptionMap.set(Class.constructor, fieldMap);
    const info: RouteOption = fieldMap.get(field) ?? {};
    info[key] = value;
    fieldMap.set(field, info);
  };
}

export const Debug = createOptions('debug');
