//Original Author: Paul Hunt - December 2015

//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

pfh.personFieldSchema = "";
pfh.PersonFieldInternalName = "StaffName"; //Note: We use this to set the name of the StaffName field which is used in a few places. it helps with the person field picker.

//Define our Header Render pattern
pfh.renderHeader = function(ctx) {
	//Capturing the Person field schema here as it's not avaliable in the preRender
	var lookupHelper = {};
	for (var i = 0, len = ctx.ListSchema.Field.length; i < len; i++)
	{
		lookupHelper[ctx.ListSchema.Field[i].RealFieldName] = ctx.ListSchema.Field[i];
	}
	
	pfh.personFieldSchema = lookupHelper[pfh.PersonFieldInternalName];

	//Define any header content here.
	//You can include JavaScript and CSS links here.
	var headerHTML = ""
	headerHTML += "<style>"
	headerHTML += "#wasWrapper {position:relative;}"
	headerHTML += ".wasWrapperTable TH {width:180px;text-align:center; border-bottom:1px solid #cccccc;}"; 
	headerHTML += ".wasWrapper-row-alternate {background-color:rgba(153, 255, 204,0.3);}";
	headerHTML += ".wasWrapper-cell {border-bottom:1px solid #cccccc;}";
	headerHTML += ".includeNotes {position:relative;}";
	headerHTML += ".includedNotes {position:absolute;top:0px;right:0px;}";
	headerHTML += ".OtherUser Span, .CurrentUser Span {display:inline-block; text-align:center; width:100%;}";
	headerHTML += ".wasWrapper-modified {font-size:0.8em;}";
	headerHTML += ".CurrentUser {position:relative;}";
	headerHTML += ".CurrentUserEdit {position:absolute;right:3px;top:50%;}";
	headerHTML += "#nameCol {max-width:170px;min-width:170px;} ";
	headerHTML += "#todayMarker {position:absolute;text-align:center;font-weight:bold;border:solid 1px red;height:110%;top:-15px;"
	headerHTML += "}";
	headerHTML += "</style>";
	headerHTML += "<h2>Whereabouts Render 1</h2>";
	headerHTML += "<div id='wasWrapper'>";
	headerHTML += "<div id='todayMarker'></div>";
	headerHTML += "<table class='wasWrapperTable'>";
	headerHTML += "<tr class='wasWrapper-HeaderRow'><th id='nameCol'>Name</th><th id='monCol'>Mon</th><th id='tueCol'>Tue</th><th id='wedCol'>Wed</th><th id='thuCol'>Thur</th><th id='friCol'>Fri</th><th>Last Updated</th></tr>";
	return headerHTML;
	}

//Define our footer render pattern
pfh.renderFooter = function(ctx) {
	//Define any footer content here.
	var footerHTML = "</table></div>";
	return footerHTML;
	}

