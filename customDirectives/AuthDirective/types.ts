import { OwnContext } from "src/types";

export interface Roles {
  args: {
    [key: string]: any;
  };
  context: OwnContext;
}

export interface Validators {
  [key: string]: (roles: any) => Promise<boolean> | boolean;
}
