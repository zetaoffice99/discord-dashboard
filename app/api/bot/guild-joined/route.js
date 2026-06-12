// app/api/bot/guild-joined/route.js
// Your Discord bot calls this when it joins a server
// Saves the guildId and newly created channelId to the user's record

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Singleton pattern to prevent multiple PrismaClient instances
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request) {
  try {
    const { discordId, guildId, channelId, secret } = await request.json();

    if (secret !== process.env.BOT_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!discordId || !guildId || !channelId) {
      return NextResponse.json(
        { error: "discordId, guildId and channelId are all required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { discordId },
      data: { guildId, channelId },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    // User not found in DB — they haven't signed up yet
    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "User not found. They need to sign up at the dashboard first." },
        { status: 404 }
      );
    }
    console.error("guild-joined error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}