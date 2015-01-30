//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Define any header content here.
	//You can include JavaScript and CSS links here.
	var cssLink = "<link rel='stylesheet' type='text/css' href='/_catalogs/masterpage/display templates/RenderGroup.css'>";
	var headerHTML = cssLink + "<div class='outerGroupWrapper'>";
	return headerHTML;
	}


//Define our footer render pattern which includes our Grouping.
pfh.renderFooter = function(ctx) {
	//Define any footer content here.
	var footerHTML = "</div>";


	//Now begin the paging control
	var firstRow = ctx.ListData.FirstRow;
	var lastRow = ctx.ListData.LastRow;
	var prevPage = ctx.ListData.PrevHref;
	var nextPage = ctx.ListData.NextHref;	

	var pagingCtrl = "<div class='paging'>";
	// Using the JavaScript in line IF notation, we'll check IF the variable contains any data
	// If it does, then the relevant paging control for forwards or backwards will be displayed.


	pagingCtrl += prevPage ? "<a class='ms-commandLink ms-promlink-button ms-promlink-button-enabled' href='" +
		prevPage + "'><span class='ms-promlink-button-image'><img class='ms-promlink-button-left'" +
		 " src='/_layouts/15/images/spcommon.png?rev=23' /></span></a>" : "";


	pagingCtrl += prevPage || nextPage ? "<span class='ms-paging'><span class='First'>" + firstRow +
		"</span> - <span class='Last'>" + lastRow + "</span></span>" : "";


	pagingCtrl += nextPage ? "<a class='ms-commandLink ms-promlink-button ms-promlink-button-enabled' href='" +
		nextPage + "'><span class='ms-promlink-button-image'><img class='ms-promlink-button-right'" +
		" src='/_layouts/15/images/spcommon.png?rev=23'/></span></a>" : "";


	//If you want the paging to appear above the footer content, switch the order of these two items
	return footerHTML + pagingCtrl;
	}


//Define our item Render pattern (Note: if the groups are rendered collapsed, then this will NOT be
//called until the group is expanded.
//All fields in the view can be access using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
	//var groupId = ctx.ctxId + ctx.CurrentItem["Dept.groupindex"];
	var itemHTML = "<div class='itemWrapper'>" + ctx.CurrentItem.Title + "</div>"; 
	
	//now check if this is the last item in the list, in which case we need to close
	//the grouping div.
	if (ctx.CurrentItemIdx == (ctx.ListData.LastRow -1))
	{
		itemHTML += "</div>";
	}

	return itemHTML;	
}


//Define our Custom Group
//This will be used to create the group header during the pages initial load.
//Clicking on the gorup header will call the expand collapse function for the selected header value
pfh.CustomGroup = function(ctx, group, groupId, listItem, ListSchema, level, expand) {
	var htmlVal = ""
	
	//If this isn't the first group, then we need to close the previous grouping div.
	if (groupId != ctx.ctxId + "1_")
	{
		htmlVal += "</div>";
	}
	
	htmlVal += "<div class='groupWrapper' id='grp" + groupId + "' Expanded='" + expand + "' Loaded='" + expand + "' ><a onclick='pfh.expandCollapseGroup(this,\"" +
		groupId + "\",\"" + ListSchema.HttpVDir + "\",\"" + ctx.listName + "\",\"" + listItem[group + ".urlencoded"] + "\", \"" + ListSchema.View + "\");return false;' href='javascript:'>"
	htmlVal += "<span class='ms-commentexpand-iconouter'><img class='ms-commentexpand-icon' id='img_" + groupId + " alt='expand' src='/_layouts/15/images/spcommon.png?rev=31'/></span>";
	htmlVal += listItem[group] + "</span>" + "<span style='font-weight:lighter; display:inline-block;'>&nbsp;(" + listItem[group + ".COUNT.group"] + ")</span>" ;
	htmlVal += "</a></div>";
	htmlVal += "<div class='groupExpandWrapper' id='expand" + groupId + "'>";	
	
	return htmlVal;
}


