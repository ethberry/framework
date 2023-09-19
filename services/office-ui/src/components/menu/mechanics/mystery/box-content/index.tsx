import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWatch } from "react-hook-form";

import { IMysteryBox } from "@framework/types";

import { MysteryboxContent } from "../../../../tables/mysterybox-content";

export const BoxContent: FC = () => {
  const mysterybox: IMysteryBox | undefined = useWatch({ name: "mysterybox" });

  if (!mysterybox || !mysterybox.item?.components?.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6">
        <FormattedMessage id="pages.mystery.boxContent.title" />
      </Typography>
      <MysteryboxContent mysterybox={mysterybox} />
    </Box>
  );
};
