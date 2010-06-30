// ==========================================================================
// Project:   DSUI
// Copyright: ©2010 David Saitta
// ==========================================================================
/*globals Dsui */

/** @class

  This class provides a button group view.

  @extends SC.SegmentedView
*/
//sc_require('core.js');
//sc_require('desktop/view/segmented.js')

DSUI.ButtonGroupView = SC.SegmentedView.extend(
/** @scope DSUI.ButtonGroupView.prototype */
{
    classNames: ['button-group-view'],
	align: 'left',
	
	renderDisplayItems: function(context, items) {
	    var value       = this.get('value'),
	        isArray     = SC.isArray(value),
	        activeIndex = this.get('activeIndex'),
	        len         = items.length,
	        title, url, className, ic, item, toolTip, width, i, stylesHash,
	        classArray;

	    for(i=0; i< len; i++){
	      ic = context.begin('a').attr('role', 'button');
	      item=items[i];
	      title = item[0]; 
	      toolTip = item[5];

	      stylesHash = {};
	      classArray = [];

	      if (this.get('layoutDirection') == SC.LAYOUT_HORIZONTAL) {
	        stylesHash['display'] = 'inline-block' ;
	      }

	      classArray.push('sc-segment');

	      if(!item[2]){
	        classArray.push('disabled');
	      }
	        
	      if( isArray ? (value.indexOf(item[1])>=0) : (item[1]===value)){
	        classArray.push('sel');
	      }
	      if(activeIndex === i) {
	        classArray.push('active') ;
	      }
	      if(item[4]){
	        width=item[4];
	        stylesHash['width'] = width+'px';
	      }
	      ic.addClass(classArray);
	      ic.addStyle(stylesHash);
	      if(toolTip) {
	        ic.attr('title', toolTip) ;
	      }

	      ic.push('<span class="sc-button-inner"><label class="sc-button-label">',
	              title, '</label></span>');
	      ic.end();
	    }   
	  },

});
