import { ComponentClass, FunctionComponent } from "react";
import { createRoot } from "react-dom/client";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(<App />);
};
