import React, {FC, useContext} from "react";

import {companyName} from "@gemunionstudio/solo-constants-misc";

import useStyles from "./styles";
import {DataContext, IDataContext} from "../../context/data/context";

export const Footer: FC = () => {
  const classes = useStyles();
  const data = useContext<IDataContext>(DataContext);

  const link = `${data.baseUrl}/profile/subscriptions`;
  return (
    <table cellPadding={0} cellSpacing={0} className={classes.root}>
      <tr>
        <td className={classes.unsubscribe}>
          You received this email because you&apos;ve registered on {companyName}. <br />
          To change your email preferences{" "}
          <a href={link} className={classes.link}>
            click here
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <br />
        </td>
      </tr>
      <tr>
        <td className={classes.copyright}>© TrejGun Inc. {new Date().getFullYear()}. All Rights Reserved</td>
      </tr>
    </table>
  );
};
