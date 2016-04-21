(function () {
    'use strict';
    
    // Config contains variables that are defined in one place
    var config = {
        /* IMPORTANT: update these settings before uploading the file to the master page gallery */
        template: 'item_minimal.js',
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

    /* DO NOT REMOVE THE FOLLOWING LINES OF CODE */
    // MDS needs to start on the head
    // Retrieve all the loaded scripts
    var allScripts = document.head.getElementsByTagName("script");
    var scriptUrl = null;
    var scriptNr = allScripts.length;
    while(scriptNr--) {
        var crntScript = allScripts[scriptNr];
        if (crntScript.src !== null) {
            // Check if the right script is retrieved based on the filename of the template
            if (crntScript.src.indexOf('/_catalogs/') > 0 && crntScript.src.toLowerCase().indexOf(config.template.toLowerCase()) > 0) {
                scriptUrl = crntScript.src;
                break;
            }
        }
    }    
    if (scriptUrl !== null) {
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