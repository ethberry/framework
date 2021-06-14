import {createContext} from "react";
import {IToken, IUser} from "@trejgun/solo-types";

export interface IDataContext {
  user?: IUser;
  token?: IToken;
  baseUrl: string;
  [key: string]: any;
}

export const DataContext = createContext<IDataContext>(undefined!);
