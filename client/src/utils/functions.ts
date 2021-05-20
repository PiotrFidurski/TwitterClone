import format from "date-fns/format";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

export const mergeRefs =
  (...refs: Array<any>) =>
  (ref: any) => {
    refs.forEach((possibleRef) => {
      if (typeof possibleRef === "function") {
        possibleRef(ref);
      } else {
        (possibleRef as any).current = ref;
      }
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
