import { FC, Fragment, useCallback, useEffect, useState } from "react";

import type { IReferralProgram, IUser } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { useUser } from "@gemunion/provider-user";

import { ReferralProgramForm } from "./form";
import { getEmptyProgramLevel } from "./form/levels";
import { sorter } from "../../../../../utils/sorter";
import { ReferralProgramStatus } from "@framework/types";
import { ReferralProgramStatusForm } from "./form/status";

export interface IReferralProgramLevel {
  id?: number;
  level: number;
  share: number;
}

export interface IReferralProgramCreate {
  merchantId: number;
  levels: Array<IReferralProgramLevel>;
  referralProgramStatus?: ReferralProgramStatus;
}

export interface IReferralProgramUpdateStatus {
  merchantId: number;
  referralProgramStatus: ReferralProgramStatus;
}

export const ReferralProgram: FC = () => {
  const { profile } = useUser<IUser>();
  const merchantId = profile?.merchantId;
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

  const { fn: updateReferralProgramStatus, isLoading: isUpdateStatusLoading } = useApiCall(
    (api, data: IReferralProgramUpdateStatus) =>
      api.fetchJson({
        url: `/referral/program/${merchantId}/status`,
        method: "PUT",
        data,
      }),
  );

  const handleSubmit = useCallback(
    async (values: IReferralProgramCreate, form: any): Promise<void> => {
      const filteredLevels = values.levels
        .sort(sorter("level"))
        .map((lev, indx) => ({ level: indx, share: lev.share }));
      // CREATE OR UPDATE
      if (initialValues?.levels.length === 0) {
        await createReferralProgramLevels(form, { merchantId, levels: filteredLevels }).then(() => {
          setInitialValues({ merchantId, levels: filteredLevels });
        });
      } else {
        await updateReferralProgramLevels(form, { merchantId, levels: filteredLevels });
      }
    },
    [initialValues],
  );

  const handleSubmitStatus = useCallback(
    async (values: IReferralProgramUpdateStatus, form: any): Promise<void> => {
      // UPDATE status
      if (initialValues?.levels && initialValues?.levels.length > 1) {
        await updateReferralProgramStatus(form, { merchantId, referralProgramStatus: values.referralProgramStatus });
      }
    },
    [initialValues],
  );

  useEffect(() => {
    void getReferralProgramLevels().then((json: IPaginationResult<IReferralProgram>) => {
      const referralProgramStatus = json?.rows?.length
        ? json?.rows[0].referralProgramStatus
        : ReferralProgramStatus.ACTIVE;
      const levels = json?.rows?.length
        ? json?.rows.map(row => ({ merchantId: row.merchantId, level: row.level, share: row.share }))
        : [...getEmptyProgramLevel([], merchantId)];

      setInitialValues({
        referralProgramStatus,
        merchantId,
        levels,
      });
    });
    return () => setInitialValues(null);
  }, []);

  if (!merchantId) {
    return null;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "referral", "referral.program"]} />

      <PageHeader message="pages.referral.program.title" />
      <ProgressOverlay isLoading={isLoading || isCreateLoading || isUpdateLoading || isUpdateStatusLoading}>
        <ReferralProgramStatusForm
          onSubmit={handleSubmitStatus}
          initialValues={{
            merchantId: initialValues ? initialValues.merchantId : 0,
            referralProgramStatus: initialValues?.referralProgramStatus || ReferralProgramStatus.ACTIVE,
          }}
        />
        <ReferralProgramForm onSubmit={handleSubmit} initialValues={initialValues} />
      </ProgressOverlay>
    </Fragment>
  );
};
