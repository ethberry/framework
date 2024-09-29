import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Grid } from "@mui/material";
import { BigNumber, constants, Contract, utils } from "ethers";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { useMetamask, useServerSignature } from "@ethberry/react-hooks-eth";
import { useAppSelector } from "@ethberry/redux";
import { walletSelectors } from "@ethberry/provider-wallet";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { FormWrapper } from "@ethberry/mui-form";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IContract } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import BreedABI from "@framework/abis/json/ExchangeBreedFacet/breed.json";

import { CommonContractInput } from "../../../../../components/inputs/common-contract";
import { TemplateInput } from "./template-input";
import { TokenInput } from "./token-input";
import { validationSchema } from "./validation";
import { StyledSubtitle } from "./styled";

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
  const referrer = useAppSelector(walletSelectors.referrerSelector);

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

  const metaFn = useMetamask((values: IBreedDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/breed/sign",
        method: "POST",
        data: {
          referrer,
          momId: values.mom.tokenId,
          dadId: values.dad.tokenId,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
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
            <StyledSubtitle variant="h6">
              <FormattedMessage id="pages.breed.matron" />
            </StyledSubtitle>
          </Grid>
          <Grid item xs={6}>
            <StyledSubtitle variant="h6">
              <FormattedMessage id="pages.breed.sire" />
            </StyledSubtitle>
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
