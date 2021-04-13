export interface IState {
  dimensions: DOMRectReadOnly | undefined;
  open: boolean;
  width: number;
  height: number;
  visible: boolean;
}

export interface IAction {
  type: string;
  value?: any;
}

export const moveLeftReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "open": {
      return {
        ...state,
        open: !state.open,
      };
    }
    case "close": {
      return {
        ...state,
        open: false,
      };
    }
    case "set_menu_size": {
      return {
        ...state,
        width: action.value.width,
        height: action.value.height,
      };
    }
    case "set_dimensions": {
      return {
        ...state,
        dimensions: {
          ...action.value,
          left: action.value.right - state.width,
          top: action.value.top + 10,
        },
      };
    }
    case "set_visibility": {
      return { ...state, visible: true };
    }
    default:
      return state;
  }
};

export const moveUpReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "open": {
      return {
        ...state,
        open: !state.open,
        visible: true,
      };
    }
    case "close": {
      return {
        ...state,
        open: false,
      };
    }

    case "set_dimensions": {
      return {
        ...state,
        dimensions: { ...action.value, y: 290 },
      };
    }
    default:
      return state;
  }
};

export const moveUpAndLeftReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "open": {
      return {
        ...state,
        open: !state.open,
      };
    }
    case "close": {
      return {
        ...state,
        open: false,
      };
    }
    case "set_menu_size": {
      return {
        ...state,
        width: action.value.width,
        height: action.value.height,
      };
    }
    case "set_dimensions": {
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
    case "set_visibility": {
      return { ...state, visible: true };
    }
    default:
      return state;
  }
};
