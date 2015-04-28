Table Layout with Sorting Templates (CSWP)
================

With these display templates you are able to render your results in a table layout. You have 10 properties which you could configure, for each managed property the display template will automatically check if it is sortable. If the managed property is sortable, that property would retrieve an ascending and descending link behind it.

File | Desciption
--- | ---
__Control_List_Table.html__ | This is the control template which needs to be used for the table layout.
__Item_List_Item.html__ | This is the item template which creates a column for each managed property and its value.
__Control_List_Table_Without_Sorting.html__ | You can use this control template if you do not want the sorting options to be available.
__Item_List_Item_Without_Sorting.html__ | You can use this item template if you do not want the sorting options to be available.
__table.redirection.js__ | This extra JavaScript file is needed to build to retrieve the web URL and redirect you to the correct property page.
__Control_List_Table_Batching.html__ | This template supports the REST batching functionality which is currenlty only available to use in **Office 365 / SharePoint Online**. If you want to make use of this template, you only need to download the Item_List_Item.html file. The table.redirection.js is not required for this template.

**Note: you will need to change the link to the table.redirection.js file in the Control_List_Table.html file.**

**Usage**

More information can be found on the following blog post: [Table layout display template with managed property sorting](http://www.eliostruyf.com/table-layout-display-template-with-managed-property-sorting/ "Table layout display template with managed property sorting")