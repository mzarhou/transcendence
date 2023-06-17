import { env } from "@/env/server.mjs";
import { $42RedirectUri, $42TokenUrl } from "@/lib/$42";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { tokensResponseSchema } from "@/schema/auth-schema";
import { api } from "@/lib/api";
import { getForwardHeaders, setCookies } from "../../auth-utils";

async function getAccessToken(code: string): Promise<string | null> {
  try {
    const { data: authData } = await axios.post($42TokenUrl, {
      grant_type: "authorization_code",
      client_id: env._42_CLIENT_ID,
      client_secret: env._42_CLIENT_SECRET,
      redirect_uri: $42RedirectUri,
      code,
    });
    return authData.access_token;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response("invalid code", {
      status: 400,
    });
  }

  try {
    const accessToken = await getAccessToken(code);
    const { data } = await api.post(
      `/authentication/school-42`,
      {
        accessToken,
      },
      {
        headers: getForwardHeaders(req),
      }
    );

    const tokens = tokensResponseSchema.parse(data);
    const response = NextResponse.redirect(env.APP_URL);
    return setCookies(response, tokens);
  } catch (error) {
    if (error instanceof AxiosError) {
      return new Response(JSON.stringify(error.toJSON()), { status: 400 });
    }
    if (error instanceof ZodError) {
      return new Response("Response shape invalid", { status: 400 });
    }
    return new Response("Failed to get to login", {
      status: 400,
    });
  }
}
