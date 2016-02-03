Highlight external content in your Hybrid Search
================

If you setup hybrid search in your environment, it could be helpful for your users to highlight the external/on-premises content. This could be an icon or a different color. The reason is that the on-premises environment might not be accessible from everywhere. In most organizations you have to be on the corporate network or connected through VPN or Direct Access. If your users would try to access the data without being connected to the corporate network this would lead to frustration because documents won't open. Specifically highlighting on-premises content could prevent this frustration.

![On-premises search results highlighted with a special icon](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/02/020216_0908_Highlighton2.png)

File | Desciption
--- | ---
__Item_CommonItem_Body_External.html__ | Displays the inline result body elements that are common to all external results.
__Item_External.html__ | Displays a result tailored for an External Item with a specific icon.
__corpnet-small.png__ | Corporate network icon (this can be changed in whatever you want it to be).

## Configuration ##

Upload these display templates and the icon to the master page gallery in a folder called **hybrid-search**.

Path: ~sitecollection/_catalogs/masterpage/hybrid-search/

If you want to put these files in another folder, you will have to update the image reference in the Item_CommonItem_Body_External.html template.

## Related blog post ##
Check the following article to get more information about these templates: [Highlight on-premises search results in your hybrid configuration](http://www.eliostruyf.com/highlight-on-premises-search-results-in-your-hybrid-configuration/)

