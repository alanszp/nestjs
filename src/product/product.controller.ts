import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./models/Product";
import {
  CreateProductInput,
  CreateProductInputBody,
} from "./models/inputs/CreateProductInput";
import { ModelValidationError } from "src/errors/ModelValidationError";

@Controller("products")
export class ProductController {
  private readonly logger = new Logger("ProductService");

  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: CreateProductInputBody): Promise<Product> {
    try {
      return await this.productService.create(new CreateProductInput(product));
    } catch (error) {
      if (error instanceof ModelValidationError) {
        throw new HttpException(error.toJSON(), HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
}
