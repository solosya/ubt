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
            requestData['meta_info'] = options.search;
            requestData['s'] = options.search;
            var url = _appJsConfig.appHostName + '/'+options.loadtype;
            var requestType = 'get';
        }

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