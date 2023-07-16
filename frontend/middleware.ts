import { NextConfig } from "next";
import { NextRequest, NextResponse } from "next/server";
import { api } from "./lib/api";
import { User } from "@transcendence/common";
import { getForwardHeaders, setCookies } from "./app/api/auth/auth-utils";
import { TokensResponse, tokensResponseSchema } from "./schema/auth-schema";
import { env } from "./env/server.mjs";

async function fetchUser(accessToken: string) {
  try {
    const data = await fetch(env.NEXT_PUBLIC_API_URL + "/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    if (data?.statusCode === 401) {
      return null;
    }
    return data;
  } catch (error) {
    console.log("error fetching user", error);
  }
  return null;
}

async function refreshTokens(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value ?? "";

  try {
    const { data } = await api.post(
      `/authentication/refresh-tokens`,
      {
        refreshToken: refreshToken,
      },
      {
        headers: getForwardHeaders(request),
      }
    );
    const tokens = tokensResponseSchema.parse(data);
    return tokens;
  } catch (error) {}
  return null;
}

type UserAuthData = {
  user: User | null;
  newTokens: TokensResponse | null;
};
async function getUserFromRequest(request: NextRequest): Promise<UserAuthData> {
  const accessToken = request.cookies.get("accessToken")?.value ?? "";

  const user = await fetchUser(accessToken);
  if (user) return { user, newTokens: null };

  // try to refresh tokens
  const newTokens = await refreshTokens(request);
  if (!newTokens) return { user: null, newTokens: null };

  const newUser = await fetchUser(newTokens.accessToken);
  return { user: newUser, newTokens };
}

export async function middleware(request: NextRequest) {
  // const requestHeaders = new Headers(request.headers);
  const pathname = new URL(request.url).pathname;
  const { user, newTokens } = await getUserFromRequest(request);

  const guestRoutes = ["/signup", "/login"];
  const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));

  if (isGuestRoute && user) {
    return NextResponse.redirect(new URL("/game-chat", request.url));
  }
  if (!isGuestRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  if (newTokens) setCookies(response, newTokens);
  return response;
}

export const config = {
  matcher: ["/((?!api|auth.jpg|_next/static|_next/image|favicon.ico).*)"],
};
