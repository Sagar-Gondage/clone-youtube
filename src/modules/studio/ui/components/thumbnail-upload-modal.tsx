import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/utils/uploadthing";

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

export const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: ThumbnailUploadModalProps) => {

    const utils = trpc.useUtils();

    const onClientUploadComplete = () => {
        utils.studio.getOne.invalidate({ id: videoId });
        utils.studio.getMany.invalidate();
        onOpenChange(false);
    }

    return (
        <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
            <UploadDropzone
                endpoint="thumbnailUploader"
                input={{ videoId }}
                onClientUploadComplete={onClientUploadComplete}
            />
        </ResponsiveModal>
    )
}