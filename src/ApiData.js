/* eslint eqeqeq: "off" */

export const payloads = {
  GET_USER_BY_ID: "PayloadGetUserByID",
  HANDSHAKE: "PayloadHandshake",
  GET_SELF_USER_IS_TEACHER: "PayloadGetSelfUserIsTeacher",
  GET_SELF_USER: "PayloadGetSelfUser"
}

export const commonOptions = {
  method: "POST",
  cache: "no-cache",
  headers: {
    "Content-Type": "text/plain"
  }
}

export const secureCookieOptions = {
  path: "/",
  sameSite: "strict",
  secure: true
}

export let apiEndpoint = subpage => `${process.env.BACKEND_SERVER}/${subpage}`

export let isValidApiKey = p =>
  p != null && p != undefined && p != "signOutNulled"
