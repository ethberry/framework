import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Grid, Typography } from "@mui/material";
import { BigNumber, constants, Contract, utils } from "ethers";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { useMetamask, useServerSignature, useSystemContract } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IContract } from "@framework/types";
import { ContractFeatures, SystemModuleType, TokenType } from "@framework/types";

import BreedABI from "../../../../abis/mechanics/breed/main/breed.abi.json";

import { CommonContractInput } from "../../../../components/inputs/common-contract";
import { TemplateInput } from "./template-input";
import { TokenInput } from "./token-input";
import { validationSchema } from "./validation";

export interface IBreedDto {
  tokenType: TokenType;
  mom: {
    address: string;
    contractId: number;
    templateId: number;
    tokenId: number;
    token: {
      tokenId: string;
    };
  };
  dad: {
    address: string;
    contractId: number;
    templateId: number;
    tokenId: number;
    token: {
      tokenId: string;
    };
  };
}

export const Breed: FC = () => {
  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (values: IBreedDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, BreedABI, web3Context.provider?.getSigner());

      return contract.breed(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: BigNumber.from(sign.bytecode),
          expiresAt: sign.expiresAt,
          referrer: constants.AddressZero,
          extra: utils.formatBytes32String("0x"),
        },
        {
          tokenType: Object.values(TokenType).indexOf(values.tokenType),
          token: values.mom.address,
          tokenId: values.mom.token.tokenId,
          amount: 1,
        },
        {
          tokenType: Object.values(TokenType).indexOf(values.tokenType),
          token: values.dad.address,
          tokenId: values.dad.token.tokenId,
          amount: 1,
        },
        sign.signature,
      ) as Promise<void>;
    },
    // { error: false },
  );

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IBreedDto, web3Context: Web3ContextType, systemContract: IContract) => {
      const { chainId, account } = web3Context;

      return metaFnWithSign(
        {
          url: "/breed/sign",
          method: "POST",
          data: {
            chainId,
            account,
            referrer: settings.getReferrer(),
            momId: values.mom.tokenId,
            dadId: values.dad.tokenId,
          },
        },
        values,
        web3Context,
        systemContract,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((values: IBreedDto, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, values, web3Context);
  });

  const handleSubmit = async (values: IBreedDto) => {
    await metaFn(values);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "breed"]} />

      <PageHeader message="pages.breed.title" />

      <FormWrapper
        initialValues={{
          tokenType: TokenType.ERC721,
          mom: {
            address: constants.AddressZero,
            tokenId: 0,
            token: {
              tokenId: "0",
            },
          },
          dad: {
            address: constants.AddressZero,
            tokenId: 0,
            token: {
              tokenId: "0",
            },
          },
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        showPrompt={false}
        testId="BreedForm"
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ mt: 1 }}>
              <FormattedMessage id="pages.breed.matron" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ mt: 1 }}>
              <FormattedMessage id="pages.breed.sire" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SelectInput
              name="tokenType"
              options={TokenType}
              disabledOptions={[TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]}
            />
          </Grid>
          <Grid item xs={6}>
            <CommonContractInput
              name="mom.contractId"
              data={{ contractFeatures: [ContractFeatures.GENES] }}
              withTokenType
            />
            <TemplateInput prefix="mom" />
            <TokenInput prefix="mom" />
          </Grid>
          <Grid item xs={6}>
            <CommonContractInput
              name="dad.contractId"
              data={{ contractFeatures: [ContractFeatures.GENES] }}
              withTokenType
            />
            <TemplateInput prefix="dad" />
            <TokenInput prefix="dad" />
          </Grid>
        </Grid>
      </FormWrapper>
    </Fragment>
  );
};
