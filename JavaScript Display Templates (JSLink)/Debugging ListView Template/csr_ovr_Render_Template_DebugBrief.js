//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Define any header content here.
	//You can include JavaScript and CSS links here.
	var headerHTML = "<div><em>This DEBUG template will show list view web part properties and the available Item fields only</em><br/>" +
		"If the column you require is not visible in the available item fields, ensure that it is selected in the web part view</div><br/>";
	
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
	
	//Get all of the available field names from the first item
	var firstListItem = ctx.ListData.Row[0];
	var fieldListFromItem = "";
	for (var subProp in firstListItem)
	{
		fieldListFromItem += subProp + "<br/>";
	}
	
	headerHTML += "<tr class='ms-itmHoverEnabled ms-itmhover'><td class='ms-cellstyle ms-vb2'>Available Item Fields</td><td class='ms-cellstyle ms-vb2'>" + fieldListFromItem + "</td></tr>"
 	
	
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
	//No footer content created
	return "";
	}


//Define our item Render pattern
//This will be called once for each item being rendered from the list.
//All fields in the view can be access using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
	//No information will be returned for any items. All info is in the Header.
	var itemHTML = "";
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
RegisterModuleInit(pfh.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_Render_Template_DebugBrief.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)
