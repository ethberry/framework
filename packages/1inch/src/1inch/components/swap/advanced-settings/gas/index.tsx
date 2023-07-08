import { FC, MouseEvent } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { LocalFireDepartment } from "@mui/icons-material";

import { useOneInch } from "../../../../provider";

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
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
        }}
      >
        <LocalFireDepartment sx={{ mr: 1 }} />
        <FormattedMessage id="pages.dex.1inch.advanced-settings.gas" />
      </Box>

      <ToggleButtonGroup value={api.getGasPrice()} exclusive onChange={handleClick} fullWidth aria-label="gas price">
        {Object.values(GasPrice).map(gasPrice => (
          <ToggleButton value={gasPrice} aria-label={gasPrice} key={gasPrice}>
            <FormattedMessage id={`pages.dex.1inch.enums.gasPrice.${gasPrice}`} />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
