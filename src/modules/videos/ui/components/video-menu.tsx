import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { PlaylistAddModal } from "@/modules/playlists/ui/components/playlist-add-modal";

interface VideoMenuProps {
    videoId: string;
    variant?: "ghost" | "secondary";
    onRemove?: () => void;
}

// TODO: implement functionality
export const VideoMenu = ({ videoId, variant = "ghost", onRemove }: VideoMenuProps) => {

    const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

    const onShare = () => {
        // TODO: chage of deploying outside vercel
        const fullUrl = `${APP_URL}/videos/${videoId}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("Link copied to the clipboard")

    }

    return (
        <>
            <PlaylistAddModal open={isAddToPlaylistOpen} onOpenChange={setIsAddToPlaylistOpen} videoId={videoId} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size="icon" className="rounded-full">
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={onShare}>
                        <ShareIcon className="mr-2 size-4" />
                        Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAddToPlaylistOpen(true)}>
                        <ListPlusIcon className="mr-2 size-4" />
                        Add to playlist
                    </DropdownMenuItem>
                    {
                        onRemove && (
                            <DropdownMenuItem onClick={onRemove}>
                                <Trash2Icon className="mr-2 size-4" />
                                Remove
                            </DropdownMenuItem>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}