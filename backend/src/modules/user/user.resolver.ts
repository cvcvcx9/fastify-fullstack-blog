import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./user.entity";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../typeorm";
@Resolver()
export class UserResolver {

    @Query(() => String)
    async profile(
        @Ctx("context") context: any) {
        const userRepo = AppDataSource.getRepository(User);
        if (!context.user) {
            throw new Error("Not authenticated");
        }
        return userRepo.findOneBy({ id: context.user.id })

    }

    @Mutation(() => Boolean)
    async register(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Arg("email", { nullable: true }) email?: string, // Default to empty string if not provided
    ): Promise<boolean> {
        const userRepo = AppDataSource.getRepository(User);
        const existingUser = await userRepo.findOne({ where: { username } });
        if (existingUser) {
            throw new Error("Username already exists");
        }
        const hashed = await bcrypt.hash(password, 10);
        if (!email) {
            email = "";
        }
        const user = userRepo.create({ username, password: hashed, email });
        await userRepo.save(user)
        return true;
    }
    @Mutation(() => String)
    async login(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() context: any
    ): Promise<string> {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ username });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = context.app.jwt.sign({ id: user.id, username: user.username });
        return token;
    }

}