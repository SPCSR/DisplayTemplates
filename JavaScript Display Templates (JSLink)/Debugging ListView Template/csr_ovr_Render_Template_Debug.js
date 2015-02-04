//Original author: Paul Hunt - 28 April 2014

//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Define any header content here.
	//You can include JavaScript and CSS links here.
	var headerHTML = "<div><em>This DEBUG template will show properties for the FIRST item on each page only.<br/>" +
		"The paging controls will switch to the next page and again show the first item only.</em><br/>" +
		"If the column you require is not visible, ensure that it is selected in the web part view</div><br/>";
	
	//Now add Specific list/web part information to the page
	headerHTML += "<div class='ms-list-addnew ms-textLarge ms-soften'>Showing properties for LVWP:" + ctx.wpq + "</div>";
    headerHTML += "<table class='ms-listviewtable'>" +
    		"<thead id='js-listinfothead-" + ctx.wpq + "'><tr class='ms-viewheadertr ms-vhltr' align='top'><th class='ms-vh2'>Property Name</th>" +
    		"<th class='ms-vh2'>Property Value</th></tr></thead><tbody>";
    		
    //If you want to show more of the base CTX properties, just add another row here.
	headerHTML += pfh.headerPropertyRow(ctx,"wpq");
	headerHTML += pfh.headerPropertyRow(ctx,"BaseViewID");
	headerHTML += pfh.headerPropertyRow(ctx,"CurrentCultureName");
	headerHTML += pfh.headerPropertyRow(ctx,"CurrentLanguage");
	headerHTML += pfh.headerPropertyRow(ctx,"CurrentUICultureName");
	headerHTML += pfh.headerPropertyRow(ctx,"listName");
	headerHTML += pfh.headerPropertyRow(ctx,"ListTemplateType");
	headerHTML += pfh.headerPropertyRow(ctx,"ListTitle");	
	
	headerHTML += "</tbody></table>";

	return headerHTML;
	}
	
pfh.headerPropertyRow = function(ctx,propName) {

	var propertyRow = "<tr class='ms-itmHoverEnabled ms-itmhover'><td class='ms-cellstyle ms-vb2'>ctx." + propName + "</td><td class='ms-cellstyle ms-vb2'>" +
			ctx[propName] + "</td></tr>"

	return propertyRow;
	}


//Define our footer render pattern
pfh.renderFooter = function(ctx) {
	//Define any footer content here.
	var footerHTML = "<div>Footer</div>";


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


//Define our item Render pattern
//This will be called once for each item being rendered from the list.
//All fields in the view can be access using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
	var itemHTML = "";
	
	//Check if this item is the first on the page. if it is we'll render it
	//otherwise we'll be skipping it.
	if (ctx.CurrentItem.firstRow)
	{
		//Setup our Item render information and table head
		//We're using MS styles where possible to keep a consistant look and feel.
    	itemHTML += "<div class='ms-list-addnew ms-textLarge ms-soften'>Showing properties for item ID:" + ctx.CurrentItem.ID + " - Title:"  + ctx.CurrentItem.Title + "</div>";
    	itemHTML += "<table class='ms-listviewtable'>" +
    		"<thead id='js-listviewthead-" + ctx.wpq + "'><tr class='ms-viewheadertr ms-vhltr' align='top'><th class='ms-vh2'>Property Name</th>" +
    		"<th class='ms-vh2'>Property Value</th></tr></thead>";
    		
    	itemHTML += "<tbody>";
		for(var prop in ctx.CurrentItem)
		{
			//The ms hover styles here make it easier to read the data by highlighting rows as the mouse is passed over
			itemHTML += "<tr class='ms-itmHoverEnabled ms-itmhover'><td class='ms-cellstyle ms-vb2'>" + prop + "</td><td class='ms-cellstyle ms-vb2'>";
			
			var currVal = ctx.CurrentItem[prop];
			
			//Verify if the property is an empty string or Null, and display a value accordingly.
			currVal = currVal === "" ? "<strong>Empty</strong>" : currVal;
			currVal = currVal === null ? "<em>Null</em>" : currVal;
			
			//Check if the item value is an object.
			if (currVal !== null && typeof currVal === 'object')
			{
				//As it is, we'll output it's properties seperated by the | character	
				currVal = pfh.evaluateObject(currVal);
			}
			
			itemHTML += currVal + "</td></tr>";
		}
    	itemHTML += "</tbody></table>";	
    }
    
	return itemHTML;	
}

//This is our function that extracts the properties of subobjects.
//We've seperated it out into it's own function so that we can use
//recursive calls to the same function to walk down a tree of nested objects.
pfh.evaluateObject = function(objValue) {

	var stringValueOfObject = "";
	//For each property in the object
	for (var subProp in objValue)
	{
		//We just need to check if the sub property is in itself an object with multiple properties
		var subPropVal = objValue[subProp];
		if (subPropVal !== null && typeof subPropVal === 'object')
		{
			//If it is, we'll use call this function again to output the values
			//This is called recursion if you're not familiar with it
			stringValueOfObject = pfh.evaluateObject(subPropVal);
		}
		else
		{
			//First validate if the property is empty, null or not
			subPropVal = subPropVal === "" ? "<strong>Empty</strong>" : subPropVal;
			subPropVal = subPropVal === null ? "<em>Null</em>" : subPropVal;
			//Then output the value.
			stringValueOfObject += subProp + ":" + subPropVal + "|";
		}
	}	
	// return the string representation of our object
	return stringValueOfObject;
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
	overrideCtx.onPostRender = [pfh.PostRenderCallback(ctx)];


//	Register this Display Template against views with matching BaseViewID and ListTemplateType
//	See http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.listtemplatetype(v=office.15).aspx for more ListTemplateTypes	
	overrideCtx.BaseViewID = 1;
	overrideCtx.ListTemplateType = 100;


//  Register the template overrides with SharePoint
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
};


//Register for MDS enabled site otherwise the display template doesn't work on refresh
//Note: The ~sitecollection tokens cannot be used here!
//PH Jan 2015 - As we know what the URL is on MDS enabled sites, we can safely extract the site colleciton URL
//For none MDS sites, we don't care if RegisterModuleInit works or not...
pfh.sitecolpath = window.location.pathname.substring(0,window.location.pathname.indexOf("/_layouts/15/start.aspx"))
RegisterModuleInit(pfh.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_Render_Template_Debug.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)
