import { env } from "@/env/server.mjs";

export const $42RedirectUri = `${env.APP_URL}/api/auth/callback/42-school`;

export const $42TokenUrl = "https://api.intra.42.fr/oauth/token";

export function get42RedirectUri() {
  const authorizeUrlParams = new URLSearchParams();
  authorizeUrlParams.set("client_id", env.CLIENT_ID_42);
  authorizeUrlParams.set("scope", "public");
  authorizeUrlParams.set("redirect_uri", $42RedirectUri);
  authorizeUrlParams.set("response_type", "code");
  return `https://api.intra.42.fr/oauth/authorize?${authorizeUrlParams}`;
}
