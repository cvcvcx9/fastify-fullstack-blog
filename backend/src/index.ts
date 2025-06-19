import dotenv from 'dotenv';
import fastify from 'fastify';
import { Query } from 'typeorm/driver/Query';
import {AppDataSource} from './typeorm'
import mercurius from 'mercurius';


dotenv.config();
const app = fastify();

const schema = `
    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
    }

    type Query {
        posts: [Post!]!
    }
    type Mutation {
        createPost(title: String!, content: String!): Post!
    }
`;

const resolvers = {
    Query:{
        posts: async () => {
            const postRepo = AppDataSource.getRepository('Post');
            return postRepo.find();
        },
    },
    Mutation: {
        createPost: async (_: any, {title, content}: any)=>{
            const postRepo = AppDataSource.getRepository('Post');
            const post = postRepo.create({title, content});
            return postRepo.save(post);
        }
    }
}

AppDataSource.initialize().then(() => {
    app.register(mercurius, {
        schema,
        resolvers,
        graphiql: true,
    });

    app.listen({ port: 3000 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server is running at ${address}`);
    });
}).catch((error) => {   
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
});