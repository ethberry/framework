import React, {FC, useContext} from "react";
import {DataContext, IDataContext} from "../../../components/context/data/context";

export const Restore: FC = () => {
  const data = useContext<IDataContext>(DataContext);

  const link = `${data.baseUrl}/login/`;
  return (
    <div>
      <h2>Password Restored! Proceed to login</h2>
      <a href={link}>{link}</a>
    </div>
  );
};
