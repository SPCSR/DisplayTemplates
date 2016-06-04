//Original Author: Paul Hunt - December 2015

//Create our Namespace object to avoid polluting the global namespace
var pfh = pfh || {};

pfh.EditMode = false;
pfh.CurrentUserItemID = -1;
pfh.EditChanges = false;
pfh.personFieldSchema = "";
pfh.PersonFieldInternalName = "StaffName"; //Note: We use this to set the name of the StaffName field which is used in a few places. it helps with the person field picker.
pfh.whereaboutsChoices = new Array();
pfh.itemsURL = "/sites/whereabouts/_api/web/lists/GetByTitle('Whereabouts')/items";

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
	
	//Set up our CSS.. I decided to do it inline so that it was easier to follow.
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
	headerHTML += "span.currUserEditBlock {display:none;}";
	headerHTML += ".currUserExtraEditData {display:none;border-bottom:1px solid #cccccc;}";
	headerHTML += ".currUserExtraEditDataCell {width:100%; padding:5px 0px 5px 0px;}";
	headerHTML += ".choicesEntry {width:100px;text-align:center;margin-right:5px;}";
	headerHTML += "#nameCol {max-width:170px;min-width:170px;} ";
	headerHTML += "#todayMarker {position:absolute;text-align:center;font-weight:bold;border:solid 1px red;height:110%;top:-15px;"
	headerHTML += "}";
	headerHTML += "</style>";
	headerHTML += "<h2>Whereabouts Render 2</h2>";
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
		//This data doesn't match the person viewing, so we'll just render it.
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
		var editLinkForItem = ctx.editFormUrl + "&amp;ID=" + ctx.CurrentItem.ID + "&Source=" +window.location.href;
		//Now the data for the week for the current user
		//We need to know the Item ID of the item that represents the current user for storing edits
		pfh.CurrentUserItemID = ctx.CurrentItem.ID
				
		//set up the choices field (This extracts the semi-colon delimited field into values and makes them available in the drop-down)
		pfh.whereaboutsChoices = ctx.CurrentItem.Choices.split(";");

		//Now we'll do a display mode and edit mode for each cell. The edit mode cells will be hidden by default and made visible when the user switches to edit mode.
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='currUserEditBlock'><input id='currUserMonday' style='width:100px;text-align:center;' type='text' list='choices' value='" + 
		 ctx.CurrentItem.Monday + "'/><datalist id='choices'><option selected='true' value=" + ctx.CurrentItem.Monday + ">" +
		 ctx.CurrentItem.Monday + "</option>" + pfh.returnOptionBlock(ctx.CurrentItem.Monday) + "</datalist></span>";
		itemHTML += "<span class='currUserDisplayBlock'>" + ctx.CurrentItem.Monday + "</span></td>";
		
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='currUserEditBlock'><input id='currUserTuesday' style='width:100px;text-align:center;' type='text' list='choices' value='" + 
		 ctx.CurrentItem.Tuesday + "'/><datalist id='choices'><option selected='true' value=" + ctx.CurrentItem.Tuesday + ">" +
		 ctx.CurrentItem.Tuesday + "</option>" + pfh.returnOptionBlock(ctx.CurrentItem.Tuesday) + "</datalist></span>";
		itemHTML += "<span class='currUserDisplayBlock'>" + ctx.CurrentItem.Tuesday + "</span></td>"; 
		
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='currUserEditBlock'><input id='currUserWednesday' style='width:100px;text-align:center;' type='text' list='choices' value='" + 
		 ctx.CurrentItem.Wednesday + "'/><datalist id='choices'><option selected='true' value=" + ctx.CurrentItem.Wednesday + ">" +
		 ctx.CurrentItem.Wednesday + "</option>" + pfh.returnOptionBlock(ctx.CurrentItem.Wednesday) + "</datalist></span>";
		itemHTML += "<span class='currUserDisplayBlock'>" + ctx.CurrentItem.Wednesday + "</span></td>"; 
		
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='currUserEditBlock'><input id='currUserThursday' style='width:100px;text-align:center;' type='text' list='choices' value='" + 
		 ctx.CurrentItem.Thursday + "'/><datalist id='choices'><option selected='true' value=" + ctx.CurrentItem.Thursday + ">" +
		 ctx.CurrentItem.Thursday + "</option>" + pfh.returnOptionBlock(ctx.CurrentItem.Thursday) + "</datalist></span>";
		itemHTML += "<span class='currUserDisplayBlock'>" + ctx.CurrentItem.Thursday + "</span></td>";
		 
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='currUserEditBlock'><input id='currUserFriday' style='width:100px;text-align:center;' type='text' list='choices' value='" + 
		 ctx.CurrentItem.Friday + "'/><datalist id='choices'><option selected='true' value=" + ctx.CurrentItem.Friday + ">" +
		 ctx.CurrentItem.Friday + "</option>" + pfh.returnOptionBlock(ctx.CurrentItem.Friday) + "</datalist></span>";
		itemHTML += "<span class='currUserDisplayBlock'>" + ctx.CurrentItem.Friday + "</span></td>"; 
		 
		itemHTML += "<td class='wasWrapper-cell CurrentUser'><span class='wasWrapper-modified'>" + ctx.CurrentItem.Modified;
		itemHTML += "<br>by " + ctx.CurrentItem.Editor[0].title + "</span>";
		itemHTML += "<div class='CurrentUserEdit'><a href='" + editLinkForItem + "' onclick='pfh.ShowEditFields();return false;'><img src='/_layouts/15/images/edititem.gif?rev=41'></a></div>";
		itemHTML += "</td>";
		

		//Now we'll insert an extra row or two to capture choices and user notes when in edit mode.
		itemHTML += "</tr><tr class='currUserExtraEditData'><td class='wasWrapper-cell currUserExtraEditDataCell' colspan=7>"
		itemHTML += "<span style='width:100%;' class='currUserEditBlock'>Notes for this week: "
		itemHTML += "<input id='currUserWeekNotes' style='width:88%;' type='text' value='" + ctx.CurrentItem.WeekNotes + "'></span></td>"
		itemHTML += "<tr class='currUserExtraEditData'><td class='wasWrapper-cell currUserExtraEditDataCell' colspan=7>"
		itemHTML += "<div class='choicesEditWrapper'><span style='width:100%;' class='currUserEditBlock'>" 
		
		$(pfh.whereaboutsChoices).each(function() {
			itemHTML += "<input class='choicesEntry' value='" + this + "' type='text'>";		
		});
		
		itemHTML += "<a href='/' onclick='pfh.AddNewChoiceItem();return false;'><span class='ms-list-addnew-imgSpan20'><img class='ms-list-addnew-img20' id='addNewChoiceItem' src='/_layouts/15/images/spcommon.png?rev=43#ThemeKey='/></a>"
		
		itemHTML += "</span></div></td>";

	}
	itemHTML += "</tr>";
	return itemHTML;	
}

