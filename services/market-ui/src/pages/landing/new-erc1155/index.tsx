import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import { Erc1155TemplateListItem } from "../../hierarchy/erc1155/template-list/item";
import { MultiCarouselHierarchy } from "../multi-carousel-hierarchy";
import { StyledTitle } from "./styled";

export const NewErc1155: FC = () => {
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/templates/new",
        data: {
          contractType: TokenType.ERC1155,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchTokens = async (): Promise<any> => {
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
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <StyledTitle variant="h4">
        <FormattedMessage id="pages.landing.erc1155-new" />
      </StyledTitle>
      <MultiCarouselHierarchy templates={templates} component={Erc1155TemplateListItem} />
    </ProgressOverlay>
  );
};
