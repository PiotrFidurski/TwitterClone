export interface IState {
  dimensions: DOMRectReadOnly | undefined;
  open: boolean;
  width: number;
  height: number;
}

export interface IAction {
  type: string;
  value?: any;
}

export const actionTypes = {
  open: "open",
  close: "close",
  setMenuSize: "setMenuSize",
  setDimensions: "setDimensions",
};

export const baseReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case actionTypes.open: {
      return {
        ...state,
        open: !state.open,
      };
    }
    case actionTypes.close: {
      return {
        ...state,
        open: false,
      };
    }
    case actionTypes.setMenuSize: {
      return {
        ...state,
        width: action.value.width as number,
        height: action.value.height as number,
      };
    }
    default:
      return state;
  }
};

export const sidebarReducer = (state: IState, action: IAction) => {
  if (action.type === actionTypes.setDimensions) {
    return {
      ...state,
      dimensions: {
        ...action.value,
        y:
          action.value.y + state.height > window.innerHeight
            ? action.value.y - state.height + 50
            : action.value.y,
      },
    };
  }
  return baseReducer(state, action);
};

export const emojiPickerReducer = (state: IState, action: IAction) => {
  if (action.type === actionTypes.setDimensions) {
    return {
      ...state,
      dimensions: {
        ...action.value,
        left:
          action.value.right + state.width / 2 > window.innerWidth
            ? action.value.right - state.width
            : action.value.right - state.width / 2 - 15,
        top:
          action.value.y + state.height > window.innerHeight
            ? action.value.top - state.height
            : action.value.top + 35,
      },
    };
  }
  return baseReducer(state, action);
};

export const moveLeftReducer = (state: IState, action: IAction) => {
  if (action.type === actionTypes.setDimensions) {
    return {
      ...state,
      dimensions: {
        ...action.value,
        left: action.value.right - state.width,
        top: action.value.top + 10,
      },
    };
  }
  return baseReducer(state, action);
};

export const dynamicReducer = (state: IState, action: IAction) => {
  if (action.type === actionTypes.setDimensions) {
    return {
      ...state,
      dimensions: {
        ...action.value,
        left: action.value.left - state.width + 15,
        top:
          action.value.y + state.height > window.innerHeight
            ? action.value.top - state.height + 15
            : action.value.top,
      },
    };
  }
  return baseReducer(state, action);
};
