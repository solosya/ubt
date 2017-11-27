// (function ($) {

// Acme.UserProfile = Acme.View.create(
// {
//     "container"     : {
//         'main'          : $('#listingForm')
//     },
//     "listeners"     : {
//     },
//     "render": function() {
//         console.log('in the render function');
//         console.log(this.data);
//     },
//     "events": function() 
//     {
//         var self = this;
//     console.log("events");

//         $('input, textarea').on("change", function(e) {
//         });

//         $('#profile-form').submit(function(e) {
//         });

//         $('.change-password').on("click", function(e) {
//             console.log('passewrd')
//             $('#password').removeAttr('disabled');
//             $('#password').attr("placeholder", "Enter new password")
//             $('.verifypassword').removeClass('hidden');
//             this.remove();
//         })



//     },
//     "construct": function() 
//     {
//         this.subscriptions = Acme.PubSub.subscribe({
//             // 'Acme.ListingForm.listener' : ["state_changed", 'update_state']
//         });
//         console.log('construct');
//         this.render();
//         this.events();
//     }
// });

// $('[data-dismiss="alert"]').on('click', function(e) {
//     this.closest('div').remove();
// });

// }(jQuery));


var UserProfielController = (function ($) {
    return {
        load: function () {
            UserProfielController.Load.init();
        }
    };
}(jQuery));

UserProfielController.Load = (function ($) {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    var attachEvents = function () {
          console.log('events!');

        $('#addManagedUser').on('click', function(e) {
            console.log('add user');
            e.preventDefault()
            var user = '<li id = "newUser">\
                <div class="userdetails" >\
                    <p><a contenteditable="true" id="newuserfirstname" class="displayname">FIRSTANAME</a> <a contenteditable="true" id="newuserlastname" class="displayname">LASTNAME</a></p>\
                    <p><a contenteditable="true" id="newuserusername" class="username">USERNAME</a></p>\
                </div>\
                <div class="useremailbuttons">\
                <div><p><a contenteditable="true" id="newuseruseremail" class="uesremail">EMAIL</a> <a id="createUser" class="edituser">create user</a><a id="cancelUserCreate" class="deleteuser">cancel</a></p></div>\
                </div>\
            </li>';

            $('#mangedUsers').append($(user));
            $('#addManagedUser').addClass('hidden');
            $('#nousers').addClass('hidden');
            $('#createUser').on('click', function(e) {

                
            
                var requestData = { 
                    firstname: $('#newuserfirstname').text(), 
                    lastname: $('#newuserlastname').text(), 
                    username: $('#newuserusername').text(), 
                    _csrf: csrfToken, 
                    useremail: $('#newuseruseremail').text()
                };

                console.log(requestData);

                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/create-paywall-managed-user',
                    dataType: 'json',
                    data: requestData,
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
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
                        console.log(textStatus);
                        console.log(jqXHR.responseText);
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

        $('.edituser').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            listelem.find('.edituser').addClass('hidden');
            listelem.find('.deleteuser').addClass('hidden');
            listelem.find('.saveedit').removeClass('hidden');
            listelem.find('.canceledit').removeClass('hidden');

            listelem.find('#muFirstname').addClass('edituserfield');
            listelem.find('#muLastname').addClass('edituserfield');
            listelem.find('#muUsername').addClass('edituserfield');
            listelem.find('#muEmail').addClass('edituserfield');
        });        

        $('.canceledit').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            listelem.find('.edituser').removeClass('hidden');
            listelem.find('.deleteuser').removeClass('hidden');
            listelem.find('.saveedit').addClass('hidden');
            listelem.find('.canceledit').addClass('hidden');
            listelem.find('.reallydelete').addClass('hidden');


            listelem.find('#muFirstname').removeClass('edituserfield');
            listelem.find('#muLastname').removeClass('edituserfield');
            listelem.find('#muUsername').removeClass('edituserfield');
            listelem.find('#muEmail').removeClass('edituserfield');

            $('#createUserErrorMessage').text('');   
        });        


        $('.deleteuser').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            listelem.find('.edituser').addClass('hidden');
            listelem.find('.deleteuser').addClass('hidden');
            listelem.find('.reallydelete').removeClass('hidden');
            listelem.find('.canceledit').removeClass('hidden');
            $('#createUserErrorMessage').text('');   
        });        

        $('.reallydelete').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var requestData = { 
                id: listelem.attr("id"), 
                _csrf: csrfToken, 
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/delete-managed-user',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.success == 1) {
                        console.log('success');
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
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        


        });        



        $('.saveedit').on('click', function(e) {
            console.log('clicks')
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var firstname = listelem.find('#muFirstname').text();
            var lastname = listelem.find('#muLastname').text();
            var username = listelem.find('#muUsername').text();
            var email = listelem.find('#muEmail').text();

            var requestData = { 
                id: listelem.attr("id"), 
                firstname: listelem.find('#muFirstname').text(), 
                lastname: listelem.find('#muLastname').text(), 
                username: listelem.find('#muUsername').text(), 
                _csrf: csrfToken, 
                useremail: listelem.find('#muEmail').text()
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/edit-managed-profile',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.success == 1) {
                        console.log('success');
                        $('#createUserErrorMessage').text('');   
                        listelem.find('.edituser').removeClass('hidden');
                        listelem.find('.deleteuser').removeClass('hidden');
                        listelem.find('.saveedit').addClass('hidden');
                        listelem.find('.canceledit').addClass('hidden');

                        listelem.find('#muFirstname').removeClass('edituserfield');
                        listelem.find('#muLastname').removeClass('edituserfield');
                        listelem.find('#muUsername').removeClass('edituserfield');
                        listelem.find('#muEmail').removeClass('edituserfield');

                        $('#createUserErrorMessage').text('User updated successfully.'); 
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        

        });


        $('.setplan').on('click', function(e) {
            var listelem = $(e.target).closest('div');
            var planusers = listelem.find('#planusercount').val();
            var usercount = listelem.find('#currentusers').val();
            console.log(planusers);
            console.log(usercount);

            var requestData = { 
                planid: listelem.find('#planid').val(), 
                _csrf: listelem.find('#_csrf').text(), 
            };

            console.log(requestData);



            if (usercount <= planusers) {


                Acme.SigninView.render("userPlanChange", "Are you sure?. This will cost you $((newplandailycost-plandailycost)*remainingplandays)");
                $('#okaybutton').on('click', function(e) {
                    $('#dialog').parent().remove();
                    console.log('pay');
                    
                    $.ajax({
                        type: 'post',
                        url: _appJsConfig.baseHttpPath + '/user/change-paywall-plan',
                        dataType: 'json',
                        data: requestData,
                        success: function (data, textStatus, jqXHR) {
                            console.log(data);
                            if (data.success == 1) {
                                window.location.reload();
                            } else {
                                //show some error somehow
                                $('#dialog').parent().remove();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(jqXHR.responseText);
                             $('#createUserErrorMessage').text(textStatus);
                        },
                    });        

                });



            } else {
                Acme.SigninView.render("userPlan", "You have too many users to change to that plan.");
            }
            $('#cancelbutton').on('click', function(e) {
                $('#dialog').parent().remove();
                console.log('moo');
            });

        });




        
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));


