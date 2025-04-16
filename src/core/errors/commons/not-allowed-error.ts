import { GenericError } from "./generic-error";

export class NotAllowedError extends Error implements GenericError {
  constructor() {
    super("Not allowed.");
  }
}
