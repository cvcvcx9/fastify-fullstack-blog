import { buildSchema } from 'type-graphql';
import { UserResolver } from '../modules/user/user.resolver';
import { PostResolver } from '../modules/post/post.resolver';

export const createSchema = () =>
    buildSchema({
        resolvers: [UserResolver, PostResolver],
        validate: false,
    });
