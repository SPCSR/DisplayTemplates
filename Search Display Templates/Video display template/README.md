# Video display template

This is an item display template that is developed to show videos from SharePoint and the Office 365 Video Portal.

**Important**: This template can only be used on Office 365.

File | Desciption
--- | ---
__Item_Video.js__ | Video item display template.

##How to use it
Download this file and upload it to your master page gallery on the site collection where you want to make use of it. Once the video display template is published, you can configure your Content Search Web Part as follows:

*TBA*

##Search Queries
###Video portal files
The easiest way to retrieve videos from your Video Portal is by the following query: **SPContentType="Cloud Video"**.

###SharePoint Videos
To retrieve all videos that exist on SharePoint, you can use the following query: **SPContentType="Video"**.

*Important: this is the default video content type that is used in the asset library. If you have created your own custom content types, be aware that you might have to adapt this query in order to retrieve the right results.*

##More information
*TBA*