import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import type { IPaginationResult } from "@ethberry/types-collection";
import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { useApiCall } from "@ethberry/react-hooks";
import type { ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import { Erc721TemplateListItem } from "../../hierarchy/erc721/template-list/item";
import { MultiCarouselHierarchy } from "../multi-carousel-hierarchy";
import { StyledTitle } from "./styled";

export const NewErc721: FC = () => {
  const { chainId } = useWeb3React();
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/templates/new",
        data: {
          contractType: TokenType.ERC721,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<void> => {
    return fn()
      .then((json: IPaginationResult<ITemplate>) => {
        setTemplates(json.rows);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchTokens();
  }, [chainId]);

  if (!templates || templates.length === 0) {
    return null;
  }

  return (
    <ProgressOverlay isLoading={isLoading}>
      <StyledTitle variant="h4">
        <FormattedMessage id="pages.landing.erc721-new" />
      </StyledTitle>
      <MultiCarouselHierarchy templates={templates} component={Erc721TemplateListItem} />
    </ProgressOverlay>
  );
};
