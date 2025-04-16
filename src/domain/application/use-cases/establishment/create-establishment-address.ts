import { Either, failure, success } from "@/core/either";
import { EstablishmentAddress } from "@/domain/enterprise/entities/relationships/establishment-address";
import { AddressTypeEnum } from "@/domain/enterprise/entities/address/address-type";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InvalidAddressTypeError } from "../address/errors/invalid-address-type-error";
import { EstablishmentAddressRepository } from "../../repositories/establishment-address-repository";

interface CreateEstablishmentAddressRequest {
  establishmentId: string;
  addressType: string;
  addressId: string;
  isMain: boolean;
}

type CreateEstablishmentAddressResponse = Either<
  InvalidAddressTypeError,
  {
    establishmentAddress: EstablishmentAddress;
  }
>;

export class CreateEstablishmentAddressUseCase {
  constructor(private establishmentAddressRepository: EstablishmentAddressRepository) {}
  async execute(
    request: CreateEstablishmentAddressRequest
  ): Promise<CreateEstablishmentAddressResponse> {
    if (!(request.addressType in AddressTypeEnum)) {
      return failure(new InvalidAddressTypeError());
    }

    const addressType = request.addressType as AddressTypeEnum;

    const establishmentAddress = EstablishmentAddress.create({
      addressId: new UniqueEntityID(request.addressId),
      establishmentId: new UniqueEntityID(request.establishmentId),
      addressType,
      isMain: request.isMain,
      createdAt: new Date(),
    });

    this.establishmentAddressRepository.create(establishmentAddress);
    return success({ establishmentAddress });
  }
}
