import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CourtProps, Court } from "@/domain/enterprise/entities/court/court";
import { CourtTypeEnum } from "@/domain/enterprise/entities/court/enum/court-type.enum";

export function makeCourt(
  override: Partial<CourtProps> = {},
  id?: UniqueEntityID
) {
  const court = Court.create(
    {
      name: "Quadra 1",
      type: CourtTypeEnum.SOCIETY,
      establishmentId: new UniqueEntityID(),
      ...override,
    },
    id
  );

  return court;
}
