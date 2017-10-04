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
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            data[elem.attr('name')] = elem.val();
            self.updateData(data);
            console.log(self.data);
        });

        $('#profile-form').submit(function(e) {
            e.preventDefault();
            console.log(self.data);

            if (self.data['first'] === undefined || self.data['first'] == "") {
                Acme.dialog.show("User must have a first name", "Error");
                return;
            }
            if (self.data['username'] === undefined || self.data['username'] == "") {
                Acme.dialog.show("User must have a username");
                return;
            }
            if (self.data['first'] === undefined || self.data['first'] == "") {
                Acme.dialog.show("User must have a first name", "Error");
                return;
            }

            Acme.server.create('article/create', self.data).done(function(r) {
                Acme.PubSub.publish('update_state', {'userArticles': ''});
                console.log(r);
            }).fail(function(r) {
                console.log(r);
            });
        });

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
