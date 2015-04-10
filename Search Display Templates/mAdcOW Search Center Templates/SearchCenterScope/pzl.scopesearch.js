// Created by @mikaelsvenson - Puzzlepart 2015
// http://techmikael.blogpost.com
//
// Requirement: jQuery

"use strict";
//ensure we have a logger
if (!window.console || !window.console.log) {
    window.console = {
        log: function () { }
    }
}

var Pzl;
(function (Pzl) {

    // Get parameteres from the URL
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Get title from list or site - using XRANK to boost sites for shorter URL's
    function getTitleFromUrl(url) {
        var defer = $.Deferred();
        var webUrl = _spPageContextInfo.webAbsoluteUrl;
        var restUrl = webUrl + "/_api/search/query?querytext='-contentclass:STS_ListItem+XRANK(cb%3d1000)+(contentclass%3dsts_web+OR+contentclass%3dsts_site) path:\"" + url + "\"'&rowlimit=1&selectproperties='title'&clienttype='DNVGL'";
        $.ajax({
            url: restUrl,
            type: "GET",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        }).done(function (data) {
            var title = "";
            if (data.d.query.PrimaryQueryResult != null) {
                var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                $.each(results, function () {
                    $.each(this.Cells.results, function () {
                        var propertyName = this.Key;
                        if (propertyName === "title") {
                            title = this.Value;
                            return false;
                        }
                    });
                });
            }
            defer.resolve(title);
        }).fail(function (data) {
            console.log(JSON.stringify(data));
            defer.reject();
        });
        return defer.promise();;
    }

    // If u= scope param is available, then hide the navigation - if not u= is carried over to verticals
    function hideNav() {
        var uParam = getParameterByName("u");
        if (!Srch.U.e(uParam)) {
            console.log("Hiding nav for scope search");
            jQuery(".ms-srchnav").hide();
        }
    }

    function showScopeHint() {
        var uParam = getParameterByName("u");
        var dp = Srch.ScriptApplicationManager.get_current().queryGroups.Default.dataProvider;
        var allUrl = Srch.U.getResultsPageUrl("Results.aspx", dp.get_currentQueryState().k);
        if (!Srch.U.e(uParam)) {
            getTitleFromUrl(uParam).always(function (title) {
                if (title == "") {
                    title = uParam;
                }
                var markup = '<div class="ms-srch-upscope-top">Showing results from <a title="' + uParam + '" href="' + uParam + '" target="_blank">' + title + '</a>, or search in <a title="All" href="' + allUrl + '">All</a> content</div>';
                // Insert scope search hint
                jQuery("#Result").prepend(markup);
            });
        }
    }

    jQuery(document).ready(function () {
        SP.SOD.executeFunc("Search.ClientControls.js", "Srch.ScriptApplicationManager", function () {
            hideNav();
            console.log("Hooking post render for scope hint");
            var dp = Srch.ScriptApplicationManager.get_current().queryGroups.Default.dataProvider;
            dp.add_resultReady(showScopeHint);
        });
    });
})(Pzl || (Pzl = {}));