"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard, VideoRowCardSkeleton } from "./video-row-card";
import { VideoGridCard, VideoGridCardSkeleton } from "./video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuggestionsSectionProps {
    videoId: string;
    isManuel?: boolean;
}

export const SuggestionsSection = ({ videoId, isManuel = false }: SuggestionsSectionProps) => {
    return (
        <Suspense fallback={<SuggestionsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong.</div>}>
                <SuggestionsSectionSuspense videoId={videoId} isManuel={isManuel} />
            </ErrorBoundary>
        </Suspense>
    )
}

const SuggestionsSectionSkeleton = () => {
    return (
       <>
        <div className="hidden md:block space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <VideoRowCardSkeleton key={index} size="default" />
            ))}
        </div>
        <div className="block md:hidden space-y-10">
            {Array.from({ length: 6 }).map((_, index) => (
               <VideoGridCardSkeleton key={index} />
            ))}
        </div>
       </>
    )
}

const SuggestionsSectionSuspense = ({ videoId, isManuel }: SuggestionsSectionProps) => {

    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggestions.pages.flatMap(page => page.items).map(suggestion => (
                    <VideoRowCard key={suggestion.id} data={suggestion} size="compact" />
                ))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages.flatMap(page => page.items).map(suggestion => (
                    <VideoGridCard key={suggestion.id} data={suggestion} />
                ))}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} isManual={isManuel} />
        </>
    )
}