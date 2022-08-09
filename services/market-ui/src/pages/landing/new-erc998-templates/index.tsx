import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { ITemplate, TokenType } from "@framework/types";

import { useStyles } from "./styles";
import { MultiCarousel } from "../multi-carousel";
import { Erc998TemplateItem } from "../../tokens/erc998/template-list/item";

export const NewErc998: FC = () => {
  const classes = useStyles();

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

  return (
    <ProgressOverlay isLoading={isLoading}>
      <Typography variant="h4" className={classes.title}>
        <FormattedMessage id="pages.landing.erc998-new" />
      </Typography>
      <MultiCarousel template={templates} component={Erc998TemplateItem} />
    </ProgressOverlay>
  );
};
