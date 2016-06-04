//Original Author: Paul Hunt - April 2014

//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Define any header content here.
	//You can include JavaScript and CSS links here.
	
	var headerHTML = "<style>.templateHeader, .templateFooter {width:300px;background-color:red;color:white;font-size:3em;}"
	headerHTML += ".templateItem {width:300px;background-color:blue;color:white;font-size:2em;margin:1px 0px 1px 0px;padding:1px 0px 1px 0px;}</style>"
	
	headerHTML += "<div class='templateHeader'>Header</div>";
	
	return headerHTML;
	}

//Define our footer render pattern
pfh.renderFooter = function(ctx) {
	//Define any footer content here.
	var footerHTML = "<div class='templateFooter'>Footer</div>";
	return footerHTML;
	}

//Define our item Render pattern
//This will be called once for each item being rendered from the list.
//All fields in the view can be access using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
    var itemHTML = "<div class='templateItem'>" + ctx.CurrentItem.Title + "</div>";
	return itemHTML;	
}

//Define any code/function that needs to be run AFTER the page has been completed and the DOM is complete.
pfh.PostRenderCallback = function(ctx) {
}

//Define the function that will register our Override with SharePoint.
pfh.RegisterTemplateOverride = function () {
// 	Define a JavaScript object that will contain our Override
	var overrideCtx = {};
	overrideCtx.Templates = {};
	
//	Here we assign our Header and Footer functions to the template overrides.
	overrideCtx.Templates.Header = pfh.renderHeader;
	overrideCtx.Templates.Footer = pfh.renderFooter;

// 	And here we assign the CustomItem function to the Item registration.
	overrideCtx.Templates.Item = pfh.CustomItem;
	
//	And finally we add our PostRender function.
//  This expects a JavaScript array, so we pass the function in []
//	Dec 2015: Fixed an issue with the PostRender registration that caused it to fire during template registration
	overrideCtx.OnPostRender = [function() {pfh.PostRenderCallback(ctx);}];
	
//	Register this Display Template against views with matching BaseViewID and ListTemplateType
//	See http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype(v=office.15).aspx for more ListTemplateTypes	
	overrideCtx.BaseViewID = 1;
	overrideCtx.ListTemplateType = 100;
	
//  Register the template overrides with SharePoint
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
};

//Note: The ~sitecollection tokens cannot be used here!
//PH Jan 2015 - As we know what the URL is on MDS enabled sites, we can safely extract the site colleciton URL
//For none MDS sites, we don't care if RegisterModuleInit works or not...
pfh.sitecolpath = window.location.pathname.substring(0,window.location.pathname.indexOf("/_layouts/15/start.aspx"))
RegisterModuleInit(pfh.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_RenderListTemplate.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)

