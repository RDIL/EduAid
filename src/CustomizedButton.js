import React from "react"
import { Button, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { createTarget } from "./RoutingUtil"

let styles = makeStyles(theme => ({
  root: {
    border: "1px solid black",
    borderRadius: 0,
    marginTop: theme.spacing(4)
  }
}))

export default props => {
  let classes = styles()
  let handleClick = () => (window.location.href = createTarget("dash"))

  return (
    <Grid container justify="center">
      <Button
        className={classes.root}
        variant="outlined"
        size="large"
        onClick={handleClick}
      >
        Go to Dashboard
      </Button>
    </Grid>
  )
}
