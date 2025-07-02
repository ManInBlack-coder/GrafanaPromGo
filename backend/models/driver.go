package models

import (
	"fmt"
	"strconv"
)


type Driver struct {
	ID string `json:"id"`
	Latitude float64 `json:"latitude"`
	Longitude float64 `json:"longitude"` 
	Status DriverStatus `json:"status"`
	VechileID string `json:"vechile_id"`
}
// presents driver current status 
type DriverStatus string 

const (
	DriveStatusAvailable DriverStatus = "available"
	DriveStatusOnTrip DriverStatus = "on_trip"
	DriveStatusOffline DriverStatus = "offline"
)

// converts driver struct to string map for redis hash storage
func (d *Driver) ToRedisHash() map[string]string {
	return map[string]string{
		"latitude": strconv.FormatFloat(d.Latitude, 'f', -1, 64),
		"longitude": strconv.FormatFloat(d.Longitude, 'f', -1, 64),
		"status": string(d.Status),
		"vechile_id": d.VechileID,
		//ToDo for future: add last_update if necessary
	}
}
// toJSONSTRING converts Driver structure to JSON str for Pub/Sub 
func (d *Driver) ToJSONString() string {
	return fmt.Sprintf(`{"id":"%s","latitude":%f,"longitude":%f,"status":"%s"}`, 
	d.ID, d.Latitude, d.Longitude, d.Status)
}