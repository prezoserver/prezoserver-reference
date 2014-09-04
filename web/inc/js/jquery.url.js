/*
jQuery Url Plugin
 * 2010-06-10
 * URL: http://ostico.it/content/javascript/jquery/jquery-url-plugin-improvement
 * Description: jQuery Url Plugin gives the ability to read GET parameters from the ALL URL's       *
 * Author: Domenico Lupinetti
 * Copyright: Copyright (c) 2010 Domenico Lupinetti under dual MIT/GPL license.
 *
 *** Original Author: Matthias J�ggli
 * URL: http://ajaxcssblog.com/jquery/url-read-get-variables/
 * Copyright: Copyright (c) 2009 Matthias J�ggli under dual MIT/GPL license.
 */
 
(function($) {
    $.url = {};
    $.extend($.url, {
        _params : {},
        init : function(urlPath) {
            var paramsRaw = "";
            try {
                paramsRaw = (urlPath.split("?", 2)[1] || "").split("#")[0].split("&") || [];
                for ( var i = 0; i < paramsRaw.length; i++) {
                    var single = paramsRaw[i].split("=");
                    if (single[0])
                        //fix for plus signs from John E on August 24th, 2009 on the Author's Blog
                        this._params[single[0]] = unescape(single[1].replace(/\+/g, " "));
                }
            } catch (e) {
                // alert(e);
            }
        },
        param : function(urlPath, name) {
            this.init(urlPath);
            return this._params[name] || "";
        },
        paramAll : function(urlPath) {
            this.init(urlPath);
            return this._params;
        }
    });
 
})(jQuery);
// parse Params of a GET STRING
 
// USE: var srcParam = $.url.param("http://example.ex/getstring.php?try=23+xxxx&src=test#this", "src");
// USE: var allParams = $.url.paramAll("http://example.com/getstring.php?try=23+xxxx&src=test#this");