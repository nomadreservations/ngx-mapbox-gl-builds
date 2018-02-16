/// <reference types="mapbox-gl" />
import { EventData, FlyToOptions, LngLatBoundsLike, LngLatLike, Map, MapBoxZoomEvent, MapMouseEvent, MapTouchEvent, PaddingOptions, PointLike, Style } from 'mapbox-gl';
import { MapService } from './map.service';
import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MapEvent } from './map.types';
declare global  {
    namespace mapboxgl {
        interface MapboxOptions {
            failIfMajorPerformanceCaveat?: boolean;
            transformRequest?: Function;
            localIdeographFontFamily?: string;
            pitchWithRotate?: boolean;
        }
    }
}
export declare class MapComponent implements OnChanges, OnDestroy, AfterViewInit, MapEvent {
    private MapService;
    accessToken?: string;
    customMapboxApiUrl?: string;
    hash?: boolean;
    refreshExpiredTiles?: boolean;
    failIfMajorPerformanceCaveat?: boolean;
    classes?: string[];
    bearingSnap?: number;
    interactive?: boolean;
    pitchWithRotate?: boolean;
    attributionControl?: boolean;
    logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    maxTileCacheSize?: number;
    localIdeographFontFamily?: string;
    preserveDrawingBuffer?: boolean;
    renderWorldCopies?: boolean;
    trackResize?: boolean;
    transformRequest?: Function;
    minZoom?: number;
    maxZoom?: number;
    scrollZoom?: boolean;
    dragRotate?: boolean;
    touchZoomRotate?: boolean;
    doubleClickZoom?: boolean;
    keyboard?: boolean;
    dragPan?: boolean;
    boxZoom?: boolean;
    style: Style | string;
    center?: LngLatLike;
    maxBounds?: LngLatBoundsLike;
    zoom?: [number];
    bearing?: [number];
    pitch?: [number];
    movingMethod: 'jumpTo' | 'easeTo' | 'flyTo';
    fitBounds?: LngLatBoundsLike;
    fitBoundsOptions?: {
        linear?: boolean;
        easing?: Function;
        padding?: number | PaddingOptions;
        offset?: PointLike;
        maxZoom?: number;
    };
    flyToOptions?: FlyToOptions;
    centerWithPanTo?: boolean;
    cursorStyle?: string;
    resize: EventEmitter<void>;
    remove: EventEmitter<void>;
    mouseDown: EventEmitter<MapMouseEvent>;
    mouseUp: EventEmitter<MapMouseEvent>;
    mouseMove: EventEmitter<MapMouseEvent>;
    click: EventEmitter<MapMouseEvent>;
    dblClick: EventEmitter<MapMouseEvent>;
    mouseEnter: EventEmitter<MapMouseEvent>;
    mouseLeave: EventEmitter<MapMouseEvent>;
    mouseOver: EventEmitter<MapMouseEvent>;
    mouseOut: EventEmitter<MapMouseEvent>;
    contextMenu: EventEmitter<MapMouseEvent>;
    touchStart: EventEmitter<MapTouchEvent>;
    touchEnd: EventEmitter<MapTouchEvent>;
    touchMove: EventEmitter<MapTouchEvent>;
    touchCancel: EventEmitter<MapTouchEvent>;
    moveStart: EventEmitter<DragEvent>;
    move: EventEmitter<MapMouseEvent | MapTouchEvent>;
    moveEnd: EventEmitter<DragEvent>;
    dragStart: EventEmitter<DragEvent>;
    drag: EventEmitter<MapMouseEvent | MapTouchEvent>;
    dragEnd: EventEmitter<DragEvent>;
    zoomStart: EventEmitter<MapMouseEvent | MapTouchEvent>;
    zoomEvt: EventEmitter<MapMouseEvent | MapTouchEvent>;
    zoomEnd: EventEmitter<MapMouseEvent | MapTouchEvent>;
    rotateStart: EventEmitter<MapMouseEvent | MapTouchEvent>;
    rotate: EventEmitter<MapMouseEvent | MapTouchEvent>;
    rotateEnd: EventEmitter<MapMouseEvent | MapTouchEvent>;
    pitchStart: EventEmitter<EventData>;
    pitchEvt: EventEmitter<EventData>;
    pitchEnd: EventEmitter<EventData>;
    boxZoomStart: EventEmitter<MapBoxZoomEvent>;
    boxZoomEnd: EventEmitter<MapBoxZoomEvent>;
    boxZoomCancel: EventEmitter<MapBoxZoomEvent>;
    webGlContextLost: EventEmitter<void>;
    webGlContextRestored: EventEmitter<void>;
    load: EventEmitter<any>;
    render: EventEmitter<void>;
    error: EventEmitter<any>;
    data: EventEmitter<EventData>;
    styleData: EventEmitter<EventData>;
    sourceData: EventEmitter<EventData>;
    dataLoading: EventEmitter<EventData>;
    styleDataLoading: EventEmitter<EventData>;
    sourceDataLoading: EventEmitter<EventData>;
    readonly mapInstance: Map;
    mapContainer: ElementRef;
    constructor(MapService: MapService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
