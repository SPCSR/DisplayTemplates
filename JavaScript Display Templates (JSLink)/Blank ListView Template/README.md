Blank ListView Template
================

This folder is a collection of blank list view templates that can be used via the JSLink property of list view web parts of in Views via PowerShell.

__csr_ovr_RenderListTemplate.js__             | This template renders a single page of results without any paging ability
__csr_ovr_RenderListTemplateWithPaging.js__   | This template is similar, however it includes paging controls.

JAN 2015 Update

There was an issue with the MDS registration on all of these that required you to inject the site collection location into the display template. The _spPageContextInfo.siteAbsoluteUrl object gives us the absolutle URL of the site collection, so we'll use that. (Thanks to Elio Struyf for the pointer!)

If we're not using MDS on the site, then we don't care and the registration is ignored.