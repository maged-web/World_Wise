import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexst/CityContext';
import { useGeolocation } from '../Hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

export default function Map() {
    const [mapPosition, setMapPosition] = useState([40, 0])
    const { cities } = useCities();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading: isLoadingPostion, position: geoLocationPosition, getPosition } = useGeolocation();
    const [mapLat, mapLng] = useUrlPosition()
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    console.log(setSearchParams)
    useEffect(function () {
        if (lat && lng) setMapPosition([lat, lng])
    }, [lat, lng])

    useEffect(function () {
        if (mapLat && mapLng)
            setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng])
    }, [geoLocationPosition])
    return (
        <div className={styles.mapContainer} >
            {!geoLocationPosition && <Button type='position' onClick={getPosition}>
                {isLoadingPostion ? 'Loading...' : 'Use your position'}
            </Button>}
            <MapContainer center={mapPosition}
                // center={[lat, lng]}
                zoom={6} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(city => <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                    <Popup>
                        <span>{city.emoji}</span> <span>{city.cityName}</span>
                    </Popup>
                </Marker>)}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap()
    map.setView(position)
    return null
}
function DetectClick() {
    const navigate = useNavigate()
    useMapEvents({
        click: (e) =>
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}