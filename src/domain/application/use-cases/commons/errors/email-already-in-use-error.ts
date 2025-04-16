import { UseCaseError } from "../../commons/errors/use-case-error";

export class EmailAlreadyInUseError extends Error implements UseCaseError {
  constructor() {
    super("Email is already in use.");
  }
}
