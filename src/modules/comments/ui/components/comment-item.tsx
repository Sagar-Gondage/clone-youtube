import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { useAuth, useClerk } from "@clerk/nextjs"
import { ChevronDownIcon, ChevronUpIcon, MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react"

import { CommentForm } from "./comment-form"
import { Button } from "@/components/ui/button"
import { CommentReplies } from "./comment-replies"
import { UserAvatar } from "@/components/user-avatar"
import { CommentsGetManyOutput } from "../../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { trpc } from "@/trpc/client"
import { cn } from "@/lib/utils"

interface CommentsItemProps {
    comment: CommentsGetManyOutput["items"][number],
    variant?: "reply" | "comment"
}

export const CommentItem = ({ comment, variant = "comment" }: CommentsItemProps) => {

    const { userId } = useAuth();
    const clerk = useClerk();

    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);

    const utils = trpc.useUtils();
    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted successfully");
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            if (error.data?.code == "UNAUTHORIZED") {
                toast.error("Please login")
                clerk.openSignIn();
            } else {
                toast.error("Something went wrong, please try again later.")
            }

        }
    });

    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            toast.success("liked successfully");
            utils.comments.getMany.invalidate({ videoId: comment.videoId })
        },
        onError: (error) => {
            if (error.data?.code == "UNAUTHORIZED") {
                toast.error("Please login")
                clerk.openSignIn();
            } else {
                toast.error("Something went wrong, please try again later.");
            }
        }
    });

    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            toast.success("disliked successfully");
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            if (error.data?.code == "UNAUTHORIZED") {
                toast.error("Please login");
                clerk.openSignIn();
            } else {
                toast.error("Something went wrong, please try again later.");
            }
        }
    });

    console.log("comment:", comment);

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/user/${comment.userId}`}>
                    <UserAvatar size={variant == "comment" ? "lg" : "sm"} imageUrl={comment.user.imageUrl} name={comment.user.name} />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/user/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.updatedAt, { addSuffix: true })}</span>
                        </div>
                    </Link>
                    <p className="text-sm">
                        {comment.value}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                className="size-8"
                                disabled={like.isPending || dislike.isPending}
                                size="icon"
                                variant="secondary"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon className={cn(comment.viewerReaction === "like" && "fill-black")} />
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                            <Button
                                className="size-8"
                                disabled={dislike.isPending || like.isPending}
                                size="icon"
                                variant="secondary"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon className={cn(comment.viewerReaction == "dislike" && "fill-black")} />
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
                        </div>
                        {variant === "comment" && (
                            <Button variant="ghost" size="sm" className="h-8" onClick={() => setIsReplyOpen(true)}>
                                Reply
                            </Button>
                        )}
                    </div>
                </div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                            variant === "comment" && (
                                <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                                    <MessageSquareIcon className="size-4" />
                                    Reply
                                </DropdownMenuItem>
                            )
                        }
                        {
                            comment.user.clerkId === userId && (
                                <DropdownMenuItem onClick={() => remove.mutate({ commentId: comment.id })}>
                                    <Trash2Icon className="size-4" />
                                    Delete
                                </DropdownMenuItem>
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isReplyOpen && variant == "comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        variant="reply"
                        videoId={comment.videoId}
                        parentId={comment.id}
                        onCancel={() => setIsReplyOpen(false)}
                        onSuccess={() => {
                        setIsReplyOpen(false);
                        setIsRepliesOpen(true);
                    }} />

                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && (
                <div className="pl-14">
                    <Button variant="tertiary" size="sm" onClick={() => setIsRepliesOpen((prev) => !prev)}>
                        {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        {comment.replyCount} Replies
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
                <CommentReplies parentId={comment.id} videoId={comment.videoId} />
            )}
        </div>
    )
}