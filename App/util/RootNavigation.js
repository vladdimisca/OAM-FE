import { createRef } from "react";

export const navigationRef = createRef();

export function dispatch(prop) {
  navigationRef.current?.dispatch(prop);
}
