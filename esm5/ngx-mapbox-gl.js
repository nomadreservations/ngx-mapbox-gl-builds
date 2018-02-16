var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
var MAPBOX_API_KEY = new InjectionToken('MapboxApiKey');
/**
 * @record
 */
/**
 * @record
 */
var MapService = /** @class */ (function () {
    /**
     * @param {?} zone
     * @param {?} MAPBOX_API_KEY
     */
    function MapService(zone, MAPBOX_API_KEY) {
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
    MapService.prototype.setup = function (options) {
        var _this = this;
        // Need onStable to wait for a potential @angular/route transition to end
        this.zone.onStable.pipe(first$1()).subscribe(function () {
            // Workaround rollup issue
            _this.assign(MapboxGl, 'accessToken', options.accessToken || _this.MAPBOX_API_KEY);
            if (options.customMapboxApiUrl) {
                _this.assign(MapboxGl, 'config.API_URL', options.customMapboxApiUrl);
            }
            _this.createMap(options.mapOptions);
            _this.hookEvents(options.mapEvents);
            _this.mapEvents = options.mapEvents;
            _this.mapCreated.next(undefined);
            _this.mapCreated.complete();
        });
    };
    /**
     * @return {?}
     */
    MapService.prototype.destroyMap = function () {
        this.subscription.unsubscribe();
        this.mapInstance.remove();
    };
    /**
     * @param {?} minZoom
     * @return {?}
     */
    MapService.prototype.updateMinZoom = function (minZoom) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setMinZoom(minZoom);
        });
    };
    /**
     * @param {?} maxZoom
     * @return {?}
     */
    MapService.prototype.updateMaxZoom = function (maxZoom) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setMaxZoom(maxZoom);
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateScrollZoom = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.scrollZoom.enable() : _this.mapInstance.scrollZoom.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateDragRotate = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.dragRotate.enable() : _this.mapInstance.dragRotate.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateTouchZoomRotate = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.touchZoomRotate.enable() : _this.mapInstance.touchZoomRotate.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateDoubleClickZoom = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.doubleClickZoom.enable() : _this.mapInstance.doubleClickZoom.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateKeyboard = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.keyboard.enable() : _this.mapInstance.keyboard.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateDragPan = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.dragPan.enable() : _this.mapInstance.dragPan.disable();
        });
    };
    /**
     * @param {?} status
     * @return {?}
     */
    MapService.prototype.updateBoxZoom = function (status) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            status ? _this.mapInstance.boxZoom.enable() : _this.mapInstance.boxZoom.disable();
        });
    };
    /**
     * @param {?} style
     * @return {?}
     */
    MapService.prototype.updateStyle = function (style) {
        var _this = this;
        // TODO Probably not so simple, write demo/tests
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setStyle(style);
        });
    };
    /**
     * @param {?} maxBounds
     * @return {?}
     */
    MapService.prototype.updateMaxBounds = function (maxBounds) {
        var _this = this;
        // TODO Probably not so simple, write demo/tests
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setMaxBounds(maxBounds);
        });
    };
    /**
     * @param {?} cursor
     * @return {?}
     */
    MapService.prototype.changeCanvasCursor = function (cursor) {
        var /** @type {?} */ canvas = this.mapInstance.getCanvasContainer();
        canvas.style.cursor = cursor;
    };
    /**
     * @param {?=} pointOrBox
     * @param {?=} parameters
     * @return {?}
     */
    MapService.prototype.queryRenderedFeatures = function (pointOrBox, parameters) {
        return this.mapInstance.queryRenderedFeatures(pointOrBox, parameters);
    };
    /**
     * @param {?} center
     * @return {?}
     */
    MapService.prototype.panTo = function (center) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.panTo(center);
        });
    };
    /**
     * @param {?} movingMethod
     * @param {?=} flyToOptions
     * @param {?=} zoom
     * @param {?=} center
     * @param {?=} bearing
     * @param {?=} pitch
     * @return {?}
     */
    MapService.prototype.move = function (movingMethod, flyToOptions, zoom, center, bearing, pitch) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            ((_this.mapInstance[movingMethod]))(Object.assign({}, flyToOptions, { zoom: zoom ? zoom : _this.mapInstance.getZoom(), center: center ? center : _this.mapInstance.getCenter(), bearing: bearing ? bearing : _this.mapInstance.getBearing(), pitch: pitch ? pitch : _this.mapInstance.getPitch() }));
        });
    };
    /**
     * @param {?} layer
     * @param {?=} before
     * @return {?}
     */
    MapService.prototype.addLayer = function (layer, before) {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            Object.keys(layer.layerOptions)
                .forEach(function (key) {
                var /** @type {?} */ tkey = (key);
                if (layer.layerOptions[tkey] === undefined) {
                    delete layer.layerOptions[tkey];
                }
            });
            _this.mapInstance.addLayer(layer.layerOptions, before);
            if (layer.layerEvents.click.observers.length) {
                _this.mapInstance.on('click', layer.layerOptions.id, function (evt) {
                    _this.zone.run(function () {
                        layer.layerEvents.click.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseEnter.observers.length) {
                _this.mapInstance.on('mouseenter', layer.layerOptions.id, function (evt) {
                    _this.zone.run(function () {
                        layer.layerEvents.mouseEnter.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseLeave.observers.length) {
                _this.mapInstance.on('mouseleave', layer.layerOptions.id, function (evt) {
                    _this.zone.run(function () {
                        layer.layerEvents.mouseLeave.emit(evt);
                    });
                });
            }
            if (layer.layerEvents.mouseMove.observers.length) {
                _this.mapInstance.on('mousemove', layer.layerOptions.id, function (evt) {
                    _this.zone.run(function () {
                        layer.layerEvents.mouseMove.emit(evt);
                    });
                });
            }
        });
    };
    /**
     * @param {?} layerId
     * @return {?}
     */
    MapService.prototype.removeLayer = function (layerId) {
        this.layerIdsToRemove.push(layerId);
    };
    /**
     * @param {?} marker
     * @return {?}
     */
    MapService.prototype.addMarker = function (marker) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            marker.addTo(_this.mapInstance);
        });
    };
    /**
     * @param {?} marker
     * @return {?}
     */
    MapService.prototype.removeMarker = function (marker) {
        this.markersToRemove.push(marker);
    };
    /**
     * @param {?} popup
     * @return {?}
     */
    MapService.prototype.addPopup = function (popup) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            popup.addTo(_this.mapInstance);
        });
    };
    /**
     * @param {?} popup
     * @return {?}
     */
    MapService.prototype.removePopup = function (popup) {
        this.popupsToRemove.push(popup);
    };
    /**
     * @param {?} control
     * @param {?=} position
     * @return {?}
     */
    MapService.prototype.addControl = function (control, position) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.addControl(/** @type {?} */ (control), position);
        });
    };
    /**
     * @param {?} control
     * @return {?}
     */
    MapService.prototype.removeControl = function (control) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.removeControl(/** @type {?} */ (control));
        });
    };
    /**
     * @param {?} imageId
     * @param {?} url
     * @param {?=} options
     * @return {?}
     */
    MapService.prototype.loadAndAddImage = function (imageId, url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.zone.runOutsideAngular(function () {
                        return new Promise(function (resolve, reject) {
                            _this.mapInstance.loadImage(url, function (error, image) {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                _this.addImage(imageId, image, options);
                                resolve();
                            });
                        });
                    })];
            });
        });
    };
    /**
     * @param {?} imageId
     * @param {?} data
     * @param {?=} options
     * @return {?}
     */
    MapService.prototype.addImage = function (imageId, data, options) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.addImage(imageId, /** @type {?} */ (data), options);
        });
    };
    /**
     * @param {?} imageId
     * @return {?}
     */
    MapService.prototype.removeImage = function (imageId) {
        this.imageIdsToRemove.push(imageId);
    };
    /**
     * @param {?} sourceId
     * @param {?} source
     * @return {?}
     */
    MapService.prototype.addSource = function (sourceId, source) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            Object.keys(source)
                .forEach(function (key) { return ((source))[key] === undefined && delete ((source))[key]; });
            _this.mapInstance.addSource(sourceId, /** @type {?} */ (source)); // Typings issue
        });
    };
    /**
     * @template T
     * @param {?} sourceId
     * @return {?}
     */
    MapService.prototype.getSource = function (sourceId) {
        return /** @type {?} */ ((this.mapInstance.getSource(sourceId)));
    };
    /**
     * @param {?} sourceId
     * @return {?}
     */
    MapService.prototype.removeSource = function (sourceId) {
        this.sourceIdsToRemove.push(sourceId);
    };
    /**
     * @param {?} layerId
     * @param {?} paint
     * @return {?}
     */
    MapService.prototype.setAllLayerPaintProperty = function (layerId, paint) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            Object.keys(paint).forEach(function (key) {
                // TODO Check for perf, setPaintProperty only on changed paint props maybe
                _this.mapInstance.setPaintProperty(layerId, key, ((paint))[key]);
            });
        });
    };
    /**
     * @param {?} layerId
     * @param {?} layout
     * @return {?}
     */
    MapService.prototype.setAllLayerLayoutProperty = function (layerId, layout) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            Object.keys(layout).forEach(function (key) {
                // TODO Check for perf, setPaintProperty only on changed paint props maybe
                _this.mapInstance.setLayoutProperty(layerId, key, ((layout))[key]);
            });
        });
    };
    /**
     * @param {?} layerId
     * @param {?} filter
     * @return {?}
     */
    MapService.prototype.setLayerFilter = function (layerId, filter) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setFilter(layerId, filter);
        });
    };
    /**
     * @param {?} layerId
     * @param {?} beforeId
     * @return {?}
     */
    MapService.prototype.setLayerBefore = function (layerId, beforeId) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.moveLayer(layerId, beforeId);
        });
    };
    /**
     * @param {?} layerId
     * @param {?=} minZoom
     * @param {?=} maxZoom
     * @return {?}
     */
    MapService.prototype.setLayerZoomRange = function (layerId, minZoom, maxZoom) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.setLayerZoomRange(layerId, minZoom ? minZoom : 0, maxZoom ? maxZoom : 20);
        });
    };
    /**
     * @param {?} bounds
     * @param {?=} options
     * @return {?}
     */
    MapService.prototype.fitBounds = function (bounds, options) {
        var _this = this;
        return this.zone.runOutsideAngular(function () {
            _this.mapInstance.fitBounds(bounds, options);
        });
    };
    /**
     * @return {?}
     */
    MapService.prototype.getCurrentViewportBbox = function () {
        var /** @type {?} */ canvas = this.mapInstance.getCanvas();
        var /** @type {?} */ w = canvas.width;
        var /** @type {?} */ h = canvas.height;
        var /** @type {?} */ upLeft = this.mapInstance.unproject([0, 0]).toArray();
        var /** @type {?} */ upRight = this.mapInstance.unproject([w, 0]).toArray();
        var /** @type {?} */ downRight = this.mapInstance.unproject([w, h]).toArray();
        var /** @type {?} */ downLeft = this.mapInstance.unproject([0, h]).toArray();
        return bbox(polygon([[upLeft, upRight, downRight, downLeft, upLeft]]));
    };
    /**
     * @return {?}
     */
    MapService.prototype.applyChanges = function () {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            _this.removeLayers();
            _this.removeSources();
            _this.removeMarkers();
            _this.removePopups();
            _this.removeImages();
        });
    };
    /**
     * @param {?} options
     * @return {?}
     */
    MapService.prototype.createMap = function (options) {
        var _this = this;
        NgZone.assertNotInAngularZone();
        Object.keys(options)
            .forEach(function (key) {
            var /** @type {?} */ tkey = (key);
            if (options[tkey] === undefined) {
                delete options[tkey];
            }
        });
        this.mapInstance = new Map(options);
        var /** @type {?} */ sub = this.zone.onMicrotaskEmpty
            .subscribe(function () { return _this.applyChanges(); });
        this.subscription.add(sub);
    };
    /**
     * @return {?}
     */
    MapService.prototype.removeLayers = function () {
        try {
            for (var _a = __values(this.layerIdsToRemove), _b = _a.next(); !_b.done; _b = _a.next()) {
                var layerId = _b.value;
                this.mapInstance.off('click', layerId);
                this.mapInstance.off('mouseenter', layerId);
                this.mapInstance.off('mouseleave', layerId);
                this.mapInstance.off('mousemove', layerId);
                this.mapInstance.removeLayer(layerId);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.layerIdsToRemove = [];
        var e_1, _c;
    };
    /**
     * @return {?}
     */
    MapService.prototype.removeSources = function () {
        try {
            for (var _a = __values(this.sourceIdsToRemove), _b = _a.next(); !_b.done; _b = _a.next()) {
                var sourceId = _b.value;
                this.mapInstance.removeSource(sourceId);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.sourceIdsToRemove = [];
        var e_2, _c;
    };
    /**
     * @return {?}
     */
    MapService.prototype.removeMarkers = function () {
        try {
            for (var _a = __values(this.markersToRemove), _b = _a.next(); !_b.done; _b = _a.next()) {
                var marker = _b.value;
                marker.remove();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.markersToRemove = [];
        var e_3, _c;
    };
    /**
     * @return {?}
     */
    MapService.prototype.removePopups = function () {
        try {
            for (var _a = __values(this.popupsToRemove), _b = _a.next(); !_b.done; _b = _a.next()) {
                var popup = _b.value;
                popup.remove();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.popupsToRemove = [];
        var e_4, _c;
    };
    /**
     * @return {?}
     */
    MapService.prototype.removeImages = function () {
        try {
            for (var _a = __values(this.imageIdsToRemove), _b = _a.next(); !_b.done; _b = _a.next()) {
                var imageId = _b.value;
                this.mapInstance.removeImage(imageId);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_5) throw e_5.error; }
        }
        this.imageIdsToRemove = [];
        var e_5, _c;
    };
    /**
     * @param {?} events
     * @return {?}
     */
    MapService.prototype.hookEvents = function (events) {
        var _this = this;
        this.mapInstance.on('load', function () {
            _this.mapLoaded.next(undefined);
            _this.mapLoaded.complete();
            _this.zone.run(function () { return events.load.emit(_this.mapInstance); });
        });
        if (events.resize.observers.length) {
            this.mapInstance.on('resize', function () { return _this.zone.run(function () { return events.resize.emit(); }); });
        }
        if (events.remove.observers.length) {
            this.mapInstance.on('remove', function () { return _this.zone.run(function () { return events.remove.emit(); }); });
        }
        if (events.mouseDown.observers.length) {
            this.mapInstance.on('mousedown', function (evt) { return _this.zone.run(function () { return events.mouseDown.emit(evt); }); });
        }
        if (events.mouseUp.observers.length) {
            this.mapInstance.on('mouseup', function (evt) { return _this.zone.run(function () { return events.mouseUp.emit(evt); }); });
        }
        if (events.mouseMove.observers.length) {
            this.mapInstance.on('mousemove', function (evt) { return _this.zone.run(function () { return events.mouseMove.emit(evt); }); });
        }
        if (events.click.observers.length) {
            this.mapInstance.on('click', function (evt) { return _this.zone.run(function () { return events.click.emit(evt); }); });
        }
        if (events.dblClick.observers.length) {
            this.mapInstance.on('dblclick', function (evt) { return _this.zone.run(function () { return events.dblClick.emit(evt); }); });
        }
        if (events.mouseEnter.observers.length) {
            this.mapInstance.on('mouseenter', function (evt) { return _this.zone.run(function () { return events.mouseEnter.emit(evt); }); });
        }
        if (events.mouseLeave.observers.length) {
            this.mapInstance.on('mouseleave', function (evt) { return _this.zone.run(function () { return events.mouseLeave.emit(evt); }); });
        }
        if (events.mouseOver.observers.length) {
            this.mapInstance.on('mouseover', function (evt) { return _this.zone.run(function () { return events.mouseOver.emit(evt); }); });
        }
        if (events.mouseOut.observers.length) {
            this.mapInstance.on('mouseout', function (evt) { return _this.zone.run(function () { return events.mouseOut.emit(evt); }); });
        }
        if (events.contextMenu.observers.length) {
            this.mapInstance.on('contextmenu', function (evt) { return _this.zone.run(function () { return events.contextMenu.emit(evt); }); });
        }
        if (events.touchStart.observers.length) {
            this.mapInstance.on('touchstart', function (evt) { return _this.zone.run(function () { return events.touchStart.emit(evt); }); });
        }
        if (events.touchEnd.observers.length) {
            this.mapInstance.on('touchend', function (evt) { return _this.zone.run(function () { return events.touchEnd.emit(evt); }); });
        }
        if (events.touchMove.observers.length) {
            this.mapInstance.on('touchmove', function (evt) { return _this.zone.run(function () { return events.touchMove.emit(evt); }); });
        }
        if (events.touchCancel.observers.length) {
            this.mapInstance.on('touchcancel', function (evt) { return _this.zone.run(function () { return events.touchCancel.emit(evt); }); });
        }
        if (events.moveStart.observers.length) {
            this.mapInstance.on('movestart', function (evt) { return _this.zone.run(function () { return events.moveStart.emit(evt); }); });
        }
        if (events.move.observers.length) {
            this.mapInstance.on('move', function (evt) { return _this.zone.run(function () { return events.move.emit(evt); }); });
        }
        if (events.moveEnd.observers.length) {
            this.mapInstance.on('moveend', function (evt) { return _this.zone.run(function () { return events.moveEnd.emit(evt); }); });
        }
        if (events.dragStart.observers.length) {
            this.mapInstance.on('dragstart', function (evt) { return _this.zone.run(function () { return events.dragStart.emit(evt); }); });
        }
        if (events.drag.observers.length) {
            this.mapInstance.on('drag', function (evt) { return _this.zone.run(function () { return events.drag.emit(evt); }); });
        }
        if (events.dragEnd.observers.length) {
            this.mapInstance.on('dragend', function (evt) { return _this.zone.run(function () { return events.dragEnd.emit(evt); }); });
        }
        if (events.zoomStart.observers.length) {
            this.mapInstance.on('zoomstart', function (evt) { return _this.zone.run(function () { return events.zoomStart.emit(evt); }); });
        }
        if (events.zoomEvt.observers.length) {
            this.mapInstance.on('zoom', function (evt) { return _this.zone.run(function () { return events.zoomEvt.emit(evt); }); });
        }
        if (events.zoomEnd.observers.length) {
            this.mapInstance.on('zoomend', function (evt) { return _this.zone.run(function () { return events.zoomEnd.emit(evt); }); });
        }
        if (events.rotateStart.observers.length) {
            this.mapInstance.on('rotatestart', function (evt) { return _this.zone.run(function () { return events.rotateStart.emit(evt); }); });
        }
        if (events.rotate.observers.length) {
            this.mapInstance.on('rotate', function (evt) { return _this.zone.run(function () { return events.rotate.emit(evt); }); });
        }
        if (events.rotateEnd.observers.length) {
            this.mapInstance.on('rotateend', function (evt) { return _this.zone.run(function () { return events.rotateEnd.emit(evt); }); });
        }
        if (events.pitchStart.observers.length) {
            this.mapInstance.on('pitchstart', function (evt) { return _this.zone.run(function () { return events.pitchStart.emit(evt); }); });
        }
        if (events.pitchEvt.observers.length) {
            this.mapInstance.on('pitch', function (evt) { return _this.zone.run(function () { return events.pitchEvt.emit(evt); }); });
        }
        if (events.pitchEnd.observers.length) {
            this.mapInstance.on('pitchend', function (evt) { return _this.zone.run(function () { return events.pitchEnd.emit(evt); }); });
        }
        if (events.boxZoomStart.observers.length) {
            this.mapInstance.on('boxzoomstart', function (evt) { return _this.zone.run(function () { return events.boxZoomStart.emit(evt); }); });
        }
        if (events.boxZoomEnd.observers.length) {
            this.mapInstance.on('boxzoomend', function (evt) { return _this.zone.run(function () { return events.boxZoomEnd.emit(evt); }); });
        }
        if (events.boxZoomCancel.observers.length) {
            this.mapInstance.on('boxzoomcancel', function (evt) { return _this.zone.run(function () { return events.boxZoomCancel.emit(evt); }); });
        }
        if (events.webGlContextLost.observers.length) {
            this.mapInstance.on('webglcontextlost', function () { return _this.zone.run(function () { return events.webGlContextLost.emit(); }); });
        }
        if (events.webGlContextRestored.observers.length) {
            this.mapInstance.on('webglcontextrestored', function () { return _this.zone.run(function () { return events.webGlContextRestored.emit(); }); });
        }
        if (events.render.observers.length) {
            this.mapInstance.on('render', function () { return _this.zone.run(function () { return events.render.emit(); }); });
        }
        if (events.error.observers.length) {
            this.mapInstance.on('error', function () { return _this.zone.run(function () { return events.error.emit(); }); });
        }
        if (events.data.observers.length) {
            this.mapInstance.on('data', function (evt) { return _this.zone.run(function () { return events.data.emit(evt); }); });
        }
        if (events.styleData.observers.length) {
            this.mapInstance.on('styledata', function (evt) { return _this.zone.run(function () { return events.styleData.emit(evt); }); });
        }
        if (events.sourceData.observers.length) {
            this.mapInstance.on('sourcedata', function (evt) { return _this.zone.run(function () { return events.sourceData.emit(evt); }); });
        }
        if (events.dataLoading.observers.length) {
            this.mapInstance.on('dataloading', function (evt) { return _this.zone.run(function () { return events.dataLoading.emit(evt); }); });
        }
        if (events.styleDataLoading.observers.length) {
            this.mapInstance.on('styledataloading', function (evt) { return _this.zone.run(function () { return events.styleDataLoading.emit(evt); }); });
        }
        if (events.sourceDataLoading.observers.length) {
            this.mapInstance.on('sourcedataloading', function (evt) { return _this.zone.run(function () { return events.sourceDataLoading.emit(evt); }); });
        }
    };
    /**
     * @param {?} obj
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    MapService.prototype.assign = function (obj, prop, value) {
        if (typeof prop === 'string') {
            // tslint:disable-next-line:no-parameter-reassignment
            prop = prop.split('.');
        }
        if (prop.length > 1) {
            var /** @type {?} */ e = prop.shift();
            this.assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === '[object Object]'
                    ? obj[e]
                    : {}, prop, value);
        }
        else {
            obj[prop[0]] = value;
        }
    };
    return MapService;
}());
MapService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MapService.ctorParameters = function () { return [
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAPBOX_API_KEY,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CustomControl = /** @class */ (function () {
    /**
     * @param {?} container
     */
    function CustomControl(container) {
        this.container = container;
    }
    /**
     * @return {?}
     */
    CustomControl.prototype.onAdd = function () {
        return this.container;
    };
    /**
     * @return {?}
     */
    CustomControl.prototype.onRemove = function () {
        return /** @type {?} */ ((this.container.parentNode)).removeChild(this.container);
    };
    /**
     * @return {?}
     */
    CustomControl.prototype.getDefaultPosition = function () {
        return 'top-right';
    };
    return CustomControl;
}());
var ControlComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function ControlComponent(MapService$$1) {
        this.MapService = MapService$$1;
    }
    /**
     * @return {?}
     */
    ControlComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.content.nativeElement.childNodes.length) {
            this.control = new CustomControl(this.content.nativeElement);
            this.MapService.mapCreated$.subscribe(function () {
                _this.MapService.addControl(/** @type {?} */ ((_this.control)), _this.position);
            });
        }
    };
    /**
     * @return {?}
     */
    ControlComponent.prototype.ngOnDestroy = function () {
        this.MapService.removeControl(this.control);
    };
    return ControlComponent;
}());
ControlComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-control',
                template: '<div class="mapboxgl-ctrl" #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ControlComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
