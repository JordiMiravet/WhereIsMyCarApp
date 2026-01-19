export interface VehicleInterface {
    name: string,
    model: string,
    plate: string,
    location?: {
        lat: number;
        lng: number;
    },
    
}
