const initialState = {
  isAuthenticated: false,
  user: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    // Add your auth action handlers here
    default:
      return state;
  }
}
