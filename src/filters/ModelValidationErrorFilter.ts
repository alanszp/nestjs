import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { ModelValidationError } from "../errors/ModelValidationError";

@Catch(ModelValidationError)
export class ModelValidationErrorFilter implements ExceptionFilter {
  catch(exception: ModelValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json(exception.toJSON());
  }
}
