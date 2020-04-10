import React from "react"

import { Send, Https } from "@material-ui/icons"
import {
  Button,
  Typography,
  Divider,
  Paper,
  TextField
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { handshake, isLoggedIn } from "./ApiClient"
import { createTarget } from "./RoutingUtil"
import Head from "react-helmet"
import Footer from "./Footer"

export default props => {
  if (isLoggedIn()) {
    window.location.href = createTarget("dashboard", true)
  }

  const classes = makeStyles(theme => ({
    paper: {
      margin: "20px",
      padding: "15px",
      textAlign: "center"
    },
    space: {
      margin: theme.spacing(2)
    },
    txtField: {
      "& > *": {
        margin: theme.spacing(1),
        width: 275
      }
    }
  }))()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState("")

  const handleFieldPresses = key => {
    if (key !== "Enter") return
    handshake(email, password).then(
      val => {
        if (val === "good") {
          props.setApiKey(val)
          return
        }
        setErrors(val)
      },
      err => {
        setErrors(`${err}`)
      }
    )
  }

  return (
    <>
      <main>
        <Head>
          <title>Login - EduAid</title>
        </Head>
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h3">Sign In</Typography>
          {errors}
          <Divider className={classes.space} />
          <form className={classes.txtField}>
            <TextField
              required
              label="Email"
              variant="outlined"
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              required
              label="Password"
              type="password"
              variant="outlined"
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleFieldPresses}
            />
          </form>
          <br />
          <Button
            variant="contained"
            startIcon={<Https />}
            endIcon={<Send />}
            color="primary"
            onClick={() => handleFieldPresses("Enter")}
          >
            Submit
          </Button>
          <br />
        </Paper>
      </main>
      <Footer />
    </>
  )
}
