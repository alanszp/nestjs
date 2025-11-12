import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
  validate,
} from "class-validator";
import { BaseModel } from "../BaseModel";

export interface CreateProductInputBody {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

export class CreateProductInput extends BaseModel {
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  constructor(body: CreateProductInputBody) {
    super();
    this.imageUrl = body.imageUrl;
    this.description = body.description;
    this.title = body.title;
    this.price = body.price;
  }
}
