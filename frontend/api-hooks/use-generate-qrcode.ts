import { api } from "@/lib/api";
import useSWR from "swr";

export const useGenerateQrcode = () => {
  console.log("run useGenerateQrcode");
  const {
    data: qrcode,
    isLoading: isLoadingImage,
    error: errorLoadingImage,
  } = useSWR(
    "/authentication/2fa/generate",
    (url) => {
      return api.get(url, { responseType: "arraybuffer" }).then((res) => {
        const base64Image = Buffer.from(res.data, "binary").toString("base64");
        return base64Image;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { qrcode, isLoadingImage, errorLoadingImage };
};
