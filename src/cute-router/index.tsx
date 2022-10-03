import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { nanoid } from "nanoid";
import { ComponentType, createContext, FC, memo, ReactNode, useContext, useLayoutEffect, useMemo, useState } from "react";
import { Route, RouteComponentProps, Switch, useParams } from "react-router";

type Context = {
  add: (component: ComponentType, at: string) => () => void
}

type MountedRoute = {
  at: string
  component: ComponentType
}

const ParentCtx = createContext('')
const Context = createContext<Context>({
  add: () => () => undefined
})
const RoutesContext = createContext<ReadonlyArray<MountedRoute>>([])

const Wrap = (Component: ComponentType): FC => memo(() => {
  const params = useParams()
  return <Component {...params} />;
})

export function useLinkFor(Component: ComponentType<{}>): string
export function useLinkFor<T>(Component: ComponentType<T>, props: T): string
export function useLinkFor(Component: ComponentType<any>, props: Record<string, unknown> = {}) {
  const routes = useContext(RoutesContext)

  const mounted = routes.find(route => route.component === Component)

  if (!mounted) {
    return '/not-found' // TODO
  }

  return Object.entries(props)
    .reduce((acc, [k, v]) => acc.replaceAll(`:${k}`, `${v}`), mounted.at)
}

export const CuteIonRouter: FC<{
  children?: ReactNode
}> = ({ children }) => {
  const [routes, setRoutes] = useState<ReadonlyArray<MountedRoute>>([])

  const value = useMemo<Context>(() => {
    return {
      add: (component, at) => {
        const route = { component, at }
        setRoutes(routes => routes.concat(route))
        return () => {
          setRoutes(routes => routes.filter(r => r !== route))
        }
      }
    }
  }, [])

  const uniqueRoutes = useMemo(() => Object.entries(routes
    .reduce((acc, { at, component }) => {
      acc[at] = Wrap(component)
      return acc;
    }, {} as Record<string, ComponentType<RouteComponentProps>>)), [routes])

  const routerKey = useMemo(() => nanoid(6), [uniqueRoutes])

  return (
    <Context.Provider value={value}>
      <RoutesContext.Provider value={routes}>
        {children}
        <IonReactRouter key={routerKey}>
          <IonRouterOutlet>
            {uniqueRoutes.map(([path, component]) => <Route exact key={path} path={path} component={component} />)}
          </IonRouterOutlet>
        </IonReactRouter>
      </RoutesContext.Provider>
    </Context.Provider>
  )
}

export const Mount: FC<{
  at: string
  component?: ComponentType<any>
  children?: ReactNode
}> = (props) => {
  const parent = useContext(ParentCtx)
  const ctx = useContext(Context)
  const at = `${parent}/${props.at}`

  useLayoutEffect(() => {
    if (props.component)
      return ctx.add(props.component, at);
  }, [props.component, at])

  return (
    <ParentCtx.Provider value={at}>
      {props.children}
    </ParentCtx.Provider>
  )
}
