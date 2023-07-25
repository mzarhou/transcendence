import { TokensResponse } from "@/schema/auth-schema";
import { NextRequest, NextResponse } from "next/server";

export function setCookies(
  response: NextResponse<unknown>,
  tokens: TokensResponse
) {
  type CookieConfig = Parameters<typeof response.cookies.set>[2];

  // TODO: secure the cookie
  const cookieConfig: CookieConfig = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
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
