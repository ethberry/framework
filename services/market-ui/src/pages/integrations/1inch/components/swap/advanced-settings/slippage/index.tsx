import { FC, MouseEvent } from "react";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Waves } from "@mui/icons-material";

import { useOneInch } from "@gemunion/provider-1inch";

export enum Slippage {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export const SlippageSettings: FC = () => {
  const api = useOneInch();

  const handleClick = (e: MouseEvent, slippage: Slippage) => {
    api.setSlippage(slippage);
  };

  return (
    <Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <Waves />
        </Grid>
        <Grid item>
          <FormattedMessage id="pages.1inch.advanced-settings.slippage" />
        </Grid>
      </Grid>

      <ToggleButtonGroup value={api.getSlippage()} exclusive onChange={handleClick} fullWidth aria-label="gas price">
        {Object.values(Slippage).map(slippage => (
          <ToggleButton value={slippage} aria-label={slippage} key={slippage}>
            <FormattedMessage id={`pages.1inch.enums.slippage.${slippage}`} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};
