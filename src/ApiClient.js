/* eslint eqeqeq: "off" */

import UniversalCookie from "universal-cookie"
import { createTarget } from "./RoutingUtil"
import {
  payloads,
  commonOptions,
  secureCookieOptions,
  apiEndpoint,
  isValidApiKey
} from "./ApiData"

export async function handshake(em, pw) {
  let response = await fetch(apiEndpoint("payload"), {
    body: JSON.stringify({
      type: payloads.HANDSHAKE,
      em: em,
      pw: pw
    }),
    ...commonOptions
  })
  if (response.status >= 400) {
    return response.statusText
  }
  let t = await response.text()
  new UniversalCookie().set("apiKey", t, secureCookieOptions)
  return "good"
}

export async function userInfo() {
  let response = await fetch(apiEndpoint("payload"), {
    body: JSON.stringify({
      type: payloads.GET_SELF_USER,
      apiKey: getApiKey()
    }),
    ...commonOptions
  })
  if (response.status >= 400) {
    return null
  }
  return await response.text()
}

export let getApiKey = () => {
  return new UniversalCookie().get("apiKey")
}

export let isLoggedIn = () => {
  return !!getApiKey() && isValidApiKey(getApiKey())
}

export function logout() {
  new UniversalCookie().set("apiKey", "signOutNulled", secureCookieOptions)
  window.location.href = createTarget("")
}

export async function isTeacher() {
  let response = await fetch(apiEndpoint("payload"), {
    body: JSON.stringify({
      type: payloads.GET_SELF_USER_IS_TEACHER,
      apiKey: getApiKey()
    }),
    ...commonOptions
  })
  if (response.status >= 400) {
    return false
  }
  return (await response.text()) == "true"
}
