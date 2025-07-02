package utils

import (
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

// generates random coordinates
func GenerateRandomCoordinates() (latitude, longitude float64) {
	latitude = 58.35 + rand.Float64()*(58.40-58.35)
	longitude = 26.65 + rand.Float64()*(26.75-26.65)
	return 
}

// simulates moving towards to nearest location 
func MoveTowardsRandomPoint(currentlat, currentlon, speedKmPerSec, intervalSec float64) (newLat, newLon float64) {
	
	distance := speedKmPerSec * intervalSec

	latChange := distance * (rand.Float64()*2 - 1) / 111.0
	lonChange := distance * (rand.Float64()*2 -1) /(111.0 * rand.Float64())

	newLat = currentlat + latChange
	newLon = currentlon + lonChange

	// made for tartu 
	if newLat > 58.45 {newLat = 58.45}
	if newLat < 58.45 {newLat = 58.30}
	if newLon > 26.80 {newLon = 26.80}
	if newLon < 26.60 {newLon = 26.60}

	return newLat, newLon
}
