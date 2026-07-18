import { NextResponse } from "next/server";

/**
 * Contact delivery runs in the browser via Web3Forms (see sendForm in
 * components/website.tsx). Web3Forms free-tier rejects server-side proxies
 * with 403, so this route is intentionally not used for delivery.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Contact form posts directly to Web3Forms from the browser. This API route is unused.",
    },
    { status: 410 },
  );
}
