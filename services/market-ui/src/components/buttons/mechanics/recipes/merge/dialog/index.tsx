import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { formatItem } from "@framework/exchange";
import type { IMerge, IMergeSignDto, IToken } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { TokenMergeInput } from "../../../../../inputs/merge-token";
import { Root, StyledCard, StyledCardContent, StyledCardWrapper } from "./styled";
import { validationSchema } from "./validation";

export interface IMergeDto extends Pick<IMergeSignDto, "tokenIds"> {
  tokens: IToken[];
  tokenEntities: IToken[];
}

export interface IMergeDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMergeDto, form: any) => Promise<void>;
  initialValues: IMergeDto;
  merge: IMerge;
  message: string;
  testId?: string;
}

export const MergeDialog: FC<IMergeDialogProps> = props => {
  const { initialValues, message, merge, testId = "MergeDialogForm", ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <Root>
        <Typography>
          <FormattedMessage
            id="pages.recipes.merge.popover"
            values={{
              price: formatItem(merge.price),
              item: formatItem(merge.item),
            }}
          />
        </Typography>
        <StyledCardWrapper>
          <StyledCard>
            {merge.item?.components.map(component => {
              return (
                <StyledCardContent key={component.template!.id}>
                  <Box component="img" src={component.template!.imageUrl} alt={component.template!.title} />
                </StyledCardContent>
              );
            })}
          </StyledCard>
        </StyledCardWrapper>
        {/* <StyledAlert */}
        {/*  severity="warning" */}
        {/*  action={ */}
        {/*    merge.price?.components[0].contract ? ( */}
        {/*      <AllowanceForAllButton contract={merge.price.components[0].contract} /> */}
        {/*    ) : null */}
        {/*  } */}
        {/* > */}
        {/*  <FormattedMessage id="alert.approve" /> */}
        {/* </StyledAlert> */}
        <TokenMergeInput merge={merge} />
      </Root>
    </FormDialog>
  );
};
