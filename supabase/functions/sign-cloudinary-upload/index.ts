import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.208.0/crypto/crypto.ts";
import { encodeHex } from "https://deno.land/std@0.208.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "3600",
};

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
      JSON.stringify({ status: "Edge function is working!" }),
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      }
    );
  }

  // Handle POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
    const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET");
    const CLOUDINARY_UPLOAD_PRESET = Deno.env.get("CLOUDINARY_UPLOAD_PRESET") || "tsd_events_gallery";

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return new Response(
        JSON.stringify({
          error: "Credentials not configured",
          cloudName: !!CLOUDINARY_CLOUD_NAME,
          apiKey: !!CLOUDINARY_API_KEY,
          secret: !!CLOUDINARY_API_SECRET,
        }),
        {
          status: 500,
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json"
          },
        }
      );
    }

    // Get folder from request body
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || "";

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Create signature - parameters must be in alphabetical order
    const params: Record<string, string> = {
      timestamp: timestamp.toString(),
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    };
    if (folder) {
      params.folder = folder;
    }
    
    // Sort alphabetically and create signature string
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
    const toSign = `${sortedParams}${CLOUDINARY_API_SECRET}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const signature = encodeHex(new Uint8Array(hashBuffer));

    const responseData = {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      signature,
      timestamp,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate signature",
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
