import React from "react"

import { Send, Https } from "@material-ui/icons"
import {
  Button,
  Typography,
  Divider,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Head from "react-helmet"

export default props => {
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
        margin: theme.spacing(1)
      }
    }
  }))()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")
  const [teacher, setTeacher] = React.useState(false)

  const handleTeacherClick = event => setTeacher(event.target.checked)

  return (
    <main>
      <Head>
        <title>Login - EduAid</title>
      </Head>
      <Paper elevation={5} className={classes.paper}>
        <Typography variant="h3">Sign Up</Typography>
        <Divider className={classes.space} />
        <form className={classes.txtField}>
          <TextField
            required
            label="First Name"
            variant="outlined"
            onChange={e => setName(e.target.value)}
          />
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
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={teacher}
                onClick={handleTeacherClick}
                value="teacher"
                inputProps={{ "aria-label": "User is a teacher" }}
              />
            }
            label="I am a teacher"
          />
        </form>
        <br />
        <Button
          variant="contained"
          startIcon={<Https />}
          endIcon={<Send />}
          color="primary"
        >
          Create Account
        </Button>
        <br />
      </Paper>
    </main>
  )
}
