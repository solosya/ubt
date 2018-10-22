(function ($) {

    Acme.Signup = function() {
        this.events();
    };

    

    Acme.Signup.prototype.events = function() {

        $('#currency-form').on('click', function(e) {
            // e.preventDefault();
            $("#ui_plans").hide();

            var elem = $(e.target);
            console.log(elem.val());
            if (elem.val() == 'usd') {
                $("#au_plans").hide();
                $("#us_plans").show();
            }
            else if (elem.val() == 'aud') {
                $("#us_plans").hide();
                $("#au_plans").show();

            }           
            
        });
    
    }


}(jQuery));