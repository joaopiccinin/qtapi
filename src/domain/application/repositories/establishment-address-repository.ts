import { EstablishmentAddress } from "../../enterprise/entities/relationships/establishment-address";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface EstablishmentAddressRepository extends BaseRepository<EstablishmentAddress> {
  findByAddressIdAndEstablishmentId(userId: string, establishmentId: string): Promise<EstablishmentAddress | null>
  findManyByEstablishmentId(establishmentId: string): Promise<EstablishmentAddress[]>
  deleteManyByEstablishmentId(establishmentId: string): Promise<void>
}
