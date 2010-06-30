
sc_require('core')

DSUI.IndicatorSupport = {
  showIndicator: NO,
  indicatorPane: null,

  statusHasChanged: function() {
	var _status = this.get('status');
	if (_status & SC.Record.BUSY) {  // This mean that of all BUSY* status, the indicator will show. 
    	this.set('showIndicator', YES);
    } else {
	  this.set('showIndicator', NO);
    }
  }.observes('status'),

  showIndicatorPane: function() {
	if(!this.get('isVisibleInWindow'))
		return;
		
	if (this.get('showIndicator') === YES) {
      var frame = this.get('frame');
      //var _layout = {top: frame.y, left: frame.x, width: frame.width, height: frame.height};
	//SC.Logger.info(this.layoutView());
	 var _layout = {top:0, bottom:0, right:0, left:0};
      this.indicatorPane = SC.PanelPane.create({
  //      layout: _layout,
        style: 'sc-view sc-pane indicator'.w(),
        modalPane: SC.ModalPane.extend({
          classNames: 'for-indicator'
        }),
        init: function(context, la) {
          this.set('classNames', this.get('style'));
          sc_super();
        },
        contentView: SC.View.design({
          classNames: 'loading',
          childViews: 'messageLabel'.w(),
          messageLabel: SC.LabelView.design({
            layout: {centerX: 0, centerY: 0, width: 200, height: 100 },
            textAlign: SC.ALIGN_CENTER,
            controlSize: SC.HUGE_CONTROL_SIZE,
            icon: 'shared-icon-loading-48',
            value: '_%@'.fmt(this.get('status')).loc()
          })
        })
      });
      this.indicatorPane.append();
    } else {
      this.indicatorPane.remove();
      this.indicatorPane = null;
    }
  }.observes('showIndicator'),
}

//SC.mixin(DSUI.IndicatorSupport, {});