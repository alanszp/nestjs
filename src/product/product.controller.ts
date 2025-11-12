import { Controller, Post, Get, Body } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./models/product";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
}
