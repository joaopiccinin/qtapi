import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Address, AddressProps } from "@/domain/enterprise/entities/address/address";
import { Country } from "@/domain/application/use-cases/utils/enums/country";

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID
) {
  const address = Address.create(
    {
      city: 'Ijui',
      state: 'RS',
      country: Country.Brazil,
      street: 'Rua sei la',
      number: '21',
      postalCode: '98700000',
      ...override,
    },
    id
  );

  return address;
}