import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
    getMany: protectedProcedure.input(z.object({
        cursor: z.object({
            creatorId: z.string().uuid(),
            updatedAt: z.date()
        }).nullish(),
        limit: z.number().min(1).max(100),
    })).query(async ({ input, ctx }) => {
        const { limit, cursor } = input;
        const { id: userId } = ctx.user;
        console.log("userId", userId);

        const data = await db
            .select({
                ...getTableColumns(subscriptions),
                user: {
                    ...getTableColumns(users),
                    subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
                }
            })
            .from(subscriptions)
            .innerJoin(users, eq(subscriptions.creatorId, users.id))
            .where(and(
                eq(subscriptions.viewerId, userId),
                cursor
                    ? or(
                        lt(subscriptions.updatedAt, cursor.updatedAt),
                        and(
                            eq(subscriptions.updatedAt, cursor.updatedAt),
                            lt(subscriptions.creatorId, cursor.creatorId)
                        )
                    )
                    : undefined
            )).orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
            .limit(limit + 1); // add one more item to check if there's a next page

        const hasMore = data.length > limit;

        // remove the last item if there's a next page
        const items = hasMore ? data.slice(0, -1) : data;

        // set the next cursor to the last item if there is more data
        const lastItem = items[items.length - 1];
        const nextCursor = hasMore ?
            {
                creatorId: lastItem.creatorId,
                updatedAt: lastItem.updatedAt
            } : null;

        return {
            items,
            nextCursor
        };
    }),
    create: protectedProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if (userId === ctx.user.id) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot subscribe to yourself." });
            }

            // Check if subscription already exists
            const existing = await db
                .select()
                .from(subscriptions)
                .where(and(
                    eq(subscriptions.viewerId, ctx.user.id),
                    eq(subscriptions.creatorId, userId)
                ));

            if (existing.length > 0) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Already subscribed." });
            }

            const [createdSubscription] = await db
                .insert(subscriptions)
                .values({ viewerId: ctx.user.id, creatorId: userId })
                .returning();

            return createdSubscription;
        }),
    remove: protectedProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { userId } = input;

            if (userId === ctx.user.id) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot unsubscribe from yourself." });
            }

            const [deletedSubscription] = await db
                .delete(subscriptions)
                .where(and(
                    eq(subscriptions.viewerId, ctx.user.id),
                    eq(subscriptions.creatorId, userId)
                ))
                .returning();

            return deletedSubscription;
        })
})