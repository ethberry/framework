import { FC, Fragment, useCallback, useEffect, useState } from "react";

import type { IReferralProgram, IReferralProgramCreateDto, IReferralProgramUpdateDto, IUser } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";
import { useUser } from "@gemunion/provider-user";

import { ReferralProgramForm } from "./form";
import { getEmptyProgramLevel } from "./form/levels";

export interface IReferralProgramCreate {
  levels: IReferralProgram[];
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

  const { fn: createReferralProgramLevel, isLoading: isCreateLoading } = useApiCall(
    (api, data: IReferralProgramCreateDto) =>
      api.fetchJson({
        url: "/referral/program",
        method: "POST",
        data,
      }),
  );

  const { fn: updateReferralProgramLevel, isLoading: isUpdateLoading } = useApiCall(
    (api, data: IReferralProgramUpdateDto) =>
      api.fetchJson({
        url: `/referral/program/${merchantId}`,
        method: "PUT",
        data,
      }),
  );

  const handleSubmit = useCallback(
    async (values: IReferralProgramCreate, form: any): Promise<void> => {
      const filteredLevels = values.levels.map(({ level, share }) => ({ level, share }));
      if (!initialValues?.levels.length || !initialValues.levels[0].id) {
        await createReferralProgramLevel(form, { merchantId, levels: filteredLevels });
      } else {
        await updateReferralProgramLevel(form, { merchantId, levels: filteredLevels });
      }
    },
    [initialValues],
  );

  useEffect(() => {
    void getReferralProgramLevels().then((json: IPaginationResult<IReferralProgram>) => {
      setInitialValues({ levels: json?.rows || [getEmptyProgramLevel([])] });
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
      <ProgressOverlay isLoading={isLoading || isCreateLoading || isUpdateLoading}>
        <ReferralProgramForm onSubmit={handleSubmit} initialValues={initialValues} />
      </ProgressOverlay>
    </Fragment>
  );
};
