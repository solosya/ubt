var ListingController = function() {
    return new Listing();
}

var Listing = function() {
    this.events();
};




Listing.prototype.events = function() 
{
    var self = this;
    console.log(_appJsConfig);
    if(_appJsConfig.isUserLoggedIn === 1) {
        init();
    }
    // var data = {};
    //     data['id'] = 0;
    //     data['guid'] = "";
    //     data['blogs'] = ["406b3a91-f4b3-4a97-b52b-82f601a5b93e"]; 
    //     data['status'] = 'published';
    //     data['title'] = "testing 00";
    //     data['content'] = "testing content 00";
    function init() {
        $('#listingForm').submit(function(e) {
            e.preventDefault();
            var form = $(this);
            var address = form.find("#address");
            var content = form.find("#description");
            var data = {};
            data['id'] = 0;
            data['guid'] = "";
            data['blogs'] = ["406b3a91-f4b3-4a97-b52b-82f601a5b93e"]; 
            data['status'] = 'published';
            data['title'] = address.val();
            data['content'] = content.val();
            data['extendedData'] =  {
                "address": address.val(),
                "phone": "9489474383",
                "contact": "Iron Man"
            };
            // var extendedData = [];
            // $.each($('.articleExtendedData'), function (index, formField) {
            //     if($(formField).is("select")) {
            //       var selectKey = $(formField).attr('name');
            //       var selectVal =  $(formField).find("option:selected").val();
            //       extendedData[selectKey] = selectVal;
            //     }
            //     else if($(formField).is(":radio")) {
            //       var radioKey = $(formField).attr('name');
            //       var radioVal =  $("input[name='"+radioKey+"']:checked").val();
            //       extendedData[radioKey] = radioVal;
            //     }
            //     else if($(formField).is(":checkbox")) {
            //         var checkboxKey =  $(formField).attr('name').slice(0, $(formField).attr('name').length - 2);
            //         var checkElement = [];
            //         $.each($("input[name='" + checkboxKey + "[]']:checked"), function (index, checkField) {
            //             var checkboxVal = $(checkField).val();
            //             checkElement.push(checkboxVal);
            //         });
            //       extendedData[checkboxKey] = checkElement;
            //     }
            //     else {
            //       var inputKey = $(formField).attr('name');
            //       var inputVal =  $(formField).val();
            //       extendedData[inputKey] = inputVal;
            //     }
            // });

            console.log(data);
            if (data['title'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must have a title"});
            }
            if (data['content'] == "") {
                $.fn.General_ShowErrorMessage({message: "Article must contain content"});
            }
            app.server.create(_appJsConfig.appHostName + '/api/article/create', data).done(function(r) {
                console.log('checking r');
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
            console.log('submitting form');
        });
    }  

};