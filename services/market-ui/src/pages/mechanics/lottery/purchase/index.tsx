import { FC, Fragment, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { LotteryPurchaseButton } from "../../../../components/buttons";

export const LotteryPurchase: FC = () => {
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(new Array(36).fill(false));

  const handleClick = (i: number) => {
    return () => {
      if (ticketNumbers.filter(e => e).length >= 6 && !ticketNumbers[i]) {
        return;
      }
      const newNumbers = [...ticketNumbers];
      newNumbers[i] = !newNumbers[i];
      setTicketNumbers(newNumbers);
    };
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.purchase"]} />

      <PageHeader message="pages.lottery.purchase.title">
        <LotteryPurchaseButton ticketNumbers={ticketNumbers} />
      </PageHeader>

      <Box>
        <FormattedMessage
          id="pages.lottery.purchase.selected"
          values={{ selected: ticketNumbers.filter(e => e).length }}
        />
      </Box>

      <Paper sx={{ width: "34em", textAlign: "center", margin: "0 auto", padding: 2 }}>
        {new Array(36).fill(null).map((e, i) => (
          <IconButton
            size="large"
            key={i}
            sx={{ width: "2em" }}
            color={ticketNumbers[i] ? "primary" : "default"}
            onClick={handleClick(i)}
          >
            {i + 1}
          </IconButton>
        ))}
      </Paper>

      <br />

      <Typography>
        <FormattedMessage id="pages.lottery.purchase.rules" />
      </Typography>
    </Fragment>
  );
};
