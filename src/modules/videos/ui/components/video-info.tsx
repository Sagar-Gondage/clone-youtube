import { formatDistanceToNow } from "date-fns";
import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoMenu } from "./video-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoInfoProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-10 flex-shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-5 w-[70%]" />
            </div>
        </div>
    )
}

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {

    const compactViews = Intl.NumberFormat('en-US', {
        notation: 'compact',
    }).format(data.viewCount);

    const compactDate = formatDistanceToNow(data.createdAt, { addSuffix: true });

    return (
        <div className="flex gap-3">
            <Link href={`/users/${data.user.id}`}>
                <UserAvatar size="sm" imageUrl={data.user.imageUrl} name={data.user.name} />
            </Link>
            <div className="min-w-0 flex-1">
                <Link href={`/videos/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">{data.title}</h3>
                </Link>
                <Link href={`/users/${data.user.id}`}>
                    <UserInfo name={data.user.name} />
                </Link>
                <Link href={`/videos/${data.id}`}>
                    <p className="text-sm text-gray-500 line-clamp-1">
                        {compactViews} views • {compactDate}
                    </p>
                </Link>
            </div>
            <div className="flex-shrink-0">
                <VideoMenu onRemove={onRemove} videoId={data.id} />
            </div>
        </div>
    )
}