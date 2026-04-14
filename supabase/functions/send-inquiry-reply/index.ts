import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "3600",
};

interface SendReplyRequest {
  to: string;
  customerName: string;
  replyMessage: string;
}

// Helper: Build branded HTML email
function buildHtmlEmail(customerName: string, replyMessage: string): string {
  const year = new Date().getFullYear();
  // Escape HTML special chars in the message
  const safeMessage = replyMessage
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reply from TSD Events &amp; Decor</title>
  </head>
  <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#b91c1c;padding:28px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                  TSD Events &amp; Decor
                </h1>
                <p style="margin:6px 0 0;color:#fecaca;font-size:13px;">
                  Professional Event Planning &amp; Decoration
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0 0 16px;color:#374151;font-size:15px;">
                  Dear <strong>${customerName}</strong>,
                </p>

                <!-- Admin reply — preserves line breaks -->
                <div style="background:#f3f4f6;border-left:4px solid #b91c1c;border-radius:4px;padding:20px 24px;margin:0 0 24px;">
                  <p style="margin:0;color:#1f2937;font-size:15px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
                </div>

                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                  Feel free to reach us anytime:
                </p>
                <p style="margin:0;color:#6b7280;font-size:13px;">
                  📞 <a href="tel:+919825413606" style="color:#b91c1c;text-decoration:none;">+91 98254 13606</a>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  💬 <a href="https://wa.me/919825413606" style="color:#16a34a;text-decoration:none;">WhatsApp</a>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  🌐 <a href="https://tsdevents.in" style="color:#b91c1c;text-decoration:none;">tsdevents.in</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">
                  TSD Events &amp; Decor · 3, Jamnasagar Flats, Sabarmati, Ahmedabad, Gujarat 380005
                </p>
                <p style="margin:6px 0 0;color:#9ca3af;font-size:12px;">
                  © ${year} TSD Events &amp; Decor. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Helper: Build plain-text fallback
function buildTextEmail(customerName: string, replyMessage: string): string {
  return `Dear ${customerName},\n\n${replyMessage}\n\n---\nTSD Events & Decor\n📞 +91 98254 13606\n🌐 tsdevents.in\n✉️ info@tsdevents.in`;
}

serve(async (req: Request) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Responding to OPTIONS preflight");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Handle GET for testing
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "send-inquiry-reply function is working!",
        endpoint: "POST with { to, customerName, replyMessage }",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Only allow POST beyond this point
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY secret");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not configured in Supabase secrets" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { to, customerName, replyMessage }: SendReplyRequest = body;

    console.log("Send reply request:", { to, customerName, replyMessageLength: replyMessage?.length });

    if (!to || !customerName || !replyMessage) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["to", "customerName", "replyMessage"],
          received: { to: !!to, customerName: !!customerName, replyMessage: !!replyMessage },
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Sending email to: ${to}`);

    // Send via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TSD Events & Decor <info@tsdevents.in>",
        to: [to],
        subject: "Reply from TSD Events & Decor",
        html: buildHtmlEmail(customerName, replyMessage),
        text: buildTextEmail(customerName, replyMessage),
      }),
    });

    const resendData = await resendResponse.json();
    console.log("Resend response:", resendData);

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData);
      return new Response(
        JSON.stringify({
          error: "Failed to send email via Resend",
          details: resendData,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Email sent successfully. Resend ID: ${resendData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        id: resendData.id,
        to,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
