import { InvalidPostalCodeError } from "./errors/invalid-postal-code-error";
import { PostalCode } from "./postal-code";

describe("Creating a postalcode ", () => {
  it("should be able to create new valid postalcode", () => {
    const result = PostalCode.create({
      postalcode: "98700-000",
      country: "BR",
    });

    expect(result.isSuccess()).toBe(true);

    const { postalcode } = result.value as { postalcode: PostalCode };
    expect(postalcode.toString()).toEqual(expect.any(String));
  });

  it ("should not be able to create a new postalCode if postalcode is invalid", () => {
    const result = PostalCode.create({
      postalcode: "98700",
      country: "BR",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPostalCodeError);
  });
});
