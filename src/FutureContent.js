import React from "react"
import { CircularProgress } from "@material-ui/core"
import usePromise from "react-promise"

export default props => {
  const { value, loading } = usePromise(props.promise)

  if (loading) {
    return <CircularProgress />
  }

  return <>{value}</>
}
