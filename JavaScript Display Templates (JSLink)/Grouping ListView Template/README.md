Render Single Group ListView Template
================


This folder contains a single List view Display template that displays the selected List view in a single grouping level (Now works with Expanded or collapsed groups).

* __csr_ovr_RenderGroup.js__             | This template renders custom items for a single grouping level, including item retrieval.
* __RenderGroup.css__			 | This css file is empty ready for your use with the custom item.


**These templates are currently configured for a BaseViewID of 1 and a ListTemplateType of 100 (Custom List)**

When you apply group to a list view that is being customised using JSLink and a display template, SharePoint tries to apply it's own group rendering which ultimately breaks, resulting in the headers being displayed in a single line with no click action.

![Screenshot of the debug brief template in action](https://raw.githubusercontent.com/SPCSR/DisplayTemplates/master/JavaScript%20Display%20Templates%20(JSLink)/Grouping%20ListView%20Template/images/GroceryList3.png)


Once you apply the custom template with custom grouping applied, the list renders the group headers correctly, which when clicked on retrieves the individual list items and then applies our custom rendering.

![Screenshot of the debug brief template in action](https://raw.githubusercontent.com/SPCSR/DisplayTemplates/master/JavaScript%20Display%20Templates%20(JSLink)/Grouping%20ListView%20Template/images/GroceryList4.png)

