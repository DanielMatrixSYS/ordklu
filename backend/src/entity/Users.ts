import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  uid!: string;

  @Column()
  name!: string;

  @Column()
  totalSolved!: number;
}
