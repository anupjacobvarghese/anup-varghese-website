import { NextResponse } from "next/server";

type Lead = {
  kind?: "contact" | "book";
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  company_website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isLead(value: unknown): value is Lead {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const lead = value as Record<string, unknown>;
  return (
    isOptionalString(lead.kind) &&
    isOptionalString(lead.name) &&
    isOptionalString(lead.email) &&
    isOptionalString(lead.phone) &&
    isOptionalString(lead.interest) &&
    isOptionalString(lead.message) &&
    isOptionalString(lead.company_website) &&
    (lead.kind === undefined || lead.kind === "contact" || lead.kind === "book")
  );
}

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isLead(input)) {
    return NextResponse.json({ error: "Invalid fields." }, { status: 400 });
  }

  const lead = input;

  if (lead.company_website) {
    return NextResponse.json({ ok: true });
  }

  if (!lead.email || !emailPattern.test(lead.email) || lead.email.length > 160) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (lead.kind !== "book" && (!lead.name || !lead.message)) {
    return NextResponse.json(
      { error: "Name and message are required." },
      { status: 400 },
    );
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Contact delivery has not been configured." },
      { status: 503 },
    );
  }

  const payload = {
    access_key: accessKey,
    subject:
      lead.kind === "book"
        ? "New book launch signup"
        : `New ${lead.interest ?? "website"} enquiry from ${lead.name}`,
    from_name: "anupvarghese.com",
    name: lead.name?.slice(0, 120) ?? "Book subscriber",
    email: lead.email.slice(0, 160),
    phone: lead.phone?.slice(0, 40) ?? "",
    interest: lead.kind === "book" ? "Book launch" : lead.interest?.slice(0, 80),
    message:
      lead.kind === "book"
        ? "Please add this email to the book launch notification list."
        : lead.message?.slice(0, 5000),
  };

  let response: Response;
  try {
    response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return NextResponse.json(
      { error: "Delivery service is temporarily unavailable." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Delivery failed. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
