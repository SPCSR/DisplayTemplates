// Show post-it notes
// @author Anatoly Mironov @mirontoli
// 2016-04-22
(function() {
	'use strict';
	var applyStyle = function() {
		//post-it style: http://webdesignandsuch.com/create-a-post-it-note-with-css3/
		var cssText = ['.post-it { background:#fefabc; ',
									'padding:15px; font-size:15px; ',
									'color: #000; width:200px; ',
									'transform: rotate(2deg);',
									'box-shadow: 0px 4px 6px #333;',
									'margin-bottom: 10px; }',
			'.post-it.green { background: #AAE5C3; }',
			'.post-it.red { background: #E5B6AA;}'].join('');
		//add style block: http://stackoverflow.com/a/524715/632117
	   var styleNode = document.createElement('style');
	   styleNode.type = "text/css";
	   // browser detection (based on prototype.js)
	   if(!!(window.attachEvent && !window.opera)) {
	    	styleNode.styleSheet.cssText = cssText;
	   } else {
	    	var styleText = document.createTextNode(cssText);
	    	styleNode.appendChild(styleText);
	   }
	   document.getElementsByTagName('head')[0].appendChild(styleNode);
	}
	applyStyle();
	var item = function(item) {
	    var postit = ctx.CurrentItem;
	    var title = ctx.CurrentItem.Title;
	    var color = (ctx.CurrentItem.PostitColor || '').toLowerCase();
	    var html = ['<div class="post-it ', color, '">', title, '</div>'].join('');
	    return html;
	};


	var override = {
	  Templates: {      
	    Item: item,
	    Footer: '<div class="postit-container">',
	    Header: '</div>'
	  },
	  BaseViewID: 1,
	  ListTemplateType = 100
	};

	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(override);
})();