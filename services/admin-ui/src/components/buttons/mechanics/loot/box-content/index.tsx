import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useWatch } from "react-hook-form";

import type { ILootBox } from "@framework/types";

import { LootBoxContent } from "../../../../tables/loot-content";

export const BoxContent: FC = () => {
  const lootBox: ILootBox | undefined = useWatch({ name: "lootBox" });

  if (!lootBox || !lootBox.content?.components?.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6">
        <FormattedMessage id="pages.loot.boxContent.title" />
      </Typography>
      <LootBoxContent lootBox={lootBox} />
    </Box>
  );
};
