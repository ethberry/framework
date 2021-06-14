import React, {FC} from "react";

import {Header} from "../header";
import {Footer} from "../footer";

import useStyles from "./styles";

export const Layout: FC = ({children}) => {
  const classes = useStyles();
  return (
    <table cellPadding={0} cellSpacing={0} className={classes.main}>
      <tr>
        <td colSpan={3} className={classes.header}>
          <Header />
        </td>
      </tr>
      <tr>
        <td />
        <td className={classes.main}>{children}</td>
        <td />
      </tr>
      <tr>
        <td colSpan={3} className={classes.footer}>
          <Footer />
        </td>
      </tr>
    </table>
  );
};
