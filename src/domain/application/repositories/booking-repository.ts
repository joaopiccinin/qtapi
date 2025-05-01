import { Booking } from "@/domain/enterprise/entities/booking/booking";
import { BaseRepository } from "./base-repository";
//TODO: It have to be an abstract class when we will start the server using node
export interface BookingRepository extends BaseRepository<Booking> {
  existsBookingInRange(
    courtId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean>;
}
