import React, { FC } from "react";
import { Box } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IMerge, IMergeSignDto, IToken } from "@framework/types";

import { TokenMergeInput } from "../../../../../inputs/merge-token";
import { MergeInfoPopover } from "./popover";
import { Root, StyledCard, StyledCardContent, StyledCardWrapper } from "./styled";

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
      message={message}
      testId={testId}
      action={<MergeInfoPopover merge={merge} />}
      {...rest}
    >
      <Root>
        <StyledCardWrapper>
          <StyledCard>
            {merge.item?.components.map(component => {
              return (
                <StyledCardContent key={component.template!.id}>
                  <Box component="img" src={component.template!.imageUrl} alt="Gemunion template image" />
                </StyledCardContent>
              );
            })}
          </StyledCard>
        </StyledCardWrapper>
        <TokenMergeInput merge={merge} />
      </Root>
    </FormDialog>
  );
};
