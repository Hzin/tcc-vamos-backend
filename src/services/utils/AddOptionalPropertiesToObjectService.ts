import Itinerary from "../../models/Itinerary";
import Passenger from "../../models/Passenger";
import PassengerRequest from "../../models/PassengerRequest";
import Trip from "../../models/Trip";
import FindItineraryService from "../FindItineraryService";
import FindUserByVehiclePlateService from "../FindUserByVehiclePlateService";
import FindUserService from "../FindUserService";
import FindVehicleService from "../FindVehicleService";

class AddOptionalPropertiesToItineraryObjectService {
  // Itinerary
  private async addPropertiesItinerary(itinerary: Itinerary): Promise<Itinerary> {
    const findVehicleService = new FindVehicleService();
    const findUserService = new FindUserService();

    itinerary.vehicle = await findVehicleService.execute(itinerary.vehicle_plate)
    itinerary.user = await findUserService.execute(itinerary.vehicle.user_id)

    return itinerary
  }

  public async executeSingleItinerary(itinerary: Itinerary): Promise<Itinerary> {
    return this.addPropertiesItinerary(itinerary)
  }

  public async executeArrItinerary(itineraries: Itinerary[]): Promise<Itinerary[]> {
    let newItineraries = itineraries

    for (let i = 0; i < newItineraries.length; i++) {
      const itinerary = newItineraries[i]
      newItineraries[i] = await this.addPropertiesItinerary(itinerary)
    }

    return newItineraries
  }

  // PassengerRequest
  private async addPropertiesPassengerRequest(passengerRequest: PassengerRequest): Promise<PassengerRequest> {
    const findItineraryService = new FindItineraryService()
    const findUserService = new FindUserService()
    const findUserByVehiclePlateService = new FindUserByVehiclePlateService()

    passengerRequest.itinerary = await findItineraryService.execute(passengerRequest.itinerary_id)
    passengerRequest.itinerary.user = await findUserByVehiclePlateService.execute(passengerRequest.itinerary.vehicle_plate)
    passengerRequest.user = await findUserService.execute(passengerRequest.user_id)

    return passengerRequest
  }

  public async executeSinglePassengerRequest(passengerRequest: PassengerRequest): Promise<PassengerRequest> {
    return this.addPropertiesPassengerRequest(passengerRequest)
  }

  public async executeArrPassengerRequest(passengerRequests: PassengerRequest[]): Promise<PassengerRequest[]> {
    let newPassengerRequests = passengerRequests

    for (let i = 0; i < newPassengerRequests.length; i++) {
      const passengerRequest = newPassengerRequests[i]
      newPassengerRequests[i] = await this.addPropertiesPassengerRequest(passengerRequest)
    }

    return newPassengerRequests
  }

  // Passenger
  // duplicado de PassengerRequest
  private async addPropertiesPassenger(passenger: Passenger): Promise<Passenger> {
    const findItineraryService = new FindItineraryService()
    const findUserService = new FindUserService()

    passenger.itinerary = await findItineraryService.execute(passenger.itinerary_id)
    passenger.user = await findUserService.execute(passenger.user_id)

    return passenger
  }

  public async executeSinglePassenger(passenger: Passenger): Promise<Passenger> {
    return this.addPropertiesPassenger(passenger)
  }

  public async executeArrPassenger(passengers: Passenger[]): Promise<Passenger[]> {
    let newPassengers = passengers

    for (let i = 0; i < newPassengers.length; i++) {
      const passenger = newPassengers[i]
      newPassengers[i] = await this.addPropertiesPassenger(passenger)
    }

    return newPassengers
  }

  // Trip
  private async addPropertiesTrip(trip: Trip): Promise<Trip> {
    const findItineraryService = new FindItineraryService()
    const findVehicleService = new FindVehicleService()
    const findUserService = new FindUserService()

    trip.itinerary = await findItineraryService.execute(trip.itinerary_id)
    trip.itinerary.vehicle = await findVehicleService.execute(trip.itinerary.vehicle_plate)
    trip.itinerary.user = await findUserService.execute(trip.itinerary.vehicle.user_id)

    return trip
  }

  public async executeSingleTrip(trip: Trip): Promise<Trip> {
    return this.addPropertiesTrip(trip)
  }

  public async executeArrTrip(trips: Trip[]): Promise<Trip[]> {
    let newTrips = trips

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i]
      newTrips[i] = await this.addPropertiesTrip(trip)
    }

    return newTrips
  }
}

export default AddOptionalPropertiesToItineraryObjectService;
