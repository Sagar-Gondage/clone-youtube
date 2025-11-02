import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
    const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!

    if (!req.headers.get("svix-signature")) {
        return new Response("Missing signature", { status: 400 })
    }

    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix signature headers", { status: 400 });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error: Could not verify webhook", err);
        return new Response("Error: Verification error", { status: 400 });
    }

    console.log("evt", evt);
    if (evt.type === "user.created") {
        const data = evt.data;
        await db.insert(users).values({
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
        });
    }

    if (evt.type === "user.deleted") {
        const { data } = evt;

        if (!data.id) {
            return new Response("Missing user ID", { status: 400 });
        }

        await db.delete(users).where(eq(users.clerkId, data.id));
    }

    if (evt.type === "user.updated") {
        await db.update(users).set({
            name: `${evt.data.first_name} ${evt.data.last_name}`,
            imageUrl: evt.data.image_url,
        }).where(eq(users.clerkId, evt.data.id));
    }

    return new Response("Success", { status: 200 });
}