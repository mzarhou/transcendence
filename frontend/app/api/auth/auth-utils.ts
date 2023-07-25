import { env } from "@/env/server.mjs";
import { TokensResponse } from "@/schema/auth-schema";
import { NextRequest, NextResponse } from "next/server";

function getCookieDomain() {
  const splitBy = env.APP_URL.includes("https") ? "https://" : "http://";
  const domain = env.APP_URL.split(splitBy)[1].split(":")[0].split(".");
  if (domain.length > 2) {
    return domain.slice(1).join(".");
  }
  return domain.join(".");
}

export function setCookies(
  response: NextResponse<unknown>,
  tokens: TokensResponse,
  options?: {
    maxAge: number | undefined;
  }
) {
  type CookieConfig = Parameters<typeof response.cookies.set>[2];

  const cookieConfig: CookieConfig = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    domain:
      process.env.NODE_ENV === "production" ? getCookieDomain() : undefined,
    maxAge: options?.maxAge,
  };
  response.cookies.set("accessToken", tokens.accessToken, cookieConfig);
  response.cookies.set("refreshToken", tokens.refreshToken, cookieConfig);
  return response;
}

export function getForwardHeaders(req: NextRequest) {
  return {
    "User-Agent": req.headers.get("user-agent"),
    "accept-language": req.headers.get("accept-language"),
    Accept: "application/json, text/plain, */*",
  };
}
