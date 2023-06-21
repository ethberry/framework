import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { ITemplate } from "@framework/types";
import { TokenType } from "@framework/types";

import { Erc721TemplateListItem } from "../../hierarchy/erc721/template-list/item";
import { MultiCarouselHierarchy } from "../multi-carousel-hierarchy";

export const NewErc721: FC = () => {
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
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <Typography variant="h4" sx={{ mt: 7 }}>
        <FormattedMessage id="pages.landing.erc721-new" />
      </Typography>
      <MultiCarouselHierarchy templates={templates} component={Erc721TemplateListItem} />
    </ProgressOverlay>
  );
};
