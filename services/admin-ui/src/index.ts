import { App } from "./pages";
import { render } from "./utils/render";

Object.defineProperty(BigInt.prototype, "toJSON", {
  value: function () {
    return this.toString();
  },
  configurable: true,
  enumerable: false,
  writable: true,
});

render(App);
