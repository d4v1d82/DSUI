// ==========================================================================
// Project:   Awa.PlotView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Awa */

/** @class

(Document Your View Here)

@extends SC.View
*/
sc_require('mixins/indicator_support.js')

DSUI.PlotView = SC.View.extend(//DSUI.IndicatorSupport,
/** @scope Awa.PlotView.prototype */
{
    classNames: ['plot-view'],
    container: null,
    chart: null,
    loading: false,
    content: null,
    options: null,
	status: null,
	
    displayProperties: ['content', 'chart'],
    concatenatedProperties: ['options'],

    init: function() {
        sc_super();
        this.options = SC.clone(Highcharts.defaultOptions);
    },

    setupChartOptions: function() {
        return this.get('options');
    },

    computePlotData: function() {
        return this.get('content');
    },

    render: function(context, firstTime) {
        sc_super();
        if (this.get('layer') && this.get('isVisibleInWindow')) {
            if ((this.get('frame').width > 0) && (this.get('frame').height > 0)) {
                if (this.get('content')) {

                    var chart = this.get('chart')
                    if (!chart) {
                        var options = this.setupChartOptions();
                        options['chart']['animation'] = true;
                        options['chart']['renderTo'] = this.get('layer').id
                        options['credits']['enabled'] = false

                        chart = new Highcharts.Chart(options)
                        this.set('chart', chart);
                    }

                    var series = this.get('series');
                    if (!series || series.length == 0) return;

                    if (chart.series.length > 0) {
                        for (var j = 0; j < series.length; j++)
                        	chart.series[j].setData(series[j].data, true);
                    }
                    else 
					{
                        for (var i = 0; i < series.length; i++)
                        	chart.addSeries(series[i]);
                    }
                }
            }
        }
    },

    viewDidResize: function() {
        sc_super();
        this.setLayerNeedsUpdate();
    },

    plotDataDidChange: function() {
        var series = this.computePlotData();
        this.set('series', series);
        this.setLayerNeedsUpdate();
    }.observes('.content', '.content.[]'),

    plotOptionsDidChange: function() {
        this.setLayerNeedsUpdate();
    }.observes('.options'),

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

    }
});
