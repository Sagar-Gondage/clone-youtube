"use client";

import { Suspense } from "react";
import { format } from "date-fns";
import { trpc } from "@/trpc/client";
import { Globe2Icon, LockIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VidoeThumbnail } from "@/modules/videos/ui/components/video-thumbnail";

import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";


export const VideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton/>}>
            <ErrorBoundary fallback={<div>Error loading videos.</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideosSectionSkeleton = () => {
    return (
        <>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative aspect-video w-36 shrink-0 bg-muted rounded-xl" />
                                        <div className="flex flex-col overflow-hidden gap-y-1 w-full">
                                            <div className="h-6 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 bg-muted rounded w-16" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 bg-muted rounded w-16" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 bg-muted rounded w-16" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-6 bg-muted rounded w-20 ml-auto" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="h-6 bg-muted rounded w-16 ml-auto" />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="h-6 bg-muted rounded w-16 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

const VideosSectionSuspense = () => {

    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            videos.pages.flatMap((page) => page.items).map((video) => (
                                <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                    <TableRow className="cursor-pointer">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative aspect-video w-36 shrink-0">
                                                    <VidoeThumbnail imageUrl={video.thumbnailUrl} previewUrl={video.previewUrl} title={video.title} duration={video.duration} />
                                                </div>
                                                <div className="flex flex-col overflow-hidden gap-y-1">
                                                    <span className="text-sm line-clamp-1">{video.title}</span>
                                                    <span className="text-xs line-clamp-1 to-muted-foreground">{video.description || "No description available"}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {video.visibility === "private" ? (
                                                    <LockIcon className="size-4 mr-2" />
                                                ) : (
                                                    <Globe2Icon className="size-4 mr-2" />
                                                )}
                                                {snakeCaseToTitle(video.visibility)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {snakeCaseToTitle(video.muxStatus || "error")}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm truncate">{format(new Date(video.createdAt), "dd MMM yyyy")}</TableCell>
                                        <TableCell className="text-right">{video.viewCount}</TableCell>
                                        <TableCell className="text-right">{video.commentCount}</TableCell>
                                        <TableCell className="text-right pr-6">{video.likeCount}</TableCell>
                                    </TableRow>
                                </Link>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}