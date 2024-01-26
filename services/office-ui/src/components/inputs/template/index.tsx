import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, TemplateStatus } from "@framework/types";

export interface ITemplateInputProps {
  contractFeatures?: Array<ContractFeatures>;
  templateStatus?: Array<TemplateStatus>;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { templateStatus = [TemplateStatus.ACTIVE, TemplateStatus.HIDDEN], contractFeatures } = props;

  const name = "templateIds";

  const form = useFormContext();
  const tokenType = useWatch({ name: "tokenType" });
  const merchantId = useWatch({ name: "merchantId" });
  const contractIds = useWatch({ name: "contractIds" });

  useEffect(() => {
    form.setValue(name, [], { shouldDirty: true, shouldTouch: true });
  }, [merchantId]);

  return (
    <EntityInput
      name={name}
      controller="templates"
      data={{
        contractIds,
        templateStatus,
        contractFeatures,
        contractType: [tokenType],
        merchantId,
      }}
      multiple
    />
  );
};
