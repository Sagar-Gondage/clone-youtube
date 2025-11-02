import { z } from "zod";

import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThumbnailGenerateModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters")
});

export const ThumbnailGenerateModal = ({ videoId, open, onOpenChange }: ThumbnailGenerateModalProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
            toast.success("Background job started!", { description: "This may take some time" });
        },
        onError: () => {
            toast.error("Error restoring thumbnail:");
        }
    });

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        generateThumbnail.mutate({ id: videoId, prompt: value.prompt });
        form.reset();
        onOpenChange(false);
    }

    return (
        <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <FormField
                        name="prompt"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Enter your prompt" className="resize-none" cols={30} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={generateThumbnail.isPending}>
                            Generate Thumbnail
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    )
}