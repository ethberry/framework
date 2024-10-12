import { FC } from "react";
import { useWatch } from "react-hook-form";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { formatItem } from "@framework/exchange";

export const AttributePrice: FC = () => {
  const price = useWatch({ name: "price" });

  return (
    <Typography>
      <FormattedMessage id="form.labels.price" />: {formatItem(price)}
    </Typography>
  );
};
