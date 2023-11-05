import { FC, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Card, CardActionArea, Grid, Tooltip } from "@mui/material";
import { ArrowBack, ArrowForward, LastPage } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { FormattedMessage, useIntl } from "react-intl";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IContract } from "@framework/types";

import { emptyRaffleRound, IRaffleRoundStatistic } from "../../../../../components/common/interfaces";
import {
  Root,
  StyledControlIcon,
  StyledDrawn,
  StyledIconButton,
  StyledPaper,
  StyledRound,
  StyledRoundDescription,
  StyledRoundPagination,
  StyledRoundWrapper,
  StyledSubtitle,
  StyledTime,
  StyledTitle,
  StyledTotalInfo,
  StyledTotalTitle,
  StyledWinning,
  StyledWrapper,
} from "./styled";

interface IRaffleStatisticProps {
  contract: IContract;
}

export const RaffleStatistic: FC<IRaffleStatisticProps> = props => {
  const { contract } = props;

  const { formatMessage } = useIntl();

  const [round, setRound] = useState<IRaffleRoundStatistic | null>(emptyRaffleRound);
  const [roundIds, setRoundIds] = useState<number[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [firstRoundId, setFirstRoundId] = useState<number | null>(null);
  const [lastRoundId, setLastRoundId] = useState<number | null>(null);

  const { fn: getLatestRound, isLoading: isLatestRoundLoading } = useApiCall(
    async (api, roundId: number) => {
      return api.fetchJson({
        url: `/raffle/rounds/${roundId}`,
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchRound = async (roundId: number): Promise<any> => {
    return getLatestRound(void 0, roundId)
      .then((json: IRaffleRoundStatistic) => {
        setRound(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const { fn: getAllRoundIds, isLoading: isAllRoundIdsLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/raffle/rounds/all",
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchAllRoundIds = async (): Promise<any> => {
    return getAllRoundIds()
      .then((json: [Array<number>, number]) => {
        if (json && Array.isArray(json) && Array.isArray(json[0]) && json[1]) {
          const roundIds = json[0];
          const firstRoundId = roundIds[0];
          const lastRoundId = roundIds[roundIds.length - 1];
          setRoundIds(roundIds);
          setFirstRoundId(firstRoundId);
          setLastRoundId(lastRoundId);
          setSelectedRoundId(lastRoundId);
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handlePrevRound = () => {
    if (roundIds.length && selectedRoundId) {
      const selectedRoundIdIndex = roundIds.indexOf(selectedRoundId);
      if (selectedRoundIdIndex > 0) {
        setSelectedRoundId(roundIds[selectedRoundIdIndex - 1]);
      }
    }
  };
  const handleNextRound = () => {
    if (roundIds.length && selectedRoundId) {
      const selectedRoundIdIndex = roundIds.indexOf(selectedRoundId);
      if (selectedRoundIdIndex < roundIds.length - 1) {
        setSelectedRoundId(roundIds[selectedRoundIdIndex + 1]);
      }
    }
  };
  const handleLastRound = () => {
    if (lastRoundId) {
      setSelectedRoundId(lastRoundId);
    }
  };

  useEffect(() => {
    if (contract.id) {
      void fetchAllRoundIds();
    }
  }, [contract.id]);

  useEffect(() => {
    if (selectedRoundId) {
      void fetchRound(selectedRoundId);
    }
  }, [selectedRoundId]);

  return (
    <ProgressOverlay isLoading={isLatestRoundLoading || isAllRoundIdsLoading}>
      <Root>
        <StyledTitle>
          <FormattedMessage id="pages.raffle.contract.statistics.title" />
        </StyledTitle>
        <StyledPaper>
          {roundIds.length && round?.roundId ? (
            <>
              <StyledRoundWrapper>
                <StyledRoundDescription>
                  <StyledRound>
                    <FormattedMessage
                      id="pages.raffle.contract.statistics.controls.round"
                      values={{ roundId: round.roundId }}
                    />
                  </StyledRound>
                  <StyledDrawn>
                    <StyledTime>
                      <FormattedMessage
                        id="pages.lottery.contract.statistics.controls.start"
                        values={{ datetime: format(parseISO(round.startTimestamp), humanReadableDateTimeFormat) }}
                      />
                    </StyledTime>
                    <FormattedMessage
                      id="pages.raffle.contract.statistics.controls.drawn"
                      values={{ datetime: format(parseISO(round.endTimestamp), humanReadableDateTimeFormat) }}
                    />
                  </StyledDrawn>
                </StyledRoundDescription>
                <StyledRoundPagination>
                  <StyledControlIcon disabled={selectedRoundId === firstRoundId} onClick={handlePrevRound}>
                    <Tooltip title={formatMessage({ id: "pages.raffle.contract.statistics.controls.previous" })}>
                      <ArrowBack />
                    </Tooltip>
                  </StyledControlIcon>
                  <StyledControlIcon disabled={selectedRoundId === lastRoundId} onClick={handleNextRound}>
                    <Tooltip title={formatMessage({ id: "pages.raffle.contract.statistics.controls.next" })}>
                      <ArrowForward />
                    </Tooltip>
                  </StyledControlIcon>
                  <StyledControlIcon disabled={selectedRoundId === lastRoundId} onClick={handleLastRound}>
                    <Tooltip title={formatMessage({ id: "pages.raffle.contract.statistics.controls.last" })}>
                      <LastPage />
                    </Tooltip>
                  </StyledControlIcon>
                </StyledRoundPagination>
              </StyledRoundWrapper>
              <StyledWrapper>
                <Grid container>
                  <Grid item xs={12} sm={4}>
                    <StyledTotalInfo>
                      <StyledTotalTitle>
                        {round.ticketCount ? (
                          <FormattedMessage
                            id="pages.raffle.contract.statistics.totalTickets"
                            values={{ count: round.ticketCount }}
                          />
                        ) : (
                          <FormattedMessage id="pages.raffle.contract.statistics.noTickets" />
                        )}
                      </StyledTotalTitle>
                    </StyledTotalInfo>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <StyledWinning>
                      <StyledSubtitle>
                        <FormattedMessage id="pages.raffle.contract.statistics.winNumber" />
                      </StyledSubtitle>
                      {round.prizeTicket ? (
                        <Card>
                          <CardActionArea
                            component={RouterLink}
                            to={`/erc721/tokens/${round.prizeTicket ? round.prizeTicket.id : 0}`}
                          >
                            <StyledIconButton size="medium" color="default">
                              {round.number}
                            </StyledIconButton>
                          </CardActionArea>
                        </Card>
                      ) : (
                        <StyledIconButton size="medium" color="default">
                          {round.number}
                        </StyledIconButton>
                      )}
                    </StyledWinning>
                  </Grid>
                </Grid>
              </StyledWrapper>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <StyledSubtitle color="textSecondary">
                <FormattedMessage id="pages.raffle.contract.statistics.empty" />
              </StyledSubtitle>
            </Box>
          )}
        </StyledPaper>
      </Root>
    </ProgressOverlay>
  );
};
