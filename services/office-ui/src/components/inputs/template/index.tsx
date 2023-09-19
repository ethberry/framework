import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { useUser } from "@gemunion/provider-user";
import { ContractFeatures, IUser, TemplateStatus } from "@framework/types";

export interface ITemplateInputProps {
  contractFeatures?: Array<ContractFeatures>;
  templateStatus?: Array<TemplateStatus>;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { templateStatus = [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN], contractFeatures } = props;

  const { profile } = useUser<IUser>();

  const tokenType = useWatch({ name: "tokenType" });
  const contractIds = useWatch({ name: "contractIds" });

  return (
    <EntityInput
      name="templateIds"
      controller="templates"
      data={{
        contractIds,
        templateStatus,
        contractFeatures,
        contractType: [tokenType],
        merchantId: profile.merchantId,
      }}
      multiple
    />
  );
};
