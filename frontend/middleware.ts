import { NextRequest, NextResponse } from "next/server";
import { User } from "@transcendence/common";
import { getForwardHeaders, setCookies } from "./app/api/auth/auth-utils";
import { TokensResponse, tokensResponseSchema } from "./schema/auth-schema";
import { env } from "./env/server.mjs";
import { log } from "@/lib/utils";

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
    log("error fetching user", error);
  }
  return null;
}

export async function refreshTokens(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value ?? "";
  log("middleware: refreshing tokens... ⏳");

  const headers: HeadersInit = new Headers();
  headers.set("Content-Type", "application/json");
  const forwardHeaders: { [key: string]: string | null } =
    getForwardHeaders(request);

  Object.keys(forwardHeaders).forEach((k) => {
    if (forwardHeaders[k]) headers.set(k, forwardHeaders[k]!);
  });

  const response = await fetch(
    env.NEXT_PUBLIC_API_URL + "/authentication/refresh-tokens",
    {
      method: "POST",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      headers,
    }
  );

  if (!response.ok) {
    log("middleware: refreshing tokens... ❌");
    return null;
  }

  const parseResult = tokensResponseSchema.safeParse(await response.json());
  if (!parseResult.success) return null;

  log("middleware: refreshing tokens... ✅");
  return parseResult.data;
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
  matcher: [
    "/((?!api|auth.jpg|_next/static|_next/image|favicon.ico).*)",
    "/api/auth/refresh-tokens",
  ],
};
