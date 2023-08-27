import { NextRequest, NextResponse } from "next/server";
import { User } from "@transcendence/common";
import { getForwardHeaders, setCookies } from "./app/api/auth/auth-utils";
import { TokensResponse, tokensResponseSchema } from "./schema/auth-schema";
import { env } from "./env/server.mjs";
import { log } from "@/lib/utils";

export let refreshingPromise: Map<
  string,
  Promise<{
    refreshToken: string;
    accessToken: string;
  } | null>
> = new Map();

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

  try {
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
      throw new Error("middleware: refreshing tokens... ❌");
    }

    const parseResult = tokensResponseSchema.safeParse(await response.json());
    if (!parseResult.success) {
      throw new Error("middleware: parsing failed... ❌");
    }

    log("middleware: refreshing tokens... ✅");
    return parseResult.data;
  } catch (error) {
    log((error as any).message);
    return null;
  }
}

type UserAuthData = {
  user: User | null;
  newTokens: TokensResponse | null;
};
export async function getUserFromRequest(
  request: NextRequest
): Promise<UserAuthData> {
  const accessToken = request.cookies.get("accessToken")?.value ?? "";
  const refreshToken = request.cookies.get("refreshToken")?.value ?? "";

  const user = await fetchUser(accessToken);
  if (user) return { user, newTokens: null };

  // try to refresh tokens
  if (!refreshingPromise.get(refreshToken)) {
    refreshingPromise.set(refreshToken, refreshTokens(request));
  }
  const newTokens = await refreshingPromise.get(refreshToken);
  refreshingPromise.delete(refreshToken);

  if (!newTokens) return { user: null, newTokens: null };

  const newUser = await fetchUser(newTokens.accessToken);
  return { user: newUser, newTokens };
}

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const { user, newTokens } = await getUserFromRequest(request);

  // "" -> landing page
  const guestRoutes = ["signup", "login", ""];
  const isGuestRoute = guestRoutes.includes(pathname.trim().split("/")[1]);

  if (isGuestRoute && user) {
    console.log("redirecting to game chat");
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
    "/((?!api|auth.jpg|logo.png|images|_next/static|_next/image|favicon.ico).*)",
    "/api/auth/refresh-tokens",
  ],
};
