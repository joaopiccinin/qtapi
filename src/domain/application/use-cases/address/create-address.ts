import { AddressRepository } from "../../repositories/address-repository";
import { Either, failure, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { Address } from "@/domain/enterprise/entities/address/address";
import { InvalidPostalCodeError } from "@/domain/enterprise/entities/address/value-objects/errors/invalid-postal-code-error";
import { PostalCode } from "@/domain/enterprise/entities/address/value-objects/postal-code";
import { PostalCodeLocale } from "validator";
import { InvalidCountryError } from "./errors/invalid-country-error";
import { Country } from "../utils/enums/country";

export interface CreateAddressUseCaseRequest {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  complement?: string;
  postalCode: string;
  addressType: string;
}

type CreateAddressResponse = Either<
  ResourceNotFoundError | InvalidPostalCodeError | InvalidCountryError,
  {
    address: Address;
  }
>;

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    request: CreateAddressUseCaseRequest
  ): Promise<CreateAddressResponse> {
    const country = this.isPostalCodeLocale(request.country)
      ? request.country
      : null;

    if (!country) {
      return failure(new InvalidCountryError());
    }

    const postalCodeResult = PostalCode.create({
      postalcode: request.postalCode.toString(),
      country: country,
    });

    if (postalCodeResult.isFailure()) {
      return failure(postalCodeResult.value);
    }

    const postalCode = postalCodeResult.value.postalcode;

    const address = Address.create({
      country: request.country,
      state: request.state,
      city: request.city,
      street: request.street,
      number: request.number,
      complement: request.complement,
      postalCode: postalCode.toString(),
      createdAt: new Date(),
    });

    await this.addressRepository.create(address);

    return success({ address });
  }

  isPostalCodeLocale(country: string): country is PostalCodeLocale {
    return Object.values(Country).includes(country as Country);
  }
}
