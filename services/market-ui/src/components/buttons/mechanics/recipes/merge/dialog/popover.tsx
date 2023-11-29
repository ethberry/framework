import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { formatItem } from "@framework/exchange";
import { IMerge } from "@framework/types";

import { InfoPopover } from "../../../../../popover";

export interface IMergeInfoPopoverProps {
  merge: IMerge;
}

export const MergeInfoPopover: FC<IMergeInfoPopoverProps> = props => {
  const { merge } = props;

  return (
    <InfoPopover>
      <FormattedMessage
        id="pages.recipes.merge.popover"
        values={{
          price: formatItem(merge.price),
          item: formatItem(merge.item),
        }}
      />
    </InfoPopover>
  );
};
