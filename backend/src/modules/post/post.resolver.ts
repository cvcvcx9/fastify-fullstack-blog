import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "./post.entity";
import { AppDataSource } from "../../typeorm";


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts() {
        const postRepo = AppDataSource.getRepository(Post);
        return postRepo.find();
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Arg("content") content: string,
        @Ctx() context: any
    ): Promise<Post> {
        if (!context.user) {
            throw new Error("Not authenticated");
        }
        const postRepo = AppDataSource.getRepository(Post);
        const post = postRepo.create({ title, content });
        return await postRepo.save(post);
    }
}