import { FC } from "react";
import { useWatch } from "react-hook-form";

import type { IMysteryBox } from "@framework/types";

import { BoxContent } from "../../../../../../../../../pages/mechanics/box-content";

export const MysteryBoxContent: FC = () => {
  const mysteryBox: IMysteryBox | undefined = useWatch({ name: "mysteryBox" });

  if (!mysteryBox?.content?.components?.length) {
    return null;
  }

  return <BoxContent content={mysteryBox?.content} />;
};
