import { FC } from "react";
import { useWatch } from "react-hook-form";

import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

export interface ITemplateInputProps {
  prefix: string;
  autoSelect?: boolean;
  multiple?: boolean;
  required?: boolean;
  tokenType?: {
    disabledOptions?: Array<TokenType>;
  };
  contract?: {
    data?: {
      contractModule?: Array<string>;
      contractStatus?: Array<string>;
      [k: string]: any;
    };
  };
  template?: {
    data?: {
      templateStatus?: Array<string>;
      [k: string]: any;
    };
  };
  readOnly?: boolean;
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { autoSelect, multiple, required, prefix, tokenType, contract, template, readOnly } = props;
  const merchantId = useWatch({ name: "merchantId" });

  return (
    <TemplateAssetInput
      autoSelect={autoSelect}
      multiple={multiple}
      required={required}
      prefix={prefix}
      tokenType={tokenType}
      contract={{
        data: {
          ...contract?.data,
          merchantId,
        },
      }}
      template={{
        data: {
          ...template?.data,
          merchantId,
        },
      }}
      readOnly={readOnly}
    />
  );
};
