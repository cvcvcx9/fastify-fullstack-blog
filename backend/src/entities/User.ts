import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: () => 'NOW()' })
  createdAt!: Date;

  @Column({ nullable: true })
  email?: string;
}