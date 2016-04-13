(function () {
    'use strict';
    
	var templateUrl;

	var register = function () {
			if ("undefined" !== typeof (Srch) && "undefined" !== typeof (Srch.U) && typeof (Srch.U.registerRenderTemplateByName) === "function") {
	            Srch.U.registerRenderTemplateByName(templateUrl, render);
	        }
		},
		render = function (ctx) {
			// Display template data
			var cachePreviousTemplateData = ctx.DisplayTemplateData;
		    ctx.DisplayTemplateData = {
				'TemplateUrl': templateUrl,
				'TemplateType': 'Control',
				'TargetControlType': ['SearchResults', 'Content Web Parts']
		    };

	    	// Checks to see if the client control loaded correctly
		    if (!$isNull(ctx.ClientControl) && !$isNull(ctx.ClientControl.shouldRenderControl) && !ctx.ClientControl.shouldRenderControl()) {
			    return "";
			}

			ctx.ListDataJSONGroupsKey = "ResultTables";
			ctx['ItemRenderWrapper'] = itemRendering;

			// HTML markup for the control template
			var htmlMarkup = String.format(	'<ul class="cbs-List">' +
												'{0}' +
	                                     	'</ul>', ctx.RenderGroups(ctx));

		    // Caching
    		ctx.DisplayTemplateData = cachePreviousTemplateData;

		    // Return the HTML markup
		    return htmlMarkup;
		},
		itemRendering = function (itemRenderResult, inCtx, tpl) {
		    var iStr = [];
		    iStr.push('<li>');
		    iStr.push(itemRenderResult);
		    iStr.push('</li>');
		    return iStr.join('');
		};

	// Retrieve all the loaded scripts
	var allScripts = document.getElementsByTagName("script");
	// Get the last script file (this is the current DT file)
    var scriptUrl = allScripts[allScripts.length - 1].src;
    if (scriptUrl.indexOf('/_catalogs/') > 0) {
	    // Remove the query string 
	    if (scriptUrl.indexOf('?') > 0) {
	    	scriptUrl = scriptUrl.split("?")[0];
	    }
	    // Insert the site collection token
	    templateUrl = '~sitecollection' + scriptUrl.substr(scriptUrl.indexOf('/_catalogs/'))
		// Register the template to load
		register();
	    if (typeof (RegisterModuleInit) === "function" && typeof(Srch.U.replaceUrlTokens) === "function") {
	        RegisterModuleInit(Srch.U.replaceUrlTokens(templateUrl), register);
	    }
	}
})();