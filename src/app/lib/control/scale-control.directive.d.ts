import { OnInit } from '@angular/core';
import { MapService } from '../map/map.service';
import { ControlComponent } from './control.component';
export declare class ScaleControlDirective implements OnInit {
    private MapService;
    private ControlComponent;
    maxWidth?: number;
    unit?: 'imperial' | 'metric' | 'nautical';
    constructor(MapService: MapService, ControlComponent: ControlComponent);
    ngOnInit(): void;
}
