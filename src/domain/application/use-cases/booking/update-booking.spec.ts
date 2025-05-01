import { InMemoryBookingRepository } from "test/repositories/in-memory-booking-repository";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { makeBooking } from "test/factories/make-booking";
import { UpdateBookingUseCase } from "./update-booking";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";

let inMemoryBookingRepository: InMemoryBookingRepository;
let sut: UpdateBookingUseCase;

describe("Update Booking", () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();

    sut = new UpdateBookingUseCase(inMemoryBookingRepository);
  });

  it("should be able to update a booking", async () => {
    const booking = makeBooking({ status: BookingStatusEnum.SCHEDULED });
    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute(booking.id.toString(), {
      status: BookingStatusEnum.CANCELLED,
    });

    expect(result.isSuccess()).toBe(true);

    expect(booking.status).toBe(BookingStatusEnum.CANCELLED);
  });

  it("should not update a booking if it does not exist", async () => {
    const result = await sut.execute("non-existent-booking", {
      status: BookingStatusEnum.CANCELLED,
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
