"use client";

import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { UserPageBanner, UserPageBannerSkeleton } from "../components/user-page-banner";
import { UserPageInfo, UserPageInfoSkeleton } from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

interface UserSectionProps {
    userId: string;
}

export const UserSection = ({ userId }: UserSectionProps) => {
    return (
        <Suspense fallback={<UserSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Error loading categories.</div>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const UserSectionSkeleton = () => {
    return (
        <div className="flex flex-col">
            <UserPageBannerSkeleton />
            <UserPageInfoSkeleton />
            <Separator />
        </div>
    )
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {

    const [user] = trpc.users.getOne.useSuspenseQuery({ userId });

    return (
        <div className="flex flex-col">
            <UserPageBanner user={user} />
            <UserPageInfo user={user} />
            <Separator />
        </div>
    )
}