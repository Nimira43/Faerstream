let state = {
  userId: null,
  userWebSocketConnection: null
}

const setState = (newState) => {
  state = {
    ...state,
    ...newState
  }
}

export const setUserId = (userId) => {
  setState({userId})
}

export const setWsConnection = (wsConnection) => {
  setState({userWebSocketConnection: wsConnection})
}