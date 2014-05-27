DisplayTemplates/Search Display Templates/mAdcOW Search Center Templates
================

Copy the mAdcOW folder and it's content to _catalogs/masterpage/Display Templates of the target site collection and you should be ready to go.

__mAdcOW_Control_SearchResults_Vertical_Count.html__ | This control template includes: vertical counts, real search as you type, user segment code, and styling of promoted results. Edit the template and set the appropriate variables at the top for the functions you want included.

__Item_DocumentLink.html + Body__ | Item template for rendering external document links.

__mAdcOW_Control_Refinement.html__ | Refiner control template to be used for Department and last modified by refiners.

__mAdcOW_Filter_Default_Count.html__ | Default refiner template with counts turned on.

__mAdcOW_Filter_Department.html__ | Refiner template to render the users Departments. Requires mapping of the crawled property ows_q_USER_Editor to for example RefinableString00, and then use RefinableString00 as the refiner property.

__mAdcOW_Filter_Modified.html__ | Refiner template to render last modified user. Requires mapping of the crawled property ows_q_USER_Editor to for example RefinableString00, and then use RefinableString00 as the refiner property.

__mAdcOW_Filter_Icon.html__ | Refiner template to render document format hits as icon. To be used with the mananged property FileType.

__mAdcOW_Item_BlogPost.html + Body__ | Item template for rendering blog posts with the blog author image, name and link to blog. Requires mapping of the crawled property ows_NumComments to RefinableString01, and a result type which triggers on contentclass=STS_ListItem_Posts, mapped to the display template.