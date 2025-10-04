import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // EmailOctopus API configuration from environment variables
    const API_KEY = process.env.EMAILOCTOPUS_API_KEY;
    const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;

    if (!API_KEY || !LIST_ID) {
      console.error("EmailOctopus API configuration missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call EmailOctopus API from server-side
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: API_KEY,
          email_address: email,
          status: "SUBSCRIBED",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (data.error?.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
        return NextResponse.json(
          { error: "This email is already subscribed!" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: data.error?.message || "Failed to subscribe" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
