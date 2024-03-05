import { FC } from "react";
import { Box, Switch } from "@mui/material";

import { ReferralProgramStatus } from "@framework/types";

export interface IStatusSwitchProps {
  status: ReferralProgramStatus | null;
  isLoading?: boolean;
  onChange: (value: ReferralProgramStatus) => Promise<void>;
}

export const StatusSwitch: FC<IStatusSwitchProps> = props => {
  const { status, isLoading, onChange } = props;

  const handleChange = async (_event: any, value: boolean) => {
    await onChange(value ? ReferralProgramStatus.ACTIVE : ReferralProgramStatus.INACTIVE);
  };

  return (
    <Box>
      <Switch
        checked={status === ReferralProgramStatus.ACTIVE}
        disabled={isLoading || status === null}
        onChange={handleChange}
      />
    </Box>
  );
};
