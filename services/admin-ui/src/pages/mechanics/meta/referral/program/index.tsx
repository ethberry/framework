import { FC, Fragment, useCallback, useEffect, useState } from "react";

import type { IReferralProgram, IUser } from "@framework/types";
import { ReferralProgramStatus } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { IPaginationResult } from "@gemunion/types-collection";
import { useUser } from "@gemunion/provider-user";

import { sorter } from "../../../../../utils/sorter";
import { ReferralProgramForm } from "./form";
import { getEmptyProgramLevel } from "./form/levels";
import { StatusSwitch } from "./status";
import { StyledDisableOverlay } from "./styled";

export interface IReferralProgramLevel {
  id?: number;
  level: number;
  share: number;
}

export interface IReferralProgramCreate {
  merchantId: number;
  levels: Array<IReferralProgramLevel>;
}

export interface IReferralProgramUpdateStatus {
  referralProgramStatus: ReferralProgramStatus;
}

export const ReferralProgram: FC = () => {
  const { profile } = useUser<IUser>();
  const merchantId = profile?.merchantId;
  // const [levels, setLevels] = useState<IReferralProgramLevel[] | null>(null);
  const [referralProgramStatus, setReferralProgramStatus] = useState<ReferralProgramStatus | null>(null);
  const [initialValues, setInitialValues] = useState<IReferralProgramCreate | null>(null);

  const { fn: getReferralProgramLevels, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: "/referral/program",
      }),
    { success: false },
  );

  const { fn: createReferralProgramLevels, isLoading: isCreateLoading } = useApiCall(
    (api, data: IReferralProgramCreate) =>
      api.fetchJson({
        url: "/referral/program",
        method: "POST",
        data,
      }),
  );

  const { fn: updateReferralProgramLevels, isLoading: isUpdateLoading } = useApiCall(
    (api, data: IReferralProgramCreate) =>
      api.fetchJson({
        url: `/referral/program/${merchantId}/levels`,
        method: "PUT",
        data,
      }),
    { success: false, error: false },
  );

  const handleSubmit = useCallback(
    async (values: IReferralProgramCreate, form: any): Promise<void> => {
      const filteredLevels = values.levels
        .sort(sorter("level"))
        .map((lev, indx) => ({ level: indx, share: lev.share }));
      // CREATE OR UPDATE
      if (initialValues?.levels.length === 0) {
        await createReferralProgramLevels(form, { merchantId, levels: filteredLevels }).then(() => {
          setInitialValues(value => ({ ...value, merchantId, levels: filteredLevels }));
        });
      } else {
        await updateReferralProgramLevels(form, { merchantId, levels: filteredLevels });
      }
    },
    [initialValues],
  );

  const { fn: updateReferralProgramStatus, isLoading: isUpdateStatusLoading } = useApiCall(
    (api, data: IReferralProgramUpdateStatus) =>
      api.fetchJson({
        url: `/referral/program/${merchantId}/status`,
        method: "PUT",
        data,
      }),
    { success: false, error: false },
  );

  const handleChangeStatus = async (value: ReferralProgramStatus): Promise<void> => {
    await updateReferralProgramStatus(void 0, { merchantId, referralProgramStatus: value }).then(() => {
      setReferralProgramStatus(value);
    });
  };

  useEffect(() => {
    void getReferralProgramLevels().then((json: IPaginationResult<IReferralProgram>) => {
      if (!json?.rows?.length) {
        setInitialValues({
          merchantId,
          levels: [...getEmptyProgramLevel([], merchantId)],
        });
        return;
      }

      const referralProgramStatus = json.rows[0].referralProgramStatus;
      const levels = json.rows.map(({ merchantId, level, share }) => ({ merchantId, level, share }));

      setReferralProgramStatus(referralProgramStatus);
      setInitialValues({
        merchantId,
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
    <Fragment>
      <Breadcrumbs path={["dashboard", "referral", "referral.program"]} />

      <PageHeader message="pages.referral.program.title">
        <StatusSwitch isLoading={isUpdateStatusLoading} onChange={handleChangeStatus} status={referralProgramStatus} />
      </PageHeader>
      <ProgressOverlay isLoading={isLoading || isCreateLoading || isUpdateLoading || isUpdateStatusLoading}>
        <StyledDisableOverlay isDisabled={referralProgramStatus === ReferralProgramStatus.INACTIVE}>
          <ReferralProgramForm onSubmit={handleSubmit} initialValues={initialValues} />
        </StyledDisableOverlay>
      </ProgressOverlay>
    </Fragment>
  );
};
