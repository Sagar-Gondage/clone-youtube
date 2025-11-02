import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: "reply" | "comment";
}

export const CommentForm = ({
    videoId,
    onSuccess,
    variant = "comment",
    parentId,
    onCancel
}: CommentFormProps) => {

    const clerk = useClerk();
    const { user } = useUser();

    const utils = trpc.useUtils();

    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            form.reset();
            toast.success("Comment added successfully!");
            onSuccess?.();
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                toast.error("You must be logged in to post a comment.");
                clerk.openSignIn();
            } else {
                toast.error("Failed to post comment. Please try again.");
            }
        }
    });

    const form = useForm<z.infer<typeof commentInsertSchema>>({
        defaultValues: {
            parentId,
            videoId,
            value: ""
        }
    })

    const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
        create.mutate(values)
    }

    return (
        <Form {...form}>
            <form className="flex gap-4 group" onSubmit={form.handleSubmit(handleSubmit)}>
                <UserAvatar size="lg" imageUrl={user?.imageUrl || "/user-placeholder.svg"} name={user?.username || "User"} />
                <div className="flex-1">
                    <FormField
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={create.isPending}
                                        placeholder={variant === "comment" ? "Add a public comment..." : "Add a reply..."}
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant="ghost" type="button" onClick={() => { form.reset(); onCancel(); }} disabled={create.isPending}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" size="sm" disabled={create.isPending}>
                            {variant === "comment" ? "Comment" : "Reply"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )

}