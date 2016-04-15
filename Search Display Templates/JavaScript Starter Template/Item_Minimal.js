(function () {
    'use strict';
    
    // Config contains variables that are defined in one place
    var config = {
        propertyMappings: { 'Path':null, 'Title':['Title'] }
    };
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
	            'TemplateType': 'Item',
	            'TargetControlType': ['SearchResults', 'Content Web Parts'],
	            'ManagedPropertyMapping': config.propertyMappings
            };
            var cachePreviousItemValuesFunction = ctx.ItemValues;
            ctx.ItemValues = function(slotOrPropName) {
                    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName);
            };

	        // Retrieve managed property data
	        var path = $getItemValue(ctx, 'Path');
	        var title = $getItemValue(ctx, 'Title');

	        // HTML markup for an item
	        var htmlMarkup = String.format( '<div>' +
	                            				'<a href="{0}" title="{1}">{1}</a>' +
	                                        '</div>', path, title);

            // Caching
            ctx.ItemValues = cachePreviousItemValuesFunction;
            ctx.DisplayTemplateData = cachePreviousTemplateData;

            // Return the HTML markup
            return htmlMarkup;
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
	    templateUrl = '~sitecollection' + scriptUrl.substr(scriptUrl.indexOf('/_catalogs/'));
	    templateUrl = decodeURI(templateUrl);
	    // Register the template to load
	    register();
	    if (typeof (RegisterModuleInit) === "function" && typeof(Srch.U.replaceUrlTokens) === "function") {
	        RegisterModuleInit(Srch.U.replaceUrlTokens(templateUrl), register);
	    }
    }
})();