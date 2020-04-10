import React from "react"
import { Typography } from "@material-ui/core"
import Header from "./HeaderCommon"
import CustomizedButton from "./CustomizedButton"
import { isLoggedIn } from "./ApiClient"
import Footer from "./Footer"

export default props => (
  <>
    <Header title="Home" />
    <main>
      <Typography variant="h2" className="heading-display">
        The new best way to learn.
      </Typography>
      {isLoggedIn() ? <CustomizedButton /> : <div hidden />}
    </main>
    <Footer />
  </>
)
