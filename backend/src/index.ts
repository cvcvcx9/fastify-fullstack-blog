import dotenv from 'dotenv';
import fastify from 'fastify';
import { Query } from 'typeorm/driver/Query';
import {AppDataSource} from './typeorm'
import mercurius from 'mercurius';
import { DateTimeResolver } from 'graphql-scalars';
import bcrypt from 'bcrypt';
import fastifyJwt from "@fastify/jwt";

dotenv.config();
const app = fastify();

const schema = `
    scalar DateTime
    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: DateTime!
    }
    type User {
        id: ID!
        username: String!
        email: String
        createdAt: DateTime!
    }
    type Query {
        posts: [Post]
        profile: User
    }
    type Mutation {
        createPost(title: String!, content: String!): Post
        register(username: String!, password: String!, email: String): Boolean
        login(username: String!, password: String!): String # Returns JWT token
    }
`;

const resolvers = {
    DateTime: DateTimeResolver,
    Query:{
        posts: async () => {
            const postRepo = AppDataSource.getRepository('Post');
            return postRepo.find();
        },
        profile: async (_: any, __: any, context: any) => {
            try {
                if (!context.user) {
                    throw new Error('Not authenticated');
                }
                const userRepo = AppDataSource.getRepository('User');
                const user = await userRepo.findOneBy({id: context.user.id});
                return user;
            }catch (error) {
                console.error('Error fetching profile:', error);
                throw new Error('Failed to fetch profile');
            }
        }
    },
    Mutation: {
        createPost: async (_: any, {title, content}: any,context:any)=>{
            if (!title || !content) {
                throw new Error('Title and content are required');
            }
            if (!context.user) {
                throw new Error('User not authenticated');
            }
            const postRepo = AppDataSource.getRepository('Post');
            const post = postRepo.create({title, content});
            return postRepo.save(post);
        },
        register: async (_: any, {username, password, email}: any) => {
            const userRepo = AppDataSource.getRepository('User');
            const existingUser = await userRepo.findOneBy({username});
            if (existingUser) {
                throw new Error('Username already exists');
            }
            const hashed = await bcrypt.hash(password, 10);
            const user = userRepo.create({username, password:hashed, email});
            await userRepo.save(user);
            return true;
        },
        login: async (_: any, {username, password}: any, context: any) => {
            const userRepo = AppDataSource.getRepository('User');
            const user = await userRepo.findOneBy({username});
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            const token = context.app.jwt.sign({ id: user.id, username: user.username });
            return token;
        }
    }
}

AppDataSource.initialize().then(() => {
    app.register(mercurius, {
        schema,
        resolvers,
        graphiql: true,
        context: async (request, reply) => {
            let user = null;
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                try {
                    const decoded = await reply.server.jwt.verify(token);
                    user = decoded; // Store the user information in the context
                } catch (error) {
                    console.error('JWT verification failed:', error);
                }
            }
            return { request, reply, app, user };
        }
    });
    app.register(fastifyJwt,{secret:process.env.JWT_SECRET!});

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