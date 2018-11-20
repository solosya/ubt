(function ($) {

    $.fn.Ajax_LoadBlogArticles = function(options){
        var requestType = 'post';
        var url = _appJsConfig.baseHttpPath + '/home/load-articles';

        var requestData = { 
            offset      : options.offset, 
            limit       : options.limit, 
            _csrf       : $('meta[name="csrf-token"]').attr("content"), 
            dateFormat  : 'SHORT',
            existingNonPinnedCount: options.nonPinnedOffset
        };

        if (options.blogid) {
            requestData['blogguid'] = options.blogid;
        }

        if (options.loadtype == 'user') {
            var url = _appJsConfig.appHostName + '/api/'+options.loadtype+'/load-more-managed';
            var requestType = 'get';
        }


        if (options.search) {
            var refinedSearch = options.search;
            if (refinedSearch.indexOf(",listingquery") >= 0) {
                refinedSearch = refinedSearch.replace(",listingquery","");
                requestData['meta_info'] = refinedSearch;
            } else{
                requestData['s'] = refinedSearch;
            }
            var url = _appJsConfig.appHostName + '/'+options.loadtype;
            var requestType = 'get';
        }


        console.log('url:',url,requestData);

        return $.ajax({
            type: requestType,
            url: url,
            dataType: 'json',
            data: requestData
        }).done(function(r) {
            // console.log(r);
        });        
    };

}(jQuery));