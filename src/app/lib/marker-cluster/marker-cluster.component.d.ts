import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { MapService } from '../map/map.service';
export declare class PointDirective {
}
export declare class ClusterPointDirective {
}
export declare class MarkerClusterComponent implements OnChanges, OnDestroy, AfterContentInit, OnInit {
    private MapService;
    private ChangeDetectorRef;
    radius?: number;
    maxZoom?: number;
    minZoom?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    reduce?: (accumulated: any, props: any) => void;
    initial?: () => any;
    map?: (props: any) => any;
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    pointTpl: TemplateRef<any>;
    clusterPointTpl: TemplateRef<any>;
    clusterPoints: GeoJSON.Feature<GeoJSON.Point>[];
    private supercluster;
    private sub;
    constructor(MapService: MapService, ChangeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private updateCluster();
}
