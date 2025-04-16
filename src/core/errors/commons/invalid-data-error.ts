import { GenericError } from "./generic-error";

export class InvalidDataError extends Error implements GenericError {
  constructor() {
    super("Invalid data.");
  }
}
