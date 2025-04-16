import { UseCaseError } from "../../commons/errors/use-case-error";

export class InvalidCountryError extends Error implements UseCaseError {
  constructor() {
    super("Country is invalid. Tell the support team.");
  }
}
