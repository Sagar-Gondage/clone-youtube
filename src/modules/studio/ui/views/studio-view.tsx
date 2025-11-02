import { VideosSection } from "../sections/videos-section"

export const StudioView = () => {
    return (
        <div className="flex flex-col gap-y-4 pt-2.5">
            <div className="px-4">
                <h1 className="text-2xl font-bold">Channel Content</h1>
                <p className="text-xs to-muted-foreground">
                    Manage and view all your videos in one place.
                </p>
            </div>
            <VideosSection />
        </div>
    )
}