//Define our item Render pattern
//This will be called once for each item being rendered from the list.
//All fields in the view can be accessed using ctx.CurrentItem.InternalFieldName
//NB: The field must be included in the view for it to be available
pfh.CustomItem = function(ctx) {
    
    var currentRowID = "wasWrapper-" + ctx.CurrentItemIdx;
    var rowClass = "wasWrapper-row";
    
    if (ctx.CurrentItemIdx % 2 == 0)
    {
    	rowClass += " wasWrapper-row-alternate";
    }

    var itemHTML = "<tr id='" + currentRowID + "' class='" + rowClass + "'>";
    itemHTML += "<td class='wasWrapper-cell "
    if (ctx.CurrentItem.WeekNotes)
    {
    	itemHTML += "includeNotes'>";
    	itemHTML += "<div class='includedNotes'><img src='/_layouts/images/info16by16.gif' title='"
    	itemHTML += ctx.CurrentItem.WeekNotes + "'></div>"
    }
    else
    {
    	itemHTML += "'>";
    }
    
    UserFieldRenderer(pfh.PersonFieldInternalName);
    itemHTML += UserFieldRendererRenderField(ctx,pfh.personFieldSchema,ctx.CurrentItem,ctx.ListSchema);
	itemHTML += "</td>";
	
	if (_spPageContextInfo.userId != ctx.CurrentItem[pfh.PersonFieldInternalName][0].id)
	{
		//Now the data for the week
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span>" + ctx.CurrentItem.Monday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span>" + ctx.CurrentItem.Tuesday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span>" + ctx.CurrentItem.Wednesday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span>" + ctx.CurrentItem.Thursday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span>" + ctx.CurrentItem.Friday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell OtherUser'><span class='wasWrapper-modified'>" + ctx.CurrentItem.Modified;
		itemHTML += "<br>by " + ctx.CurrentItem.Editor[0].title + "</span></td>";
	}
	else
	{
		var editLinkForItem = ctx.editFormUrl + "&amp;ID=" + ctx.CurrentItem.ID + "&IsDlg=1&Source=" +window.location.href;
		//Now the data for the week for the Current User
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span>" + ctx.CurrentItem.Monday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span>" + ctx.CurrentItem.Tuesday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span>" + ctx.CurrentItem.Wednesday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span>" + ctx.CurrentItem.Thursday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span>" + ctx.CurrentItem.Friday + "</span></td>";
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='wasWrapper-modified'>" + ctx.CurrentItem.Modified;
		itemHTML += "<br>by " + ctx.CurrentItem.Editor[0].title + "</span>";
		itemHTML += "<div class='CurrentUserEdit'><a href='" + editLinkForItem + "' onclick='pfh.openUrlInModalDialog(&quot;" + editLinkForItem + "&quot;);return false;'><img src='/_layouts/15/images/edititem.gif?rev=41'></a></div>";
		itemHTML += "</td>";

	}
	itemHTML += "</tr>";
	return itemHTML;	
}

//Define any code/function that needs to be run AFTER the page has been completed and the DOM is complete.
pfh.PostRenderCallback = function(ctx) {

	var todayMarkerElement = document.getElementById("todayMarker");
	todayMarkerElement.textContent = "Today"
	var currDate = new Date();
	var dayOfWeek = currDate.getDay()
	switch (dayOfWeek)
	{
		case 1:
			var colElement = document.getElementById("monCol")
			todayMarkerElement.style.setProperty("width",colElement.clientWidth + "px","");
			todayMarkerElement.style.setProperty("left",colElement.offsetLeft + "px","");
		break;
		
		case 2:
			var colElement = document.getElementById("tueCol")
			todayMarkerElement.style.setProperty("width",colElement.clientWidth + "px","");
			todayMarkerElement.style.setProperty("left",colElement.offsetLeft + "px","");
		break;
		
		case 3:
			var colElement = document.getElementById("wedCol")
			todayMarkerElement.style.setProperty("width",colElement.clientWidth + "px","");
			todayMarkerElement.style.setProperty("left",colElement.offsetLeft + "px","");
		break;
		
		case 4:
			var colElement = document.getElementById("thuCol")
			todayMarkerElement.style.setProperty("width",colElement.clientWidth + "px","");
			todayMarkerElement.style.setProperty("left",colElement.offsetLeft + "px","");
		break;
		
		case 5:
			var colElement = document.getElementById("friCol")
			todayMarkerElement.style.setProperty("width",colElement.clientWidth + "px","");
			todayMarkerElement.style.setProperty("left",colElement.offsetLeft + "px","");

		break
		
		default:
			todayMarkerElement.style.setProperty("display","none","")
		break;	
	}

	//Now register an event handler for resizing..
	window.addEventListener('resize',pfh.PostRenderCallback);


}

pfh.openUrlInModalDialog = function(targetUrl) {
	var options = {
			url: targetUrl,
			dialogReturnValueCallback:pfh.modalDialogCallback
		};
	SP.UI.ModalDialog.showModalDialog(options);
}

pfh.modalDialogCallback = function(dialogResult,objData) {
	if(dialogResult == 1)
	{
		window.location.reload()
	}
	else
	{
		//no reload required
	}
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
	overrideCtx.OnPostRender = [function() {pfh.PostRenderCallback(ctx)}];
	
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
RegisterModuleInit(pfh.sitecolpath + "/_catalogs/masterpage/Display%20Templates/csr_ovr_RenderWhereabouts_ListView.js", pfh.RegisterTemplateOverride); // CSR-override for MDS enabled site
pfh.RegisterTemplateOverride(); //CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)

