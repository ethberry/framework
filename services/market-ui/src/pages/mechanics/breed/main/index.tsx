import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { Web3ContextType } from "@web3-react/core";
import { Grid, Typography } from "@mui/material";

import { BigNumber, constants, Contract, utils } from "ethers";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import type { IServerSignature } from "@gemunion/types-blockchain";
import { TokenType } from "@framework/types";

import BreedABI from "../../../../abis/pages/mechanics/breed/main/breed.abi.json";

import { validationSchema } from "./validation";
import { TokenInput } from "./token-input";
import { ContractInput } from "./contract-input";
import { TemplateInput } from "./template-input";
import { useStyles } from "./styles";

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
  const classes = useStyles();

  const settings = useSettings();

  const metaFnWithSign = useServerSignature(
    (values: IBreedDto, web3Context: Web3ContextType, sign: IServerSignature) => {
      const contract = new Contract(process.env.EXCHANGE_ADDR, BreedABI, web3Context.provider?.getSigner());

      return contract.breed(
        {
          nonce: utils.arrayify(sign.nonce),
          externalId: BigNumber.from(sign.bytecode),
          expiresAt: sign.expiresAt,
          referrer: constants.AddressZero,
        },
        {
          tokenType: Object.keys(TokenType).indexOf(values.tokenType),
          token: values.mom.address,
          tokenId: values.mom.token.tokenId,
          amount: 1,
        },
        {
          tokenType: Object.keys(TokenType).indexOf(values.tokenType),
          token: values.dad.address,
          tokenId: values.dad.token.tokenId,
          amount: 1,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((data: IBreedDto, web3Context: Web3ContextType) => {
    const { account } = web3Context;

    return metaFnWithSign(
      {
        url: "/breed/sign",
        method: "POST",
        data: {
          account,
          referrer: settings.getReferrer(),
          momId: data.mom.tokenId,
          dadId: data.dad.tokenId,
        },
      },
      data,
      web3Context,
    );
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
            <Typography variant="h6" className={classes.select}>
              <FormattedMessage id="pages.breed.matron" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" className={classes.select}>
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
