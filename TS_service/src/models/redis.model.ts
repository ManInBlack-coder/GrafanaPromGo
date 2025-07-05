import { redisClient } from '../services/redisPubSub.service'; // Kasutame tavalist Redis klienti

interface TaxiLocation {
    id: string;
    latitude: number;
    longitude: number;
    status: 'available' | 'on_trip' | 'offline';
    vechile_id: string;
}

const DRIVER_LOCATION_KEY_PREFIX = 'driver';

export const RedisModel = {
    async getDriverLocation(driverId: string): Promise<TaxiLocation | null> {
        const key = `${DRIVER_LOCATION_KEY_PREFIX}${driverId}:location`;
        const result = await redisClient.hGetAll(key);
        if (Object.keys(result).length === 0) {
             return null;
        } 
        return {
            id: driverId,
            latitude: parseFloat(result.latitude),
            longitude: parseFloat(result.longitude),
            status: result.status as TaxiLocation['status'],
            vechile_id: result.vechile_id, 
        };
    },
    async setDRiverLocation(taxi:TaxiLocation): Promise<void> {
        const key =  `${DRIVER_LOCATION_KEY_PREFIX}${taxi.id}:location`;
        await redisClient.hSet(key, {
            latitude: taxi.latitude.toString(),
            longitude: taxi.longitude.toString(),
            status: taxi.status,
            vechile_id: taxi.vechile_id,
        });
    },



    async getNearbyDrivers(latitude:number, longitude:number, radiusKm:number): Promise<TaxiLocation[]> {
        const availableDrivers: TaxiLocation[] = [];

        const pattern = `${DRIVER_LOCATION_KEY_PREFIX}*:location`;
        let cursor = '0';
        do {
            const reply = await redisClient.scan(cursor, {MATCH: pattern, COUNT: 100});
            cursor = reply.cursor;
            for (const key of reply.keys) {
                const driverId = key.split(':')[1];
                const taxi = await RedisModel.getDriverLocation(driverId);
                if (taxi && taxi.status === 'available') {
                    availableDrivers.push(taxi)
                }
            }
        } while (cursor !== '0');
        return availableDrivers;

    }



    
}