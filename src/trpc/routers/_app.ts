import { studioRouter } from '@/modules/studio/ui/server/procedures';
import { createTRPCRouter } from '../init';
import { usersRouter } from '@/modules/users/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { playlistRouter } from '@/modules/playlists/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { VideoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { commentReactionRouter } from '@/modules/comment-reactions/server/procedures';

export const appRouter = createTRPCRouter({
    users: usersRouter,
    studio: studioRouter,
    videos: videosRouter,
    search: searchRouter,
    comments: commentsRouter,
    playlists: playlistRouter,
    categories: categoriesRouter,
    videoViews: videoViewsRouter,
    suggestions: suggestionsRouter,
    subscriptions: subscriptionsRouter,
    videoReactions: VideoReactionsRouter,
    commentReactions: commentReactionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;