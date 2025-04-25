import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import './LawyerConnectionPage.css';

const staticLawyerData = [
    {
        id: 1,
        name: 'Sarah Martinez',
        email: 'smartinez@example.com',
        phone: '(213) 555-0123',
        address: '350 S Grand Ave',  
        city: 'Los Angeles',
        coordinates: [34.0522, -118.2437]
    },
    {
        id: 2,
        name: 'David Kim',
        email: 'dkim@example.com',
        phone: '(310) 555-0234',
        address: '9665 Wilshire Blvd',    
        city: 'Beverly Hills',
        coordinates: [34.0674, -118.4016]
    },
    {
        id: 3,
        name: 'Maria Rodriguez',
        email: 'mrodriguez@example.com',
        phone: '(323) 555-0345',
        address: '3700 Wilshire Blvd',
        city: 'Los Angeles',
        coordinates: [34.0614, -118.3065]
    },
    {
        id: 4,
        name: 'James Chen',
        email: 'jchen@example.com',
        phone: '(626) 555-0456',
        address: '400 S Atlantic Blvd',
        city: 'Monterey Park',
        coordinates: [34.0622, -118.1339]
    },
    {
        id: 5,
        name: 'Emily Wong',
        email: 'ewong@example.com',
        phone: '(818) 555-0567',
        address: '303 N Glenoaks Blvd',
        city: 'Burbank',
        coordinates: [34.1808, -118.3090]
    },
    {
        id: 6,
        name: 'Michael Patel',
        email: 'mpatel@example.com',
        phone: '(424) 555-0678',
        address: '1910 Ocean Way',
        city: 'Santa Monica',
        coordinates: [34.0195, -118.4912]
    },
    {
        id: 7,
        name: 'Lisa Garcia',
        email: 'lgarcia@example.com',
        phone: '(562) 555-0789',
        address: '4400 E Pacific Coast Hwy',
        city: 'Long Beach',
        coordinates: [33.7701, -118.1937]
    },
    {
        id: 8,
        name: 'Robert Lee',
        email: 'rlee@example.com',
        phone: '(949) 555-0890',
        address: '2100 Main Street',
        city: 'Irvine',
        coordinates: [33.6846, -117.8265]
    },
    {
        id: 9,
        name: 'Jennifer Park',
        email: 'jpark@example.com',
        phone: '(213) 555-0901',
        address: '888 S Figueroa St',
        city: 'Los Angeles',
        coordinates: [34.0485, -118.2602]
    },
    {
        id: 10,
        name: 'Thomas Nguyen',
        email: 'tnguyen@example.com',
        phone: '(714) 555-1012',
        address: '500 S Harbor Blvd',
        city: 'Anaheim',
        coordinates: [33.8366, -117.9143]
    },
    {
        id: 11,
        name: 'Amanda Cohen',
        email: 'acohen@example.com',
        phone: '(310) 555-1123',
        address: '1601 Lincoln Blvd',
        city: 'Venice',
        coordinates: [33.9905, -118.4518]
    },
    {
        id: 12,
        name: 'Kevin Santos',
        email: 'ksantos@example.com',
        phone: '(323) 555-1234',
        address: '5757 Wilshire Blvd',
        city: 'Los Angeles',
        coordinates: [34.0620, -118.3527]
    }
];

