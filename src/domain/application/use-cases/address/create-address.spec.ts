import { CreateAddressUseCase } from "./create-address";
import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository";
import { Country } from "../utils/enums/country";
import { InvalidCountryError } from "./errors/invalid-country-error";
import { Address } from "@/domain/enterprise/entities/address/address";
import { InvalidPostalCodeError } from "@/domain/enterprise/entities/address/value-objects/errors/invalid-postal-code-error";
import { AddressTypeEnum } from "@/domain/enterprise/entities/address/enum/adress-type.enum";

let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: CreateAddressUseCase;

describe("Create Address", () => {
  beforeEach(async () => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    sut = new CreateAddressUseCase(inMemoryAddressRepository);
  });

  it("should be able to create an address", async () => {
    const result = await sut.execute({
      country: Country.Brazil,
      state: "RS",
      city: "Ijui",
      street: "Rua João",
      number: "123",
      addressType: AddressTypeEnum.Residential,
      complement: "Apto 203",
      postalCode: "98700-000",
    });

    expect(result.isSuccess()).toBe(true);

    const { address } = result.value as { address: Address };

    expect(address).toEqual(
      expect.objectContaining({
        country: Country.Brazil,
        state: "RS",
        city: "Ijui",
        street: "Rua João",
        number: "123",
        complement: "Apto 203",
        postalCode: "98700-000",
      })
    );
  });

  it("should not be able to create an address with invalid country", async () => {
    const result = await sut.execute({
      country: "Invalid country",
      state: "RS",
      city: "Ijui",
      street: "Rua João",
      number: "123",
      addressType: AddressTypeEnum.Residential,
      postalCode: "98700-000",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCountryError);
  });

  it("should not be able to create an address with invalid postal code", async () => {
    const result = await sut.execute({
      country: Country.Brazil,
      state: "RS",
      city: "Ijui",
      street: "Rua João",
      number: "123",
      addressType: AddressTypeEnum.Residential,
      postalCode: "123456",
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPostalCodeError);
  });
});
