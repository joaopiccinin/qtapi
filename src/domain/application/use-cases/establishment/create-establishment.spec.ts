import { InMemoryEstablishmentRepository } from "test/repositories/in-memory-establishment-repository";
import { CreateEstablishmentUseCase } from "./create-establishment";
import { Establishment } from "@/domain/enterprise/entities/establishment/establishment";
import { InvalidEmailError } from "@/domain/enterprise/entities/commons/value-objects/errors/invalid-email-error";
import { EmailAlreadyInUseError } from "../commons/errors/email-already-in-use-error";
import { makeEstablishment } from "test/factories/make-establishment";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { InMemoryEstablishmentAddressRepository } from "test/repositories/in-memory-establishment-address-repository";
import { InMemoryAddressRepository } from "test/repositories/in-memory-address-repository";
import { Country } from "../utils/enums/country";

let inMemoryEstablishmentRepository: InMemoryEstablishmentRepository;
let inMemoryEstablishmentAddressRepository: InMemoryEstablishmentAddressRepository;
let inMemoryAddressRepository: InMemoryAddressRepository;
let sut: CreateEstablishmentUseCase;

describe("Create Establishment", () => {
  beforeEach(() => {
    inMemoryEstablishmentRepository = new InMemoryEstablishmentRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryEstablishmentAddressRepository =
      new InMemoryEstablishmentAddressRepository();

    sut = new CreateEstablishmentUseCase(
      inMemoryEstablishmentRepository,
      inMemoryEstablishmentAddressRepository,
      inMemoryAddressRepository
    );
  });

  it("should be able to create an establishment", async () => {
    const result = await sut.execute({
      name: "Loja tal",
      email: "lojatal@gmail.com",
      phone: "123456789",
      address: {
        country: Country.Brazil,
        state: "SP",
        city: "São Paulo",
        street: "Rua do Bosque",
        number: "123",
        complement: "Apto 203",
        postalCode: "01234-567",
        addressType: "Residential",
      },
    });

    expect(result.isSuccess()).toBe(true);

    const { establishment } = result.value as { establishment: Establishment };

    expect(establishment).toEqual(
      expect.objectContaining({
        name: "Loja tal",
        email: "lojatal@gmail.com",
        phone: "123456789",
        createdAt: expect.any(Date),
      })
    );

    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(1);
    expect(inMemoryAddressRepository.items.length).toBe(1);
  });

  it("should not be able to create an establishment with an email that is already in use", async () => {
    const establishment = makeEstablishment({ email: "lojatal@gmail.com" });
    await inMemoryEstablishmentRepository.create(establishment);

    const result = await sut.execute({
      name: "Loja tal",
      email: "lojatal@gmail.com",
      phone: "123456789",
      address: {
        country: Country.Brazil,
        state: "SP",
        city: "São Paulo",
        street: "Rua do Bosque",
        number: "123",
        complement: "Apto 203",
        postalCode: "01234-567",
        addressType: "Residential",
      },
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError);
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(0);
    expect(inMemoryAddressRepository.items.length).toBe(0);
  });

  it("should not be able to create an establishment with an invalid email", async () => {
    const result = await sut.execute({
      name: "Loja tal",
      email: "lojatalgmail.com",
      phone: "123456789",
      address: {
        country: Country.Brazil,
        state: "SP",
        city: "São Paulo",
        street: "Rua do Bosque",
        number: "123",
        complement: "Apto 203",
        postalCode: "01234-567",
        addressType: "Residential",
      },
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(0);
    expect(inMemoryAddressRepository.items.length).toBe(0);
  });

  it("should be able to create an establishment with a parent establishment", async () => {
    const establishment = makeEstablishment({
      name: "Loja Tal",
      email: "lojatal@gmail.com",
    });

    await inMemoryEstablishmentRepository.create(establishment);

    const result = await sut.execute({
      name: "Loja tal Filial",
      email: "lojatalfilial@gmail.com",
      phone: "123456789",
      parentEstablishmentId: establishment.id.toString(),
      address: {
        country: Country.Brazil,
        state: "SP",
        city: "São Paulo",
        street: "Rua do Bosque",
        number: "123",
        complement: "Apto 203",
        postalCode: "01234-567",
        addressType: "Residential",
      },
    });

    expect(result.isSuccess()).toBe(true);

    const { establishment: createdEstablishment } = result.value as {
      establishment: Establishment;
    };

    expect(createdEstablishment).toEqual(
      expect.objectContaining({
        name: "Loja tal Filial",
        email: "lojatalfilial@gmail.com",
        phone: "123456789",
        parentEstablishmentId: establishment.id.toString(),
        createdAt: expect.any(Date),
      })
    );
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(1);
    expect(inMemoryAddressRepository.items.length).toBe(1);
  });

  it("should not be able to create an establishment with an invalid parent establishment", async () => {
    const result = await sut.execute({
      name: "Loja tal Filial",
      email: "lojatalfilial@gmail.com",
      phone: "123456789",
      parentEstablishmentId: "inexistent-establishment",
      address: {
        country: Country.Brazil,
        state: "SP",
        city: "São Paulo",
        street: "Rua do Bosque",
        number: "123",
        complement: "Apto 203",
        postalCode: "01234-567",
        addressType: "Residential",
      },
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryEstablishmentAddressRepository.items.length).toBe(0);
    expect(inMemoryAddressRepository.items.length).toBe(0);
  });
});