const LawyerConnectionPage = () => {
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyLawyers, setNearbyLawyers] = useState(staticLawyerData);
    const [locationError, setLocationError] = useState(null);
    const mapRef = useRef();
    const mapElement = useRef();
    const popupRef = useRef();
    const [popup, setPopup] = useState(null);
    const [isLocating, setIsLocating] = useState(true);
    const [selectedLawyerId, setSelectedLawyerId] = useState(null);
    const markerLayerRef = useRef(null);

    useEffect(() => {
        // Initialize map
        const map = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([-98.5795, 39.8283]), // US center
                zoom: 4
            })
        });
        mapRef.current = map;

        // Create popup overlay
        const overlay = new Overlay({
            element: popupRef.current,
            positioning: 'bottom-center',
            offset: [0, -20],
            stopEvent: false
        });
        
        mapRef.current.addOverlay(overlay);
        setPopup(overlay);

        // Get user location
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    findNearbyLawyers(latitude, longitude);
                    
                    // Center map on user location
                    map.getView().animate({
                        center: fromLonLat([longitude, latitude]),
                        zoom: 10
                    });

                    // Add markers for lawyers and user
                    addMapMarkers(map, latitude, longitude);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Unable to get your location. Showing all available lawyers.");
                    setIsLocating(false);
                }
            );
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.setTarget(undefined);
            }
            if (overlay) {
                mapRef.current.removeOverlay(overlay);
            }
        };
    }, []);

    const findNearbyLawyers = (userLat, userLon) => {
        const lawyersWithDistance = staticLawyerData.map(lawyer => ({
            ...lawyer,
            distance: calculateDistance(
                userLat,
                userLon,
                lawyer.coordinates[0],
                lawyer.coordinates[1]
            )
        }));

        // Sort lawyers by distance
        const sortedLawyers = lawyersWithDistance.sort((a, b) => a.distance - b.distance);
        setNearbyLawyers(sortedLawyers);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const toRad = (value) => {
        return value * Math.PI / 180;
    };

    const addMapMarkers = (map, userLat, userLng) => {
        // Remove existing marker layer
        if (markerLayerRef.current) {
            map.removeLayer(markerLayerRef.current);
        }

        const userStyle = new Style({
            image: new Icon({
                src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="8" fill="%232196F3"/></svg>',
                scale: 1.5,
                anchor: [0.5, 0.5]
            })
        });

        const getLawyerStyle = (isSelected) => new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                scale: isSelected ? 0.09 : 0.07,
                color: isSelected ? '#FF4444' : '#4CAF50'
            })
        });

        const markers = new VectorLayer({
            source: new VectorSource()
        });
        markerLayerRef.current = markers;

        // Add user location marker
        const userFeature = new Feature({
            geometry: new Point(fromLonLat([userLng, userLat])),
            type: 'user'
        });
        userFeature.setStyle(userStyle);

        // Add all lawyer markers with appropriate styles
        const lawyerFeatures = nearbyLawyers.map(lawyer => {
            const feature = new Feature({
                geometry: new Point(fromLonLat([lawyer.coordinates[1], lawyer.coordinates[0]])),
                type: 'lawyer',
                lawyer: lawyer
            });
            feature.setStyle(getLawyerStyle(lawyer.id === selectedLawyerId));
            return feature;
        });

        markers.getSource().addFeatures([userFeature, ...lawyerFeatures]);
        map.addLayer(markers);
    };

    useEffect(() => {
        if (mapRef.current && popup) {
            mapRef.current.on('pointermove', (evt) => {
                const feature = mapRef.current.forEachFeatureAtPixel(evt.pixel, feature => feature);
                if (feature && feature.get('type') === 'lawyer') {
                    const lawyer = feature.get('lawyer');
                    popup.setPosition(evt.coordinate);
                    popupRef.current.innerHTML = `
                        <div class="ol-popup">
                            <div class="popup-title">${lawyer.name}</div>
                            <div class="popup-info">📍 ${lawyer.city}</div>
                            <div class="popup-info popup-phone">📞 ${lawyer.phone}</div>
                            <div class="popup-info">✉️ ${lawyer.email}</div>
                        </div>
                    `;
                    popupRef.current.style.display = 'block';
                } else {
                    popupRef.current.style.display = 'none';
                }
            });
        }
    }, [popup]);

    useEffect(() => {
        if (mapRef.current && userLocation) {
            addMapMarkers(mapRef.current, userLocation.lat, userLocation.lng);
        }
    }, [selectedLawyerId]);

    const zoomToLocation = (coordinates) => {
        if (mapRef.current) {
            mapRef.current.getView().animate({
                center: fromLonLat(coordinates),
                zoom: 12,
                duration: 1000
            });
        }
    };

    const resetToUserLocation = () => {
        if (userLocation) {
            mapRef.current.getView().animate({
                center: fromLonLat([userLocation.lng, userLocation.lat]),
                zoom: 10,
                duration: 1000
            });
        }
    };

    return (
        <div className="h-screen flex flex-col">    
            <Modal show={isLocating} centered backdrop="static" className="rounded-3">
                <Modal.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <h5 className="mb-0">Getting your location...</h5>
                    <p className="text-muted">(Please allow the location access).</p>
                </Modal.Body>
            </Modal>
            <div className="flex flex-1 overflow-hidden">
                {/* Map Section */}
                <div className="w-2/3">
                    <div className="h-full relative touch-none" ref={mapElement}>
                        <div ref={popupRef} className="ol-popup hidden"></div>
                        <button 
                            onClick={resetToUserLocation}
                            className="absolute bottom-8 right-8 z-10 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            title="Locate Me"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Lawyers List Section */}
                <div className="w-1/3 flex flex-col">
                    <div className="p-4 bg-white border-b shadow-sm">
                        <h2 className="text-2xl font-bold">Find Nearby Immigration Lawyers</h2>
                        {locationError && (
                            <p className="text-yellow-600 mt-2">{locationError}</p>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="lawyer-list p-4 space-y-4">
                            {nearbyLawyers.map(lawyer => (
                                <Link 
                                    to={`/lawyer/${lawyer.id}`}
                                    key={lawyer.id}
                                    className={`lawyer-card p-4 border rounded block transition-all ${
                                        selectedLawyerId === lawyer.id 
                                            ? 'bg-blue-50 border-blue-500 shadow-lg' 
                                            : 'hover:shadow-lg'
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedLawyerId(
                                            selectedLawyerId === lawyer.id ? null : lawyer.id
                                        );
                                        zoomToLocation([...lawyer.coordinates].reverse());
                                    }}
                                >
                                    <h3 className="text-xl font-semibold">{lawyer.name}</h3>
                                    <p>{lawyer.city}</p>
                                    {lawyer.distance && (
                                        <p className="text-sm text-gray-600">
                                            {lawyer.distance.toFixed(1)} km away
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default LawyerConnectionPage;