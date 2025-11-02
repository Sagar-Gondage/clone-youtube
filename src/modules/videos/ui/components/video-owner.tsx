import Link from "next/link";
import { VidoeGetOneOutput } from "../../types"
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";

interface VideoOwnerProps {
    user: VidoeGetOneOutput["user"];
    videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {

    const { userId: clerkUserId, isLoaded } = useAuth();

    const { isPending, toggleSubscription } = useSubscription({ userId: user.id, isSubscribed: user.viewerSubscribed, fromVideoId: videoId });

    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex flex-col gap-1 min-w-0">
                        <UserInfo name={user.name} size="lg" />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {user.subscriptionCount} subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {user.clerkId === clerkUserId ? (
                <Button
                    variant="secondary"
                    className="rounded-full"
                    asChild
                >
                    <Link
                        href={`/studio/videos/${videoId}`}
                        className="ml-auto sm:ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition"
                    >
                        Edit Video
                    </Link>
                </Button>
            ) : (
                <SubscriptionButton onClick={toggleSubscription} disabled={isPending || !isLoaded} isSubscribed={user.viewerSubscribed} className="flex-none"  />
            )}
        </div>
    )
}