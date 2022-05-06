import { FC } from "react";

import { useStyles } from "./styles";

export const Landing: FC = () => {
  const classes = useStyles();

  return (
    <div>
      <a href="https://gemunion.io">
        <img src="/logo.png" alt="GEMUNION" className={classes.logo} />
      </a>
    </div>
  );
};
