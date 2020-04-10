import React from "react"
import Header from "./HeaderCommon"
import { Typography, Box, Tab, Tabs } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { userInfo, isTeacher } from "./ApiClient"
import FutureContent from "./FutureContent"
import Loadable from "@yeutech-lab/react-loadable"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

let a11yProps = index => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`
})

// height is about 145 pixels per tab element
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 600
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

export default props => {
  const classes = useStyles()
  // the id of the selected tab
  const [value, setValue] = React.useState(0)

  let TeacherTools = Loadable({
    loader: () => import("./TeacherTools"),
    loading: props.useProgress
  })

  const handleChange = (event, newValue) => setValue(newValue)

  return (
    <>
      <Header title="Dashboard" />
      <main>
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs navigation"
            className={classes.tabs}
          >
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="My Information" {...a11yProps(1)} />
            {isTeacher() ? (
              <Tab label="Teacher Tools" {...a11yProps(2)} />
            ) : (
              <div hidden />
            )}
          </Tabs>
          <TabPanel value={value} index={0}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1}>
            {// prevent it being fetched again every rerender
            value === 1 ? (
              <FutureContent
                promise={userInfo()}
              />
            ) : (
              <div hidden />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TeacherTools />
          </TabPanel>
        </div>
      </main>
    </>
  )
}
