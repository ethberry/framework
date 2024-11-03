import { FC } from "react";
import { useWatch } from "react-hook-form";

import type { IVestingBox } from "@framework/types";

import { BoxContent } from "../../../../../../pages/mechanics/box-content";

export const VestingBoxContent: FC = () => {
  const vestingBox: IVestingBox | undefined = useWatch({ name: "vestingBox" });

  if (!vestingBox?.content?.components?.length) {
    return null;
  }

  return (
    <BoxContent content={vestingBox.content} />
  );
};
