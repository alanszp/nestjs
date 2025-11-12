import { INestApplication } from "@nestjs/common";
import { ModelValidationErrorFilter } from "./filters/ModelValidationErrorFilter";

export function configureApp(app: INestApplication): void {
  app.useGlobalFilters(new ModelValidationErrorFilter());
}
