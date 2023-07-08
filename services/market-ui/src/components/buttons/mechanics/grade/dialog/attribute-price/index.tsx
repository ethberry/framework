import { FC } from "react";
import { useWatch } from "react-hook-form";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { formatPrice } from "../../../../../../utils/money";

export const AttributePrice: FC = () => {
  const watchFields = useWatch({ name: "price" });

  return (
    <Typography>
      <FormattedMessage id="form.labels.price" />: {formatPrice(watchFields)}
    </Typography>
  );
};