pfh.expandCollapseGroup = function (control,groupId, sourceSite, listId, groupString, viewId) {
	//Obtain a jQuery object that represents the group wrapper
	var groupWrapper = jQuery("#grp"+groupId);

	//Check if the group is already expanded, in which case we want to collapse
	if (groupWrapper.attr("Expanded") == "True")
	{
		//Hide the group and set the expanded attribute to false
		jQuery("#expand" + groupId).hide();
		groupWrapper.attr("Expanded","False");
	}
	//Check if the group is collapsed
	else
	{
		//Check to see if the data we require is present
		if(groupWrapper.attr("Loaded") == "True")
		{
			//The data is already loaded, so we'll show the data
			jQuery("#expand" + groupId).show();
			//And set the expanded attribute to true.
			groupWrapper.attr("Expanded","True");
		}
		//If it isn't present, we'll call another function to fetch it.
		else
		{
			pfh.fetchGroupItems(groupId, sourceSite, listId, groupString, viewId);
		}
	}

}

//We'll use jQuery here to call re-create the standard SharePoint behaviour using the inplview.aspx page
//To retrieve the relevant group level of data
pfh.fetchGroupItems = function(groupId, sourceSite, listId, groupString, viewId) {
	//Build our web part id
	var webpartId = jQuery('#MSOZoneCell_WebPart' + ctx.wpq ).attr('WebPart' + ctx.wpq + '_WebPartStorageKey')

	//Set up the URL to call, passing relevant list IDs etc
	var fetchItemsUrl = sourceSite + "/_layouts/15/inplview.aspx?List=" + listId + "&View=" + viewId;
	fetchItemsUrl += "&IsXslView=TRUE&IsCSR=TRUE&GroupString=" + groupString + "&IsGroupRender=TRUE&WebPartID={" + webpartId + "}";

	//Set our expand group to "Working on it"
	pfh.expandGroupId = "expand" + groupId;
	jQuery("#" + pfh.expandGroupId).html("<div class='ms-gload'>Working on it</div>");
	
	//Set the loaded and expanded flags
	jQuery("#grp" + groupId).attr("Loaded","True").attr("Expanded","True");
	
	//Trigger the call to SharePoint to fetch the items
	jQuery.post(fetchItemsUrl,null,pfh.fetchGroupItemsCallback);
}

//Handle the data posted back
pfh.fetchGroupItemsCallback = function(response) {

	var renderItems = "";
	
	//Process each row of data received from SharePoint
	for (var idx = 0; idx < response.Row.length; idx++) {
            var listItem = response.Row[idx];
            ctx.CurrentItem = listItem;
            //Finally call our Custom Item render method manually for each item.
            renderItems += pfh.CustomItem(ctx);
    }

	//use jQuery to inject the resulting HTML onto the page
	jQuery("#" + pfh.expandGroupId).html(renderItems);

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
	
//And here we add our custom Group headers
	overrideCtx.Templates.Group = pfh.CustomGroup;

//	And finally we add our PostRender function.
//  This expects a JavaScript array, so we pass the function in []
	overrideCtx.onPostRender = [pfh.PostRenderCallback(ctx)];


//	Register this Display Template against views with matching BaseViewID and ListTemplateType
//	See http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype(v=office.15).aspx for more ListTemplateTypes	
	overrideCtx.BaseViewID = 1;
	overrideCtx.ListTemplateType = 100;


//  Register the template overrides with SharePoint
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
};


//Register for MDS enabled site otherwise the display template doesn't work on refresh
//PH Jan 2015 - As we know what the URL is on MDS enabled sites, we can safely extract the site colleciton URL
//For none MDS sites, we don't care if RegisterModuleInit works or not...
pfh.sitecolpath = window.location.pathname.substring(0,window.location.pathname.indexOf("/_layouts/15/start.aspx"))
RegisterModuleInit(pfh.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_RenderSingleGroup.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)
