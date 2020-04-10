import React from "react"
import { Typography } from "@material-ui/core"
import Header from "./HeaderCommon"
import Head from "react-helmet"
import Footer from "./Footer"

export default props => (
  <>
    <Header title="Page Not Found" />
    <Head>
      <title>Page Not Found - EduAid</title>
    </Head>
    <main>
      <Typography variant="h4" className="heading-display">
        We couldn't find that page, or you don't have permissions to access it.
      </Typography>
    </main>
    <Footer />
  </>
)
