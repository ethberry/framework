import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWatch } from "react-hook-form";

import type { IMysteryBox } from "@framework/types";

import { MysteryboxContent } from "../../../../tables/mysterybox-content";

export const BoxContent: FC = () => {
  const mysteryBox: IMysteryBox | undefined = useWatch({ name: "mysteryBox" });

  if (!mysteryBox || !mysteryBox.item?.components?.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6">
        <FormattedMessage id="pages.mystery.boxContent.title" />
      </Typography>
      <MysteryboxContent mysteryBox={mysteryBox} />
    </Box>
  );
};
