// ==========================================================================
// Project:   DSUI.GoogleMapChartView
// Copyright: ©2010 David Saita
// ==========================================================================
/*globals DSUI */

/** @class


@extends SC.View
*/
sc_require('mixins/indicator_support.js')

DSUI.GoogleMapChartView = SC.View.extend(//DSUI.IndicatorSupport,
/** @scope DSUI.GoogleMapChartView.prototype */
{
    classNames: ['google-map-chart-view'],
    map: null,
    markers: null,
    content: null,
    image_path: null,
    container: null,

    render: function(context, firstTime) {
        sc_super();
        if (this.get('layer') && this.get('isVisibleInWindow')) {
            if ((this.get('frame').width > 0) && (this.get('frame').height > 0)) {

                if (!this.get('map')) {
                    if (GBrowserIsCompatible()) {
                        var container = this.get('layer');
                        this.set('container', container);

                        var map = new GMap2(container);
                        this.set('map', map);

                        //map.setCenterToSFBay();
                        //map.setUIToDefault();
                        //map.setUIToDefault();
                        //map.checkResize();
                        map.addControl(new GLargeMapControl());
                        map.addControl(new GMapTypeControl(1));
                        map.addControl(new GScaleControl());
                        map.enableDoubleClickZoom();
                    }
                }

                if (this.get('content')) {
                    this.setupEventsMarkers();
                }
            }
        }
    },

    init: function() {
        sc_super();
        var value = this.get('contentBinding');
        this.set('image_path', sc_static('images'));
    },

    viewDidResize: function() {
        sc_super();
        this.setLayerNeedsUpdate();
    },

    plotDataDidChange: function() {
        this.setLayerNeedsUpdate();
    }.observes('.content', '.content.[]'),

    visibilityDidChange: function() {
        if (this.get('isVisibleInWindow') && this.get('isVisible')) {
            this.setLayerNeedsUpdate();
        }
    }.observes('isVisibleInWindow', 'isVisible'),

    layerDidChange: function() {
        this.setLayerNeedsUpdate();
    }.observes('layer'),

    layoutDidChange: function() {
        sc_super();
        this.setLayerNeedsUpdate();
    },

    updateLayerLocationIfNeeded: function() {
        sc_super();
        this.setLayerNeedsUpdate();
    },

    setLayerNeedsUpdate: function() {
        this.invokeOnce(function() {
            this.set('layerNeedsUpdate', YES);
        });

    },

    setupEventsMarkers: function() {

        var m = this.get('markers');
        if (m) m.clearMarkers();

        var content = this.get('content');

        var markers = [];
        content.forEach(function(ev, index, enumerable) {
            var lt = ev.get('latitude');
            var lng = ev.get('longitude');

            if (lt != '' && lng != '') {
                var icon = new GIcon();
                var event_type = ev.get('event_type').trim();
                icon.image = "/static/awa/en/current/resources/images/%@.png".fmt(event_type);
                icon.iconAnchor = new GPoint(17, 38);
                icon.infoWindowAnchor = new GPoint(16, 0);
                icon.iconSize = new GSize(20, 34);

                var point = new GLatLng(lt, lng);
                var marker = new GMarker(point, {
                    icon: icon
                });
                GEvent.addListener(marker, "click",
                function() {
                    var info = ev;
                    var app_name = info.getPath('application.app_name');
                    marker.openInfoWindowHtml("<div style='font: 12px Verdana, sans-serif;color:black;'>Application: <b>" + app_name + "</b><br>Event type: <b>" + info.get('event_type') + "</b><br>Device: <b>" + info.get('model') + "</b><br>Date and time: <b>" + info.get('created') + "</b></div>");
                });
                markers.push(marker);
            }
        },
        this);

        var map = this.get('map');
        var markerCluster = new MarkerClusterer(map, markers, {
            gridSize: 20
        });
        if (markers.length > 0) map.setCenter(markers.firstObject().getLatLng(), 2);
        this.set('markers', markerCluster);
    },
});
