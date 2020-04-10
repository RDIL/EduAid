import React from "react"
import { Button, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Alarm } from "@material-ui/icons"
import { createTarget } from "./RoutingUtil"

const useStyles = makeStyles(theme => ({
  noBlue: {
    color: "inherit",
    textDecoration: "none"
  }
}))

export default props => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h4" className="heading-display">
        Click any tool to launch it:
      </Typography>
      <br />
      <a
        href={createTarget("tools-timer")}
        target="_blank"
        className={classes.noBlue}
        rel="noopener noreferrer"
      >
        <Button variant="contained" color="primary" startIcon={<Alarm />}>
          Timer
        </Button>
      </a>
    </>
  )
}
