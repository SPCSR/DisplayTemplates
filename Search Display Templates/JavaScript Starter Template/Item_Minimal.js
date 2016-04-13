/**
 * Javascript Starter Template - a minimal Display Template in JavaScript
 * @author Anatoly Mironov @mirontoli
 * blog post: https://chuvash.eu/2016/04/13/minimal-display-template/
 * @date 2016-04-13
 */


(function() {
  //config contains variables that are defined in one place
  var config = {
    templateName: "Item_Minimal",
    customFolder: "Contoso",
    fileName: 'Item_Minmal.js'
  }
  //url to your display template
  var templateUrl = ['~sitecollection', '_catalogs', 'masterpage', 
    'Display Templates', 'Search', config.customFolder, config.fileName].join('\u002f');

  //this is the function you want to care about. Here is the markup for every Result Item defined
  function getHtml(plainItem) {
    return ['<div>', title, '</div>'].join('');
  }
  //this is the built-in function, "_Minimal" is my change. You can keep it.
  //perhaps it is possible to refactor this function
  function DisplayTemplate_Minimal(ctx) {
    var cachePreviousTemplateData = ctx.DisplayTemplateData;
    ctx.DisplayTemplateData = {
      'TemplateUrl': templateUrl,
      'TemplateType': 'Item',
      'TargetControlType': 'SearchResults',
      'ManagedPropertyMapping': {
        'Title':['Title']
      }
    };
    var cachePreviousItemValuesFunction = ctx.ItemValues;
    ctx.ItemValues = function(slotOrPropName) {
      return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
    };
    ctx.ItemValues = cachePreviousItemValuesFunction;
    ctx.DisplayTemplateData = cachePreviousTemplateData;
    //here you map Search result to you plain object
    var plainItem = { 
      title: $getItemValue(ctx, "Title")
    }
    //here you get the html markup for your plain object
    return getHtml(plainItem);
  }

  //the remainder is just the boilerplate for registering your display template, normal and for MDS
  window.RegisterTemplate_Minimal = function() {
    var srchLoaded = Srch && Srch.U && Srch.registerRenderTemplateByName;
    if (srchLoaded) {
      Srch.U.registerRenderTemplateByName(config.templateName, DisplayTemplate_Minimal);
    }

    if ("undefined" != typeof (Srch) &&
      "undefined" != typeof (Srch.U) &&
      typeof(Srch.U.registerRenderTemplateByName) == "function") {
      Srch.U.registerRenderTemplateByName(templateUrl, DisplayTemplate_Minimal);
    }
  };

  window.RegisterTemplate_Minimal();

  if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
    RegisterModuleInit(Srch.U.replaceUrlTokens(templateUrl), window.RegisterTemplate_Minimal);
  }
})();
