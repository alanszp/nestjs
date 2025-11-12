import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { IsUrl, IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsUrl()
  imageUrl: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column("decimal")
  @IsNumber()
  @Min(0.01)
  price: number;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeTitle(): void {
    if (this.title) {
      this.title = this.title.toUpperCase();
    }
  }
}
