import { FC, Fragment } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Grid } from "@mui/material";
import { constants, Contract, utils } from "ethers";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import { TokenType } from "@framework/types";
import type { IServerSignature } from "@gemunion/types-collection";

import ExchangeSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Exchange/Exchange.sol/Exchange.json";

import { validationSchema } from "./validation";
import { TokenInput } from "./token-input";
import { ContractInput } from "./contract-input";
import { TemplateInput } from "./template-input";

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
  const metaFnWithSign = useServerSignature(
    (values: IBreedDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, ExchangeSol.abi, web3Context.provider?.getSigner());

      return contract.breed(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: 0,
          expiresAt: sign.expiresAt,
          referrer: constants.AddressZero,
        },
        {
          tokenType: values.tokenType,
          token: values.mom.address,
          tokenId: values.mom.token.tokenId,
          amount: 1,
        },
        {
          tokenType: values.tokenType,
          token: values.dad.address,
          tokenId: values.dad.token.tokenId,
          amount: 1,
        },
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((data: IBreedDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/breed/sign",
        method: "POST",
        data: {
          momId: data.mom.tokenId,
          dadId: data.dad.tokenId,
        },
      },
      data,
      web3Context,
    );
  });

  const onSubmit = async (values: IBreedDto) => {
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
        onSubmit={onSubmit}
        showPrompt={false}
        testId="BreedForm"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput
              name="tokenType"
              options={TokenType}
              disabledOptions={[TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]}
            />
          </Grid>
          <Grid item xs={6}>
            <ContractInput prefix="mom" />
            <TemplateInput prefix="mom" />
            <TokenInput prefix="mom" />
          </Grid>
          <Grid item xs={6}>
            <ContractInput prefix="dad" />
            <TemplateInput prefix="dad" />
            <TokenInput prefix="dad" />
          </Grid>
        </Grid>
      </FormWrapper>
    </Fragment>
  );
};
