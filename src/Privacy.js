import React from "react"
import { Typography } from "@material-ui/core"
import Header from "./HeaderCommon"
import Head from "react-helmet"
import Footer from "./Footer"

export default props => (
  <>
    <Header title="Privacy Policy" />
    <Head>
      <title>Privacy Policy - EduAid</title>
    </Head>
    <main>
      <Typography>We take your privacy very seriously.</Typography>
    </main>
    <Footer />
  </>
)
