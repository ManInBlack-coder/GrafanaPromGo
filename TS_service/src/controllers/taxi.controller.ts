import { Request, Response } from "express";
import { RedisModel } from '../models/redis.model';


export const TaxiController = {
    async getNearbyTaxis(req: Request, res:Response) {
        try {
            const {latitude, longitude, radius} = req.query;

            if (!latitude || !longitude || !radius) {
                return res.status(400).json({message: 'Missing required query params'});
            }

            const lat = parseFloat(latitude as string);
            const lon = parseFloat(longitude as string);
            const r = parseFloat(radius as string);

            if (isNaN(lat) || isNaN(lon) || isNaN(r)) {
                return res.status(400).json({message:' invalid numeric parameters '})
            }

            const nearbyTaxis = await RedisModel.getNearbyDrivers(lat, lon, r);
            return res.status(200).json(nearbyTaxis);
        } catch (error) {
            console.error('Error fetching nearby taxis', error);
            return res.status(500).json({message:'Internal server error'});
        }
    },
}