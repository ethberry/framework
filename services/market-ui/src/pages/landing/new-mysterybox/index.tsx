import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import type { IPaginationResult } from "@ethberry/types-collection";
import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { useApiCall } from "@ethberry/react-hooks";
import type { IMysteryBox } from "@framework/types";

import { MultiCarouselMysterybox } from "../multi-carousel-mysterybox";
import { MysteryBoxListItem } from "../../mechanics/marketing/mystery/box-list/item";
import { StyledTitle } from "./styled";

export const NewMysterybox: FC = () => {
  const { chainId } = useWeb3React();
  const [mysteryboxes, setMysteryboxes] = useState<Array<IMysteryBox>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/mystery/boxes/new",
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<any> => {
    return fn()
      .then((json: IPaginationResult<IMysteryBox>) => {
        setMysteryboxes(json.rows);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchTokens();
  }, [chainId]);

  if (!mysteryboxes || mysteryboxes.length === 0) {
    return null;
  }

  return (
    <ProgressOverlay isLoading={isLoading} wrapperSx={{ minHeight: 400 }}>
      <StyledTitle variant="h4">
        <FormattedMessage id="pages.landing.mysterybox-new" />
      </StyledTitle>
      <MultiCarouselMysterybox mysteryBoxes={mysteryboxes} component={MysteryBoxListItem} />
    </ProgressOverlay>
  );
};
