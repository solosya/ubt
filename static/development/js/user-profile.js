Acme.UserProfile = Acme.View.create(
{
    "container"     : {
        'main'          : $('#listingForm')
    },
    "listeners"     : {
    },
    "render": function() {
        console.log('in the render function');
        console.log(this.data);
    },
    "events": function() 
    {
        var self = this;

        $('input, textarea').on("change", function(e) {
        });

        $('#profile-form').submit(function(e) {
        });

        $('.change-password').on("click", function(e) {
            $('#password').removeAttr('disabled');
            $('#password').attr("placeholder", "Enter new password")
            $('.verifypassword').removeClass('hidden');
            this.remove();
        })

    },
    "construct": function() 
    {
        this.subscriptions = Acme.PubSub.subscribe({
            // 'Acme.ListingForm.listener' : ["state_changed", 'update_state']
        });

        this.render();
        this.events();
    }
});

$('[data-dismiss="alert"]').on('click', function(e) {
    this.closest('div').remove();
});
