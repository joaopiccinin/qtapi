import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CourtProps, Court } from "@/domain/enterprise/entities/court/court";
import { CourtLocationTypeEnum } from "@/domain/enterprise/entities/court/enum/court-location-type.enum";
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
      locationType: CourtLocationTypeEnum.COVERED,
      bookingDurationMinutes: 30,
      ...override,
    },
    id
  );

  return court;
}
