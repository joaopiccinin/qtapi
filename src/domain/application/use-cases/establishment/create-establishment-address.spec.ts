import { AddressTypeEnum } from "@/domain/enterprise/entities/address/address-type";
import { makeAddress } from "test/factories/make-address";
import { makeEstablishment } from "test/factories/make-establishment";
import { InMemoryEstablishmentAddressRepository } from "test/repositories/in-memory-establishment-address-repository";
import { InvalidAddressTypeError } from "../address/errors/invalid-address-type-error";
import { CreateEstablishmentAddressUseCase } from "./create-establishment-address";


let inMemoryEstablishmentAddressRepository: InMemoryEstablishmentAddressRepository;
let sut: CreateEstablishmentAddressUseCase;

describe("Create Establishment", () => {
  beforeEach(() => {
    inMemoryEstablishmentAddressRepository =
      new InMemoryEstablishmentAddressRepository();

    sut = new CreateEstablishmentAddressUseCase(
      inMemoryEstablishmentAddressRepository,
    );
  });

  it("should be able to create an establishment address", async () => {
    const address = makeAddress()
    const establishment = makeEstablishment();

    const result = await sut.execute({
      addressId: address.id.toString(),
      establishmentId: establishment.id.toString(),
      addressType: AddressTypeEnum.Residential,
      isMain: true,
    });

    expect(result.isSuccess()).toBe(true);
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(1);
  });

  it("should not be able to create an establishment address with an invalid address type", async () => {
    const address = makeAddress()
    const establishment = makeEstablishment();

    const result = await sut.execute({
      addressId: address.id.toString(),
      establishmentId: establishment.id.toString(),
      addressType: 'InvalidAddressType',
      isMain: true,
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAddressTypeError);
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(0);
  });
});
