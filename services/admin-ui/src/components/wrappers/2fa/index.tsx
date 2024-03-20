import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";

import { useApiCall } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

export const TwoFAProvider: FC<PropsWithChildren> = props => {
  const { children } = props;

  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  const is2FAValid = localStorage.getItem("is2FAValid");
  const [code, setCode] = useState<string>("");
  const [is2FAActive, setIs2FAActive] = useState<boolean | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const { fn: get2FAStatus, isLoading } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/2fa",
        })
        .then((json: { isActive: boolean }) => {
          setIs2FAActive(json?.isActive || false);
        });
    },
    { success: false, error: false },
  );

  const { fn: verify, isLoading: isVerifying } = useApiCall(
    async (api, data: { token: string }) => {
      return api
        .fetchJson({
          url: "/2fa/verify",
          method: "POST",
          data,
        })
        .then((json: boolean) => {
          if (json) {
            localStorage.setItem("is2FAValid", "true");
          } else {
            localStorage.removeItem("is2FAValid");
          }
        });
    },
    { success: false, error: false },
  );

  const handleClick = async () => {
    await verify(void 0, { token: code });
  };

  useEffect(() => {
    void get2FAStatus();
    if (!isUserAuthenticated) {
      setIs2FAActive(false);
      setCode("");
    }
  }, [isUserAuthenticated]);

  return (
    <>
      {isUserAuthenticated && is2FAActive && !is2FAValid ? (
        <Dialog maxWidth="lg" open>
          <FormControl disabled={isVerifying || isLoading}>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogContent>
              <TextField value={code} name="otpCode" label="Enter OTP code" placeholder="OTP" onChange={handleChange} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClick}>Check</Button>
            </DialogActions>
          </FormControl>
        </Dialog>
      ) : null}
      {children}
    </>
  );
};
