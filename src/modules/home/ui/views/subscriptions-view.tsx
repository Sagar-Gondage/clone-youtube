import { SubscriptionsVideosSection } from "../sections/subscriptoins-videos-section"

export const SubscriptionsView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">Subscribed</h1>
                <p className="text-xs text-muted-foreground">Vides from you favourite creators</p>
            </div>
            <SubscriptionsVideosSection />
        </div>
    )
}