Adding or customizing search hover panel actions
================

These display templates show you a couple of ways on how you could add and customize hover panel actions in your search center.

Everything is explained in the following blog post: [Adding and customizing actions in the search hover panel](http://www.eliostruyf.com/adding-and-customizing-actions-in-the-search-hover-panel/ "Adding and customizing actions in the search hover panel")

**Important: The location of where I stored these display templates is: ~sitecollection/_catalogs/masterpage/SearchDT. If you are going to use one of these templates, it can be that you need to update the references to the file in your templates.**

## Approach 1: adding or changing a custom action for all hover panels ##

File | Desciption
--- | ---
Item_CommonHoverPanel_Actions.html | This is the hover panel actions template in which I made a small change text change to the send action.

## Approach 2: adding a custom action for a specific display template ##

File | Desciption
--- | ---
Item_Word.html | This is the Word item display template in which the hover panel template location has been changed. 
Item_Word_HoverPanel.html | A custom action has been added to the hover panel actions section.

## Approach 3: adding or modifying a custom action for a specific display template ##

File | Desciption
--- | ---
Item_Word.html | This template contains the code to get the hover panel actions display template loaded.
Item_Word_HoverPanel.html | The hover panel display template that your specified will be used to render the footer.
Item_CommonHoverPanel_Actions.html | This is the hover panel actions display template that is used to render the foorter in your hover panel template.

## Approach 4: optimizing the third approach for multiple result types ##

File | Desciption
--- | ---
Item_Word.html | This template contains the script reference to the search_hoverpanel.js file.
Item_Word_HoverPanel.html | The hover panel display template that your specified will be used to render the footer.
Item_PowerPoint.html | This template contains the script reference to the search_hoverpanel.js file.
Item_PowerPoint_HoverPanel.html | The hover panel display template that your specified will be used to render the footer.
Item_CommonHoverPanel_Actions.html | This is the hover panel actions display template that is used to render the foorter in your hover panel template.
search_hoverpanel.js | This file contains the JavaScript code to load the template and to return the function to render the footer actions.