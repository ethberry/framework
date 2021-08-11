import React, {FC, useContext} from "react";

import {companyName} from "@gemunionstudio/solo-constants-misc";

import useStyles from "./styles";
import {DataContext, IDataContext} from "../../context/data/context";

export const Header: FC = () => {
  const classes = useStyles();
  const data = useContext<IDataContext>(DataContext);

  return (
    <a href={data.baseUrl} className={classes.link}>
      <img
        className={classes.image}
        alt={companyName}
        height="144"
        width="144"
        src="https://firebasestorage.googleapis.com/v0/b/trejgun-website.appspot.com/o/website%20assets%2F144.png?alt=media&token=507e9642-0de0-4b04-abf7-36b4133f5e1e"
      />
    </a>
  );
};
