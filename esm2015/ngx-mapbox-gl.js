import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, EventEmitter, Host, Inject, Injectable, InjectionToken, Input, NgModule, NgZone, Optional, Output, TemplateRef, ViewChild, forwardRef } from '@angular/core';
import { AttributionControl, FullscreenControl, GeolocateControl, Map, Marker, NavigationControl, Popup, ScaleControl } from 'mapbox-gl';
import * as MapboxGl from 'mapbox-gl';
import { __awaiter } from 'tslib';
import bbox from '@turf/bbox';
import { polygon } from '@turf/helpers';
import { AsyncSubject as AsyncSubject$1 } from 'rxjs/AsyncSubject';
import { first as first$1 } from 'rxjs/operators/first';
import { Subscription as Subscription$1 } from 'rxjs/Subscription';
import { fromEvent as fromEvent$1 } from 'rxjs/observable/fromEvent';
import { merge as merge$1 } from 'rxjs/observable/merge';
import { startWith as startWith$1 } from 'rxjs/operators/startWith';
import supercluster from 'supercluster';
import { takeUntil as takeUntil$1 } from 'rxjs/operators/takeUntil';
import { ReplaySubject as ReplaySubject$1 } from 'rxjs/ReplaySubject';
import { debounceTime as debounceTime$1 } from 'rxjs/operators/debounceTime';
import { Subject as Subject$1 } from 'rxjs/Subject';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const MAPBOX_API_KEY = new InjectionToken('MapboxApiKey');
/**
 * @record
 */

/**
 * @record
 */