ControlComponent.propDecorators = {
    "position": [{ type: Input },],
    "content": [{ type: ViewChild, args: ['content',] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var AttributionControlDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    function AttributionControlDirective(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    AttributionControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            var /** @type {?} */ options = {};
            if (_this.compact !== undefined) {
                options.compact = _this.compact;
            }
            _this.ControlComponent.control = new AttributionControl(options);
            _this.MapService.addControl(_this.ControlComponent.control, _this.ControlComponent.position);
        });
    };
    return AttributionControlDirective;
}());
AttributionControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglAttribution]'
            },] },
];
/** @nocollapse */
AttributionControlDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
]; };
AttributionControlDirective.propDecorators = {
    "compact": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var FullscreenControlDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    function FullscreenControlDirective(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    FullscreenControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            _this.ControlComponent.control = new FullscreenControl();
            _this.MapService.addControl(_this.ControlComponent.control, _this.ControlComponent.position);
        });
    };
    return FullscreenControlDirective;
}());
FullscreenControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglFullscreen]'
            },] },
];
/** @nocollapse */
FullscreenControlDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var GeolocateControlDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    function GeolocateControlDirective(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    GeolocateControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            var /** @type {?} */ options = {
                positionOptions: _this.positionOptions,
                fitBoundsOptions: _this.fitBoundsOptions,
                trackUserLocation: _this.trackUserLocation,
                showUserLocation: _this.showUserLocation
            };
            Object.keys(options)
                .forEach(function (key) {
                var /** @type {?} */ tkey = (key);
                if (options[tkey] === undefined) {
                    delete options[tkey];
                }
            });
            _this.ControlComponent.control = new GeolocateControl(options);
            _this.MapService.addControl(_this.ControlComponent.control, _this.ControlComponent.position);
        });
    };
    return GeolocateControlDirective;
}());
GeolocateControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglGeolocate]'
            },] },
];
/** @nocollapse */
GeolocateControlDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
]; };
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
var NavigationControlDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    function NavigationControlDirective(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    NavigationControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            _this.ControlComponent.control = new NavigationControl();
            _this.MapService.addControl(_this.ControlComponent.control, _this.ControlComponent.position);
        });
    };
    return NavigationControlDirective;
}());
NavigationControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglNavigation]'
            },] },
];
/** @nocollapse */
NavigationControlDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ScaleControlDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ControlComponent
     */
    function ScaleControlDirective(MapService$$1, ControlComponent$$1) {
        this.MapService = MapService$$1;
        this.ControlComponent = ControlComponent$$1;
    }
    /**
     * @return {?}
     */
    ScaleControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.ControlComponent.control) {
                throw new Error('Another control is already set for this control');
            }
            var /** @type {?} */ options = {};
            if (_this.maxWidth !== undefined) {
                options.maxWidth = _this.maxWidth;
            }
            if (_this.unit !== undefined) {
                options.unit = _this.unit;
            }
            _this.ControlComponent.control = new ScaleControl(options);
            _this.MapService.addControl(_this.ControlComponent.control, _this.ControlComponent.position);
        });
    };
    return ScaleControlDirective;
}());
ScaleControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglScale]'
            },] },
];
/** @nocollapse */
ScaleControlDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: ControlComponent, decorators: [{ type: Host },] },
]; };
ScaleControlDirective.propDecorators = {
    "maxWidth": [{ type: Input },],
    "unit": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ImageComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} zone
     */
    function ImageComponent(MapService$$1, zone) {
        this.MapService = MapService$$1;
        this.zone = zone;
        this.error = new EventEmitter();
        this.loaded = new EventEmitter();
        this.imageAdded = false;
    }
    /**
     * @return {?}
     */
    ImageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data) return [3 /*break*/, 1];
                        this.MapService.addImage(this.id, this.data, this.options);
                        this.imageAdded = true;
                        return [3 /*break*/, 5];
                    case 1:
                        if (!this.url) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.MapService.loadAndAddImage(this.id, this.url, this.options)];
                    case 3:
                        _a.sent();
                        this.imageAdded = true;
                        this.zone.run(function () {
                            _this.loaded.emit();
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.zone.run(function () {
                            _this.error.emit(error_1);
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageComponent.prototype.ngOnChanges = function (changes) {
        if (changes["data"] && !changes["data"].isFirstChange() ||
            changes["options"] && !changes["options"].isFirstChange() ||
            changes["url"] && !changes["url"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    ImageComponent.prototype.ngOnDestroy = function () {
        if (this.imageAdded) {
            this.MapService.removeImage(this.id);
        }
    };
    return ImageComponent;
}());
ImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-image',
                template: ''
            },] },
];
/** @nocollapse */
ImageComponent.ctorParameters = function () { return [
    { type: MapService, },
    { type: NgZone, },
]; };
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
var LayerComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function LayerComponent(MapService$$1) {
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
    LayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            _this.MapService.addLayer({
                layerOptions: {
                    id: _this.id,
                    type: _this.type,
                    source: _this.source,
                    metadata: _this.metadata,
                    'source-layer': _this.sourceLayer,
                    minzoom: _this.minzoom,
                    maxzoom: _this.maxzoom,
                    filter: _this.filter,
                    layout: _this.layout,
                    paint: _this.paint
                },
                layerEvents: {
                    click: _this.click,
                    mouseEnter: _this.mouseEnter,
                    mouseLeave: _this.mouseLeave,
                    mouseMove: _this.mouseMove
                }
            }, _this.before);
            _this.layerAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    LayerComponent.prototype.ngOnChanges = function (changes) {
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
    };
    /**
     * @return {?}
     */
    LayerComponent.prototype.ngOnDestroy = function () {
        if (this.layerAdded) {
            this.MapService.removeLayer(this.id);
        }
    };
    return LayerComponent;
}());
LayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-layer',
                template: ''
            },] },
];
/** @nocollapse */
LayerComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var MapComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function MapComponent(MapService$$1) {
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
    Object.defineProperty(MapComponent.prototype, "mapInstance", {
        /**
         * @return {?}
         */
        get: function () {
            return this.MapService.mapInstance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MapComponent.prototype.ngAfterViewInit = function () {
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
    };
    /**
     * @return {?}
     */
    MapComponent.prototype.ngOnDestroy = function () {
        this.MapService.destroyMap();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MapComponent.prototype.ngOnChanges = function (changes) {
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
    };
    return MapComponent;
}());
MapComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-map',
                template: '<div #container></div>',
                styles: ["\n  :host {\n    display: block;\n  }\n  div {\n    height: 100%;\n    width: 100%;\n  }\n  "],
                providers: [
                    MapService
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MapComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var PointDirective = /** @class */ (function () {
    function PointDirective() {
    }
    return PointDirective;
}());
PointDirective.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[mglPoint]' },] },
];
/** @nocollapse */
PointDirective.ctorParameters = function () { return []; };
var ClusterPointDirective = /** @class */ (function () {
    function ClusterPointDirective() {
    }
    return ClusterPointDirective;
}());
ClusterPointDirective.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[mglClusterPoint]' },] },
];
/** @nocollapse */
ClusterPointDirective.ctorParameters = function () { return []; };
var MarkerClusterComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} ChangeDetectorRef
     */
    function MarkerClusterComponent(MapService$$1, ChangeDetectorRef$$1) {
        this.MapService = MapService$$1;
        this.ChangeDetectorRef = ChangeDetectorRef$$1;
        this.sub = new Subscription$1();
    }
    /**
     * @return {?}
     */
    MarkerClusterComponent.prototype.ngOnInit = function () {
        var /** @type {?} */ options = {
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
            .forEach(function (key) {
            var /** @type {?} */ tkey = (key);
            if (options[tkey] === undefined) {
                delete options[tkey];
            }
        });
        this.supercluster = supercluster(options);
        this.supercluster.load(this.data.features);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MarkerClusterComponent.prototype.ngOnChanges = function (changes) {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.supercluster.load(this.data.features);
        }
    };
    /**
     * @return {?}
     */
    MarkerClusterComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.MapService.mapCreated$.subscribe(function () {
            var /** @type {?} */ mapMove$ = merge$1(fromEvent$1(_this.MapService.mapInstance, 'zoomChange'), fromEvent$1(_this.MapService.mapInstance, 'move'));
            var /** @type {?} */ sub = mapMove$.pipe(startWith$1(undefined)).subscribe(function () { return _this.updateCluster(); });
            _this.sub.add(sub);
        });
    };
    /**
     * @return {?}
     */
    MarkerClusterComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    /**
     * @return {?}
     */
    MarkerClusterComponent.prototype.updateCluster = function () {
        var /** @type {?} */ bbox$$1 = this.MapService.getCurrentViewportBbox();
        var /** @type {?} */ currentZoom = Math.round(this.MapService.mapInstance.getZoom());
        this.clusterPoints = this.supercluster.getClusters(bbox$$1, currentZoom);
        this.ChangeDetectorRef.detectChanges();
        this.MapService.applyChanges();
    };
    return MarkerClusterComponent;
}());
MarkerClusterComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-marker-cluster',
                template: "\n    <ng-container *ngFor=\"let feature of clusterPoints\">\n      <ng-container *ngIf=\"feature.properties.cluster; else point\">\n        <mgl-marker\n          [feature]=\"feature\"\n        >\n          <ng-container *ngTemplateOutlet=\"clusterPointTpl; context: { $implicit: feature }\"></ng-container>\n        </mgl-marker>\n      </ng-container>\n      <ng-template #point>\n        <mgl-marker\n          [feature]=\"feature\"\n        >\n          <ng-container *ngTemplateOutlet=\"pointTpl; context: { $implicit: feature }\"></ng-container>\n        </mgl-marker>\n      </ng-template>\n    </ng-container>\n  ",
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false
            },] },
];
/** @nocollapse */
MarkerClusterComponent.ctorParameters = function () { return [
    { type: MapService, },
    { type: ChangeDetectorRef, },
]; };
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
var MarkerComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function MarkerComponent(MapService$$1) {
        this.MapService = MapService$$1;
    }
    /**
     * @return {?}
     */
    MarkerComponent.prototype.ngOnInit = function () {
        if (this.feature && this.lngLat) {
            throw new Error('feature and lngLat input are mutually exclusive');
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MarkerComponent.prototype.ngOnChanges = function (changes) {
        if (changes["lngLat"] && !changes["lngLat"].isFirstChange()) {
            /** @type {?} */ ((this.markerInstance)).setLngLat(/** @type {?} */ ((this.lngLat)));
        }
        if (changes["feature"] && !changes["feature"].isFirstChange()) {
            /** @type {?} */ ((this.markerInstance)).setLngLat(/** @type {?} */ ((((this.feature)).geometry)).coordinates);
        }
    };
    /**
     * @return {?}
     */
    MarkerComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.markerInstance = new Marker(this.content.nativeElement, { offset: this.offset });
        this.markerInstance.setLngLat(this.feature ? /** @type {?} */ ((this.feature.geometry)).coordinates : /** @type {?} */ ((this.lngLat)));
        this.MapService.mapCreated$.subscribe(function () {
            _this.MapService.addMarker(/** @type {?} */ ((_this.markerInstance)));
        });
    };
    /**
     * @return {?}
     */
    MarkerComponent.prototype.ngOnDestroy = function () {
        this.MapService.removeMarker(/** @type {?} */ ((this.markerInstance)));
        this.markerInstance = undefined;
    };
    /**
     * @return {?}
     */
    MarkerComponent.prototype.togglePopup = function () {
        /** @type {?} */ ((this.markerInstance)).togglePopup();
    };
    return MarkerComponent;
}());
MarkerComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-marker',
                template: '<div #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MarkerComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var PopupComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function PopupComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.close = new EventEmitter();
    }
    /**
     * @return {?}
     */
    PopupComponent.prototype.ngOnInit = function () {
        if (this.lngLat && this.marker) {
            throw new Error('marker and lngLat input are mutually exclusive');
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PopupComponent.prototype.ngOnChanges = function (changes) {
        if (changes["lngLat"] && !changes["lngLat"].isFirstChange()) {
            this.MapService.removePopup(/** @type {?} */ ((this.popupInstance)));
            var /** @type {?} */ popupInstanceTmp = this.createPopup();
            this.MapService.addPopup(popupInstanceTmp);
            this.popupInstance = popupInstanceTmp;
        }
        if (changes["marker"] && !changes["marker"].isFirstChange()) {
            var /** @type {?} */ previousMarker = changes["marker"].previousValue;
            if (previousMarker.markerInstance) {
                previousMarker.markerInstance.setPopup(undefined);
            }
            if (this.marker && this.marker.markerInstance) {
                this.marker.markerInstance.setPopup(this.popupInstance);
            }
        }
    };
    /**
     * @return {?}
     */
    PopupComponent.prototype.ngAfterViewInit = function () {
        this.popupInstance = this.createPopup();
    };
    /**
     * @return {?}
     */
    PopupComponent.prototype.ngOnDestroy = function () {
        this.MapService.removePopup(/** @type {?} */ ((this.popupInstance)));
        this.popupInstance = undefined;
    };
    /**
     * @return {?}
     */
    PopupComponent.prototype.createPopup = function () {
        var _this = this;
        var /** @type {?} */ options = {
            closeButton: this.closeButton,
            closeOnClick: this.closeOnClick,
            anchor: this.anchor,
            offset: this.offset
        };
        Object.keys(options)
            .forEach(function (key) { return ((options))[key] === undefined && delete ((options))[key]; });
        var /** @type {?} */ popupInstance = new Popup(options);
        popupInstance.once('close', function () {
            _this.close.emit();
        });
        popupInstance.setDOMContent(this.content.nativeElement);
        this.MapService.mapCreated$.subscribe(function () {
            if (_this.lngLat) {
                popupInstance.setLngLat(_this.lngLat);
                _this.MapService.addPopup(popupInstance);
            }
            else if (_this.marker && _this.marker.markerInstance) {
                _this.marker.markerInstance.setPopup(popupInstance);
            }
        });
        return popupInstance;
    };
    return PopupComponent;
}());
PopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-popup',
                template: '<div #content><ng-content></ng-content></div>',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
PopupComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var CanvasSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function CanvasSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    CanvasSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            var /** @type {?} */ source = {
                type: 'canvas',
                coordinates: _this.coordinates,
                canvas: _this.canvas,
                animate: _this.animate,
            };
            _this.MapService.addSource(_this.id, source);
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    CanvasSourceComponent.prototype.ngOnChanges = function (changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["coordinates"] && !changes["coordinates"].isFirstChange() ||
            changes["canvas"] && !changes["canvas"].isFirstChange() ||
            changes["animate"] && !changes["animate"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    CanvasSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    };
    return CanvasSourceComponent;
}());
CanvasSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-canvas-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
CanvasSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var GeoJSONSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function GeoJSONSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.updateFeatureData = new Subject$1();
        this.sourceAdded = false;
        this.featureIdCounter = 0;
    }
    /**
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.data) {
            this.data = {
                type: 'FeatureCollection',
                features: []
            };
        }
        this.MapService.mapLoaded$.subscribe(function () {
            _this.MapService.addSource(_this.id, {
                type: 'geojson',
                data: _this.data,
                maxzoom: _this.maxzoom,
                minzoom: _this.minzoom,
                buffer: _this.buffer,
                tolerance: _this.tolerance,
                cluster: _this.cluster,
                clusterRadius: _this.clusterRadius,
                clusterMaxZoom: _this.clusterMaxZoom,
            });
            _this.sub = _this.updateFeatureData.pipe(debounceTime$1(0)).subscribe(function () {
                var /** @type {?} */ source = _this.MapService.getSource(_this.id);
                source.setData(/** @type {?} */ ((_this.data)));
            });
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.ngOnChanges = function (changes) {
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
            var /** @type {?} */ source = this.MapService.getSource(this.id);
            source.setData(/** @type {?} */ ((this.data)));
        }
    };
    /**
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.sub.unsubscribe();
            this.MapService.removeSource(this.id);
        }
    };
    /**
     * @param {?} feature
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.addFeature = function (feature) {
        var /** @type {?} */ collection = (this.data);
        collection.features.push(feature);
        this.updateFeatureData.next();
    };
    /**
     * @param {?} feature
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.removeFeature = function (feature) {
        var /** @type {?} */ collection = (this.data);
        var /** @type {?} */ index = collection.features.indexOf(feature);
        if (index > -1) {
            collection.features.splice(index, 1);
        }
        this.updateFeatureData.next();
    };
    /**
     * @return {?}
     */
    GeoJSONSourceComponent.prototype.getNewFeatureId = function () {
        return ++this.featureIdCounter;
    };
    return GeoJSONSourceComponent;
}());
GeoJSONSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-geojson-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
GeoJSONSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var FeatureComponent = /** @class */ (function () {
    /**
     * @param {?} GeoJSONSourceComponent
     */
    function FeatureComponent(GeoJSONSourceComponent$$1) {
        this.GeoJSONSourceComponent = GeoJSONSourceComponent$$1;
        this.type = 'Feature';
    }
    /**
     * @return {?}
     */
    FeatureComponent.prototype.ngOnInit = function () {
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
    };
    /**
     * @return {?}
     */
    FeatureComponent.prototype.ngOnDestroy = function () {
        this.GeoJSONSourceComponent.removeFeature(this.feature);
    };
    /**
     * @param {?} coordinates
     * @return {?}
     */
    FeatureComponent.prototype.updateCoordinates = function (coordinates) {
        ((this.feature.geometry)).coordinates = coordinates;
        this.GeoJSONSourceComponent.updateFeatureData.next();
    };
    return FeatureComponent;
}());
FeatureComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-feature',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
FeatureComponent.ctorParameters = function () { return [
    { type: GeoJSONSourceComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return GeoJSONSourceComponent; }),] },] },
]; };
FeatureComponent.propDecorators = {
    "id": [{ type: Input },],
    "geometry": [{ type: Input },],
    "properties": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DraggableDirective = /** @class */ (function () {
    /**
     * @param {?} MapService
     * @param {?} FeatureComponent
     * @param {?} NgZone
     */
    function DraggableDirective(MapService$$1, FeatureComponent$$1, NgZone$$1) {
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
    DraggableDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.FeatureComponent.geometry.type !== 'Point') {
            throw new Error('mglDraggable only support point feature');
        }
        this.MapService.mapCreated$.subscribe(function () {
            _this.source.mouseEnter.pipe(takeUntil$1(_this.destroyed$)).subscribe(function (evt) {
                var /** @type {?} */ feature = _this.MapService.queryRenderedFeatures(evt.point, {
                    layers: [_this.source.id],
                    filter: [
                        'all',
                        ['==', '$type', 'Point'],
                        ['==', '$id', _this.FeatureComponent.id]
                    ]
                })[0];
                if (!feature) {
                    return;
                }
                _this.MapService.changeCanvasCursor('move');
                _this.MapService.updateDragPan(false);
                fromEvent$1(_this.MapService.mapInstance, 'mousedown').pipe(takeUntil$1(merge$1(_this.destroyed$, _this.source.mouseLeave))).subscribe(function () {
                    if (_this.dragStart.observers.length) {
                        _this.NgZone.run(function () { return _this.dragStart.emit(evt); });
                    }
                    fromEvent$1(_this.MapService.mapInstance, 'mousemove').pipe(takeUntil$1(merge$1(_this.destroyed$, fromEvent$1(_this.MapService.mapInstance, 'mouseup')))).subscribe(function (evt) {
                        if (_this.drag.observers.length) {
                            _this.NgZone.run(function () { return _this.drag.emit(evt); });
                        }
                        _this.FeatureComponent.updateCoordinates([evt.lngLat.lng, evt.lngLat.lat]);
                    }, function (err) { return err; }, function () {
                        if (_this.dragEnd.observers.length) {
                            _this.NgZone.run(function () { return _this.dragEnd.emit(evt); });
                        }
                    });
                });
            });
            _this.source.mouseLeave.pipe(takeUntil$1(_this.destroyed$)).subscribe(function () {
                _this.MapService.changeCanvasCursor('');
                _this.MapService.updateDragPan(true);
            });
        });
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnDestroy = function () {
        this.destroyed$.next(undefined);
        this.destroyed$.complete();
    };
    return DraggableDirective;
}());
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mglDraggable]'
            },] },
];
/** @nocollapse */
DraggableDirective.ctorParameters = function () { return [
    { type: MapService, },
    { type: FeatureComponent, decorators: [{ type: Host },] },
    { type: NgZone, },
]; };
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
var ImageSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function ImageSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    ImageSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            _this.MapService.addSource(_this.id, {
                type: 'image',
                url: _this.url,
                coordinates: _this.coordinates
            });
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageSourceComponent.prototype.ngOnChanges = function (changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["url"] && !changes["url"].isFirstChange() ||
            changes["coordinates"] && !changes["coordinates"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    ImageSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    };
    return ImageSourceComponent;
}());
ImageSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-image-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ImageSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
ImageSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "url": [{ type: Input },],
    "coordinates": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var RasterSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function RasterSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.type = 'raster';
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    RasterSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            var /** @type {?} */ source = {
                type: _this.type,
                url: _this.url,
                tiles: _this.tiles,
                bounds: _this.bounds,
                minzoom: _this.minzoom,
                maxzoom: _this.maxzoom,
                tileSize: _this.tileSize
            };
            _this.MapService.addSource(_this.id, source);
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    RasterSourceComponent.prototype.ngOnChanges = function (changes) {
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
    };
    /**
     * @return {?}
     */
    RasterSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    };
    return RasterSourceComponent;
}());
RasterSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-raster-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
RasterSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var VectorSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function VectorSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.type = 'vector';
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    VectorSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            _this.MapService.addSource(_this.id, {
                type: _this.type,
                url: _this.url,
                tiles: _this.tiles,
                minzoom: _this.minzoom,
                maxzoom: _this.maxzoom,
            });
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    VectorSourceComponent.prototype.ngOnChanges = function (changes) {
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
    };
    /**
     * @return {?}
     */
    VectorSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    };
    return VectorSourceComponent;
}());
VectorSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-vector-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
VectorSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
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
var VideoSourceComponent = /** @class */ (function () {
    /**
     * @param {?} MapService
     */
    function VideoSourceComponent(MapService$$1) {
        this.MapService = MapService$$1;
        this.sourceAdded = false;
    }
    /**
     * @return {?}
     */
    VideoSourceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.MapService.mapLoaded$.subscribe(function () {
            _this.MapService.addSource(_this.id, {
                type: 'video',
                urls: _this.urls,
                coordinates: _this.coordinates
            });
            _this.sourceAdded = true;
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    VideoSourceComponent.prototype.ngOnChanges = function (changes) {
        if (!this.sourceAdded) {
            return;
        }
        if (changes["urls"] && !changes["urls"].isFirstChange() ||
            changes["coordinates"] && !changes["coordinates"].isFirstChange()) {
            this.ngOnDestroy();
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    VideoSourceComponent.prototype.ngOnDestroy = function () {
        if (this.sourceAdded) {
            this.MapService.removeSource(this.id);
        }
    };
    return VideoSourceComponent;
}());
VideoSourceComponent.decorators = [
    { type: Component, args: [{
                selector: 'mgl-video-source',
                template: '',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
VideoSourceComponent.ctorParameters = function () { return [
    { type: MapService, },
]; };
VideoSourceComponent.propDecorators = {
    "id": [{ type: Input },],
    "urls": [{ type: Input },],
    "coordinates": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxMapboxGLModule = /** @class */ (function () {
    function NgxMapboxGLModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    NgxMapboxGLModule.forRoot = function (config) {
        return {
            ngModule: NgxMapboxGLModule,
            providers: [
                {
                    provide: MAPBOX_API_KEY,
                    useValue: config.accessToken
                }
            ],
        };
    };
    return NgxMapboxGLModule;
}());
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
NgxMapboxGLModule.ctorParameters = function () { return []; };
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
