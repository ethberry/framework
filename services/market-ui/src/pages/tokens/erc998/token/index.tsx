import { ChangeEvent, FC, Fragment } from "react";
import { Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";

import { FormattedMessage, useIntl } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ContractFeatures, ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { FormWrapper } from "@gemunion/mui-form";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";

import { useStyles } from "./styles";
import { TokenSellButton, UpgradeButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { Clear } from "@mui/icons-material";
import { IOwnership } from "@framework/types/dist/entities/blockchain/hierarchy/ownership";

export const Erc998Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc998-tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  const { formatMessage } = useIntl();
  const classes = useStyles();

  const metaFn = useMetamask((data: IToken, web3Context: Web3ContextType) => {
    const contract = new Contract(
      data.template!.contract!.address,
      ERC721SimpleSol.abi,
      web3Context.provider?.getSigner(),
    );
    return contract["safeTransferFrom(address,address,uint256,bytes)"](
      web3Context.account,
      selected.template!.contract!.address,
      data.tokenId,
      utils.hexZeroPad(BigNumber.from(selected.tokenId).toHexString(), 32),
    ) as Promise<void>;
  });

  const metaFnClear = useMetamask((data: IToken, web3Context: Web3ContextType) => {
    const contract = new Contract(
      selected.template!.contract!.address,
      ERC998SimpleSol.abi,
      web3Context.provider?.getSigner(),
    );

    return contract["safeTransferChild(uint256,address,address,uint256)"](
      selected.tokenId,
      web3Context.account,
      data.template!.contract!.address,
      data.tokenId,
    ) as Promise<void>;
  });

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): Promise<any> => {
    return metaFn(option);
  };

  const handleClear = (ownership: IOwnership) => async () => {
    await metaFnClear(ownership.child);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998.tokens", "erc998.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc998.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Typography variant="h4">Composed tokens</Typography>
          {selected.template?.contract?.children?.map(child => {
            const filtered = selected.children!.filter(
              ownership => ownership.child?.template?.contractId === child.childId,
            );

            return (
              <FormWrapper
                key={child.id}
                initialValues={filtered.reduce(
                  (memo, current, i) => {
                    memo.tokenId[i] = current.childId;
                    return memo;
                  },
                  { tokenId: [] as Array<number> },
                )}
                onSubmit={Promise.resolve}
                showButtons={false}
                showPrompt={false}
                testId="???"
              >
                <Typography variant="h5">{child.child?.title}</Typography>
                {new Array(filtered.length).fill(null).map((e, i) => (
                  <Grid container key={child.child?.id}>
                    <Grid item xs={6}>
                      <EntityInput
                        disableClear={true}
                        key={i}
                        name={`tokenId[${i}]`}
                        controller="tokens"
                        data={{
                          account: selected.template?.contract?.address,
                          contractIds: [child.child?.id],
                        }}
                        label={formatMessage({ id: "form.labels.tokenId" })}
                        placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
                        getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title={formatMessage({ id: "form.tips.clear" })}>
                        <IconButton onClick={handleClear(filtered[i])} data-testid="ChildClearButton">
                          <Clear />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))}
                {new Array(child.amount - filtered.length).fill(null).map((e, i) => (
                  <EntityInput
                    disableClear={true}
                    key={i}
                    name={`tokenId[${i + filtered.length}]`}
                    controller="tokens"
                    data={{
                      contractIds: [child.child?.id],
                    }}
                    label={formatMessage({ id: "form.labels.tokenId" })}
                    placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
                    getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
                    onChange={handleChange}
                  />
                ))}
              </FormWrapper>
            );
          })}
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.erc998.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc998.token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
