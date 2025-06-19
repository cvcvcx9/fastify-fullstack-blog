import { Field, ID, ObjectType } from "type-graphql";
import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    content!: string;

    @Field()
    @Column({ type: "timestamptz", default: () => "NOW()" })
    createdAt!: Date;
}