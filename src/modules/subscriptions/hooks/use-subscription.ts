import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";


interface UseSubscriptionProps {
    userId: string;
    isSubscribed: boolean;
    fromVideoId?: string;
}

export const useSubscription = ({ userId, isSubscribed, fromVideoId }: UseSubscriptionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess: () => {
            toast.success("Subscribed successfully!");
            utils.subscriptions.getMany.invalidate();
            utils.videos.getManySubscribed.invalidate();
            utils.users.getOne.invalidate({ userId });
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            if (error.data?.code == "UNAUTHORIZED") {
                toast.error("please login to subscribe");
                clerk.openSignIn();
            } else {
                toast.error("Failed to subscribe. Please try again.");
            }
        }
    });

    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: () => {
            toast.success("Unsubscribed successfully!");
            utils.subscriptions.getMany.invalidate();
            utils.users.getOne.invalidate({ userId });
            utils.videos.getManySubscribed.invalidate();
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            if (error.data?.code == "UNAUTHORIZED") {
                toast.error("please login to subscribe");
                clerk.openSignIn();
            } else {
                toast.error("Failed to subscribe. Please try again.");
            }
        }
    });

    const isPending = subscribe.isPending || unsubscribe.isPending;

    const toggleSubscription = () => {
        if (isSubscribed) {
            unsubscribe.mutate({ userId });
        } else {
            subscribe.mutate({ userId });
        }
    };

    return {
        toggleSubscription,
        isPending
    };

}