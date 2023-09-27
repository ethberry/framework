import { FC, useState, MouseEvent, ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";

import {
  CardActions,
  CardContent,
  Paper,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";

import { StyledCard, StyledToolbar, StyledTypography, CustomTablePagination } from "./styled";
import { ChainLinkSubscriptionButton } from "../../../../components/buttons/integrations/chain-link/add-subscription";

export interface IChainLinkConsumerProps {
  subscriptionId: number;
  consumers: Array<string>;
}

export const ChainLinkSubscriptionConsumer: FC<IChainLinkConsumerProps> = props => {
  const { subscriptionId, consumers } = props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - consumers.length) : 0;
  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage
              id="pages.chain-link.info.consumers"
              values={{ value: subscriptionId || "No subscription" }}
            />
          </StyledTypography>
        </StyledToolbar>
        <ChainLinkSubscriptionButton subscriptionId={subscriptionId} />
      </CardContent>
      <CardActions>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Contract</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? consumers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : consumers
              ).map((row, indx) => (
                <TableRow key={indx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 34 * emptyRows }}>
                  <TableCell colSpan={3} aria-hidden />
                </TableRow>
              )}
            </TableBody>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={consumers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Table>
        </TableContainer>
      </CardActions>
    </StyledCard>
  );
};
