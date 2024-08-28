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
  difficulty!: number;
}
