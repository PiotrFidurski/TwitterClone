import * as React from "react";
import { Post } from "../../generated/graphql";

interface IContext {
  post: Post;
  userId: string;
  prevItem?: Post;
}

const Context = React.createContext<IContext | null>(null);

interface PostProviderProps {}

export const PostProvider: React.FC<PostProviderProps & IContext> = React.memo(
  ({ ...props }) => {
    return (
      <Context.Provider value={{ ...props }}>{props.children}</Context.Provider>
    );
  },
  (prevProps, nextProps) => prevProps.post === nextProps.post
);

export const usePost = () => {
  const context = React.useContext(Context)!;
  if (!context) {
    throw new Error("You're using PostContext outside of PostProvider.");
  }
  return { ...context };
};
