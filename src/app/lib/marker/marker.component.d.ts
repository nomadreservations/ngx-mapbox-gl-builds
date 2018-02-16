/// <reference types="mapbox-gl" />
import { LngLatLike, Marker, PointLike } from 'mapbox-gl';
import { MapService } from '../map/map.service';
import { ElementRef, OnChanges, OnDestroy, SimpleChanges, AfterViewInit, OnInit } from '@angular/core';
export declare class MarkerComponent implements OnChanges, OnDestroy, AfterViewInit, OnInit {
    private MapService;
    offset?: PointLike;
    feature?: GeoJSON.Feature<GeoJSON.Point>;
    lngLat?: LngLatLike;
    content: ElementRef;
    markerInstance?: Marker;
    constructor(MapService: MapService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    togglePopup(): void;
}
