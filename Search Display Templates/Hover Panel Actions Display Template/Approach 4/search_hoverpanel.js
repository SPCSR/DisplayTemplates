Type.registerNamespace('search.hoverpanel');

search.hoverpanel = function () {
    var loading = false;
    var hoverpanel = '~sitecollection/_catalogs/masterpage/SearchDT/Item_CommonHoverPanel_Actions.js';

    var init = function () {
            // Check if your hover panel actions display template is already registered and loaded
            if (typeof Srch.U.getRenderTemplateCollection()[hoverpanel.toLowerCase()] === "undefined" && !loading) {
                loading = true;

                // Load the custom hover panel actions display template
                var scripts = new Array();
                Srch.U.appendScriptsToLoad(scripts, hoverpanel);
                Srch.U.loadScripts(scripts, function () {
                    // Once the display template is loaded, register this as a template that can be used
                    Srch.U.registerLoadedScripts(scripts);
                }, function () {
                    // Do something if it failed
                });
            }
        },
        get = function () {
            // Return the custom hover panel display template function if it exists
            if (typeof Srch.U.getRenderTemplateCollection()[hoverpanel.toLowerCase()] !== "undefined") {
                return Srch.U.getRenderTemplateCollection()[hoverpanel.toLowerCase()];
            }
            return;
        };


    return {
        init: init,
        get: get
    };
}();