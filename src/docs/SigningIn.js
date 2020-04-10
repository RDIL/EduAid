import React from "react"
import ReactMarkdown from "react-markdown"
import { createTarget } from "../RoutingUtil"

export default props => {
  return (
    <ReactMarkdown
      source={`
# Signing In

To sign in, you will need to follow these steps:

1. Head to the [sign-in page](${createTarget("login")})
2. Enter your email and password
3. Press the submit button *or* press enter on your keyboard when you are clicked-in to the password input box
4. Wait a few seconds
5. You will be taken to the dashboard automatically
    `}
    />
  )
}
