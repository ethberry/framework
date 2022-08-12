import { ChangeEvent, FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract, utils, BigNumber } from "ethers";
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

import { useStyles } from "./styles";
import { TokenSellButton, UpgradeButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";

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

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): Promise<any> => {
    return metaFn(option);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-token"]} data={[{}, selected.template]} />

      <PageHeader message="pages.erc998-token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Typography variant="h4">Composed tokens</Typography>
          {selected.template?.contract?.children?.map(child => (
            <FormWrapper
              key={child.id}
              initialValues={{}}
              onSubmit={Promise.resolve}
              showButtons={false}
              showPrompt={false}
              testId="???"
            >
              <Typography variant="h5">{child.child?.title}</Typography>
              {new Array(child.amount).fill(null).map((e, i) => (
                <EntityInput
                  key={i}
                  name="tokenId"
                  controller="erc721-tokens"
                  data={{
                    contractIds: [child.child?.id],
                  }}
                  getTitle={(token: IToken) => token.template!.title}
                  onChange={handleChange}
                />
              ))}
            </FormWrapper>
          ))}
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.erc721-token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721-token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
