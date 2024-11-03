import React, { FC } from "react";
import { Box } from "@mui/material";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import { ContractStatus, ModuleType, TokenType, VestingBoxStatus } from "@framework/types";

import { SelectInput } from "./select";
import { durationOptions } from "./constants";
import { PeriodDropdown } from "./period-dropdown";
import { Cliff } from "./cliff";
import { GrowthRate } from "./growth-rate";
import { StartTimeStamp } from "./start-timestamp";
import { ShapeDropdown } from "./shape-dropdown";
import { GridContainer, GridItem, Root } from "./styled";
import { useRenderPlot } from "./hooks";

export interface IVestingBoxForm {
  id?: number;
}

export const VestingBoxForm: FC<IVestingBoxForm> = props => {
  const { id } = props;
  useRenderPlot();

  return (
    <Root>
      <GridContainer container>
        <GridItem item xs={5.7}>
          <AvatarInput name="imageUrl" required />
          <TextInput name="title" required />
          <EntityInput
            required
            name="template.contractId"
            controller="contracts"
            data={{
              contractModule: [ModuleType.VESTING],
              contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
            }}
            readOnly={!!id}
          />
          <TemplateAssetInput
            required
            autoSelect
            prefix="content"
            tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
            contract={{
              data: {
                contractType: [TokenType.ERC20],
                contractModule: [ModuleType.HIERARCHY],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
              },
            }}
            forceAmount
            readOnly={!!id}
          />
          <TemplateAssetInput
            required
            autoSelect
            prefix="template.price"
            tokenType={{ disabledOptions: [TokenType.ERC721] }}
            contract={{
              data: {
                contractModule: [ModuleType.HIERARCHY],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
              },
            }}
          />
          {id ? <SelectInput name="vestingBoxStatus" options={VestingBoxStatus} /> : null}
        </GridItem>
        <GridItem item xs={5.7}>
          <Box id="function-plot" />
          <StartTimeStamp />
          <ShapeDropdown />
          <SelectInput name="duration" options={durationOptions} required />
          <Cliff />
          <PeriodDropdown />
          <GrowthRate />
        </GridItem>
      </GridContainer>
      <RichTextEditor name="description" InputLabelProps={{ required: true }} />
      {/* <FormWatcher /> */}
    </Root>
  );
};
