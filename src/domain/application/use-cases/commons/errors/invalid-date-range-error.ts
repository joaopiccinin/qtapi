import { UseCaseError } from "../../commons/errors/use-case-error";

export class InvalidDateRangeError extends Error implements UseCaseError {
  constructor() {
    super("Invalid date range.");
  }
}
