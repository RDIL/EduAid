import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core"
import { createTarget } from "./RoutingUtil"
import { isLoggedIn } from "./ApiClient"
import Head from "react-helmet"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  noBlue: {
    color: "inherit",
    textDecoration: "none"
  }
}))

export default props => {
  const classes = useStyles()
  let loggedIn = isLoggedIn()

  return (
    <nav>
      <Head>
        <title>{props.title} - EduAid</title>
      </Head>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.root}>
              {props.title}
            </Typography>
            <a
              href={loggedIn ? createTarget("logout") : createTarget("login")}
              className={classes.noBlue}
            >
              <Button color="inherit" disableTouchRipple>
                {loggedIn ? "Log Out" : "Log In"}
              </Button>
            </a>
          </Toolbar>
        </AppBar>
      </div>
    </nav>
  )
}
