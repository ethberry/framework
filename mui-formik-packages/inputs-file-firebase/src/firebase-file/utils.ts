import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import app from "@gemunion/firebase";
import { v4 } from "uuid";

export const useDeleteUrl = (bucket?: string): ((url: string) => Promise<void>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const storage = getStorage(app, bucket);

  return async (url: string): Promise<void> => {
    if (url.includes("DO_NOT_REMOVE")) {
      return;
    }
    const storageRef = ref(storage, url);
    await deleteObject(storageRef)
      .then(message => {
        console.info("message", message);
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
      })
      .catch(e => {
        console.error(e);
        if (e.code !== "storage/object-not-found") {
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };
};

export const useUploadUrl = (bucket?: string): ((files: File[]) => Promise<Array<string>>) => {
  const storage = getStorage(app, bucket);

  return async (files: File[]): Promise<Array<string>> => {
    return Promise.all(
      files.map(async file => {
        const storageRef = ref(storage, v4());
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      }),
    );
  };
};
