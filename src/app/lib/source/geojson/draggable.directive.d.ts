/// <reference types="mapbox-gl" />
import { OnDestroy, OnInit, EventEmitter, NgZone } from '@angular/core';
import { MapMouseEvent } from 'mapbox-gl';
import { LayerComponent } from '../../layer/layer.component';
import { MapService } from '../../map/map.service';
import { FeatureComponent } from './feature.component';
export declare class DraggableDirective implements OnInit, OnDestroy {
    private MapService;
    private FeatureComponent;
    private NgZone;
    source: LayerComponent;
    dragStart: EventEmitter<MapMouseEvent>;
    dragEnd: EventEmitter<MapMouseEvent>;
    drag: EventEmitter<MapMouseEvent>;
    private destroyed$;
    constructor(MapService: MapService, FeatureComponent: FeatureComponent, NgZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
