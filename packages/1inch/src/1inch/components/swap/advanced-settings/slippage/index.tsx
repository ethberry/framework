import { FC, MouseEvent } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Waves } from "@mui/icons-material";

import { useOneInch } from "../../../../provider";

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
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Waves sx={{ mr: 1 }} />
        <FormattedMessage id="pages.dex.1inch.advanced-settings.slippage" />
      </Box>

      <ToggleButtonGroup value={api.getSlippage()} exclusive onChange={handleClick} fullWidth aria-label="gas price">
        {Object.values(Slippage).map(slippage => (
          <ToggleButton value={slippage} aria-label={slippage} key={slippage}>
            <FormattedMessage id={`pages.dex.1inch.enums.slippage.${slippage}`} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
