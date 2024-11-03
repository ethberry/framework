import { FC, useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useApiCall } from "@ethberry/react-hooks";
import { useUser } from "@ethberry/provider-user";
import { comparator } from "@ethberry/utils";
import type { IPaginationResult } from "@ethberry/types-collection";
import type { IReferralProgram, IReferralProgramCreateDto, IReferralProgramUpdateDto, IUser } from "@framework/types";
import { ReferralProgramStatus } from "@framework/types";

import { ReferralProgramForm } from "./form";
import { getEmptyProgramLevel } from "./form/levels";
import { StatusSwitch } from "./status";
import { StyledDisableOverlay } from "./styled";

export const ReferralProgram: FC = () => {
  const { profile } = useUser<IUser>();
  const merchantId = profile?.merchantId;
  const [referralProgramStatus, setReferralProgramStatus] = useState<ReferralProgramStatus | null>(null);
  const [initialValues, setInitialValues] = useState<IReferralProgramCreateDto | null>(null);

  const { fn: getReferralProgram, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: "/referral/program",
      }),
    { success: false },
  );

  const { fn: createReferralProgram, isLoading: isCreateLoading } = useApiCall((api, data: IReferralProgramCreateDto) =>
    api.fetchJson({
      url: "/referral/program",
      method: "POST",
      data,
    }),
  );

  const { fn: updateReferralProgram, isLoading: isUpdateLoading } = useApiCall(
    (api, data: IReferralProgramUpdateDto) =>
      api.fetchJson({
        url: `/referral/program/`,
        method: "PUT",
        data,
      }),
    { success: false, error: false },
  );

  const handleSubmit = useCallback(
    async (values: IReferralProgramCreateDto, form: any): Promise<void> => {
      const filteredLevels = values.levels
        .sort(comparator("level"))
        .map((lev, indx) => ({ level: indx, share: lev.share }));
      // CREATE OR UPDATE
      if (initialValues?.levels.length === 0) {
        await createReferralProgram(form, { levels: filteredLevels }).then(() => {
          setInitialValues(value => ({ ...value, merchantId, levels: filteredLevels }));
        });
      } else {
        await updateReferralProgram(form, { levels: filteredLevels });
      }
    },
    [initialValues],
  );

  const handleChangeStatus = async (value: ReferralProgramStatus): Promise<void> => {
    await updateReferralProgram(void 0, { referralProgramStatus: value, levels: [] as any }).then(() => {
      setReferralProgramStatus(value);
    });
  };

  useEffect(() => {
    void getReferralProgram().then((json: IPaginationResult<IReferralProgram>) => {
      if (!json?.rows?.length) {
        setInitialValues({
          levels: [...getEmptyProgramLevel([], merchantId)],
        });
        return;
      }

      const referralProgramStatus = json.rows[0].referralProgramStatus;
      const levels = json.rows.map(({ merchantId, level, share }) => ({ merchantId, level, share }));

      setReferralProgramStatus(referralProgramStatus);
      setInitialValues({
        levels,
      });
    });

    return () => {
      setReferralProgramStatus(null);
      setInitialValues(null);
    };
  }, [merchantId]);

  if (!merchantId) {
    return null;
  }

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.program"]} />

      <PageHeader message="pages.referral.program.title">
        <StatusSwitch isLoading={isUpdateLoading} onChange={handleChangeStatus} status={referralProgramStatus} />
      </PageHeader>
      <ProgressOverlay isLoading={isLoading || isCreateLoading || isUpdateLoading}>
        <StyledDisableOverlay isDisabled={referralProgramStatus === ReferralProgramStatus.INACTIVE}>
          <ReferralProgramForm onSubmit={handleSubmit} initialValues={initialValues} />
        </StyledDisableOverlay>
      </ProgressOverlay>
    </Grid>
  );
};
