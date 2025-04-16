import { Address } from "../../enterprise/entities/address/address";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface AddressRepository extends BaseRepository<Address> {}
