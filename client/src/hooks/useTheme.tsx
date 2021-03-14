import * as React from "react";

interface ITheme {
  themeColor: string;
  color: string;
}

export const useTheme = () => {
  const currentTheme: ITheme = JSON.parse(localStorage.getItem("theme")!);

  const [theme, setTheme] = React.useState(() => {
    return (
      currentTheme || {
        themeColor: "rgb(255, 255, 255)",
        color: "rgb(29, 161, 242)",
      }
    );
  });

  React.useEffect(() => {
    document.body.dataset.theme = theme.themeColor;
    document.body.dataset.color = theme.color;

    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return ([theme, setTheme] as const) || null;
};
