import React, { FC } from "react";

import { DataContext, IDataContext } from "./context";

interface IDataProviderProps {
  data: IDataContext;
}

export const DataProvider: FC<IDataProviderProps> = ({ data, children }) => {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
