
import { HomeLayout } from "@/modules/home/ui/layout/home-layout"

export const dynamic = 'force-dynamic';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <HomeLayout>
            <div>
                {children}
            </div>
        </HomeLayout>
    )
}

export default Layout