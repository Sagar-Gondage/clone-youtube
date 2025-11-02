import { HistoryVideosSection } from "../sections/history-videos-section"

export const HistoryView = () => {
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-4 pt2.5 flex flex-col gap-y-6">
            <HistoryVideosSection />
        </div>
    )
}