import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { IsUrl, IsString, IsNotEmpty, IsNumber, Min } from "class-validator";
import { CreateProductInput } from "./inputs/CreateProductInput";

@Entity()
export class Product extends BaseEntity {
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

  fromInput(input: CreateProductInput): Product {
    this.imageUrl = input.imageUrl;
    this.title = input.title.toUpperCase();
    this.description = input.description;
    this.price = input.price;
    return this;
  }
}
