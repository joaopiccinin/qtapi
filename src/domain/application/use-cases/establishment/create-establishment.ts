import { Establishment } from "@/domain/enterprise/entities/establishment/establishment";
import { EstablishmentRepository } from "../../repositories/establishment-repository";
import { Either, failure, success } from "@/core/either";
import { Email } from "@/domain/enterprise/entities/commons/value-objects/email";
import { EmailAlreadyInUseError } from "../commons/errors/email-already-in-use-error";
import { InvalidEmailError } from "@/domain/enterprise/entities/commons/value-objects/errors/invalid-email-error";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import {
  CreateAddressUseCase,
  CreateAddressUseCaseRequest,
} from "../address/create-address";
import { InvalidAddressTypeError } from "../address/errors/invalid-address-type-error";
import { CreateEstablishmentAddressUseCase } from "./create-establishment-address";
import { AddressRepository } from "../../repositories/address-repository";
import { EstablishmentAddressRepository } from "../../repositories/establishment-address-repository";
import { InvalidCountryError } from "../address/errors/invalid-country-error";
import { InvalidPostalCodeError } from "@/domain/enterprise/entities/address/value-objects/errors/invalid-postal-code-error";

interface CreateEstablishmentUseCaseRequest {
  name: string;
  email: string;
  phone: string;
  parentEstablishmentId?: string;
  address: CreateAddressUseCaseRequest;
}

type CreateEstablishmentResponse = Either<
  | EmailAlreadyInUseError
  | InvalidEmailError
  | InvalidAddressTypeError
  | InvalidCountryError
  | ResourceNotFoundError
  | InvalidPostalCodeError,
  {
    establishment: Establishment;
  }
>;

export class CreateEstablishmentUseCase {
  constructor(
    private establishmentRepository: EstablishmentRepository,
    private establishmentAddressRepository: EstablishmentAddressRepository,
    private addressRepository: AddressRepository
  ) {}

  async execute(
    request: CreateEstablishmentUseCaseRequest
  ): Promise<CreateEstablishmentResponse> {
    const existingEstablishmentWithEmail =
      await this.establishmentRepository.findByEmail(request.email);

    if (existingEstablishmentWithEmail) {
      return failure(new EmailAlreadyInUseError());
    }

    const emailResult = Email.create({ email: request.email });

    if (emailResult.isFailure()) {
      return failure(emailResult.value);
    }

    const email = emailResult.value.email;

    if (request.parentEstablishmentId) {
      const parentResult = await this.validateParentEstablishment(
        request.parentEstablishmentId
      );
      if (parentResult.isFailure()) {
        return failure(parentResult.value);
      }
    }

    const establishment = Establishment.create({
      name: request.name,
      email: email.toString(),
      phone: request.phone,
      parentEstablishmentId: request.parentEstablishmentId,
      createdAt: new Date(),
    });

    const createAddressUseCase = new CreateAddressUseCase(
      this.addressRepository
    );
    const addressResult = await createAddressUseCase.execute(request.address);
    if (addressResult.isFailure()) {
      return failure(addressResult.value);
    }

    const address = addressResult.value.address;

    const createEstablishmentAddressUseCase =
      new CreateEstablishmentAddressUseCase(
        this.establishmentAddressRepository
      );

    const establishmentAddressResult =
      await createEstablishmentAddressUseCase.execute({
        establishmentId: establishment.id.toString(),
        addressType: request.address.addressType,
        addressId: address.id.toString(),
        isMain: true,
      });

    if (establishmentAddressResult.isFailure()) {
      return failure(establishmentAddressResult.value);
    }

    await this.establishmentRepository.create(establishment);

    return success({ establishment });
  }

  private async validateParentEstablishment(
    parentId: string
  ): Promise<Either<ResourceNotFoundError, null>> {
    const parent = await this.establishmentRepository.findById(parentId);

    if (!parent) {
      return failure(new ResourceNotFoundError());
    }

    return success(null);
  }
}
