import * as Actions from '../functions/ActionTypes';

const initial_state = {
  category: null,
  category_options: [],
};

function CategoryReducer(state = initial_state, action) {
  switch (action.type) {
    case Actions.SET_CATEGORY: {
      return {
        ...state,
        category: action.category,
      };
    }
    case Actions.SET_CATEGORY_OPTIONS: {
      if (action.status) {
        return {
          ...state,
          category_options: action.category_options,
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}

export default CategoryReducer;
