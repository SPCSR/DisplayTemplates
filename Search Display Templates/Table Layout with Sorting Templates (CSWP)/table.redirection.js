var tableLayoutDT = tableLayoutDT || {};
tableLayoutDT.redirectToPropertiesUrl = function (element, docPath) {
    docPath = docPath.substring(0, docPath.lastIndexOf('/')) + "/_api/contextinfo";

    var request = new XMLHttpRequest();
    request.open('POST', docPath, true);
    request.setRequestHeader('Accept', 'application/json; odata=verbose');
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (!Srch.U.n(request.responseText)) {
                var data = JSON.parse(request.responseText);
                var webUrl = data.d.GetContextWebInformation.WebFullUrl;
                // Check if the web url that is retrieved is not null or empty
                if (!Srch.U.n(webUrl) && !Srch.U.e(webUrl)) {
                    GoToPage(String.format('{0}{1}', webUrl, element.getAttribute('href')));
                }
            }
        }
    };
    request.onerror = function (e) {
        // Catching errors
    };
    request.send(null);
    return false;
}