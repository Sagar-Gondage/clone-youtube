import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { VideoAssetCreatedWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetTrackReadyWebhookEvent, VideoAssetDeletedWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";



const WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetDeletedWebhookEvent | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: Request) => {
    if (!WEBHOOK_SECRET) {
        throw new Error("MUX_WEBHOOK_SECRET is not set");
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");

    if (!muxSignature) {
        return new Response("Missing Mux signature", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(body, {
        "mux-signature": muxSignature
    },
        WEBHOOK_SECRET
    );

    console.log("\nReceived Mux webhook:", payload.type);

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 });
            }
            await db.update(videos).set({
                muxAssetId: data.id,
                muxStatus: data.status
            }).where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];

            const playbackId = data.playback_ids?.[0]?.id;

            console.log("playbackId", playbackId);
            console.log("data", data);

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 });
            }

            console.log("one");

            if (!playbackId) {
                return new Response("Missing playbackId", { status: 400 });
            }

            console.log("two");

            const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;
            console.log("three");
            try {
                const utapi = new UTApi(); // TODO: multiple video.asset.ready events can be fired, optimize this and if data.status and not ready then uploadFilesFromUrl is failing 
                const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);
                console.log("Uploaded thumbnail and preview:", uploadedThumbnail, uploadedPreview);
                if (!uploadedThumbnail.data || !uploadedPreview.data) {
                    return new Response("Failed to upload thumbnail or preview", { status: 500 });
                }
                console.log("four");
                const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
                const { key: previewKey, url: previewUrl } = uploadedPreview.data;
                console.log(`updating database for upload id:${data.upload_id}`);
                const test = await db.update(videos).set({
                    muxStatus: data.status,
                    muxPlaybackId: playbackId,
                    muxAssetId: data.id,
                    thumbnailUrl: thumbnailUrl,
                    thumbnailKey: thumbnailKey,
                    previewUrl: previewUrl,
                    previewKey: previewKey,
                    duration: duration
                }).where(eq(videos.muxUploadId, data.upload_id));
                console.log("Database update result:", test);
            } catch (error) {
                console.error("Error uploading thumbnail or preview:", error);
                return new Response("Failed to upload thumbnail or preview", { status: 500 });
            }
            break;
        }

        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 });
            }

            await db.update(videos).set({
                muxStatus: data.status
            }).where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 });
            }

            await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & { asset_id: string }


            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;

            if (!assetId) {
                return new Response("Missing asset_id", { status: 400 });
            }

            await db.update(videos).set({
                muxTrackId: trackId,
                muxTrackStatus: status
            }).where(eq(videos.muxAssetId, assetId));
            break;
        }

    }

    return new Response("Webhook received", { status: 200 });
}