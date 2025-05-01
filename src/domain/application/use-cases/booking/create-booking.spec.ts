import { InMemoryBookingRepository } from "test/repositories/in-memory-booking-repository";
import { InMemoryCourtRepository } from "test/repositories/in-memory-court-repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository";
import { CreateBookingUseCase } from "./create-booking";
import { makeUser } from "test/factories/make-user";
import { makeCourt } from "test/factories/make-court";
import { Booking } from "@/domain/enterprise/entities/booking/booking";
import { ResourceNotFoundError } from "@/core/errors/commons/resource-not-found-error";
import { BookingTimeConflictError } from "./errors/booking-time-conflict-error";
import { InvalidDateRangeError } from "../commons/errors/invalid-date-range-error";
import { BookingStatusEnum } from "@/domain/enterprise/entities/booking/enum/booking-status.enum";
import { makeBooking } from "test/factories/make-booking";

let inMemoryBookingRepository: InMemoryBookingRepository;
let inMemoryCourtRepository: InMemoryCourtRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: CreateBookingUseCase;

describe("Create Booking", () => {
  beforeEach(() => {
    inMemoryBookingRepository = new InMemoryBookingRepository();
    inMemoryCourtRepository = new InMemoryCourtRepository();
    inMemoryUserRepository = new InMemoryUserRepository();

    sut = new CreateBookingUseCase(
      inMemoryBookingRepository,
      inMemoryCourtRepository,
      inMemoryUserRepository
    );
  });

  it("should be able to create a booking", async () => {
    const user = makeUser();
    const court = makeCourt();

    await inMemoryUserRepository.create(user);
    await inMemoryCourtRepository.create(court);

    const startTime = new Date("2025-04-19T10:00:00Z");
    const endTime = new Date("2025-04-19T11:00:00Z");

    const result = await sut.execute({
      courtId: court.id.toString(),
      userId: user.id.toString(),
      startTime,
      endTime,
    });

    expect(result.isSuccess()).toBe(true);

    const { booking } = result.value as { booking: Booking };

    expect(booking).toEqual(
      expect.objectContaining({
        courtId: court.id,
        userId: user.id,
        establishmentId: court.establishmentId,
        startTime,
        endTime,
        createdAt: expect.any(Date),
      })
    );
  });

  it("should not create a booking if the user does not exist", async () => {
    const court = makeCourt();
    await inMemoryCourtRepository.create(court);

    const result = await sut.execute({
      courtId: court.id.toString(),
      userId: "non-existent-user",
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not create a booking if the court does not exist", async () => {
    const user = makeUser();
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      courtId: "non-existent-court",
      userId: user.id.toString(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not create a booking with invalid date range", async () => {
    const user = makeUser();
    const court = makeCourt();

    await inMemoryUserRepository.create(user);
    await inMemoryCourtRepository.create(court);

    const startTime = new Date("2025-04-19T11:00:00Z");
    const endTime = new Date("2025-04-19T10:00:00Z");

    const result = await sut.execute({
      courtId: court.id.toString(),
      userId: user.id.toString(),
      startTime,
      endTime,
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidDateRangeError);
  });

  it("should not create a booking if there is a time conflict", async () => {
    const user = makeUser();
    const court = makeCourt();

    await inMemoryUserRepository.create(user);
    await inMemoryCourtRepository.create(court);

    const startTime = new Date("2025-04-19T10:00:00Z");
    const endTime = new Date("2025-04-19T11:00:00Z");

    const booking = makeBooking({
      courtId: court.id,
      userId: user.id,
      establishmentId: court.establishmentId,
      startTime,
      endTime,
      status: BookingStatusEnum.SCHEDULED,
      createdAt: new Date(),
    });

    await inMemoryBookingRepository.create(booking);

    const result = await sut.execute({
      courtId: court.id.toString(),
      userId: user.id.toString(),
      startTime: new Date("2025-04-19T10:30:00Z"),
      endTime: new Date("2025-04-19T11:30:00Z"),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(BookingTimeConflictError);
  });
});
