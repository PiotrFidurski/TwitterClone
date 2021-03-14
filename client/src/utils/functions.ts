import * as React from "react";
import { ConversationQuery, FeedQuery, Post } from "../generated/graphql";
import { RepliesQuery } from "../generated/introspection-result";
import format from "date-fns/format";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

export function useThreadConversation(
  callback: () => void,
  deps: [unknown, boolean]
) {
  const [data, loading] = deps;
  const [sorted, setSorted] = React.useState(() => !!data || false);

  React.useLayoutEffect(() => {
    if (!loading && !sorted) {
      callback();
      setTimeout(() => {
        setSorted(true);
      }, 200);
    }
  }, [loading, sorted, callback]);

  return [sorted] as const;
}

export function threadFeed(
  currentResult: FeedQuery | undefined,
  prevResult: FeedQuery | undefined
) {
  let thread: Array<{ [key: string]: Post }> = [];

  currentResult &&
    currentResult!.feed! &&
    currentResult!.feed!.feed! &&
    currentResult!.feed!.feed!.forEach((post) => (thread[post!.id!] = post));

  let array =
    currentResult &&
    currentResult!.feed!.feed! &&
    currentResult!.feed!.feed!.filter((post) => !post.replyCount!);

  array &&
    array!.length &&
    array!.slice(0).forEach((post, index) => {
      let parent: Post = thread[post!.inReplyToId!];

      if (parent && !array!.includes(parent)) {
        const idx = array!.indexOf(post);

        array!.splice(idx, 0, parent);

        if (
          parent.inReplyToId &&
          !array!.includes(thread[parent.conversationId!])
        ) {
          const idx = array!.indexOf(parent);

          array!.splice(idx, 0, thread[parent!.conversationId!]);
        }
      }
    });

  return array;
}

export const sortConversation = (
  post: Post,
  data: ConversationQuery | undefined
) => {
  const thread: Array<{ [key: string]: Post }> = [];

  data && data!.conversation!.forEach((post) => (thread[post.id] = post));

  let array =
    data &&
    data!.conversation!.filter((_post) => _post.id === post.inReplyToId);

  const findMore = (post: Post) => {
    if (post) {
      post && array!.unshift(post);
      findMore(thread[post!.inReplyToId!]);
    }
  };

  if (array && array.length) {
    array!.slice(0).forEach((post) => {
      let parent: Post = thread[post!.inReplyToId!];

      if (!array!.includes(parent)) {
        findMore(parent!);
      }
    });
  }

  return array;
};

export const sortReplies = (data: RepliesQuery | undefined, post: Post) => {
  const thread: Array<{ [key: string]: Post }> = [];

  data &&
    data!.replies!.forEach((_post) => (thread[_post.inReplyToId!] = _post));

  let array = data!.replies!.filter((_post) => _post.inReplyToId === post.id);

  array!.slice(0).forEach((_post) => {
    let child = thread[_post!.id];
    if (child) {
      let idx = array.indexOf(_post);
      array.splice(idx + 1, 0, child);
    }
  });

  return array;
};

export const convertDateToTime = (post: Post) => {
  const replaceString: { [key: string]: string } = {
    "/ /g": "",
    hours: "h",
    hour: "h",
    minute: "m",
    second: "s",
    minutes: "m",
    seconds: "s",
  };

  const time = new Date(
    parseInt(post!.id.toString().substring(0, 8), 16) * 1000
  );
  let date =
    Number(
      formatDistanceToNowStrict(time, { unit: "hour" }).replace("hours", "")
    ) > 24
      ? format(time, "MMM dd, yyyy", {})
      : formatDistanceToNowStrict(time)
          .replace(
            /hours|hour|minutes|minute|seconds|second/gi,
            function (matches) {
              return replaceString[matches];
            }
          )
          .replace(/ /g, "");

  return date;
};
