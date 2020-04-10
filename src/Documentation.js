/* eslint eqeqeq: "off" */

import React from "react"
import Header from "./HeaderCommon"
import { Typography, Button, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Loadable from "@yeutech-lab/react-loadable"
import Footer from "./Footer"

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(4)
  }
}))

export default props => {
  const classes = useStyles()
  const { useProgress } = props
  const [page, setPage] = React.useState(null)
  const [title, setTitle] = React.useState("Documentation Home")

  function DocButton({ name, page }) {
    return (
      <Button
        variant="outlined"
        onClick={() => {
          setTitle(name)
          setPage(page)
        }}
      >
        {name}
      </Button>
    )
  }

  let PageSigningIn = Loadable({
    loader: () => import("./docs/SigningIn"),
    loading: useProgress
  })

  if (page == null) {
    return (
      <>
        <Header title={title} />
        <main>
          <Typography variant="h2" className="heading-display">
            Choose a topic to get started.
          </Typography>
          <DocButton name="Signing In" page={<PageSigningIn />} />
        </main>
        <Footer />
      </>
    )
  } else {
    return (
      <>
        <Header title={title} />
        <main>
          <Paper elevation={3} className={classes.root}>
            {page}
          </Paper>
        </main>
        <Footer />
      </>
    )
  }
}
