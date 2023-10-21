import { FC, useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { ArrowForward, ArrowBack, LastPage } from "@mui/icons-material";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IContract, ILotteryRound } from "@framework/types";

import { emptyLotteryRound } from "../../../../../components/common/interfaces";

import {
  Root,
  StyledControlIcon,
  StyledRoundPagination,
  StyledDrawn,
  StyledIconButton,
  StyledPaper,
  StyledRound,
  StyledRoundDescription,
  StyledRoundWrapper,
  StyledSubtitle,
  StyledTitle,
  StyledWrapper,
} from "./styled";
import { Details } from "./details";

interface ILotteryStatisticProps {
  contract: IContract;
}

export const LotteryStatistic: FC<ILotteryStatisticProps> = props => {
  const { contract } = props;

  const [round, setRound] = useState<ILotteryRound | null>(emptyLotteryRound);
  const [roundIds, setRoundIds] = useState<number[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [firstRoundId, setFirstRoundId] = useState<number | null>(null);
  const [lastRoundId, setLastRoundId] = useState<number | null>(null);

  const { fn: getLatestRound, isLoading: isLatestRoundLoading } = useApiCall(
    async (api, roundId: number) => {
      return api.fetchJson({
        url: `/lottery/rounds/${roundId}`,
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchRound = async (roundId: number): Promise<any> => {
    return getLatestRound(void 0, roundId)
      .then((json: ILotteryRound) => {
        setRound(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const { fn: getAllRoundIds, isLoading: isAllRoundIdsLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/lottery/rounds/all",
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
        <StyledTitle>Finished rounds</StyledTitle>
        <StyledPaper>
          {roundIds.length && round?.roundId ? (
            <>
              <StyledRoundWrapper>
                <StyledRoundDescription>
                  <StyledRound>Round: #{round.roundId}</StyledRound>
                  <StyledDrawn>Drawn: {format(parseISO(round.endTimestamp), humanReadableDateTimeFormat)}</StyledDrawn>
                </StyledRoundDescription>
                <StyledRoundPagination>
                  <StyledControlIcon disabled={selectedRoundId === firstRoundId} onClick={handlePrevRound}>
                    <Tooltip title="Previous round">
                      <ArrowBack />
                    </Tooltip>
                  </StyledControlIcon>
                  <StyledControlIcon disabled={selectedRoundId === lastRoundId} onClick={handleNextRound}>
                    <Tooltip title="Next round">
                      <ArrowForward />
                    </Tooltip>
                  </StyledControlIcon>
                  <StyledControlIcon disabled={selectedRoundId === lastRoundId} onClick={handleLastRound}>
                    <Tooltip title="Last round">
                      <LastPage />
                    </Tooltip>
                  </StyledControlIcon>
                </StyledRoundPagination>
              </StyledRoundWrapper>
              <StyledSubtitle>Winning numbers</StyledSubtitle>
              <StyledWrapper>
                {new Array(36).fill(null).map((e, i) => {
                  const isSelected = round.numbers[i];

                  if (!isSelected) {
                    return null;
                  }

                  return (
                    <StyledIconButton size="medium" key={i} color="default">
                      {i + 1}
                    </StyledIconButton>
                  );
                })}
              </StyledWrapper>
              <Details round={round} commission={contract.parameters.commission as string} />
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <StyledSubtitle color="textSecondary">No finished rounds yet...</StyledSubtitle>
            </Box>
          )}
        </StyledPaper>
      </Root>
    </ProgressOverlay>
  );
};
