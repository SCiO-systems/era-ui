import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import './styles.css';

const MapComponent = (props) => {
	const { latLng } = props;
	const [map, setMap] = useState(null);
	const markerRef = useRef();

	const mapRef = (element) => {
		setMap(element);
	};

	useEffect(() => {
		if (!map) return;
		if (!latLng) return;

		const currentLatLng = markerRef.current?.getLatLng();
		if (currentLatLng?.lat !== latLng[0] || currentLatLng?.lng !== latLng[1]) {
			map.setView(latLng, 10);
			addMarker();
		}
	}, [latLng]);

	const addMarker = () => {
		if (!markerRef.current) {
			const customIcon = L.divIcon({
				className: 'custom-div-icon',
				html: '<i class=\'fa-solid fa-location-dot\'>',
				iconSize: [30, 42],
				iconAnchor: [15, 42],
			});
			const marker = L.marker(latLng, { icon: customIcon, zIndexOffset: 10000 });
			marker.addTo(map);
			markerRef.current = marker;
		} else {
			markerRef.current.setLatLng(latLng);
		}
	};

	useEffect(
		() => {
			if (!map) return;
			map.createPane(`pane-0`);
			map.getPane(`pane-0`).style.zIndex = 399;
			map.zoomControl.setPosition('topleft');
			map.options.maxZoom = 14;
		}, [map]
	);

	return (
		<div className="map-container">
			<MapContainer
				ref={mapRef}
				scrollWheelZoom
				center={{ lat: 51.505, lng: -0.09 }}
				zoom={5}
			>
				<TileLayer
					attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
					url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
				/>
			</MapContainer>
		</div>
	);
};

export default MapComponent;
