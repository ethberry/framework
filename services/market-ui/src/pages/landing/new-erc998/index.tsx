import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import { Erc998TemplateListItem } from "../../hierarchy/erc998/template-list/item";
import { MultiCarouselHierarchy } from "../multi-carousel-hierarchy";
import { StyledTitle } from "./styled";

export const NewErc998: FC = () => {
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/templates/new",
        data: {
          contractType: TokenType.ERC998,
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
  }, []);

  if (!templates || templates.length === 0) {
    return null;
  }

  return (
    <ProgressOverlay isLoading={isLoading}>
      <StyledTitle variant="h4">
        <FormattedMessage id="pages.landing.erc998-new" />
      </StyledTitle>
      <MultiCarouselHierarchy templates={templates} component={Erc998TemplateListItem} />
    </ProgressOverlay>
  );
};
