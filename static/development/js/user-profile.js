
var UserProfielController = (function ($) {
    return {
        load: function () {
            UserProfielController.Load.init();
        }
    };
}(jQuery));





UserProfielController.Load = (function ($) {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    var deleteUser = function(e) {
        console.log('DELETING THE USER!!!', e);

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
                console.log(data);
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
                console.log(textStatus);
                console.log(jqXHR.responseText);
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
            // var firstNameElem   = listelem.find('.j-firstname');
            // var lastNameElem    = listelem.find('.j-lastname');
            // var userNameElem    = listelem.find('.userdetails__username');
            // var emailElem       = listelem.find('.userdetails__email');
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
            console.log( getUserData("val") );

            $('#cancelUserCreate').on('click', function(e) {
                renderUser(listelem, data);
                userEvents();
            });

            $('#editUser').on('click', function(e) {
                console.log('clicks')
                var requestData = getUserData("val");
                requestData.id = userid;
                requestData._csrf = csrfToken;
                console.log(requestData);
                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/edit-managed-profile',
                    dataType: 'json',
                    data: requestData,
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.success == 1) {
                            console.log('success');
                            renderUser(listelem, requestData);
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
                        console.log(textStatus);
                        console.log(jqXHR.responseText);
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
          console.log('events!');

        $('#addManagedUser').on('click', function(e) {
            console.log('add user');
            e.preventDefault()
            var userTemp = Handlebars.compile(window.templates.create_user);
            var data = {
                firstname: "FIRSTNAME", 
                lastname:  "LASTNAME", 
                username:  "USERNAME", 
                useremail: "EMAIL",
            };

            var html = '<li id="newUser">' + userTemp(data) + '</li>';

            $('#mangedUsers').append(html);
            $('#addManagedUser').addClass('hidden');
            $('#nousers').addClass('hidden');
            
            $('#createUser').on('click', function(e) {
                var requestData = { 
                    firstname: $('#newuserfirstname').val(), 
                    lastname:  $('#newuserlastname').val(), 
                    username:  $('#newuserusername').val(), 
                    useremail: $('#newuseruseremail').val(),
                    _csrf: csrfToken
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

  



        // $('.canceledit').on('click', function(e) {
        //     var listelem = $(e.target).closest('li');
        //     listelem.find('.edituser').removeClass('hidden');
        //     listelem.find('.deleteuser').removeClass('hidden');
        //     listelem.find('.saveedit').addClass('hidden');
        //     listelem.find('.canceledit').addClass('hidden');
        //     listelem.find('.reallydelete').addClass('hidden');


        //     listelem.find('#muFirstname').removeClass('edituserfield');
        //     listelem.find('#muLastname').removeClass('edituserfield');
        //     listelem.find('#muUsername').removeClass('edituserfield');
        //     listelem.find('#muEmail').removeClass('edituserfield');

        // });        

        

        $('#cancelAccount').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var requestData = { 
                status: 'cancelled', 
                _csrf: csrfToken, 
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/paywall-account-sataus',
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





        $('.j-setplan').on('click', function(e) {
            var listelem = $(e.target);
            var planusers = listelem.find('#planusercount').val();
            var usercount = listelem.find('#currentusers').val();

            var requestData = { 
                planid: listelem.find('#planid').val(), 
                _csrf: listelem.find('#_csrf').text(), 
            };

            console.log(requestData);



            if (usercount <= planusers) {
                // var newcost = listelem.find('#plancost').val();
                // var oldcost = listelem.find('#currentcost').val();
                // var newdays = listelem.find('#planperiod').val();
                // var olddays = listelem.find('#currentperiod').val();
                // if (newdays = 'week') {newdays = 7;}
                // if (newdays = 'month') {newdays = 30;}
                // if (newdays = 'year') {newdays = 365;}
                // if (olddays = 'week') {olddays = 7;}
                // if (olddays = 'month') {olddays = 30;}
                // if (olddays = 'year') {olddays = 365;}
                // var newplandailycost = newcost/newdays;
                // var plandailycost = oldcost/olddays;
                // var expDate = listelem.find('#expdate').val();
                // console.log(newplandailycost);
                // console.log(oldcost);
                // console.log(olddays);
                // console.log(expDate);
                // console.log(plandailycost);

                // var remainingplandays = 10;
                Acme.SigninView.render("userPlanChange", "Are you sure you want to change plan?");

                $('#okaybutton').on('click', function(e) {
                    $('#dialog').parent().remove();
                    
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
            userEvents();
        }
    };

}(jQuery));


