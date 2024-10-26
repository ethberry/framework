import { FC } from "react";
import { useWatch } from "react-hook-form";

import type { ILootBox } from "@framework/types";

import { BoxContent } from "../../../../../../../../../pages/mechanics/box-content";

export const LootBoxContent: FC = () => {
  const lootBox: ILootBox | undefined = useWatch({ name: "lootBox" });

  if (!lootBox?.content?.components?.length) {
    return null;
  }

  return <BoxContent content={lootBox?.content} />;
};
