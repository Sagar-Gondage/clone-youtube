import { z } from "zod";

import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
    name: z.string().min(1)
})

export const PlaylistCreateModal = ({ open, onOpenChange }: PlaylistCreateModalProps) => {

    const utils = trpc.useUtils();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const create = trpc.playlists.create.useMutation({
        onSuccess: () => {
            form.reset()
            onOpenChange(false);
            toast.success("Playlist created!");
            utils.playlists.getMany.invalidate();
        },
        onError: () => {
            toast.error("Error creating playlist, plese try again");
            onOpenChange(false);
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values);
        form.reset();
        // onOpenChange(false);
    }

    return (
        <ResponsiveModal title="Create a Playlist" open={open} onOpenChange={(value) => { if (!create.isPending) onOpenChange(value); }}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="My favourite videos" disabled={create.isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={create.isPending}>
                            Create Playlist
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    )
}