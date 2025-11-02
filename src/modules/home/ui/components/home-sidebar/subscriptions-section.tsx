"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon } from "lucide-react";


export const SubscriptionsSection = () => {

    const pathname = usePathname();
    const { isSignedIn } = useUser();


    const { data, isLoading } = trpc.subscriptions.getMany.useQuery({
        limit: DEFAULT_LIMIT
    }, { enabled: isSignedIn })

    if (!isSignedIn) return null;

    if (isLoading) return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {[...Array(5)].map((_, idx) => (
                        <SidebarMenuItem key={idx}>
                            <SidebarMenuButton asChild>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {data?.items.map((subscription) => (
                        <SidebarMenuItem key={`${subscription.creatorId}-${subscription.viewerId}`}>
                            <SidebarMenuButton
                                tooltip={subscription.user.name}
                                asChild
                                isActive={pathname === `/users/${subscription.user.id}`}
                            >
                                <Link href={`/users/${subscription.user.id}`} className="flex items-center gap-4">
                                    <UserAvatar imageUrl={subscription.user.imageUrl} name={subscription.user.name} size="xs" />
                                    <span className="text-sm">{subscription.user.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    {!isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/subscriptions"}>
                                <Link href="/subscriptions" className="flex items-center gap-4">
                                    <ListIcon className="size-4" />
                                    <span className="text-sm">All subscriptions</span>
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}