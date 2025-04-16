import { Either, failure, success } from "@/core/either";
import validator, { PostalCodeLocale } from "validator";
import { InvalidPostalCodeError } from "./errors/invalid-postal-code-error";

export interface PostalCodeProps {
  postalcode: string;
  country: PostalCodeLocale;
}

type CreatePostalCodeResponse = Either<
  InvalidPostalCodeError,
  {
    postalcode: PostalCode;
  }
>;

export class PostalCode {
  private postalcode: string;

  public constructor(postalcode: string) {
    this.postalcode = postalcode;
  }

  static create({ postalcode, country }: PostalCodeProps): CreatePostalCodeResponse {
    if (!PostalCode.isPostalCodeValid(postalcode, country)) {
      return failure(new InvalidPostalCodeError());
    }

    const hashedPostalCode = new PostalCode(postalcode);

    return success({ postalcode: hashedPostalCode });
  }

  toString(): string {
    return this.postalcode;
  }

  /**
   * Validates an postalcode address using the `validator` library.
   *
   * This function leverages the `validator.isPostalCode()` method, which performs a comprehensive check for postalcode format.
   *
   * @param postalcode - The postalcode address to validate.
   * @returns `true` if the postalcode is valid, `false` otherwise.
   */
  static isPostalCodeValid(postalcode: string, country: PostalCodeLocale): boolean {
    return validator.isPostalCode(postalcode, country);
  }
}
