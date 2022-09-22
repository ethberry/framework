import { FC, MouseEvent } from "react";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { LocalFireDepartment } from "@mui/icons-material";

import { useOneInch } from "@gemunion/provider-1inch";

export enum GasPrice {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const GasSettings: FC = () => {
  const api = useOneInch();

  const handleClick = (e: MouseEvent, gasPrice: GasPrice) => {
    api.setGasPrice(gasPrice);
  };

  return (
    <Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <LocalFireDepartment />
        </Grid>
        <Grid item>
          <FormattedMessage id="pages.1inch.advanced-settings.gas" />
        </Grid>
      </Grid>

      <ToggleButtonGroup value={api.getGasPrice()} exclusive onChange={handleClick} fullWidth aria-label="gas price">
        {Object.values(GasPrice).map(gasPrice => (
          <ToggleButton value={gasPrice} aria-label={gasPrice} key={gasPrice}>
            <FormattedMessage id={`pages.1inch.enums.gasPrice.${gasPrice}`} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};