class MapService {
    /**
     * @param {?} zone
     * @param {?} MAPBOX_API_KEY
     */
    constructor(zone, MAPBOX_API_KEY) {
        this.zone = zone;
        this.MAPBOX_API_KEY = MAPBOX_API_KEY;
        this.mapCreated = new AsyncSubject$1();
        this.mapLoaded = new AsyncSubject$1();
        this.layerIdsToRemove = [];
        this.sourceIdsToRemove = [];
        this.markersToRemove = [];
        this.popupsToRemove = [];
        this.imageIdsToRemove = [];
        this.subscription = new Subscription$1();
        this.mapCreated$ = this.mapCreated.asObservable();
        this.mapLoaded$ = this.mapLoaded.asObservable();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setup(options) {
        // Need onStable to wait for a potential @angular/route transition to end
        this.zone.onStable.pipe(first$1()).subscribe(() => {
            // Workaround rollup issue
            this.assign(MapboxGl, 'accessToken', options.accessToken || this.MAPBOX_API_KEY);
            if (options.customMapboxApiUrl) {
                this.assign(MapboxGl, 'config.API_URL', options.customMapboxApiUrl);
            }
            this.createMap(options.mapOptions);
            this.hookEvents(options.mapEvents);
            this.mapEvents = options.mapEvents;
            this.mapCreated.next(undefined);
            this.mapCreated.complete();
        });
    }
    /**
     * @return {?}
     */
    destroyMap() {
        this.subscription.unsubscribe();
        this.mapInstance.remove();
    }
    /**
     * @param {?} minZoom
     * @return {?}
     */
    updateMinZoom(minZoom) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setMinZoom(minZoom);
        });
    }
    /**
     * @param {?} maxZoom
     * @return {?}
     */
    updateMaxZoom(maxZoom) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setMaxZoom(maxZoom);
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateScrollZoom(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.scrollZoom.enable() : this.mapInstance.scrollZoom.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateDragRotate(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.dragRotate.enable() : this.mapInstance.dragRotate.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateTouchZoomRotate(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.touchZoomRotate.enable() : this.mapInstance.touchZoomRotate.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateDoubleClickZoom(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.doubleClickZoom.enable() : this.mapInstance.doubleClickZoom.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateKeyboard(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.keyboard.enable() : this.mapInstance.keyboard.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateDragPan(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.dragPan.enable() : this.mapInstance.dragPan.disable();
        });
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateBoxZoom(status) {
        return this.zone.runOutsideAngular(() => {
            status ? this.mapInstance.boxZoom.enable() : this.mapInstance.boxZoom.disable();
        });
    }
    /**
     * @param {?} style
     * @return {?}
     */
    updateStyle(style) {
        // TODO Probably not so simple, write demo/tests
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setStyle(style);
        });
    }
    /**
     * @param {?} maxBounds
     * @return {?}
     */
    updateMaxBounds(maxBounds) {
        // TODO Probably not so simple, write demo/tests
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setMaxBounds(maxBounds);
        });
    }
    /**
     * @param {?} cursor
     * @return {?}
     */
    changeCanvasCursor(cursor) {
        const /** @type {?} */ canvas = this.mapInstance.getCanvasContainer();
        canvas.style.cursor = cursor;
    }
    /**
     * @param {?=} pointOrBox
     * @param {?=} parameters
     * @return {?}
     */
    queryRenderedFeatures(pointOrBox, parameters) {
        return this.mapInstance.queryRenderedFeatures(pointOrBox, parameters);
    }
    /**
     * @param {?} center
     * @return {?}
     */
    panTo(center) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.panTo(center);
        });
    }
    /**
     * @param {?} movingMethod
     * @param {?=} flyToOptions
     * @param {?=} zoom
     * @param {?=} center
     * @param {?=} bearing
     * @param {?=} pitch
     * @return {?}
     */
    move(movingMethod, flyToOptions, zoom, center, bearing, pitch) {
        return this.zone.runOutsideAngular(() => {
            (/** @type {?} */ (this.mapInstance[movingMethod]))(Object.assign({}, flyToOptions, { zoom: zoom ? zoom : this.mapInstance.getZoom(), center: center ? center : this.mapInstance.getCenter(), bearing: bearing ? bearing : this.mapInstance.getBearing(), pitch: pitch ? pitch : this.mapInstance.getPitch() }));
        });
    }
    /**
     * @param {?} layer
     * @param {?=} before
     * @return {?}
     */
    addLayer(layer, before) {
        this.zone.runOutsideAngular(() => {
            Object.keys(layer.layerOptions)
                .forEach((key) => {
                const /** @type {?} */ tkey = /** @type {?} */ (key);
                if (layer.layerOptions[tkey] === undefined) {
                    delete layer.layerOptions[tkey];
                }
            });
            this.mapInstance.addLayer(layer.layerOptions, before);
            if (layer.layerEvents.click.observers.length) {
                this.mapInstance.on('click', layer.layerOptions.id, (evt) => {
                    this.zone.run(() => {
                        layer.layerEvents.click.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseEnter.observers.length) {
                this.mapInstance.on('mouseenter', layer.layerOptions.id, (evt) => {
                    this.zone.run(() => {
                        layer.layerEvents.mouseEnter.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseLeave.observers.length) {
                this.mapInstance.on('mouseleave', layer.layerOptions.id, (evt) => {
                    this.zone.run(() => {
                        layer.layerEvents.mouseLeave.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseMove.observers.length) {
                this.mapInstance.on('mousemove', layer.layerOptions.id, (evt) => {
                    this.zone.run(() => {
                        layer.layerEvents.mouseMove.emit(evt);
                    });
                });
            }
        });
    }
    /**
     * @param {?} layerId
     * @return {?}
     */
    removeLayer(layerId) {
        this.layerIdsToRemove.push(layerId);
    }
    /**
     * @param {?} marker
     * @return {?}
     */
    addMarker(marker) {
        return this.zone.runOutsideAngular(() => {
            marker.addTo(this.mapInstance);
        });
    }
    /**
     * @param {?} marker
     * @return {?}
     */
    removeMarker(marker) {
        this.markersToRemove.push(marker);
    }
    /**
     * @param {?} popup
     * @return {?}
     */
    addPopup(popup) {
        return this.zone.runOutsideAngular(() => {
            popup.addTo(this.mapInstance);
        });
    }
    /**
     * @param {?} popup
     * @return {?}
     */
    removePopup(popup) {
        this.popupsToRemove.push(popup);
    }
    /**
     * @param {?} control
     * @param {?=} position
     * @return {?}
     */
    addControl(control, position) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.addControl(/** @type {?} */ (control), position);
        });
    }
    /**
     * @param {?} control
     * @return {?}
     */
    removeControl(control) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.removeControl(/** @type {?} */ (control));
        });
    }
    /**
     * @param {?} imageId
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    loadAndAddImage(imageId, url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.zone.runOutsideAngular(() => {
                return new Promise((resolve, reject) => {
                    this.mapInstance.loadImage(url, (error, image) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        this.addImage(imageId, image, options);
                        resolve();
                    });
                });
            });
        });
    }
    /**
     * @param {?} imageId
     * @param {?} data
     * @param {?=} options
     * @return {?}
     */
    addImage(imageId, data, options) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.addImage(imageId, /** @type {?} */ (data), options);
        });
    }
    /**
     * @param {?} imageId
     * @return {?}
     */
    removeImage(imageId) {
        this.imageIdsToRemove.push(imageId);
    }
    /**
     * @param {?} sourceId
     * @param {?} source
     * @return {?}
     */
    addSource(sourceId, source) {
        return this.zone.runOutsideAngular(() => {
            Object.keys(source)
                .forEach((key) => (/** @type {?} */ (source))[key] === undefined && delete (/** @type {?} */ (source))[key]);
            this.mapInstance.addSource(sourceId, /** @type {?} */ (source)); // Typings issue
        });
    }
    /**
     * @template T
     * @param {?} sourceId
     * @return {?}
     */
    getSource(sourceId) {
        return /** @type {?} */ (/** @type {?} */ (this.mapInstance.getSource(sourceId)));
    }
    /**
     * @param {?} sourceId
     * @return {?}
     */
    removeSource(sourceId) {
        this.sourceIdsToRemove.push(sourceId);
    }
    /**
     * @param {?} layerId
     * @param {?} paint
     * @return {?}
     */
    setAllLayerPaintProperty(layerId, paint) {
        return this.zone.runOutsideAngular(() => {
            Object.keys(paint).forEach((key) => {
                // TODO Check for perf, setPaintProperty only on changed paint props maybe
                this.mapInstance.setPaintProperty(layerId, key, (/** @type {?} */ (paint))[key]);
            });
        });
    }
    /**
     * @param {?} layerId
     * @param {?} layout
     * @return {?}
     */
    setAllLayerLayoutProperty(layerId, layout) {
        return this.zone.runOutsideAngular(() => {
            Object.keys(layout).forEach((key) => {
                // TODO Check for perf, setPaintProperty only on changed paint props maybe
                this.mapInstance.setLayoutProperty(layerId, key, (/** @type {?} */ (layout))[key]);
            });
        });
    }
    /**
     * @param {?} layerId
     * @param {?} filter
     * @return {?}
     */
    setLayerFilter(layerId, filter) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setFilter(layerId, filter);
        });
    }
    /**
     * @param {?} layerId
     * @param {?} beforeId
     * @return {?}
     */
    setLayerBefore(layerId, beforeId) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.moveLayer(layerId, beforeId);
        });
    }
    /**
     * @param {?} layerId
     * @param {?=} minZoom
     * @param {?=} maxZoom
     * @return {?}
     */
    setLayerZoomRange(layerId, minZoom, maxZoom) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.setLayerZoomRange(layerId, minZoom ? minZoom : 0, maxZoom ? maxZoom : 20);
        });
    }
    /**
     * @param {?} bounds
     * @param {?=} options
     * @return {?}
     */
    fitBounds(bounds, options) {
        return this.zone.runOutsideAngular(() => {
            this.mapInstance.fitBounds(bounds, options);
        });
    }
    /**
     * @return {?}
     */
    getCurrentViewportBbox() {
        const /** @type {?} */ canvas = this.mapInstance.getCanvas();
        const /** @type {?} */ w = canvas.width;
        const /** @type {?} */ h = canvas.height;
        const /** @type {?} */ upLeft = this.mapInstance.unproject([0, 0]).toArray();
        const /** @type {?} */ upRight = this.mapInstance.unproject([w, 0]).toArray();
        const /** @type {?} */ downRight = this.mapInstance.unproject([w, h]).toArray();
        const /** @type {?} */ downLeft = this.mapInstance.unproject([0, h]).toArray();
        return bbox(polygon([[upLeft, upRight, downRight, downLeft, upLeft]]));
    }
    /**
     * @return {?}
     */
    applyChanges() {
        this.zone.runOutsideAngular(() => {
            this.removeLayers();
            this.removeSources();
            this.removeMarkers();
            this.removePopups();
            this.removeImages();
        });
    }
    /**
     * @param {?} options
     * @return {?}
     */
    createMap(options) {
        NgZone.assertNotInAngularZone();
        Object.keys(options)
            .forEach((key) => {
            const /** @type {?} */ tkey = /** @type {?} */ (key);
            if (options[tkey] === undefined) {
                delete options[tkey];
            }
        });
        this.mapInstance = new Map(options);
        const /** @type {?} */ sub = this.zone.onMicrotaskEmpty
            .subscribe(() => this.applyChanges());
        this.subscription.add(sub);
    }
    /**
     * @return {?}
     */
    removeLayers() {
        for (const /** @type {?} */ layerId of this.layerIdsToRemove) {
            this.mapInstance.off('click', layerId);
            this.mapInstance.off('mouseenter', layerId);
            this.mapInstance.off('mouseleave', layerId);
            this.mapInstance.off('mousemove', layerId);
            this.mapInstance.removeLayer(layerId);
        }
        this.layerIdsToRemove = [];
    }
    /**
     * @return {?}
     */
    removeSources() {
        for (const /** @type {?} */ sourceId of this.sourceIdsToRemove) {
            this.mapInstance.removeSource(sourceId);
        }
        this.sourceIdsToRemove = [];
    }
    /**
     * @return {?}
     */
    removeMarkers() {
        for (const /** @type {?} */ marker of this.markersToRemove) {
            marker.remove();
        }
        this.markersToRemove = [];
    }
    /**
     * @return {?}
     */
    removePopups() {
        for (const /** @type {?} */ popup of this.popupsToRemove) {
            popup.remove();
        }
        this.popupsToRemove = [];
    }
    /**
     * @return {?}
     */
    removeImages() {
        for (const /** @type {?} */ imageId of this.imageIdsToRemove) {
            this.mapInstance.removeImage(imageId);
        }
        this.imageIdsToRemove = [];
    }
    /**
     * @param {?} events
     * @return {?}
     */
    hookEvents(events) {
        this.mapInstance.on('load', () => {
            this.mapLoaded.next(undefined);
            this.mapLoaded.complete();
            this.zone.run(() => events.load.emit(this.mapInstance));
        });
        if (events.resize.observers.length) {
            this.mapInstance.on('resize', () => this.zone.run(() => events.resize.emit()));
        }
        if (events.remove.observers.length) {
            this.mapInstance.on('remove', () => this.zone.run(() => events.remove.emit()));
        }
        if (events.mouseDown.observers.length) {
            this.mapInstance.on('mousedown', (evt) => this.zone.run(() => events.mouseDown.emit(evt)));
        }
        if (events.mouseUp.observers.length) {
            this.mapInstance.on('mouseup', (evt) => this.zone.run(() => events.mouseUp.emit(evt)));
        }
        if (events.mouseMove.observers.length) {
            this.mapInstance.on('mousemove', (evt) => this.zone.run(() => events.mouseMove.emit(evt)));
        }
        if (events.click.observers.length) {
            this.mapInstance.on('click', (evt) => this.zone.run(() => events.click.emit(evt)));
        }
        if (events.dblClick.observers.length) {
            this.mapInstance.on('dblclick', (evt) => this.zone.run(() => events.dblClick.emit(evt)));
        }
        if (events.mouseEnter.observers.length) {
            this.mapInstance.on('mouseenter', (evt) => this.zone.run(() => events.mouseEnter.emit(evt)));
        }
        if (events.mouseLeave.observers.length) {
            this.mapInstance.on('mouseleave', (evt) => this.zone.run(() => events.mouseLeave.emit(evt)));
        }
        if (events.mouseOver.observers.length) {
            this.mapInstance.on('mouseover', (evt) => this.zone.run(() => events.mouseOver.emit(evt)));
        }
        if (events.mouseOut.observers.length) {
            this.mapInstance.on('mouseout', (evt) => this.zone.run(() => events.mouseOut.emit(evt)));
        }
        if (events.contextMenu.observers.length) {
            this.mapInstance.on('contextmenu', (evt) => this.zone.run(() => events.contextMenu.emit(evt)));
        }
        if (events.touchStart.observers.length) {
            this.mapInstance.on('touchstart', (evt) => this.zone.run(() => events.touchStart.emit(evt)));
        }
        if (events.touchEnd.observers.length) {
            this.mapInstance.on('touchend', (evt) => this.zone.run(() => events.touchEnd.emit(evt)));
        }
        if (events.touchMove.observers.length) {
            this.mapInstance.on('touchmove', (evt) => this.zone.run(() => events.touchMove.emit(evt)));
        }
        if (events.touchCancel.observers.length) {
            this.mapInstance.on('touchcancel', (evt) => this.zone.run(() => events.touchCancel.emit(evt)));
        }
        if (events.moveStart.observers.length) {
            this.mapInstance.on('movestart', (evt) => this.zone.run(() => events.moveStart.emit(evt)));
        }
        if (events.move.observers.length) {
            this.mapInstance.on('move', (evt) => this.zone.run(() => events.move.emit(evt)));
        }
        if (events.moveEnd.observers.length) {
            this.mapInstance.on('moveend', (evt) => this.zone.run(() => events.moveEnd.emit(evt)));
        }
        if (events.dragStart.observers.length) {
            this.mapInstance.on('dragstart', (evt) => this.zone.run(() => events.dragStart.emit(evt)));
        }
        if (events.drag.observers.length) {
            this.mapInstance.on('drag', (evt) => this.zone.run(() => events.drag.emit(evt)));
        }
        if (events.dragEnd.observers.length) {
            this.mapInstance.on('dragend', (evt) => this.zone.run(() => events.dragEnd.emit(evt)));
        }
        if (events.zoomStart.observers.length) {
            this.mapInstance.on('zoomstart', (evt) => this.zone.run(() => events.zoomStart.emit(evt)));
        }
        if (events.zoomEvt.observers.length) {
            this.mapInstance.on('zoom', (evt) => this.zone.run(() => events.zoomEvt.emit(evt)));
        }
        if (events.zoomEnd.observers.length) {
            this.mapInstance.on('zoomend', (evt) => this.zone.run(() => events.zoomEnd.emit(evt)));
        }
        if (events.rotateStart.observers.length) {
            this.mapInstance.on('rotatestart', (evt) => this.zone.run(() => events.rotateStart.emit(evt)));
        }
        if (events.rotate.observers.length) {
            this.mapInstance.on('rotate', (evt) => this.zone.run(() => events.rotate.emit(evt)));
        }
        if (events.rotateEnd.observers.length) {
            this.mapInstance.on('rotateend', (evt) => this.zone.run(() => events.rotateEnd.emit(evt)));
        }
        if (events.pitchStart.observers.length) {
            this.mapInstance.on('pitchstart', (evt) => this.zone.run(() => events.pitchStart.emit(evt)));
        }
        if (events.pitchEvt.observers.length) {
            this.mapInstance.on('pitch', (evt) => this.zone.run(() => events.pitchEvt.emit(evt)));
        }
        if (events.pitchEnd.observers.length) {
            this.mapInstance.on('pitchend', (evt) => this.zone.run(() => events.pitchEnd.emit(evt)));
        }
        if (events.boxZoomStart.observers.length) {
            this.mapInstance.on('boxzoomstart', (evt) => this.zone.run(() => events.boxZoomStart.emit(evt)));
        }
        if (events.boxZoomEnd.observers.length) {
            this.mapInstance.on('boxzoomend', (evt) => this.zone.run(() => events.boxZoomEnd.emit(evt)));
        }
        if (events.boxZoomCancel.observers.length) {
            this.mapInstance.on('boxzoomcancel', (evt) => this.zone.run(() => events.boxZoomCancel.emit(evt)));
        }
        if (events.webGlContextLost.observers.length) {
            this.mapInstance.on('webglcontextlost', () => this.zone.run(() => events.webGlContextLost.emit()));
        }
        if (events.webGlContextRestored.observers.length) {
            this.mapInstance.on('webglcontextrestored', () => this.zone.run(() => events.webGlContextRestored.emit()));
        }
        if (events.render.observers.length) {
            this.mapInstance.on('render', () => this.zone.run(() => events.render.emit()));
        }
        if (events.error.observers.length) {
            this.mapInstance.on('error', () => this.zone.run(() => events.error.emit()));
        }
        if (events.data.observers.length) {
            this.mapInstance.on('data', (evt) => this.zone.run(() => events.data.emit(evt)));
        }
        if (events.styleData.observers.length) {
            this.mapInstance.on('styledata', (evt) => this.zone.run(() => events.styleData.emit(evt)));
        }
        if (events.sourceData.observers.length) {
            this.mapInstance.on('sourcedata', (evt) => this.zone.run(() => events.sourceData.emit(evt)));
        }
        if (events.dataLoading.observers.length) {
            this.mapInstance.on('dataloading', (evt) => this.zone.run(() => events.dataLoading.emit(evt)));
        }
        if (events.styleDataLoading.observers.length) {
            this.mapInstance.on('styledataloading', (evt) => this.zone.run(() => events.styleDataLoading.emit(evt)));
        }
        if (events.sourceDataLoading.observers.length) {
            this.mapInstance.on('sourcedataloading', (evt) => this.zone.run(() => events.sourceDataLoading.emit(evt)));
        }
    }
    /**
     * @param {?} obj
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    assign(obj, prop, value) {
        if (typeof prop === 'string') {
            // tslint:disable-next-line:no-parameter-reassignment
            prop = prop.split('.');
        }
        if (prop.length > 1) {
            const /** @type {?} */ e = prop.shift();
            this.assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === '[object Object]'
                    ? obj[e]
                    : {}, prop, value);
        }
        else {
            obj[prop[0]] = value;
        }
    }
}
MapService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MapService.ctorParameters = () => [
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAPBOX_API_KEY,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CustomControl {
    /**
     * @param {?} container
     */
    constructor(container) {
        this.container = container;
    }
    /**
     * @return {?}
     */
    onAdd() {
        return this.container;
    }
    /**
     * @return {?}
     */
    onRemove() {
        return /** @type {?} */ ((this.container.parentNode)).removeChild(this.container);
    }
    /**
     * @return {?}
     */
    getDefaultPosition() {
        return 'top-right';
    }
}
class ControlComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this.content.nativeElement.childNodes.length) {
            this.control = new CustomControl(this.content.nativeElement);
            this.MapService.mapCreated$.subscribe(() => {
                this.MapService.addControl(/** @type {?} */ ((this.control)), this.position);
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.MapService.removeControl(this.control);
    }
}
ControlComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-control',
                template: '<div class="mapboxgl-ctrl" #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ControlComponent.ctorParameters = () => [
    { type: MapService, },
];
ControlComponent.propDecorators = {
    "position": [{ type: Input },],
    "content": [{ type: ViewChild, args: ['content',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AttributionControlDirective {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    constructor(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapCreated$.subscribe(() => {
            if (this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            const /** @type {?} */ options = {};
            if (this.compact !== undefined) {
                options.compact = this.compact;
            }
            this.ControlComponent.control = new AttributionControl(options);
            this.MapService.addControl(this.ControlComponent.control, this.ControlComponent.position);
        });
    }
}
AttributionControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglAttribution]'
            },] },
];
/** @nocollapse */
AttributionControlDirective.ctorParameters = () => [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
];
AttributionControlDirective.propDecorators = {
    "compact": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FullscreenControlDirective {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    constructor(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapCreated$.subscribe(() => {
            if (this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            this.ControlComponent.control = new FullscreenControl();
            this.MapService.addControl(this.ControlComponent.control, this.ControlComponent.position);
        });
    }
}
FullscreenControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglFullscreen]'
            },] },
];
/** @nocollapse */
FullscreenControlDirective.ctorParameters = () => [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GeolocateControlDirective {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    constructor(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapCreated$.subscribe(() => {
            if (this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            const /** @type {?} */ options = {
                positionOptions: this.positionOptions,
                fitBoundsOptions: this.fitBoundsOptions,
                trackUserLocation: this.trackUserLocation,
                showUserLocation: this.showUserLocation
            };
            Object.keys(options)
                .forEach((key) => {
                const /** @type {?} */ tkey = /** @type {?} */ (key);
                if (options[tkey] === undefined) {
                    delete options[tkey];
                }
            });
            this.ControlComponent.control = new GeolocateControl(options);
            this.MapService.addControl(this.ControlComponent.control, this.ControlComponent.position);
        });
    }
}
GeolocateControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglGeolocate]'
            },] },
];
/** @nocollapse */
GeolocateControlDirective.ctorParameters = () => [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
];
GeolocateControlDirective.propDecorators = {
    "positionOptions": [{ type: Input },],
    "fitBoundsOptions": [{ type: Input },],
    "trackUserLocation": [{ type: Input },],
    "showUserLocation": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NavigationControlDirective {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    constructor(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapCreated$.subscribe(() => {
            if (this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            this.ControlComponent.control = new NavigationControl();
            this.MapService.addControl(this.ControlComponent.control, this.ControlComponent.position);
        });
    }
}
NavigationControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglNavigation]'
            },] },
];
/** @nocollapse */
NavigationControlDirective.ctorParameters = () => [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ScaleControlDirective {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    constructor(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapCreated$.subscribe(() => {
            if (this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            const /** @type {?} */ options = {};
            if (this.maxWidth !== undefined) {
                options.maxWidth = this.maxWidth;
            }
            if (this.unit !== undefined) {
                options.unit = this.unit;
            }
            this.ControlComponent.control = new ScaleControl(options);
            this.MapService.addControl(this.ControlComponent.control, this.ControlComponent.position);
        });
    }
}
ScaleControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglScale]'
            },] },
];
/** @nocollapse */
ScaleControlDirective.ctorParameters = () => [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
];
ScaleControlDirective.propDecorators = {
    "maxWidth": [{ type: Input },],
    "unit": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ImageComponent {
    /**
     * @param {?} MapService
     * @param {?} zone
     */
    constructor(MapService$$1, zone) {
        this.MapService = MapService$$1;
        this.zone = zone;
        this.error = new EventEmitter();
        this.loaded = new EventEmitter();
        this.imageAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => __awaiter(this, void 0, void 0, function* () {
            if (this.data) {
                this.MapService.addImage(this.id, this.data, this.options);
                this.imageAdded = true;
            }
            else if (this.url) {
                try {
                    yield this.MapService.loadAndAddImage(this.id, this.url, this.options);
                    this.imageAdded = true;
                    this.zone.run(() => {
                        this.loaded.emit();
                    });
                }
                catch (/** @type {?} */ error) {
                    this.zone.run(() => {
                        this.error.emit(error);
                    });
                }
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["data"] && !changes["data"].isFirstChange() ||
            changes["options"] && !changes["options"].isFirstChange() ||
            changes["url"] && !changes["url"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.imageAdded) {
            this.MapService.removeImage(this.id);
        }
    }
}
ImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-image',
                template: ''
            },] },
];
/** @nocollapse */
ImageComponent.ctorParameters = () => [
    { type: MapService, },
    { type: NgZone, },
];
ImageComponent.propDecorators = {
    "id": [{ type: Input },],
    "data": [{ type: Input },],
    "options": [{ type: Input },],
    "url": [{ type: Input },],
    "error": [{ type: Output },],
    "loaded": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LayerComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.click = new EventEmitter();
        this.mouseEnter = new EventEmitter();
        this.mouseLeave = new EventEmitter();
        this.mouseMove = new EventEmitter();
        this.layerAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            this.MapService.addLayer({
                layerOptions: {
                    id: this.id,
                    type: this.type,
                    source: this.source,
                    metadata: this.metadata,
                    'source-layer': this.sourceLayer,
                    minzoom: this.minzoom,
                    maxzoom: this.maxzoom,
                    filter: this.filter,
                    layout: this.layout,
                    paint: this.paint
                },
                layerEvents: {
                    click: this.click,
                    mouseEnter: this.mouseEnter,
                    mouseLeave: this.mouseLeave,
                    mouseMove: this.mouseMove
                }
            }, this.before);
            this.layerAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.layerAdded) {
            return;
        }
        if (changes["paint"] && !changes["paint"].isFirstChange()) {
            this.MapService.setAllLayerPaintProperty(this.id, /** @type {?} */ ((changes["paint"].currentValue)));
        }
        if (changes["layout"] && !changes["layout"].isFirstChange()) {
            this.MapService.setAllLayerLayoutProperty(this.id, /** @type {?} */ ((changes["layout"].currentValue)));
        }
        if (changes["filter"] && !changes["filter"].isFirstChange()) {
            this.MapService.setLayerFilter(this.id, /** @type {?} */ ((changes["filter"].currentValue)));
        }
        if (changes["before"] && !changes["before"].isFirstChange()) {
            this.MapService.setLayerBefore(this.id, /** @type {?} */ ((changes["before"].currentValue)));
        }
        if (changes["minzoom"] && !changes["minzoom"].isFirstChange() ||
            changes["maxzoom"] && !changes["maxzoom"].isFirstChange()) {
            this.MapService.setLayerZoomRange(this.id, this.minzoom, this.maxzoom);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.layerAdded) {
            this.MapService.removeLayer(this.id);
        }
    }
}
LayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-layer',
                template: ''
            },] },
];
/** @nocollapse */
LayerComponent.ctorParameters = () => [
    { type: MapService, },
];
LayerComponent.propDecorators = {
    "id": [{ type: Input },],
    "source": [{ type: Input },],
    "type": [{ type: Input },],
    "metadata": [{ type: Input },],
    "sourceLayer": [{ type: Input },],
    "filter": [{ type: Input },],
    "layout": [{ type: Input },],
    "paint": [{ type: Input },],
    "before": [{ type: Input },],
    "minzoom": [{ type: Input },],
    "maxzoom": [{ type: Input },],
    "click": [{ type: Output },],
    "mouseEnter": [{ type: Output },],
    "mouseLeave": [{ type: Output },],
    "mouseMove": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MapComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        /* Added by ngx-mapbox-gl */
        this.movingMethod = 'flyTo';
        this.resize = new EventEmitter();
        this.remove = new EventEmitter();
        this.mouseDown = new EventEmitter();
        this.mouseUp = new EventEmitter();
        this.mouseMove = new EventEmitter();
        this.click = new EventEmitter();
        this.dblClick = new EventEmitter();
        this.mouseEnter = new EventEmitter();
        this.mouseLeave = new EventEmitter();
        this.mouseOver = new EventEmitter();
        this.mouseOut = new EventEmitter();
        this.contextMenu = new EventEmitter();
        this.touchStart = new EventEmitter();
        this.touchEnd = new EventEmitter();
        this.touchMove = new EventEmitter();
        this.touchCancel = new EventEmitter();
        this.moveStart = new EventEmitter();
        this.move = new EventEmitter();
        this.moveEnd = new EventEmitter();
        this.dragStart = new EventEmitter();
        this.drag = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.zoomStart = new EventEmitter();
        this.zoomEvt = new EventEmitter();
        this.zoomEnd = new EventEmitter();
        this.rotateStart = new EventEmitter();
        this.rotate = new EventEmitter();
        this.rotateEnd = new EventEmitter();
        this.pitchStart = new EventEmitter();
        this.pitchEvt = new EventEmitter();
        this.pitchEnd = new EventEmitter();
        this.boxZoomStart = new EventEmitter();
        this.boxZoomEnd = new EventEmitter();
        this.boxZoomCancel = new EventEmitter();
        this.webGlContextLost = new EventEmitter();
        this.webGlContextRestored = new EventEmitter();
        this.load = new EventEmitter();
        this.render = new EventEmitter();
        this.error = new EventEmitter();
        this.data = new EventEmitter();
        this.styleData = new EventEmitter();
        this.sourceData = new EventEmitter();
        this.dataLoading = new EventEmitter();
        this.styleDataLoading = new EventEmitter();
        this.sourceDataLoading = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get mapInstance() {
        return this.MapService.mapInstance;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.MapService.setup({
            accessToken: this.accessToken,
            customMapboxApiUrl: this.customMapboxApiUrl,
            mapOptions: {
                container: this.mapContainer.nativeElement,
                minZoom: this.minZoom,
                maxZoom: this.maxZoom,
                style: this.style,
                hash: this.hash,
                interactive: this.interactive,
                bearingSnap: this.bearingSnap,
                pitchWithRotate: this.pitchWithRotate,
                classes: this.classes,
                attributionControl: this.attributionControl,
                logoPosition: this.logoPosition,
                failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat,
                preserveDrawingBuffer: this.preserveDrawingBuffer,
                refreshExpiredTiles: this.refreshExpiredTiles,
                maxBounds: this.maxBounds,
                scrollZoom: this.scrollZoom,
                boxZoom: this.boxZoom,
                dragRotate: this.dragRotate,
                dragPan: this.dragPan,
                keyboard: this.keyboard,
                doubleClickZoom: this.doubleClickZoom,
                touchZoomRotate: this.touchZoomRotate,
                trackResize: this.trackResize,
                center: this.center,
                zoom: this.zoom,
                bearing: this.bearing,
                pitch: this.pitch,
                renderWorldCopies: this.renderWorldCopies,
                maxTileCacheSize: this.maxTileCacheSize,
                localIdeographFontFamily: this.localIdeographFontFamily,
                transformRequest: this.transformRequest
            },
            mapEvents: this
        });
        if (this.cursorStyle) {
            this.MapService.changeCanvasCursor(this.cursorStyle);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.MapService.destroyMap();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["cursorStyle"] && !changes["cursorStyle"].isFirstChange()) {
            this.MapService.changeCanvasCursor(changes["cursorStyle"].currentValue);
        }
        if (changes["minZoom"] && !changes["minZoom"].isFirstChange()) {
            this.MapService.updateMinZoom(changes["minZoom"].currentValue);
        }
        if (changes["maxZoom"] && !changes["maxZoom"].isFirstChange()) {
            this.MapService.updateMaxZoom(changes["maxZoom"].currentValue);
        }
        if (changes["scrollZoom"] && !changes["scrollZoom"].isFirstChange()) {
            this.MapService.updateScrollZoom(changes["scrollZoom"].currentValue);
        }
        if (changes["dragRotate"] && !changes["dragRotate"].isFirstChange()) {
            this.MapService.updateDragRotate(changes["dragRotate"].currentValue);
        }
        if (changes["touchZoomRotate"] && !changes["touchZoomRotate"].isFirstChange()) {
            this.MapService.updateTouchZoomRotate(changes["touchZoomRotate"].currentValue);
        }
        if (changes["doubleClickZoom"] && !changes["doubleClickZoom"].isFirstChange()) {
            this.MapService.updateDoubleClickZoom(changes["doubleClickZoom"].currentValue);
        }
        if (changes["keyboard"] && !changes["keyboard"].isFirstChange()) {
            this.MapService.updateKeyboard(changes["keyboard"].currentValue);
        }
        if (changes["dragPan"] && !changes["dragPan"].isFirstChange()) {
            this.MapService.updateDragPan(changes["dragPan"].currentValue);
        }
        if (changes["boxZoom"] && !changes["boxZoom"].isFirstChange()) {
            this.MapService.updateBoxZoom(changes["boxZoom"].currentValue);
        }
        if (changes["style"] && !changes["style"].isFirstChange()) {
            this.MapService.updateStyle(changes["style"].currentValue);
        }
        if (changes["maxBounds"] && !changes["maxBounds"].isFirstChange()) {
            this.MapService.updateMaxBounds(changes["maxBounds"].currentValue);
        }
        if (changes["fitBounds"] && !changes["fitBounds"].isFirstChange()) {
            this.MapService.fitBounds(changes["fitBounds"].currentValue, this.fitBoundsOptions);
        }
        if (this.centerWithPanTo && changes["center"] && !changes["center"].isFirstChange() &&
            !changes["zoom"] && !changes["bearing"] && !changes["pitch"]) {
            this.MapService.panTo(/** @type {?} */ ((this.center)));
        }
        else if (changes["center"] && !changes["center"].isFirstChange() ||
            changes["zoom"] && !changes["zoom"].isFirstChange() ||
            changes["bearing"] && !changes["bearing"].isFirstChange() ||
            changes["pitch"] && !changes["pitch"].isFirstChange()) {
            this.MapService.move(this.movingMethod, this.flyToOptions, changes["zoom"] && this.zoom ? this.zoom[0] : undefined, changes["center"] ? this.center : undefined, changes["bearing"] && this.bearing ? this.bearing[0] : undefined, changes["pitch"] && this.pitch ? this.pitch[0] : undefined);
        }
    }
}
MapComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-map',
                template: '<div #container></div>',
                styles: [`
  :host {
    display: block;
  }
  div {
    height: 100%;
    width: 100%;
  }
  `],
                providers: [
                    MapService
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MapComponent.ctorParameters = () => [
    { type: MapService, },
];
MapComponent.propDecorators = {
    "accessToken": [{ type: Input },],
    "customMapboxApiUrl": [{ type: Input },],
    "hash": [{ type: Input },],
    "refreshExpiredTiles": [{ type: Input },],
    "failIfMajorPerformanceCaveat": [{ type: Input },],
    "classes": [{ type: Input },],
    "bearingSnap": [{ type: Input },],
    "interactive": [{ type: Input },],
    "pitchWithRotate": [{ type: Input },],
    "attributionControl": [{ type: Input },],
    "logoPosition": [{ type: Input },],
    "maxTileCacheSize": [{ type: Input },],
    "localIdeographFontFamily": [{ type: Input },],
    "preserveDrawingBuffer": [{ type: Input },],
    "renderWorldCopies": [{ type: Input },],
    "trackResize": [{ type: Input },],
    "transformRequest": [{ type: Input },],
    "minZoom": [{ type: Input },],
    "maxZoom": [{ type: Input },],
    "scrollZoom": [{ type: Input },],
    "dragRotate": [{ type: Input },],
    "touchZoomRotate": [{ type: Input },],
    "doubleClickZoom": [{ type: Input },],
    "keyboard": [{ type: Input },],
    "dragPan": [{ type: Input },],
    "boxZoom": [{ type: Input },],
    "style": [{ type: Input },],
    "center": [{ type: Input },],
    "maxBounds": [{ type: Input },],
    "zoom": [{ type: Input },],
    "bearing": [{ type: Input },],
    "pitch": [{ type: Input },],
    "movingMethod": [{ type: Input },],
    "fitBounds": [{ type: Input },],
    "fitBoundsOptions": [{ type: Input },],
    "flyToOptions": [{ type: Input },],
    "centerWithPanTo": [{ type: Input },],
    "cursorStyle": [{ type: Input },],
    "resize": [{ type: Output },],
    "remove": [{ type: Output },],
    "mouseDown": [{ type: Output },],
    "mouseUp": [{ type: Output },],
    "mouseMove": [{ type: Output },],
    "click": [{ type: Output },],
    "dblClick": [{ type: Output },],
    "mouseEnter": [{ type: Output },],
    "mouseLeave": [{ type: Output },],
    "mouseOver": [{ type: Output },],
    "mouseOut": [{ type: Output },],
    "contextMenu": [{ type: Output },],
    "touchStart": [{ type: Output },],
    "touchEnd": [{ type: Output },],
    "touchMove": [{ type: Output },],
    "touchCancel": [{ type: Output },],
    "moveStart": [{ type: Output },],
    "move": [{ type: Output },],
    "moveEnd": [{ type: Output },],
    "dragStart": [{ type: Output },],
    "drag": [{ type: Output },],
    "dragEnd": [{ type: Output },],
    "zoomStart": [{ type: Output },],
    "zoomEvt": [{ type: Output },],
    "zoomEnd": [{ type: Output },],
    "rotateStart": [{ type: Output },],
    "rotate": [{ type: Output },],
    "rotateEnd": [{ type: Output },],
    "pitchStart": [{ type: Output },],
    "pitchEvt": [{ type: Output },],
    "pitchEnd": [{ type: Output },],
    "boxZoomStart": [{ type: Output },],
    "boxZoomEnd": [{ type: Output },],
    "boxZoomCancel": [{ type: Output },],
    "webGlContextLost": [{ type: Output },],
    "webGlContextRestored": [{ type: Output },],
    "load": [{ type: Output },],
    "render": [{ type: Output },],
    "error": [{ type: Output },],
    "data": [{ type: Output },],
    "styleData": [{ type: Output },],
    "sourceData": [{ type: Output },],
    "dataLoading": [{ type: Output },],
    "styleDataLoading": [{ type: Output },],
    "sourceDataLoading": [{ type: Output },],
    "mapContainer": [{ type: ViewChild, args: ['container',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PointDirective {
}
PointDirective.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[mglPoint]' },] },
];
/** @nocollapse */
PointDirective.ctorParameters = () => [];
class ClusterPointDirective {
}
ClusterPointDirective.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[mglClusterPoint]' },] },
];
/** @nocollapse */
ClusterPointDirective.ctorParameters = () => [];
class MarkerClusterComponent {
    /**
     * @param {?} MapService
     * @param {?} ChangeDetectorRef
     */
    constructor(MapService$$1, ChangeDetectorRef$$1) {
        this.MapService = MapService$$1;
        this.ChangeDetectorRef = ChangeDetectorRef$$1;
        this.sub = new Subscription$1();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ options = {
            radius: this.radius,
            maxZoom: this.maxZoom,
            minZoom: this.minZoom,
            extent: this.extent,
            nodeSize: this.nodeSize,
            log: this.log,
            reduce: this.reduce,
            initial: this.initial,
            map: this.map
        };
        Object.keys(options)
            .forEach((key) => {
            const /** @type {?} */ tkey = /** @type {?} */ (key);
            if (options[tkey] === undefined) {
                delete options[tkey];
            }
        });
        this.supercluster = supercluster(options);
        this.supercluster.load(this.data.features);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.supercluster.load(this.data.features);
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.MapService.mapCreated$.subscribe(() => {
            const /** @type {?} */ mapMove$ = merge$1(fromEvent$1(this.MapService.mapInstance, 'zoomChange'), fromEvent$1(this.MapService.mapInstance, 'move'));
            const /** @type {?} */ sub = mapMove$.pipe(startWith$1(undefined)).subscribe(() => this.updateCluster());
            this.sub.add(sub);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    /**
     * @return {?}
     */
    updateCluster() {
        const /** @type {?} */ bbox$$1 = this.MapService.getCurrentViewportBbox();
        const /** @type {?} */ currentZoom = Math.round(this.MapService.mapInstance.getZoom());
        this.clusterPoints = this.supercluster.getClusters(bbox$$1, currentZoom);
        this.ChangeDetectorRef.detectChanges();
        this.MapService.applyChanges();
    }
}
MarkerClusterComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-marker-cluster',
                template: `
    <ng-container *ngFor="let feature of clusterPoints">
      <ng-container *ngIf="feature.properties.cluster; else point">
        <mgl-marker
          [feature]="feature"
        >
          <ng-container *ngTemplateOutlet="clusterPointTpl; context: { $implicit: feature }"></ng-container>
        </mgl-marker>
      </ng-container>
      <ng-template #point>
        <mgl-marker
          [feature]="feature"
        >
          <ng-container *ngTemplateOutlet="pointTpl; context: { $implicit: feature }"></ng-container>
        </mgl-marker>
      </ng-template>
    </ng-container>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false
            },] },
];
/** @nocollapse */
MarkerClusterComponent.ctorParameters = () => [
    { type: MapService, },
    { type: ChangeDetectorRef, },
];
MarkerClusterComponent.propDecorators = {
    "radius": [{ type: Input },],
    "maxZoom": [{ type: Input },],
    "minZoom": [{ type: Input },],
    "extent": [{ type: Input },],
    "nodeSize": [{ type: Input },],
    "log": [{ type: Input },],
    "reduce": [{ type: Input },],
    "initial": [{ type: Input },],
    "map": [{ type: Input },],
    "data": [{ type: Input },],
    "pointTpl": [{ type: ContentChild, args: [PointDirective, { read: TemplateRef },] },],
    "clusterPointTpl": [{ type: ContentChild, args: [ClusterPointDirective, { read: TemplateRef },] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MarkerComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.feature && this.lngLat) {
            throw new Error('feature and lngLat input are mutually exclusive');
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["lngLat"] && !changes["lngLat"].isFirstChange()) {
            /** @type {?} */ ((this.markerInstance)).setLngLat(/** @type {?} */ ((this.lngLat)));
        }
        if (changes["feature"] && !changes["feature"].isFirstChange()) {
            /** @type {?} */ ((this.markerInstance)).setLngLat(/** @type {?} */ ((/** @type {?} */ ((this.feature)).geometry)).coordinates);
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.markerInstance = new Marker(this.content.nativeElement, { offset: this.offset });
        this.markerInstance.setLngLat(this.feature ? /** @type {?} */ ((this.feature.geometry)).coordinates : /** @type {?} */ ((this.lngLat)));
        this.MapService.mapCreated$.subscribe(() => {
            this.MapService.addMarker(/** @type {?} */ ((this.markerInstance)));
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.MapService.removeMarker(/** @type {?} */ ((this.markerInstance)));
        this.markerInstance = undefined;
    }
    /**
     * @return {?}
     */
    togglePopup() {
        /** @type {?} */ ((this.markerInstance)).togglePopup();
    }
}
MarkerComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-marker',
                template: '<div #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MarkerComponent.ctorParameters = () => [
    { type: MapService, },
];
MarkerComponent.propDecorators = {
    "offset": [{ type: Input },],
    "feature": [{ type: Input },],
    "lngLat": [{ type: Input },],
    "content": [{ type: ViewChild, args: ['content',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PopupComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.close = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.lngLat && this.marker) {
            throw new Error('marker and lngLat input are mutually exclusive');
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes["lngLat"] && !changes["lngLat"].isFirstChange()) {
            this.MapService.removePopup(/** @type {?} */ ((this.popupInstance)));
            const /** @type {?} */ popupInstanceTmp = this.createPopup();
            this.MapService.addPopup(popupInstanceTmp);
            this.popupInstance = popupInstanceTmp;
        }
        if (changes["marker"] && !changes["marker"].isFirstChange()) {
            const /** @type {?} */ previousMarker = changes["marker"].previousValue;
            if (previousMarker.markerInstance) {
                previousMarker.markerInstance.setPopup(undefined);
            }
            if (this.marker && this.marker.markerInstance) {
                this.marker.markerInstance.setPopup(this.popupInstance);
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.popupInstance = this.createPopup();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.MapService.removePopup(/** @type {?} */ ((this.popupInstance)));
        this.popupInstance = undefined;
    }
    /**
     * @return {?}
     */
    createPopup() {
        const /** @type {?} */ options = {
            closeButton: this.closeButton,
            closeOnClick: this.closeOnClick,
            anchor: this.anchor,
            offset: this.offset
        };
        Object.keys(options)
            .forEach((key) => (/** @type {?} */ (options))[key] === undefined && delete (/** @type {?} */ (options))[key]);
        const /** @type {?} */ popupInstance = new Popup(options);
        popupInstance.once('close', () => {
            this.close.emit();
        });
        popupInstance.setDOMContent(this.content.nativeElement);
        this.MapService.mapCreated$.subscribe(() => {
            if (this.lngLat) {
                popupInstance.setLngLat(this.lngLat);
                this.MapService.addPopup(popupInstance);
            }
            else if (this.marker && this.marker.markerInstance) {
                this.marker.markerInstance.setPopup(popupInstance);
            }
        });
        return popupInstance;
    }
}
PopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-popup',
                template: '<div #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
PopupComponent.ctorParameters = () => [
    { type: MapService, },
];
PopupComponent.propDecorators = {
    "closeButton": [{ type: Input },],
    "closeOnClick": [{ type: Input },],
    "anchor": [{ type: Input },],
    "offset": [{ type: Input },],
    "lngLat": [{ type: Input },],
    "marker": [{ type: Input },],
    "close": [{ type: Output },],
    "content": [{ type: ViewChild, args: ['content',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CanvasSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            const /** @type {?} */ source = {
                type: 'canvas',
                coordinates: this.coordinates,
                canvas: this.canvas,
                animate: this.animate,
            };
            this.MapService.addSource(this.id, source);
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["coordinates"] && !changes["coordinates"].isFirstChange() ||
            changes["canvas"] && !changes["canvas"].isFirstChange() ||
            changes["animate"] && !changes["animate"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    }
}
CanvasSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-canvas-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
CanvasSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
CanvasSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "coordinates": [{ type: Input },],
    "canvas": [{ type: Input },],
    "animate": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GeoJSONSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.updateFeatureData = new Subject$1();
        this.sourceAdded = false;
        this.featureIdCounter = 0;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.data) {
            this.data = {
                type: 'FeatureCollection',
                features: []
            };
        }
        this.MapService.mapLoaded$.subscribe(() => {
            this.MapService.addSource(this.id, {
                type: 'geojson',
                data: this.data,
                maxzoom: this.maxzoom,
                minzoom: this.minzoom,
                buffer: this.buffer,
                tolerance: this.tolerance,
                cluster: this.cluster,
                clusterRadius: this.clusterRadius,
                clusterMaxZoom: this.clusterMaxZoom,
            });
            this.sub = this.updateFeatureData.pipe(debounceTime$1(0)).subscribe(() => {
                const /** @type {?} */ source = this.MapService.getSource(this.id);
                source.setData(/** @type {?} */ ((this.data)));
            });
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["maxzoom"] && !changes["maxzoom"].isFirstChange() ||
            changes["minzoom"] && !changes["minzoom"].isFirstChange() ||
            changes["buffer"] && !changes["buffer"].isFirstChange() ||
            changes["tolerance"] && !changes["tolerance"].isFirstChange() ||
            changes["cluster"] && !changes["cluster"].isFirstChange() ||
            changes["clusterRadius"] && !changes["clusterRadius"].isFirstChange() ||
            changes["clusterMaxZoom"] && !changes["clusterMaxZoom"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
        if (changes["data"] && !changes["data"].isFirstChange()) {
            const /** @type {?} */ source = this.MapService.getSource(this.id);
            source.setData(/** @type {?} */ ((this.data)));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.sub.unsubscribe();
            this.MapService.removeSource(this.id);
        }
    }
    /**
     * @param {?} feature
     * @return {?}
     */
    addFeature(feature) {
        const /** @type {?} */ collection = /** @type {?} */ (this.data);
        collection.features.push(feature);
        this.updateFeatureData.next();
    }
    /**
     * @param {?} feature
     * @return {?}
     */
    removeFeature(feature) {
        const /** @type {?} */ collection = /** @type {?} */ (this.data);
        const /** @type {?} */ index = collection.features.indexOf(feature);
        if (index > -1) {
            collection.features.splice(index, 1);
        }
        this.updateFeatureData.next();
    }
    /**
     * @return {?}
     */
    getNewFeatureId() {
        return ++this.featureIdCounter;
    }
}
GeoJSONSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-geojson-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
GeoJSONSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
GeoJSONSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "data": [{ type: Input },],
    "minzoom": [{ type: Input },],
    "maxzoom": [{ type: Input },],
    "buffer": [{ type: Input },],
    "tolerance": [{ type: Input },],
    "cluster": [{ type: Input },],
    "clusterRadius": [{ type: Input },],
    "clusterMaxZoom": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FeatureComponent {
    /**
     * @param {?} GeoJSONSourceComponent
     */
    constructor(GeoJSONSourceComponent$$1) {
        this.GeoJSONSourceComponent = GeoJSONSourceComponent$$1;
        this.type = 'Feature';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.id) {
            this.id = this.GeoJSONSourceComponent.getNewFeatureId();
        }
        this.feature = {
            type: this.type,
            geometry: this.geometry,
            properties: this.properties ? this.properties : {}
        };
        this.feature.id = this.id;
        this.GeoJSONSourceComponent.addFeature(this.feature);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.GeoJSONSourceComponent.removeFeature(this.feature);
    }
    /**
     * @param {?} coordinates
     * @return {?}
     */
    updateCoordinates(coordinates) {
        (/** @type {?} */ (this.feature.geometry)).coordinates = coordinates;
        this.GeoJSONSourceComponent.updateFeatureData.next();
    }
}
FeatureComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-feature',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
FeatureComponent.ctorParameters = () => [
    { type: GeoJSONSourceComponent, decorators: [{ type: Inject, args: [forwardRef(() => GeoJSONSourceComponent),] },] },
];
FeatureComponent.propDecorators = {
    "id": [{ type: Input },],
    "geometry": [{ type: Input },],
    "properties": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DraggableDirective {
    /**
     * @param {?} MapService
     * @param {?} FeatureComponent
     * @param {?} NgZone
     */
    constructor(MapService$$1, FeatureComponent$$1, NgZone$$1) {
        this.MapService = MapService$$1;
        this.FeatureComponent = FeatureComponent$$1;
        this.NgZone = NgZone$$1;
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.drag = new EventEmitter();
        this.destroyed$ = new ReplaySubject$1(1);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.FeatureComponent.geometry.type !== 'Point') {
            throw new Error('mglDraggable only support point feature');
        }
        this.MapService.mapCreated$.subscribe(() => {
            this.source.mouseEnter.pipe(takeUntil$1(this.destroyed$)).subscribe((evt) => {
                const /** @type {?} */ feature = this.MapService.queryRenderedFeatures(evt.point, {
                    layers: [this.source.id],
                    filter: [
                        'all',
                        ['==', '$type', 'Point'],
                        ['==', '$id', this.FeatureComponent.id]
                    ]
                })[0];
                if (!feature) {
                    return;
                }
                this.MapService.changeCanvasCursor('move');
                this.MapService.updateDragPan(false);
                fromEvent$1(this.MapService.mapInstance, 'mousedown').pipe(takeUntil$1(merge$1(this.destroyed$, this.source.mouseLeave))).subscribe(() => {
                    if (this.dragStart.observers.length) {
                        this.NgZone.run(() => this.dragStart.emit(evt));
                    }
                    fromEvent$1(this.MapService.mapInstance, 'mousemove').pipe(takeUntil$1(merge$1(this.destroyed$, fromEvent$1(this.MapService.mapInstance, 'mouseup')))).subscribe((evt) => {
                        if (this.drag.observers.length) {
                            this.NgZone.run(() => this.drag.emit(evt));
                        }
                        this.FeatureComponent.updateCoordinates([evt.lngLat.lng, evt.lngLat.lat]);
                    }, (err) => err, () => {
                        if (this.dragEnd.observers.length) {
                            this.NgZone.run(() => this.dragEnd.emit(evt));
                        }
                    });
                });
            });
            this.source.mouseLeave.pipe(takeUntil$1(this.destroyed$)).subscribe(() => {
                this.MapService.changeCanvasCursor('');
                this.MapService.updateDragPan(true);
            });
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroyed$.next(undefined);
        this.destroyed$.complete();
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglDraggable]'
            },] },
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: MapService, },
    { type: FeatureComponent, decorators: [{ type: Host },] },
    { type: NgZone, },
];
DraggableDirective.propDecorators = {
    "source": [{ type: Input, args: ['mglDraggable',] },],
    "dragStart": [{ type: Output },],
    "dragEnd": [{ type: Output },],
    "drag": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ImageSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            this.MapService.addSource(this.id, {
                type: 'image',
                url: this.url,
                coordinates: this.coordinates
            });
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["url"] && !changes["url"].isFirstChange() ||
            changes["coordinates"] && !changes["coordinates"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    }
}
ImageSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-image-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ImageSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
ImageSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "url": [{ type: Input },],
    "coordinates": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class RasterSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.type = 'raster';
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            const /** @type {?} */ source = {
                type: this.type,
                url: this.url,
                tiles: this.tiles,
                bounds: this.bounds,
                minzoom: this.minzoom,
                maxzoom: this.maxzoom,
                tileSize: this.tileSize
            };
            this.MapService.addSource(this.id, source);
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["url"] && !changes["url"].isFirstChange() ||
            changes["tiles"] && !changes["tiles"].isFirstChange() ||
            changes["bounds"] && !changes["bounds"].isFirstChange() ||
            changes["minzoom"] && !changes["minzoom"].isFirstChange() ||
            changes["maxzoom"] && !changes["maxzoom"].isFirstChange() ||
            changes["tileSize"] && !changes["tileSize"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    }
}
RasterSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-raster-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
RasterSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
RasterSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "url": [{ type: Input },],
    "tiles": [{ type: Input },],
    "bounds": [{ type: Input },],
    "minzoom": [{ type: Input },],
    "maxzoom": [{ type: Input },],
    "tileSize": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class VectorSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.type = 'vector';
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            this.MapService.addSource(this.id, {
                type: this.type,
                url: this.url,
                tiles: this.tiles,
                minzoom: this.minzoom,
                maxzoom: this.maxzoom,
            });
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["url"] && !changes["url"].isFirstChange() ||
            changes["tiles"] && !changes["tiles"].isFirstChange() ||
            changes["minzoom"] && !changes["minzoom"].isFirstChange() ||
            changes["maxzoom"] && !changes["maxzoom"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    }
}
VectorSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-vector-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
VectorSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
VectorSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "url": [{ type: Input },],
    "tiles": [{ type: Input },],
    "minzoom": [{ type: Input },],
    "maxzoom": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class VideoSourceComponent {
    /**
     * @param {?} MapService
     */
    constructor(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.MapService.mapLoaded$.subscribe(() => {
            this.MapService.addSource(this.id, {
                type: 'video',
                urls: this.urls,
                coordinates: this.coordinates
            });
            this.sourceAdded = true;
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["urls"] && !changes["urls"].isFirstChange() ||
            changes["coordinates"] && !changes["coordinates"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    }
}
VideoSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-video-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
VideoSourceComponent.ctorParameters = () => [
    { type: MapService, },
];
VideoSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "urls": [{ type: Input },],
    "coordinates": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxMapboxGLModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgxMapboxGLModule,
            providers: [
                {
                    provide: MAPBOX_API_KEY,
                    useValue: config.accessToken
                }
            ],
        };
    }
}
NgxMapboxGLModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    MapComponent,
                    LayerComponent,
                    DraggableDirective,
                    ImageComponent,
                    VectorSourceComponent,
                    GeoJSONSourceComponent,
                    RasterSourceComponent,
                    ImageSourceComponent,
                    VideoSourceComponent,
                    CanvasSourceComponent,
                    FeatureComponent,
                    MarkerComponent,
                    PopupComponent,
                    ControlComponent,
                    FullscreenControlDirective,
                    NavigationControlDirective,
                    GeolocateControlDirective,
                    AttributionControlDirective,
                    ScaleControlDirective,
                    PointDirective,
                    ClusterPointDirective,
                    MarkerClusterComponent
                ],
                exports: [
                    MapComponent,
                    LayerComponent,
                    DraggableDirective,
                    ImageComponent,
                    VectorSourceComponent,
                    GeoJSONSourceComponent,
                    RasterSourceComponent,
                    ImageSourceComponent,
                    VideoSourceComponent,
                    CanvasSourceComponent,
                    FeatureComponent,
                    MarkerComponent,
                    PopupComponent,
                    ControlComponent,
                    FullscreenControlDirective,
                    NavigationControlDirective,
                    GeolocateControlDirective,
                    AttributionControlDirective,
                    ScaleControlDirective,
                    PointDirective,
                    ClusterPointDirective,
                    MarkerClusterComponent
                ]
            },] },
];
/** @nocollapse */
NgxMapboxGLModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { NgxMapboxGLModule, MAPBOX_API_KEY, MapService, MapComponent, AttributionControlDirective as ɵq, ControlComponent as ɵm, FullscreenControlDirective as ɵn, GeolocateControlDirective as ɵp, NavigationControlDirective as ɵo, ScaleControlDirective as ɵr, ImageComponent as ɵe, LayerComponent as ɵa, ClusterPointDirective as ɵt, MarkerClusterComponent as ɵu, PointDirective as ɵs, MarkerComponent as ɵk, PopupComponent as ɵl, CanvasSourceComponent as ɵj, DraggableDirective as ɵb, FeatureComponent as ɵc, GeoJSONSourceComponent as ɵd, ImageSourceComponent as ɵh, RasterSourceComponent as ɵg, VectorSourceComponent as ɵf, VideoSourceComponent as ɵi };
//# sourceMappingURL=ngx-mapbox-gl.js.map
