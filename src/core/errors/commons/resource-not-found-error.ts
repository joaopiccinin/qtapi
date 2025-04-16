import { GenericError } from "./generic-error";

export class ResourceNotFoundError extends Error implements GenericError {
  constructor() {
    super("Resource not found.");
  }
}
