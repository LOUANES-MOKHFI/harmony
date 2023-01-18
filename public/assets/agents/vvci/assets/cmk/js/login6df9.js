var adFrame = true;
$('#username').focus();
$('#login_info').hide();
window.localStorage.clear();
detectBrowser();
function CMK_reloadVerifyLang() {
    var language = $('#language').val();
    var newurl = "login/login_lang/?lang=" + language;
    $.ajax({
        url: newurl,
        type: "post",
        success: function (data_result) {
            //location.reload();
            window.location.href = base_url_ajax + 'login?lang=' + language
        }
    });
}
var countKeypressEnter = 0;

function checkLoginKey(e) {
    // alert(e.keyCode);

    if ((e.keyCode == 192) && ($('#username').is(':focus'))) {
        var loginValue = $('#username').val();
        $('#username').val(loginValue.substring(0, loginValue.length - 1));
        $("#account").focus();
        $("#account").select();
    } else {

        if (e.keyCode == 13 && countKeypressEnter == 0) {
            checkLogin();
            e.stopImmediatePropagation();
            countKeypressEnter++;
            return false;
        }
    }
}


function CheckWebService(obj) {
    $.ajax({
        url: "../../webservice/client/check_connect_ip.php", // override for form's 'action' attribute
        success: function (data_result) {
            window.location.href = base_url_ajax + obj[2];
        }
    });
}

function checkLogin() {


    //window.location.href = "dashboard/dashboard";

    var is_poste_defined = $("#poste").val().length > 0 && $("#poste").val() != 0
    var is_browser_compatible = $.browser.chrome || $.browser.mozilla || $.browser.opera || $.browser.safari;
    if (!is_browser_compatible && is_poste_defined) {
        //Dn not allow connection if incompatible browser and poste is defined
        $('#incompatible_browser_user').modal('show');
        return;
    }

    var sDataForm = $('#login_form').serialize();

    $.ajax({
        url: base_url_ajax + "login/login_check", // override for form's 'action' attribute
        type: "post", // 'get' or 'post', override for form's 'method' attribute
        data: sDataForm + "&language=" + $('#language').val(),
        beforeSend: function () {
            // setting a timeout
            $('.bg-black').hide();
            $('.loader').show();
            $('.btn-login').prop('disabled', true);
        },
        success: function (data_result) {
            
            console.log(data_result);
            verifLoginPage_Callback(data_result);
            return false;
        }
    });
}

function detectBrowser() {



    if ($.browser.chrome || $.browser.mozilla || $.browser.opera || $.browser.safari) {
        return true;
    } else {
        //if($.browser.safari){
        $('#incompatible_browser_user').modal('show');
        /*}else{
            $('#incompatible_browser').modal('show');
            $('#login_form').addClass('hidden');
            $('.cmk-footer_login').addClass('hidden');
        }*/
    }
}
function startTour() {
    var tour = new Tour({
        storage: false,
        template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation btn-grp'> <button class='btn btn-xs btn-success btn-outlined' data-role='prev'>« " + lbl_tour_prev + "</button> <button class='btn btn-xs btn-success btn-outlined' data-role='next'>" + lbl_tour_next + " »</button> <button class='btn btn-xs btn-info btn-outlined' data-role='end'>" + lbl_tour_end + "</button></div></div>",
        steps: [
            {
                element: "#username",
                title: "Title of my step",
                content: lbl_tour_username,
                backdrop: true,
                placement: "top"
            },
            {
                element: "#account",
                title: "Title of my step",
                content: lbl_tour_account,
                backdrop: true,
                placement: "top"
            },
            {
                element: "#password",
                title: "Title of my step",
                content: lbl_tour_password,
                backdrop: true
            },
            {
                element: "#poste",
                title: "Title of my step",
                content: lbl_tour_post,
                backdrop: true
            }
        ]
    });

    // Initialize the tour
    tour.init();

    // Start the tour
    tour.start();
}


