import parseUrl from "url-parse"

export let getTarget = address => {
  let returnValue
  if (process.env.NODE_ENV === "production") {
    returnValue = new parseUrl(address).query
  } else {
    returnValue = new parseUrl(address).pathname
  }
  return returnValue
}

export let createTarget = (target, useDomain) => {
  let returnValue
  if (process.env.NODE_ENV === "development") {
    if (useDomain) {
      returnValue = new parseUrl(window.location.href).host + "/" + target
    } else {
      returnValue = "/" + target
    }
  } else {
    if (useDomain) {
      returnValue = new parseUrl(window.location.href).host + "?" + target
    } else {
      returnValue = "?" + target
    }
  }
  return returnValue
}
