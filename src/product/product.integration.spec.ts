import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { ProductModule } from "./product.module";
import { Product } from "./models/product";

describe("Product API Integration Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Product],
          synchronize: true,
        }),
        ProductModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /products", () => {
    it("should create a product successfully", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        title: "Test Product",
        description: "This is a test product",
        price: 29.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.imageUrl).toBe(productData.imageUrl);
          expect(res.body.title).toBe("TEST PRODUCT"); // Title should be normalized to uppercase
          expect(res.body.description).toBe(productData.description);
          expect(res.body.price).toBe(productData.price);
        });
    });

    it("should return 400 when imageUrl is invalid", () => {
      const productData = {
        imageUrl: "not-a-valid-url",
        title: "Test Product",
        description: "Test description",
        price: 19.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain("imageUrl must be a URL address");
        });
    });

    it("should return 400 when price is less than 0.01", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        title: "Test Product",
        description: "Test description",
        price: 0,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain(
            "price must not be less than 0.01"
          );
        });
    });

    it("should return 400 when price is negative", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        title: "Test Product",
        description: "Test description",
        price: -5,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain(
            "price must not be less than 0.01"
          );
        });
    });

    it("should return 400 when title is missing", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        description: "Test description",
        price: 19.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain("title should not be empty");
        });
    });

    it("should return 400 when description is missing", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        title: "Test Product",
        price: 19.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain("description should not be empty");
        });
    });

    it("should return 400 when multiple fields are missing", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        price: 19.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain("title should not be empty");
          expect(res.body.message).toContain("description should not be empty");
        });
    });

    it("should normalize title to uppercase", () => {
      const productData = {
        imageUrl: "https://example.com/product.jpg",
        title: "Mixed Case Product Title",
        description: "Test description",
        price: 19.99,
      };

      return request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe("MIXED CASE PRODUCT TITLE");
        });
    });
  });

  describe("GET /products", () => {
    it("should return an empty array when no products exist", () => {
      return request(app.getHttpServer())
        .get("/products")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it("should return all products", async () => {
      // Create a product first
      const productData = {
        imageUrl: "https://example.com/product1.jpg",
        title: "First Product",
        description: "First product description",
        price: 29.99,
      };

      await request(app.getHttpServer()).post("/products").send(productData);

      // Create another product
      const productData2 = {
        imageUrl: "https://example.com/product2.jpg",
        title: "Second Product",
        description: "Second product description",
        price: 39.99,
      };

      await request(app.getHttpServer()).post("/products").send(productData2);

      // Get all products
      return request(app.getHttpServer())
        .get("/products")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
          expect(res.body[0]).toHaveProperty("id");
          expect(res.body[0]).toHaveProperty("imageUrl");
          expect(res.body[0]).toHaveProperty("title");
          expect(res.body[0]).toHaveProperty("description");
          expect(res.body[0]).toHaveProperty("price");
        });
    });
  });

  describe("End-to-end flow", () => {
    it("should create and retrieve products correctly", async () => {
      // Create a product
      const productData = {
        imageUrl: "https://example.com/e2e-product.jpg",
        title: "E2E Test Product",
        description: "End to end test product",
        price: 49.99,
      };

      const createResponse = await request(app.getHttpServer())
        .post("/products")
        .send(productData)
        .expect(201);

      const productId = createResponse.body.id;

      // Retrieve all products
      const getAllResponse = await request(app.getHttpServer())
        .get("/products")
        .expect(200);

      // Verify the created product is in the list
      const createdProduct = getAllResponse.body.find(
        (p: Product) => p.id === productId
      );

      expect(createdProduct).toBeDefined();
      expect(createdProduct.imageUrl).toBe(productData.imageUrl);
      expect(createdProduct.title).toBe("E2E TEST PRODUCT");
      expect(createdProduct.description).toBe(productData.description);
      expect(createdProduct.price).toBe(productData.price);
    });
  });
});
