import dotenv from 'dotenv';
import fastify from 'fastify';
import { AppDataSource } from './typeorm'
import mercurius from 'mercurius';
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors';
import { createSchema } from './graphql/schema';
dotenv.config();
const app = fastify();


AppDataSource.initialize().then(async () => {
    app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
    app.register(cors, {
        origin: '*', // Allow all origins for development; adjust as needed for production
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
        credentials: true // Allow credentials (cookies, authorization headers, etc.)
    })
    const schema = await createSchema();
    app.register(mercurius, {
        schema,
        ide: true,
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