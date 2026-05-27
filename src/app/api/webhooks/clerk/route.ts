import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-utils";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 }
      );
    }

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;

    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
        unsafe_metadata,
      } = evt.data;

      const primaryEmail = email_addresses?.find((e: any) => e.id === evt.data.primary_email_address_id);
      const email = primaryEmail?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      const emailVerified = primaryEmail?.verification?.status === "verified"
        ? new Date()
        : null;
      const role = public_metadata?.role || unsafe_metadata?.role || "user";

      if (email) {
        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email,
            name,
            image: image_url,
            role,
            emailVerified,
          },
          update: {
            email,
            name,
            image: image_url,
            role,
            emailVerified,
          },
        });
      }
    }

    if (eventType === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata,
      } = evt.data;

      const primaryEmail = email_addresses?.find((e: any) => e.id === evt.data.primary_email_address_id);
      const email = primaryEmail?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      const emailVerified = primaryEmail?.verification?.status === "verified"
        ? new Date()
        : undefined;
      const role = public_metadata?.role;

      if (email) {
        const updateData: any = {
          email,
          name,
          image: image_url,
        };
        if (emailVerified !== undefined) updateData.emailVerified = emailVerified;
        if (role !== undefined) updateData.role = role;

        await prisma.user.upsert({
          where: { clerkId: id },
          create: {
            clerkId: id,
            email,
            name,
            image: image_url,
            role: role || "user",
            emailVerified,
          },
          update: updateData,
        });
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      await prisma.user.deleteMany({
        where: { clerkId: id },
      });
    }

    if (eventType === "session.created") {
      const { user_id } = evt.data;
      const user = await prisma.user.findUnique({
        where: { clerkId: user_id },
        select: { id: true },
      });

      if (user) {
        await prisma.activity.create({
          data: {
            userId: user.id,
            type: "auth",
            title: "Signed in",
            description: "New session started",
          },
        });
      }
    }

    if (eventType === "session.revoked" || eventType === "session.ended") {
      const { user_id } = evt.data;
      const user = await prisma.user.findUnique({
        where: { clerkId: user_id },
        select: { id: true },
      });

      if (user) {
        await prisma.activity.create({
          data: {
            userId: user.id,
            type: "auth",
            title: "Signed out",
            description: "Session ended",
          },
        });
      }
    }

    if (eventType === "email.created" || eventType === "email.updated") {
      const { user_id, email_address, verification } = evt.data;
      if (verification?.status === "verified") {
        await prisma.user.updateMany({
          where: { clerkId: user_id },
          data: { emailVerified: new Date() },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return errorResponse(error);
  }
}
