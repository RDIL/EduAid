import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Drawer, Typography, Grid } from "@material-ui/core"
import { createTarget } from "./RoutingUtil"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    backgroundColor: theme.palette.background,
    marginTop: theme.spacing(10),
    width: "100%",
    flexShrink: 0
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    textAlign: "center"
  },
  link: {
    display: "block",
    color: "inherit"
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <footer className={classes.root}>
      <Drawer className={classes.drawer} variant="permanent" anchor="bottom">
        <div className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">EduAid</Typography>
              <Typography variant="body2">Copyright (&copy;) 2019-present Reece Dunham.</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Quick Links</Typography>
              <div>
                <a href={createTarget("dash")} className={classes.link}>
                  Dashboard
                </a>
                <a href={createTarget("login")} className={classes.link}>
                  Log In
                </a>
              </div>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Help Pages</Typography>
              <div>
                <a href={createTarget("doc")} className={classes.link}>
                  Documentation
                </a>
              </div>
            </Grid>
          </Grid>
        </div>
      </Drawer>
    </footer>
  )
}
