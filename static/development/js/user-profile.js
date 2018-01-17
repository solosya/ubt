
// Acme.UserProfileController = (function ($) {
//     return {
//         load: function () {
//             Acme.UserProfileController.Load.init();
//         }
//     };
// }(jQuery));

console.log('loading profile controller');

Acme.UserProfileController = {};

Acme.UserProfileController.Load = function () {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    var deleteUser = function(e) {
        var user = $(e.target).closest('li');
        var userid = user.attr("id");
        var requestData = { 
            id: userid, 
            _csrf: csrfToken
        };

        return $.ajax({
            type: 'post',
            url: _appJsConfig.baseHttpPath + '/user/delete-managed-user',
            dataType: 'json',
            data: requestData,
            success: function (data, textStatus, jqXHR) {
                if (data.success == 1) {
                    user.remove();
                } else {
                    var text = '';
                    for (var key in data.error) {
                        text = text + data.error[key] + " ";
                    } 
                    $('#createUserErrorMessage').text(text);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log(textStatus);
                // console.log(jqXHR.responseText);
                 $('#createUserErrorMessage').text(textStatus);
            },
        });
    };

    var renderUser = function(parent, data) {
        var userTemp = Handlebars.compile(window.templates.managed_user);
        var html = userTemp(data);
        parent.empty().append(html);
    };

    var userEvents = function() {
        $('.j-edit').unbind().on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var userid          = listelem.attr("id");

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
                renderUser(listelem, data);
                userEvents();
            });

            $('#saveUser').on('click', function(e) {
                var requestData = getUserData("val");
                requestData.id = userid;
                requestData._csrf = csrfToken;
                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/edit-managed-profile',
                    dataType: 'json',
                    data: requestData,
                    success: function (data, textStatus, jqXHR) {
                        if (data.success == 1) {
                            console.log('success');
                            renderUser(listelem, requestData);
                            $('#addManagedUser').removeClass('hidden');
                            $('#createUserErrorMessage').text('');   
                        } else {
                            var text = '';
                            for (var key in data.error) {
                                text = text + data.error[key] + " ";
                            } 
                            $('#createUserErrorMessage').text(text);
                        }
                        userEvents();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // console.log(textStatus);
                        // console.log(jqXHR.responseText);
                         $('#createUserErrorMessage').text(textStatus);
                    },
                });        
            });
        });  

        $('.j-delete').unbind().on('click', function(e) {
            Acme.SigninView.render("userPlanChange", "Are you sure you want to delete this user?")
                .done(function() {
                    deleteUser(e);
                });
        });   
    };




    var attachEvents = function () {

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
                $('#user-editor-buttons').addClass('spinner');
                var requestData = { 
                    firstname: $('#newuserfirstname').val(), 
                    lastname:  $('#newuserlastname').val(), 
                    username:  $('#newuserusername').val(), 
                    useremail: $('#newuseruseremail').val(),
                    _csrf: csrfToken
                };

                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/create-paywall-managed-user',
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
                        // console.log(textStatus);
                        // console.log(jqXHR.responseText);
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

            var status = 'cancelled';
            message = "Are you sure you want to cancel your plan?"
            if ($(e.target).text() == 'Restart Subscription') {
                message = "Do you want to re activae your plan? You will be billed on the next payment date."
                status = 'unpaid'
            }
            var requestData = { 
                status: status, 
                _csrf: csrfToken, 
            };


console.log($(e.target).text());

            Acme.SigninView.render("userPlanChange", message)
                .done(function() {
                    $('#dialog').parent().remove();
                    
                    $.ajax({
                        type: 'post',
                        url: _appJsConfig.baseHttpPath + '/user/paywall-account-sataus',
                        dataType: 'json',
                        data: requestData,
                        success: function (data, textStatus, jqXHR) {
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
                            // console.log(textStatus);
                            console.log(jqXHR.responseText);
                             $('#createUserErrorMessage').text(textStatus);
                        },
                    });        
                }); 

            // $.ajax({
            //     type: 'post',
            //     url: _appJsConfig.baseHttpPath + '/user/paywall-account-sataus',
            //     dataType: 'json',
            //     data: requestData,
            //     success: function (data, textStatus, jqXHR) {
            //         if (data.success == 1) {
            //             location.reload(false);             
            //         } else {
            //             var text = '';
            //             for (var key in data.error) {
            //                 text = text + data.error[key] + " ";
            //             } 
            //             $('#createUserErrorMessage').text(text);
            //         }
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {
            //         // console.log(textStatus);
            //         console.log(jqXHR.responseText);
            //          $('#createUserErrorMessage').text(textStatus);
            //     },
            // });        
        });       


        $('.j-setplan').on('click', function(e) {
            console.log(e.target);
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
            console.log(usercount);
            console.log(planusers);

            if (Number(usercount) <= Number(planusers)) {
                var newcost = listelem.find('#plancost').val();
                var oldcost = listelem.find('#currentcost').val();
                var newdays = listelem.find('#planperiod').val();
                var olddays = listelem.find('#currentperiod').val();
                console.log(newdays);
                console.log(olddays);
                if (newdays == 'week') {newdays = 7;}
                if (newdays == 'month') {newdays = 30;}
                if (newdays == 'year') {newdays = 365;}
                if (olddays == 'week') {olddays = 7;}
                if (olddays == 'month') {olddays = 30;}
                if (olddays == 'year') {olddays = 365;}
                var newplandailycost = newcost/newdays;
                var plandailycost = oldcost/olddays;
                var expDate = listelem.find('#expdate').val();
                console.log(newcost);
                console.log(newdays);
                console.log(oldcost);
                console.log(olddays);
                console.log(expDate);
                console.log(plandailycost);
                console.log(newplandailycost);

                var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date();
                var secondDate = new Date(expDate.split('-')[0],expDate.split('-')[1]-1,expDate.split('-')[2]);

                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                // var remainingplandays = 10;
                console.log(diffDays);
                console.log((newplandailycost-plandailycost) * diffDays);
                console.log(firstDate.getFullYear() +'-'+firstDate.getMonth()+1 + '-' + firstDate.getDate()  )
                console.log(secondDate.getFullYear() +'-'+secondDate.getMonth()+1 + '-' + secondDate.getDate()  )
                var msg = "";
                if ((newplandailycost-plandailycost) * diffDays > 0) {
                    msg = " This will cost $" + Math.round((newplandailycost-plandailycost) * diffDays);
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
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                // console.log(textStatus);
                                // console.log(jqXHR.responseText);
                                 $('#createUserErrorMessage').text(textStatus);
                            },
                        });        
                    }); 

            } else {
                Acme.SigninView.render("userPlan", "You have too many users to change to that plan.");
            }
        });

    };


    var listingEvents = function() {
        $('.j-deleteListing').unbind().on('click', function(e) {
            var listing = $(e.target).closest('a.card');
            var id      = listing.data("guid");
            Acme.SigninView.render("userPlanChange", "Are you sure you want to delete this listing?")
                .done(function() {
                    Acme.server.create('/api/article/delete-user-article', {"articleguid": id}).done(function(r) {
                        listing.remove();
                    }).fail(function(r) {
                        console.log(r);
                    });
                });
        });  
    };



    return {
        init: function () {
            attachEvents();
            userEvents();
            listingEvents();
        }
    };
    
};
Acme.UserProfileController.Load().init();

