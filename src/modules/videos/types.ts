import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server"


export type VidoeGetOneOutput = inferRouterOutputs<AppRouter>["videos"]["getOne"];


// TODO: change to videos getMany
export type VideoGetManyOutput = inferRouterOutputs<AppRouter>["suggestions"]["getMany"];