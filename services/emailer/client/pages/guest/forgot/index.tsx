import React, { FC, useContext } from "react";

import { DataContext, IDataContext } from "../../../components/context/data/context";
import useStyles from "./styles";

export const Forgot: FC = () => {
  const classes = useStyles();

  const data = useContext<IDataContext>(DataContext);

  const link = `${data.baseUrl}/restore-password/${data.token!.uuid}`;
  return (
    <div>
      <h2>Recover your password</h2>
      <p>Please enter this recovery code in trejgun app:</p>
      <pre className={classes.code}>{data.token!.uuid}</pre>
      <p>
        recovery code expires in <em>5 minutes</em>
      </p>
      <p>Alternatively, you can click on the confirmation link below:</p>
      <p>
        <a href={link}>{link}</a>
      </p>
    </div>
  );
};
