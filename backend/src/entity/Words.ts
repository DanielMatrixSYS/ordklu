import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "words" })
export class Words {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  word!: string;

  @Column()
  length!: number;

  @Column()
  category!: string;

  @Column()
  description!: string;

  @Column()
  language!: string;

  @Column()
  difficulty!: number;

  @Column()
  daily!: boolean;

  @Column()
  attempts!: number;

  @Column()
  solves!: number;
}
