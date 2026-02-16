export interface VehicleInterface {
    _id?: string;
    name: string,
    model: string,
    plate: string,
    location?: {
        lat: number;
        lng: number;
    },
    events?: []
}