//This function reacts to the user clicking the PLUS (+) icon in the choices dialog.
pfh.AddNewChoiceItem = function() {
console.log("Adding new Choice option");
$(".choicesEntry").last().after("<input class='choicesEntry' type='text' onchange='pfh.editFieldChanged();'>");
return false;
}


pfh.returnOptionBlock = function(currSelection) {
	var returnBlock = "";
	for (index = 0; index < pfh.whereaboutsChoices.length; ++index) {
		if (currSelection != pfh.whereaboutsChoices[index])
		{
			returnBlock += "<option value='" + pfh.whereaboutsChoices[index] + "'>" + pfh.whereaboutsChoices[index] + "</option>";
		}
	}
	
	return returnBlock;
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
	
	//Now add a function to register changed data when the current user item is edited.
	$(".currUserEditBlock input").change(pfh.editFieldChanged);
}

pfh.editFieldChanged = function() {
	pfh.EditChanges = true;
	console.log("Changes registered");
	}

pfh.fetchInputField = function(dayToFetch) {
	idFetch = "#currUser" + dayToFetch;
	returnVal = $(idFetch).val();
	return returnVal;
}

pfh.ShowEditFields = function() {
	if (pfh.EditMode == true)
	{
		//We're in edit mode, so check if the value has changed, if so.. save the fields
		console.log("leaving edit mode, checking for changes")
		if (pfh.EditChanges == true)
		{
			console.log("Entering change update function");
			//Changes were made, so data must be saved.
			//We'll use REST to update the data and then refresh the page when the save is complete.
			
			if (pfh.CurrentUserItemID != -1)
			{
				msg = "Updating item " + pfh.CurrentUserItemID;
				console.log(msg);
				SP.UI.Notify.addNotification("Saving changes",false);			
				currItem = pfh.itemsURL + "(" + pfh.CurrentUserItemID +  ")";
				msg = "Using URL:" + currItem;
				console.log(msg);
				
				currentChoices = ""
				
				$(".choicesEntry").filter(function()
				 { return $.trim($(this).val()).length > 0}).each(function()
				 { 
				 	if (currentChoices.length > 0) {currentChoices += ";"};
					 	currentChoices += $(this).val();			
					});
				console.log(currentChoices)
				
				
				//Note the SP.Data.WhereaboutsListItem changes based on your list. You can find this out by using the following
				//REST call in your browser....
				//....https://[YOUR TENANCY HERE]/sites/[SUBSITENAME]/_api/web/lists/GetByTitle('[LISTNAME]')?$select=ListItemEntityTypeFullName
				dataPacket = {"__metadata":{ "type":"SP.Data.WhereaboutsListItem"}};
				dataPacket.Monday = pfh.fetchInputField("Monday");
				dataPacket.Tuesday = pfh.fetchInputField("Tuesday");
				dataPacket.Wednesday = pfh.fetchInputField("Wednesday");
				dataPacket.Thursday = pfh.fetchInputField("Thursday");
				dataPacket.Friday = pfh.fetchInputField("Friday");
				dataPacket.WeekNotes = pfh.fetchInputField("WeekNotes");
				dataPacket.Choices = currentChoices;

				$.ajax({
					url: currItem,
					type: "POST",
					headers: { "accept": "application/json;odata=verbose",
							   "content-type": "application/json;odata=verbose",
							   "X-HTTP-Method":"MERGE",
							   "IF-MATCH": "*",
							   "X-RequestDigest": $("#__REQUESTDIGEST").val()
					},
					data: JSON.stringify(dataPacket)
				}).done(function(result){
					console.log("Promise finished");
					window.location.reload();
				}).fail(function(result) {
					var errStatus = SP.UI.Status.addStatus("I'm sorry, something went wrong while updating. Please refresh the page and try again")
					SP.UI.Status.setStatusPriColor(errStatus,'red');
				});
				
				
			}
			
			console.log("Update process finished");
		
		}
		else
		{
			console.log("No changes made")
		}
		
		
		//Now hide the edit fields and display the read only.
		$("span.currUserEditBlock").css( "display", "none");
		$("span.currUserDisplayBlock").css( "display", "inline-block");
		$(".currUserExtraEditData").css("display","none");

		pfh.EditMode = false;
	}
	else
	{
		console.log("Entering edit mode")
		
		//We're in display mode..so hide the display and show the edit.
		$("span.currUserDisplayBlock").css( "display", "none");
		$("span.currUserEditBlock").css( "display", "block");
		$(".currUserExtraEditData").css("display","table-row");
		pfh.EditMode = true;
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

