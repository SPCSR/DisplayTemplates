# Javascript Starter Display Templates

A simple as minimal as possible Display Template directly in Javascript. You can use these templates if you do not have publishing features activated on your SharePoint site, or if you want more control over the creating process of your display templates.

File | Desciption
--- | ---
__Control_Minimal.js__ | Starter control JavaScript display template.
__Item_Minimal.js__ | Starter item JavaScript display template.

##Usage / provisioning
###Manual upload
When you upload the files to the master page gallery you will have to manually set the metadata for each of the display template files.

**Control template**

The following metadata has to be set for the control display template:
-	Content type: **Display Template Code**
-	Name
-	Title
-	Target control type: **Content Web Parts** and/or **SearchResults** (depends for which type of web part you are creating the template)
-	Template level: **Control**

**Item template**

The following metadata has to be set for the item display template:
-	Content type: **Display Template Code**
-	Name
-	Title
-	Target control type: **Content Web Parts** and/or **SearchResults** (depends for which type of web part you are creating the template)
-	Template level: **Item**
-	Managed property mappings: **'Path','Title':'Title'**

![Managed metadata mappings](http://cdn-eliostruyf.azureedge.net/wp-content/uploads/2016/04/041316_1714_JavaScripts1.png)

###Provisioning via module
You can also provision the templates via a sandboxed solution module. 

```xml
<?xml version="1.0" encoding="utf-8"?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <Module Name="Templates" Path="Templates" Url="_catalogs/masterpage/CustomTemplates">
    <File Url="Control_Minimal.js" Level="Published" ReplaceContent="true" Type="GhostableInLibrary">
      <Property Name="ContentTypeId" Value="0x0101002039C03B61C64EC4A04F5361F38510660500A0383064C59087438E649B7323C95AF6" />
      <Property Name="MasterPageDescription" Value="This is the starter JS control display template." />
      <Property Name="Title" Value="Control JS" />
      <Property Name="TargetControlType" Value=";#Content Web Parts;#" />
      <Property Name="DisplayTemplateLevel" Value="Control" />
      <Property Name="HtmlDesignAssociated" Value="FALSE" />
      <Property Name="ContentType" Value="Display Template Code" />
    </File>
    <File Url="Item_Minimal.js" Level="Published" ReplaceContent="true" Type="GhostableInLibrary">
      <Property Name="ContentTypeId" Value="0x0101002039C03B61C64EC4A04F5361F38510660500A0383064C59087438E649B7323C95AF6" />
      <Property Name="MasterPageDescription" Value="This is the starter JS item display template." />
      <Property Name="Title" Value="Item JS" />
      <Property Name="TargetControlType" Value=";#Content Web Parts;#" />
      <Property Name="DisplayTemplateLevel" Value="Item" />
      <Property Name="ManagedPropertyMapping" Value="'Path','Title':'Title'" />
      <Property Name="HtmlDesignAssociated" Value="FALSE" />
      <Property Name="ContentType" Value="Display Template Code" />
    </File>
  </Module>
</Elements>
```

##See more
See more on the following articles: [Minimal Display Template](https://chuvash.eu/2016/04/13/minimal-display-template/) - [Starter JavaScript display templates for your projects](http://www.eliostruyf.com/starter-javascript-display-templates-for-your-projects/)