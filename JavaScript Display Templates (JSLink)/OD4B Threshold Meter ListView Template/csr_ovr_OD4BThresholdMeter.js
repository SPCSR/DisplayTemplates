//Original Author: Paul Hunt - April 2014
//OD4B Threshold Meter Author: Paul Choquette - October 2015

//Create our Namespace object to avoid polluting the global namespace
var Starcrossed = Starcrossed || {};
Starcrossed.Threshold = Starcrossed.Threshold || {};

//Define any code/function that needs to be run BEFORE the page has been completed and the DOM is complete.
Starcrossed.Threshold.PreRenderCallback = function(ctx) {
	Starcrossed.Threshold.Context = ctx;	// Save our context object for later
	_spBodyOnLoadFunctionNames.push("Starcrossed.Threshold.GetCount");
};

Starcrossed.Threshold.GetCount = function() {
	var ctx = Starcrossed.Threshold.Context;	// Retrieve our context object
	
	// Use jQuery to make a call to SP's REST service to retrieve the ItemCount for our document library
	jQuery.ajax({
		"url": ctx.HttpRoot + "/_api/web/lists(guid'" + ctx.listName.replace("{","").replace("}","") + "')/ItemCount",
		"headers": {
			"accept": "application/json;odata=verbose"
		}
	}).done(function(data) {
		var count = data.d.ItemCount
		var pctUsed = Math.min(100, (count*100)/5000);
		if (pctUsed >= 60) {	// We only display the throttle meter if we are at 60% capacity or greater
			var throttle = '<tr>';
			throttle += 	'<td>';
			throttle += 		'<table id="tblThrottle" align="left" width="50%" cellpadding="0" cellspacing="0">';
			throttle +=				'<tbody>';
			throttle += 				'<tr height="20">';
			var tdWidth = (pctUsed < 1) ? "1%" : pctUsed + '%';
			throttle += 					'<td id="tdUsed" class="ms-storMeUsed" style="text-align:center" width="' + tdWidth + '">' + count + ' items (OneDrive for Business limit is 5000).</td>';
			if (pctUsed < 100)	// We hide the free space once we hit 100% capacity
				throttle += 				'<td id="tdFree" class="ms-storMeFree" style="text-align:center">&nbsp;</td>';
			throttle += 				'</tr>';
			throttle +=				'</tbody>';
			throttle += 		'</table>';
			throttle += 	'</td>';
			throttle += '</tr>';
			jQuery("#Hero-" + ctx.wpq.toUpperCase() + " tbody").append(throttle);	// Add our meter's markup to the Hero Menu for our list view
			jQuery("#Hero-" + ctx.wpq.toUpperCase()).css("margin-bottom", "10px");	// This is to prevent the new row on the Hero Menu from bumping into the List View Controls
		}
	}).fail(function(sender, args) {	
		console.log(args.message);	// Just log our error to the console for now
	});
}

//Define the function that will register our Override with SharePoint.
Starcrossed.Threshold.RegisterTemplateOverride = function () {
// 	Define a JavaScript object that will contain our Override
	var overrideCtx = {};
	overrideCtx.Templates = {};
	
//	And finally we add our PreRender function.
//  This expects a JavaScript array, so we pass the function in []
	overrideCtx.OnPreRender = [Starcrossed.Threshold.PreRenderCallback];
	
//	Register this Display Template against views with matching BaseViewID and ListTemplateType
//	See http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype(v=office.15).aspx for more ListTemplateTypes	
	overrideCtx.BaseViewID = 1;
	overrideCtx.ListTemplateType = 101; // Document Library
	
//  Register the template overrides with SharePoint
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
};

//Note: The ~sitecollection tokens cannot be used here!
//PH Jan 2015 - As we know what the URL is on MDS enabled sites, we can safely extract the site colleciton URL
//For none MDS sites, we don't care if RegisterModuleInit works or not...
Starcrossed.Threshold.sitecolpath = window.location.pathname.substring(0,window.location.pathname.indexOf("/_layouts/15/start.aspx"))
RegisterModuleInit(Starcrossed.Threshold.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_OD4BThresholdMeter.js", Starcrossed.Threshold.RegisterTemplateOverride); // CSR-override for MDS enabled site
Starcrossed.Threshold.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)