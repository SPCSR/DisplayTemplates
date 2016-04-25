# Video display template

This is an item display template which is developed to show videos from SharePoint and the Office 365 Video Portal.

**Important**: This template can only be used on Office 365.

File | Desciption
--- | ---
__Item_Video.html__ | Video item display template;
__Item_Video_ChannelColor.html__ | Video item template which shows the Video Portal channel color.

##How to use it
Download this file and upload it to your master page gallery on the site collection where you want to make use of it. Once the video display template is published, you can configure your Content Search Web Part as follows:

![Item video configuration](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/04/snip_20160422122745-300x174.png)

##Search Queries
###Video portal files
The easiest way to retrieve videos from your Video Portal is by the following query: **SPContentType="Cloud Video"**.

###SharePoint Videos
To retrieve all videos that exist on SharePoint, you can use the following query: **SPContentType="Video"**.

*Important: this is the default video content type that is used in the asset library. If you have created your own custom content types, be aware that you might have to adapt this query in order to retrieve the right results.*

##Template result
The output of the **Item_Video.html** template looks like this:

![Video template output](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/04/snip_20160422141117-229x300.png)

The output of the **Item_Video_ChannelColor.html** template includes the Video Portal channel color:

![Video template with channel color output](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/04/snip_20160425153527-223x300.png)

If you are displaying videos from SharePoint, it can happen that your browser cannot play the video file. If that happens a message will get displayed.

![File format is not supported - SharePoint Video](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/04/042116_1851_Renderingvi8.png)

##More information
You can read more about the template in the following article: [Rendering video results with the use of display templates](http://www.eliostruyf.com/rendering-video-results-with-the-use-of-display-templates/ "Rendering video results with the use of display templates").