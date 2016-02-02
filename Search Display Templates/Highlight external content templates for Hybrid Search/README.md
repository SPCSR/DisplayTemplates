Highlight external content in your Hybrid Search
================

If you setup hybrid search in your environment, it could be helpful for your users to highlight the external/on-premises content. This could be an icon or a color. The reason why is that not in every environment the on-premises environment is accessible from everywhere. In most organizations you have to be on the corporate network or connected via VPN. If your users would try to access the data without being on the corporate network this would lead to frustration that documents would not open. So highlighting this content could solve this frustration.

![On-premises search results highlighted with a VPN icon](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/02/020216_0908_Highlighton2.png)

File | Desciption
--- | ---
__Item_CommonItem_Body_External.html__ | Displays the inline result body elements that are common to all external results.
__Item_External.html__ | Displays a result tailored for a External Item with a VPN icon.
__vpn-small.png__ | VPN icon (this can be changed in whatever you want it to be).

## Configuration ##

Upload these display templates and the icon to the master page gallery in a folder called **hybrid-search**.

Path: ~sitecollection/_catalogs/masterpage/hybrid-search/

If you would place these files in another folder, you will have to update the image reference in the Item_CommonItem_Body_External.html template.

## Related blog post ##
Check the following article to get more information about these templates: [Highlight on-premises search results in your hybrid configuration](http://www.eliostruyf.com/highlight-on-premises-search-results-in-your-hybrid-configuration/)

