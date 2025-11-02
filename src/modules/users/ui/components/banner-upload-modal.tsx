import { ResponsiveModal } from "@/components/responsive-modal";
import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/utils/uploadthing";

interface BannerlUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

export const BannerlUploadModal = ({ userId, open, onOpenChange }: BannerlUploadModalProps) => {

    const utils = trpc.useUtils();

    const onClientUploadComplete = () => {
        utils.users.getOne.invalidate({ userId });
        onOpenChange(false);
    }

    return (
        <ResponsiveModal title="Upload a banner" open={open} onOpenChange={onOpenChange}>
            <UploadDropzone
                endpoint="bannerUploader"
                onClientUploadComplete={onClientUploadComplete}
            />
        </ResponsiveModal>
    )
}