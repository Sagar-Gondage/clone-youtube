import { AlertTriangleIcon } from "lucide-react";
import { VidoeGetOneOutput } from "../../types"


interface VideoBannerProps {
    status: VidoeGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {

    if (status == "ready") return null;

    return (
        <div className="bg-yellow-500 border py-3 px-4 rounded-b-xl flex items-center gap-y-2" role="alert">
            <AlertTriangleIcon className="size-4 text-black shrink-0" />

            <p className="text-xs md:text-sm text-black font-medium line-clamp-1">
                This Video is still being processed.
            </p>
        </div>
    )

}