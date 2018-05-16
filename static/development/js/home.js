var BlogController = (function ($) {
    return {
        blog: function() {
            BlogController.Blog.init();
        }
    };
}(jQuery));

BlogController.Blog = (function ($) {
    var attachEvents = function () {

        //attach follow blog
        $('a.followBlog').followBlog({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " blog(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
        //attach follow user
        $('a.followUser').followUser({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " user(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
    };
    
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));