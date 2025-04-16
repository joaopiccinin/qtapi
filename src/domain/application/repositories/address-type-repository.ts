import { AddressType } from "../../enterprise/entities/address/address-type";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface AddressTypeRepository extends BaseRepository<AddressType> {}
