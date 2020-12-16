(function ($) {


Acme.UserProfileController = function()
{
    this.csrfToken = $('meta[name="csrf-token"]').attr("content");
    this.events();
    this.userEvents();
    this.listingEvents();
};


Acme.UserProfileController.prototype.deleteUser = function(e) {
    var user = $(e.target).closest('li');
    var userid = user.attr("id");
    var requestData = { 
        id: userid, 
        _csrf: this.csrfToken
    };

    return $.ajax({
        type: 'post',
        url: _appJsConfig.baseHttpPath + '/user/delete-managed-user',
        dataType: 'json',
        data: requestData,
        success: function (data, textStatus, jqXHR) {
            if (data.success == 1) {
                user.remove();
                $('#addManagedUser').removeClass('hidden');
                var usertxt = $('.profile-section__users-left').text();
                var usercount = usertxt.split(" ");
                var total = usercount[2];
                usercount = parseInt(usercount[0]);
                $('.profile-section__users-left').text((usercount - 1) + " of " + total + " used.");
            } else {
                var text = '';
                for (var key in data.error) {
                    text = text + data.error[key] + " ";
                } 
                $('#createUserErrorMessage').text(text);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
             $('#createUserErrorMessage').text(textStatus);
        },
    });
};

Acme.UserProfileController.prototype.renderUser = function(parent, data, template) {

    var userTemp = template ? Handlebars.compile(template) : Handlebars.compile(window.templates.managed_user);
    if (data.constructor != Array) {
        data = [data];
    }
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += userTemp(data[i]);
    }
    // console.log(html);
    parent.empty().append(html);
};

Acme.UserProfileController.prototype.render = function(data) 
{
    var self = this;
    var data = data.users.users || data.users;
    var users = [];
    for (var i=0; i< data.length; i++) {
        users.push({
            firstname: data[i].firstname, 
            lastname:  data[i].lastname, 
            username:  data[i].username, 
            useremail: data[i].email,
        });
    }
    self.renderUser(($('#mangedUsers')), users, Acme.managed_user);
    self.userEvents();
};

Acme.UserProfileController.prototype.search = function(params) 
{   
    var self = this;
    this.fetch(params, 'search-managed-users').done(function(data) {
        self.render(data);
    });
};

Acme.UserProfileController.prototype.fetchUsers = function(params) 
{   
    var self = this;
    this.fetch(params, 'load-more-managed').done(function(data) {
        self.render(data);
    });
};

Acme.UserProfileController.prototype.fetch = function(params, url) 
{
    var url = _appJsConfig.appHostName + '/api/user/'+ url;
    return Acme.server.fetch(url, params);
};



Acme.UserProfileController.prototype.userEvents = function() 
{
    var self = this;

    $('.j-edit').unbind().on('click', function(e) {

        var listelem = $(e.target).closest('li');
        var userid = listelem.attr("id");

        function getUserData(func) {
            return {
                firstname: listelem.find('.j-firstname')[func](), 
                lastname:  listelem.find('.j-lastname')[func](), 
                username:  listelem.find('.j-username')[func](), 
                useremail: listelem.find('.j-email')[func](),
            };
        };

        var data = getUserData("text");
        var userTemp = Handlebars.compile(window.templates.edit_user);
        var html = userTemp(data);
        listelem.empty().append(html);

        $('#cancelUserCreate').on('click', function(e) {
            self.renderUser(listelem, data);
            self.userEvents();
        });

        $('#saveUser').on('click', function(e) {
            var requestData = getUserData("val");
            requestData.id = userid;
            requestData._csrf = this.csrfToken;
            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/edit-managed-profile',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    if (data.success == 1) {
                        self.renderUser(listelem, requestData);
                        $('#addManagedUser').removeClass('hidden');
                        $('#createUserErrorMessage').text('');   
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                    self.userEvents();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        
        });
    });  

    $('.j-delete').unbind().on('click', function(e) {
        Acme.SigninView.render("userPlanChange", "Are you sure you want to delete this user?")
            .done(function() {
                self.deleteUser(e);
            });
    });   
};




Acme.UserProfileController.prototype.events = function () 
{
    var self = this;


    $('#managed-user-search').on('submit', function(e) {
        e.preventDefault();
        var search = {};
        $.each($(this).serializeArray(), function(i, field) {
            search[field.name] = field.value;
        });
        self.search(search);
        $('#user-search-submit').hide();
        $('#user-search-clear').show();

    });

    $('#user-search-clear').on('click', function(e) {
        e.preventDefault();
        self.fetchUsers();
        $('#managed-user-search-field').val('');
        $('#user-search-submit').show();
        $('#user-search-clear').hide();
    });



    $('#addManagedUser').on('click', function(e) {
        e.preventDefault()
        var userTemp = Handlebars.compile(window.templates.create_user);
        var data = {
            firstname: "First name", 
            lastname:  "Last name", 
            username:  "Username", 
            useremail: "Email",
        };

        var html = '<li id="newUser" class="user-editor">' + userTemp(data) + '</li>';

        $('#mangedUsers').append(html);
        $('#newuserfirstname').focus();
        $('#addManagedUser').addClass('hidden');
        $('#nousers').addClass('hidden');
        
        $('#saveUser').on('click', function(e) {
            $('#createUserErrorMessage').text("");
            var requestData = { 
                firstname: $('#newuserfirstname').val(), 
                lastname:  $('#newuserlastname').val(), 
                username:  $('#newuserusername').val(), 
                useremail: $('#newuseruseremail').val(),
                _csrf: this.csrfToken
            };
            console.log('saving new user');
            if (!requestData['username']) {
                $('#createUserErrorMessage').text("You must supply a username");
                return;
            }
            if (!requestData['lastname']) {
                $('#createUserErrorMessage').text("You must supply a last name");
                return;
            }
            
            if (!requestData['useremail']) {
                $('#createUserErrorMessage').text("You must supply an email address");
                return;
            }
            
            $('#user-editor-buttons').addClass('spinner');
            console.log(_appJsConfig.appHostName);
            console.log(_appJsConfig.baseHttpPath);
            
            $.ajax({
                type: 'post',
                url: _appJsConfig.appHostName + '/user/create-paywall-managed-user',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    $('#user-editor-buttons').removeClass('spinner');

                    if (data.success == 1) {
                        location.reload(false);             
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#user-editor-buttons').removeClass('spinner');
                    $('#createUserErrorMessage').text(textStatus);
                },
            });        
        });

        $('#cancelUserCreate').on('click', function(e) {
            $('#newUser').remove();
            $('#addManagedUser').removeClass('hidden');
            $('#createUserErrorMessage').text('');
        });
    });



    $('#cancelAccount').on('click', function(e) {

        var listelem = $(e.target).closest('li');
        var userid = listelem.attr("id");
        // var template = "cancelPlan";
        //var message = "";
        var template = "userPlanChange";
        var message = "Are you sure? Click OK to deactivate your subscription to frank."
        var status = 'cancelled';
        if ($(e.target).text() == 'Restart Subscription') {
            //template = "userPlanChange";
            message = "Click OK to reactivate your plan. Your credit card will be charged on the next payment date."
            status = 'paid'
        }
        var requestData = { 
            status: status, 
            _csrf: this.csrfToken, 
        };



        Acme.SigninView.render(template, message)
            .done(function() {
                $('#dialog').parent().remove();
                
                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/paywall-account-sataus',
                    dataType: 'json',
                    data: requestData,
                    success: function (data, textStatus, jqXHR) {
                        if (data.success == 1) {
                            window.location.reload(false);             
                        } else {
                            var text = '';
                            for (var key in data.error) {
                                text = text + data.error[key] + " ";
                            } 
                            $('#createUserErrorMessage').text(text);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                         $('#createUserErrorMessage').text(textStatus);
                    },
                });        
            }); 
    });       


    $('.j-setplan').on('click', function(e) {

        var listelem = $(e.target);
        if (!listelem.hasClass('j-setplan')) {
            listelem = $(e.target.parentNode);
        }
        var planusers = Number(listelem.find('#planusercount').val());
        var usercount = Number(listelem.find('#currentusers').val());


        var requestData = { 
            planid: listelem.find('#planid').val(), 
            _csrf: listelem.find('#_csrf').text(), 
        };

        if (Number(usercount) <= Number(planusers)) {
            var newcost = listelem.find('#plancost').val();
            var oldcost = listelem.find('#currentcost').val();
            var newdays = listelem.find('#planperiod').val();
            var olddays = listelem.find('#currentperiod').val();
            if (newdays == 'week')  {newdays = 7;}
            if (newdays == 'month') {newdays = 30;}
            if (newdays == 'year')  {newdays = 365;}
            if (olddays == 'week')  {olddays = 7;}
            if (olddays == 'month') {olddays = 30;}
            if (olddays == 'year')  {olddays = 365;}
            var newplandailycost = newcost/newdays;
            var plandailycost = oldcost/olddays;
            var expDate = listelem.find('#expdate').val();

            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date();
            var secondDate = new Date(expDate.split('-')[0],expDate.split('-')[1]-1,expDate.split('-')[2]);

            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

            var msg = "";
            var currencySymbol = "&dollar;";
            if (Acme.State.Country == 'GB') {
                currencySymbol = "&pound;";
            }

            if ((newplandailycost-plandailycost) * diffDays >= 0) {
                msg = " This will cost " + currencySymbol + Math.round((newplandailycost-plandailycost) * diffDays);
                msg = msg.replace(/(.+)(\d\d)$/g, "$1.$2");
            }
            Acme.SigninView.render("userPlanChange", "Are you sure you want to change plan?" + msg)
                .done(function() {
                    $('#dialog').parent().remove();
                    
                    $.ajax({
                        type: 'post',
                        url: _appJsConfig.baseHttpPath + '/user/change-paywall-plan',
                        dataType: 'json',
                        data: requestData,
                        success: function (data, textStatus, jqXHR) {
                            if (data.success == 1) {
                                window.location.reload();
                            } else {
                                $('#dialog').parent().remove();
                                Acme.SigninView.render("userPlan", data.error);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                             $('#createUserErrorMessage').text(textStatus);
                        },
                    });        
                }); 

        } else {
            Acme.SigninView.render("userPlan", "You have too many users to change to that plan.");
        }
    });

};


Acme.UserProfileController.prototype.checkPaymentIntentStatus = function(client_secret) {
    console.log('checking user payment status');
    console.log(client_secret);
    var self = this;
    var stripekey = $('#stripekey').html();
    if (stripekey.length < 1) return;

    var stripe = Stripe(stripekey);
    var elements = stripe.elements();

    // stripe.retrievePaymentIntent(client_secret).then(function(result) {
    //     console.log(result);
    // });



    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
        base: {
            color: '#fff',
            lineHeight: '24px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#fff'
            }
        },
        invalid: {
            color: '#fff',
            iconColor: '#fff'
        }
    };

    // Create an instance of the card Element
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>
    var cardElement = document.getElementById('card-element');
    if (cardElement != null) {
        card.mount('#card-element');
    }

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }); 

    var form = document.getElementById('fix-payment-form');

    if (form != null) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('charting fix');
            self.stripeCharge(stripe, card, client_secret);
        });
    }

    // stripe.handleCardAction(client_secret).then(function(result) {
    //     if (result.error) {
    //         console.log('there was an error', result.error);
    //       // Show `result.error.message` in payment form
    //     } else {
    //         console.log('success');

    //       // The card action has been handled
    //       // The PaymentIntent can be confirmed again on the server
    //     //   fetch('/pay', {
    //     //     method: 'POST',
    //     //     headers: { 'Content-Type': 'application/json' },
    //     //     body: JSON.stringify({ payment_intent_id: result.paymentIntent.id })
    //     //   }).then(function(confirmResult) {
    //     //     return confirmResult.json();
    //     //   }).then(handleServerResponse);
    //     }
    //   });
  
}
Acme.UserProfileController.prototype.stripeCharge = function(stripe, card, client_secret) {

    var modal = new Acme.Signin('spinner', 'acme-dialog', {"spinner": 'spinnerTmpl'});

    modal.render("spinner", "Attempting payment");

    stripe.confirmCardPayment(client_secret, {
        payment_method: {
            card: card,
            billing_details: {
                address: {
                    // city:self.data.city,
                    // line1:self.data.address1,
                    // line2:self.data.address2,
                },
                name: "jenny Davis",
                // email: self.data.email
            }
        },
        setup_future_usage: 'off_session'
    }).then(function(result) {
        // console.log(result);
        modal.closeWindow();
        if (result.error) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                console.log('IT WORKED!!!');
                var paymentForm = document.getElementById('card-errors');
                modal.render("spinner", "Looks good! It can sometimes take a few minutes");
                paymentForm.innerHTML = "";
                // setTimeout(function() {
                //     location.reload()
                // }, 3000);
            }
        }
    });
}


Acme.UserProfileController.prototype.listingEvents = function() {
    $('.j-deleteListing').unbind().on('click', function(e) {
        e.preventDefault();
        var listing = $(e.target).closest('a.card');
        var id      = listing.data("guid");
        Acme.SigninView.render("userPlanChange", "Are you sure you want to delete this listing?")
            .done(function() {
                Acme.server.create('/api/article/delete-user-article', {"articleguid": id}).done(function(r) {
                    listing.remove();
                }).fail(function(r) {
                    // console.log(r);
                });
            });
    });  
};
}(jQuery));

