import { emptyStateString } from "@ethberry/draft-js-utils";
import { emptyPrice, getEmptyTemplate } from "@ethberry/mui-inputs-asset";
import { type ITemplate, ShapeType, TokenType } from "@framework/types";

import { defaultValues, timeValues } from "./constants";
import { Time } from "./types";

export const emptyValues = {
  title: "",
  description: emptyStateString,
  content: getEmptyTemplate(TokenType.ERC20),
  template: {
    price: emptyPrice,
  } as ITemplate,
  duration: timeValues[Time.YEAR],
  startTimestamp: new Date().toISOString(),
  shape: ShapeType.LINEAR,
  period: 1,
  ...defaultValues,
};
