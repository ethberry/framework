import { FC } from "react";
import { useWatch } from "react-hook-form";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { formatPrice } from "../../../../../../utils/money";

export const WaitListItem: FC = () => {
  const watchFields = useWatch({ name: "item" });

  return (
    <Typography>
      <FormattedMessage id="form.labels.item" />: {formatPrice(watchFields)}
    </Typography>
  );
};
