import React from "react"
import Loadable from "@yeutech-lab/react-loadable"
import { LinearProgress } from "@material-ui/core"
import { getTarget } from "./RoutingUtil"
import UniversalCookie from "universal-cookie"
import { isLoggedIn, logout } from "./ApiClient"
import { isValidApiKey } from "./ApiData"

let useProgress = () => <LinearProgress />

let Login = Loadable({
  loader: () => import("./Login"),
  loading: useProgress
})

let PrivacyPolicy = Loadable({
  loader: () => import("./Privacy"),
  loading: useProgress
})

let NotFound = Loadable({
  loader: () => import("./NotFound"),
  loading: useProgress
})

let Home = Loadable({
  loader: () => import("./HomePage"),
  loading: useProgress
})

let Dashboard = Loadable({
  loader: () => import("./Dashboard"),
  loading: useProgress
})

let Timer = Loadable({
  loader: () => import("./vendor/components/MainContainer"),
  loading: useProgress
})

let Docs = Loadable({
  loader: () => import("./Documentation"),
  loading: useProgress
})

export default () => {
  // IE check
  if (
    window.navigator.userAgent.indexOf("MSIE ") > 0 ||
    !!navigator.userAgent.match(/Trident.*rv:11\./)
  ) {
    alert(
      "EduAid does not support Internet Explorer. Please use Chrome, Edge, Safari, or Firefox."
    )
  }

  let z = new UniversalCookie().get("apiKey")
  let [apiKey, setApiKey] = React.useState(isValidApiKey(z) ? z : "")

  const parsed = getTarget(window.location.href)

  if (parsed === "" || parsed === "/" || parsed.includes("home")) {
    return <Home />
  }

  if (parsed.includes("dash")) {
    if (!isLoggedIn()) {
      return <Login apiKey={apiKey} setApiKey={setApiKey} />
    }
    return <Dashboard useProgress={useProgress} />
  }

  if (parsed.includes("privacy")) {
    return <PrivacyPolicy />
  }

  if (parsed.includes("doc")) {
    return <Docs useProgress={useProgress} />
  }

  if (parsed.includes("login")) {
    return <Login apiKey={apiKey} setApiKey={setApiKey} />
  }

  if (parsed.includes("logout") && isLoggedIn()) {
    logout()
  }

  if (parsed.includes("tools-timer")) {
    return <Timer />
  }

  return <NotFound />
}
