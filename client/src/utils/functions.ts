import { closestTo, format, formatDistanceToNowStrict } from "date-fns";
import { Conversation } from "../generated/graphql";

export const mergeRefs =
  <T = any>(
    ...refs: Array<React.RefObject<T> | React.LegacyRef<T>>
  ): React.RefCallback<T> =>
  (value) => {
    refs.forEach((possibleRef) => {
      (possibleRef as React.MutableRefObject<T | null>).current = value;
    });
  };

export const convertDateToTime = (entity: { id: string }) => {
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
    parseInt(entity!.id.toString().substring(0, 8), 16) * 1000
  );
  const date =
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

export function convertIdToDate(value: string) {
  return new Date(parseInt(value.substring(0, 8), 16) * 1000);
}

export function getClosestToDate(date: Date | number, array: Conversation[]) {
  let dates: Array<Date> = [];
  let dateKey: Array<{ [key: string]: Conversation }> = [];

  array?.forEach((conversation) => {
    if (conversation.mostRecentEntryId) {
      let date = convertIdToDate(conversation?.mostRecentEntryId!);

      dates = [...dates, date];
      return (dateKey[date.getTime().toString()] = conversation);
    }
  });
  console.log(dateKey);
  return dateKey[closestTo(date, dates)?.getTime()]?.mostRecentEntryId;
}

export function formatNumToK(num: number) {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))} k`
    : Math.sign(num) * Math.abs(num);
}
