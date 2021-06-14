import React, {FC, useContext} from "react";

import {DataContext, IDataContext} from "../../../components/context/data/context";
import useStyles from "./styles";

export const Verification: FC = () => {
  const classes = useStyles();

  const data = useContext<IDataContext>(DataContext);

  const link = `${data.baseUrl}/verify-email/${data.token!.uuid}`;
  return (
    <div>
      <h2>Confirm your email address</h2>
      <p>Please enter this verification code to get started:</p>
      <pre className={classes.code}>{data.token!.uuid}</pre>
      <p>
        verification code expires in <em>5 minutes</em>
      </p>
      <p>Alternatively, you can click on the confirmation link below:</p>
      <p>
        <a href={link}>{link}</a>
      </p>
    </div>
  );
};
