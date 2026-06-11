import { NextRequest, NextResponse } from "next/server";

function twimlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(_req: NextRequest) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="man" language="en-US">
    Hey, this is Bro AI from BRO 2 BRO — your health companion for Black men in Arkansas.
    We don't handle voice calls right now, but you can text this same number anytime and I'll respond right away.
    You can also visit bro 2 bro dot app for appointments, resources, mentors, and more.
    Take care, brother.
  </Say>
  <Hangup/>
</Response>`;
  return twimlResponse(xml);
}

// Twilio can also send GET for status callbacks
export async function GET(_req: NextRequest) {
  return twimlResponse(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
}
