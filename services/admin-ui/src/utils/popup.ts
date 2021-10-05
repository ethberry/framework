import { MouseEvent } from "react";

function _open(url: string): void {
  if (typeof window !== "undefined") {
    const width = 960;
    const height = 480;
    const top = (window.innerHeight - height) / 2;
    const left = (window.innerWidth - width) / 2;

    const popup = window.open(url, "_blank", `height=${height},width=${width},top=${top},left=${left}`);
    if (popup && window.focus) {
      popup.focus();
    }
  }
}

export function open(e: MouseEvent<HTMLAnchorElement>): void {
  e.preventDefault();
  _open((e.target as HTMLAnchorElement).href);
}

export function popup(url: string): (e: MouseEvent) => void {
  return (_e: MouseEvent): void => _open(url);
}
