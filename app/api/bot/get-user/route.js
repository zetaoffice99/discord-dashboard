// app/api/bot/get-user/route.js
// Your Discord bot calls this to get a user's Google tokens
// before sending email or creating calendar events on their behalf

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { discordId, secret } = await request.json();

    // Only your bot can call this
    if (secret !== process.env.BOT_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!discordId) {
      return NextResponse.json({ error: "discordId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { discordId },
      select: {
        id:                true,
        discordUsername:   true,
        googleEmail:       true,
        googleAccessToken: true,
        googleRefreshToken:true,
        googleTokenExpiry: true,
        calendarId:        true,
        channelId:         true,
        guildId:           true,
      },
    });

    // User never visited dashboard
    if (!user) {
      return NextResponse.json({
        error: "NOT_SETUP",
        message:
          "⚠️ You haven't set up your account yet!\n👉 Visit **" +
          process.env.NEXTAUTH_URL +
          "/dashboard** to connect your Google account.",
      }, { status: 404 });
    }

    // User logged in but didn't connect Google
    if (!user.googleRefreshToken) {
      return NextResponse.json({
        error: "NO_GOOGLE",
        message:
          "⚠️ You haven't connected Google yet!\n👉 Visit **" +
          process.env.NEXTAUTH_URL +
          "/dashboard** to connect your Google account.",
      }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("get-user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}