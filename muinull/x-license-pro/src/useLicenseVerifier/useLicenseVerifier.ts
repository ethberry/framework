import * as React from "react";
import { verifyLicense } from "../verifyLicense";
import {
  LicenseInfo,
  LicenseScope,
  LicenseStatus,
  showExpiredLicenseKeyError,
  showExpiredPackageVersionError,
  showInvalidLicenseKeyError,
  showLicenseKeyPlanMismatchError,
  showMissingLicenseKeyError,
} from "../utils";

export type MuiCommercialPackageName = "x-data-grid-pro" | "x-data-grid-premium" | "x-date-pickers-pro";

export const sharedLicenseStatuses: {
  [packageName in MuiCommercialPackageName]?: { key: string | undefined; status: LicenseStatus };
} = {};

export function useLicenseVerifier(packageName: MuiCommercialPackageName, releaseInfo: string): LicenseStatus {
  return React.useMemo(() => {
    const licenseKey = LicenseInfo.getLicenseKey();
    if (sharedLicenseStatuses[packageName] && sharedLicenseStatuses[packageName]!.key === licenseKey) {
      return sharedLicenseStatuses[packageName]!.status;
    }

    const acceptedScopes: LicenseScope[] = packageName.includes("premium") ? ["premium"] : ["pro", "premium"];

    const plan = packageName.includes("premium") ? "Premium" : "Pro";
    const licenseStatus = verifyLicense({
      releaseInfo,
      licenseKey,
      acceptedScopes,
      isProduction: process.env.NODE_ENV === "production",
    });

    sharedLicenseStatuses[packageName] = { key: licenseKey, status: licenseStatus };
    const fullPackageName = `@mui/${packageName}`;

    if (licenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseKeyError();
    } else if (licenseStatus === LicenseStatus.OutOfScope) {
      showLicenseKeyPlanMismatchError();
    } else if (licenseStatus === LicenseStatus.NotFound) {
      showMissingLicenseKeyError({ plan, packageName: fullPackageName });
    } else if (licenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseKeyError();
    } else if (licenseStatus === LicenseStatus.ExpiredVersion) {
      showExpiredPackageVersionError({ packageName: fullPackageName });
    }

    return licenseStatus;
  }, [packageName, releaseInfo]);
}
