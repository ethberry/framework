import { ComponentClass, FunctionComponent } from "react";
import { render } from "react-dom";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  render(<App />, document.getElementById("app"));
};
