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
            $('#createUser').on('click', function(e) {

            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            
        
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
                    // if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                    //     opts.onSuccess(data, textStatus, jqXHR);
                    // }                
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                    // if (opts.onError && typeof opts.onError === 'function') {
                    //     opts.onError(jqXHR, textStatus, errorThrown);
                    // }
                },
                // beforeSend: function (jqXHR, settings) {
                //     if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                //         opts.beforeSend(jqXHR, settings);
                //     }
                // },
                // complete: function (jqXHR, textStatus) {
                //     if (opts.onComplete && typeof opts.onComplete === 'function') {
                //         opts.onComplete(jqXHR, textStatus);
                //     }
                // }
            });        





            });
            $('#cancelUserCreate').on('click', function(e) {
                $('#newUser').remove();
                $('#addManagedUser').removeClass('hidden');
            });

        });
        
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));


