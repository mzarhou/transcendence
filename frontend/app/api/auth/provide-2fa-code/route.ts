import { TokensResponse } from "@/schema/auth-schema";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getForwardHeaders, setCookies } from "../auth-utils";
import { serverApi } from "@/lib/serverApi";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const code = formData.get("code");
  const accessToken = req.cookies.get("accessToken")?.value ?? "";

  try {
    const { data: tokens } = await serverApi.post<TokensResponse>(
      "authentication/2fa/code",
      {
        tfaCode: code,
      },
      {
        headers: {
          ...getForwardHeaders(req),
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return setCookies(NextResponse.json(null), tokens);
  } catch (error) {
    if (error instanceof AxiosError) {
      return new Response(error.message, {
        status: 400,
      });
    }
    return new Response("Unkown error", { status: 500 });
  }
}
