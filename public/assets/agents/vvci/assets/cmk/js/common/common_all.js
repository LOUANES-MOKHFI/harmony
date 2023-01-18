

var glb_msg ,glb_url, glb_lineNo, glb_columnNo, glb_error;
var glb_event,glb_request,glb_settings_url,glb_settings_data,glb_thrownError;
var cmk_user_logging_out = 0;
window.onerror = function (msg, url, lineNo, columnNo, error) {


    glb_error_type = "js";
    glb_msg=msg;
    glb_url=url;
    glb_lineNo=lineNo;
    glb_columnNo=columnNo;
    glb_error=error;

    var message = [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error)
    ].join(' \n ');


    
    $('#bug_error_msg').html(message);
    if(cmk_enable_bug_report==1)
        $('#bug_report_modal').modal();
    else if(cmk_enable_bug_report==2)
        reportJsAjaxError();


    App.unblockUI();
    return false;
};

$('.report_bug_button').click(function (e) {

    reportJsAjaxError();
});



function reportJsAjaxError() {

    //var sContent=$("#form_HistActions").serialize();

    var dataError={};
    if(glb_error_type =="js"){
        dataError = {
            type_error:"js",
            js_message:glb_msg,
            lineNo:glb_lineNo,
            columnNo:glb_columnNo,
            error_json:(glb_error)?JSON.stringify(glb_error,Object.getOwnPropertyNames(glb_error)):null,
            stack:(glb_error)?JSON.stringify(glb_error.stack):null,
        };
    } else if( glb_error_type=="ajax") {
        dataError = {
            type_error:"ajax",
            request_status:glb_request.status,
            request_responseText:glb_request.responseText,
            error_json:(glb_error)?JSON.stringify(glb_thrownError,Object.getOwnPropertyNames(glb_thrownError)):null,
            ajax_url:glb_settings_url,
            ajax_data:glb_settings_data

        };
    }


    if(cmk_enable_bug_report==1) {
        dataError.description = $("#bug_report_description").val();
    } else { //cmk_enable_bug_report==2
        dataError.description = "Bug rapportÃ© sans alerter l'utilisateur";
    }

    dataError.account=cmk_account;
    dataError.login=cmk_login;
    dataError.num_login=cmk_num_login;
    dataError.num_user=cmk_num_user;
    dataError.name_user=cmk_name_user;
    dataError.poste_user=cmk_poste_user;
    dataError.ip_local_com=cmk_ip_local_com;
    dataError.crm_url=cmk_crm_url;

    $.ajax({
        type : 'post',
        url : base_url_ajax+'common/common/logBug',
        //data: sContent,
        global: false,
        data: dataError,
        success : function(response) {
            if(response==1) {
                if(cmk_enable_bug_report==1) {
                    $('#bug_report_modal').modal('hide');
                    show_msg_log(lbl_bug_reported_successfully, 'success');
                }
            }
        }
    });
}

$(document).ready(function() {

    $('.logout_process').click(function() {
        cmk_user_logging_out = 1;
    });
    //if (cmk_session_type == 'superviseur') {
    verif_password_out_of_date();
    //}



});


function verif_password_out_of_date(){

    $.ajax({
        url: base_url_ajax+"generalites/generalites/verifPassword",
        type: "post",
        data: "",
        dataType:"json",
        success: function(is_password_out_of_date) {
            if(is_password_out_of_date==1) {
                $('#modal_change_password').modal();
            }

        }
    });
}


$(".changepwd_input").keypress(function(e) {
    if (e.keyCode == '13' ) {
        if ( ! $('#change_password').attr('disabled')  )
            $("#change_password").trigger("click");
    }
});

function generatePassword() {
    return $.passGen({
        // Number of characters
        'length' : 12,
        // Use numbers (0, 1, 2, etc...)
        'numeric' : true,
        // Use lowercase letters (a, b, c, etc...)
        'lowercase' : true,
        // Use uppercase letters (A, B, C, etc...)
        'uppercase' : true,
        // Use special characters (!, @, #, $, etc...)
        'special'   : true
    });
}
$(document).on('click','.toggle_pwd_visisility',function(){
    var solid_password=$(this).parent().parent().find('.solid_password')

    if(solid_password.attr('type')=='text') {
        solid_password.attr('type', 'password');
        $(this).children('.toggle_pwd_visisility_icon').removeClass('fa-eye-slash').addClass('fa-eye');
    } else {
        solid_password.attr('type', 'text');
        $(this).children('.toggle_pwd_visisility_icon').removeClass('fa-eye').addClass('fa-eye-slash');
    }


});

$(document).on('click','.gen_password',function(){
    var generated_pwd=generatePassword();

    $(".solid_password").val(generated_pwd);
    $("#new_password_retype").val(generated_pwd);
    $(".solid_password").trigger('keyup'); //to update bar
});


function setPasswordPlugin() {

    var configPluginPass={

        // Minimum Length of password
        minLength: 10,

        // Minimum number of Upper Case Letters characters in password
        minUpperCase: 1,

        // Minimum number of Lower Case Letters characters in password
        minLowerCase: 1,

        // Minimum number of digits characters in password
        minDigits: 1,

        // Minimum number of special characters in password
        minSpecial: 1,

        // Maximum number of repeated alphanumeric characters in password dhgurAAAfjewd <- 3 A's
        maxRepeats: 5,

        // Maximum number of alphanumeric characters from one set back to back
        maxConsecutive: 3,

        // Disallow Upper Case Lettera
        noUpper: false,

        // Disallow Lower Case Letters
        noLower: false,

        // Disallow Digits
        noDigit: false,

        // Disallow Special Characters
        noSpecial: false,

        // Disallow user to have x number of repeated alphanumeric characters ex.. ..A..a..A.. <- fails if maxRepeats <= 3 CASE INSENSITIVE
        failRepeats: false,

        // Disallow user to have x number of consecutive alphanumeric characters from any set ex.. abc <- fails if maxConsecutive <= 3
        failConsecutive: false,

        // selector of confirm field
        confirmField: "#new_password_retype"

    };



    $(".solid_password").each(function() {

        $(this).passwordValidation(configPluginPass, function(element, valid, match, failedCases) {

            if( ! element.is(":visible"))
                return;

            if(valid) {
                pscore = 100;
            } else {
                pscore= (5 - failedCases.length) * 20;
            }

            console.log(failedCases);

            updatePwdGui(pscore,element.parent().find('.progressbarPassword'));
        });
    });
}



function updatePwdGui(yScore,progressbarPassword) {
    if (cmk_strong_pwd_required == 1 || cmk_session_type == 'superviseur' || cmk_session_type == 'root') {
        $(".change_password").attr('disabled', true)
    }
    if (yScore <= 30) {
        progressbarPassword.removeClass('progress-bar-success');
        progressbarPassword.removeClass('progress-bar-warning');
        progressbarPassword.addClass('progress-bar-danger');
    } else if ((yScore > 30) && (yScore <= 80)) {
        progressbarPassword.removeClass('progress-bar-success');
        progressbarPassword.addClass('progress-bar-warning');
        progressbarPassword.removeClass('progress-bar-danger');
    } else {
        progressbarPassword.addClass('progress-bar-success');
        progressbarPassword.removeClass('progress-bar-warning');
        progressbarPassword.removeClass('progress-bar-danger');
        $(".change_password").attr('disabled', false)
    }

    progressbarPassword.width(yScore + '%');
}

    setPasswordPlugin();


$(document).on('click','#change_password',function(){

    var old_pwd = $("#old_password").val();
    var new_pwd = $("#new_password").val();
    var new_password_retype = $("#new_password_retype").val();


    if(old_pwd==null || old_pwd == "" ){
        show_msg_log(lb_msg_error_old_pwd, 'warning');
        return false;
    }


    if(new_pwd==null || new_pwd == "" ){
        show_msg_log(lb_msg_error_change_pwd, 'warning');
        return false;
    }


    if(new_password_retype==null || new_password_retype == "" ){
        show_msg_log(lb_msg_error_change_pwd_retype, 'warning');
        return false;
    }


    if(new_password_retype==null || new_password_retype == "" ){
        show_msg_log(lb_msg_error_change_pwd_retype, 'warning');
        return false;
    }

    if(new_password_retype!=new_pwd){
        show_msg_log(lb_msg_error_verif_new_pwd, 'warning');
        return false;
    }




    $.ajax({
        url: base_url_ajax + "login/changepwd",
        type: "post", // 'get' or 'post', override for form's 'method'
        data: {
            old_pwd : old_pwd,
            new_pwd : new_pwd,
        },
        dataType : 'json',
        success: function(response) {


            switch (response.return){
                case 1:
                    $('.logout_process')[0].click();

                    break;

                case 0:
                    show_msg_log(lb_msg_info_change_pwd,"error")

                    break;

                case -1:
                    show_msg_log(lb_msg_error_old_pwd_incorect,"error")

                    break;


            }


        }
    });
});



/*
function disable_contextual_help() {
    $('.cmk_ch').popover('destroy');
    $('.cmk_ch').pulsate('destroy');

    $(".cmk_contextual_help_toggle").removeClass('red');//.addClass('green');
    $(".cmk_contextual_help_toggle").html(lbl_start_contextual_help);
    //$(".cmk_contextual_tour").prop('disabled', false);

    cmk_contextual_help_enable=false;
}


var cmk_contextual_help_enable=false;

$(document).ready(function() {


    $(".cmk_contextual_help_toggle").html(lbl_start_contextual_help);
    $(".cmk_contextual_top").html(lbl_start_tour);


    var help_popover_html='<div class="btn-group ch-right"  style="display:none">\
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" aria-expanded="false">\
                <span class="langname"> <i class="fa fa-question-circle"></i></span>    <i class="fa fa-angle-down"></i>\
            </a>\
        <ul class="dropdown-menu">\
        <li class="">   <a class="btn blue btn-block    btn-sm cmk_contextual_tour " style="color:white">'+lbl_start_tour+'</a>    </li>\
                <li class="">   <a class="btn green btn-block    btn-sm cmk_contextual_help_toggle" style="color:white">'+lbl_start_contextual_help+'</a>    </li>\
    </ul>\
    </div>';


    $(help_popover_html).insertAfter( ".modal-header .close" );





    $(document).on("click",".cmk_contextual_help_toggle",function(event) {
        cmk_contextual_help_enable=!cmk_contextual_help_enable;

        if(cmk_contextual_help_enable) {

            //$('.cmk_ch').attr('data-trigger','hover');
            //$('.cmk_ch').attr('data-placement','bottom');
            //$('.cmk_ch').attr('data-html','true');

            $('.cmk_ch').popover({
                //'container': tour_parent
                html:'true',
                trigger: 'hover',
                //placement: 'bottom'
            });

            $('.cmk_ch').pulsate({
                color: "#399bc3",
                //color: "green",
                //repeat: 2
                repeat: true,                           // will repeat forever if true, if given a number will repeat for that many times
                reach: 5,                              // how far the pulse goes in px
                speed: 1000,                            // how long one pulse takes in ms
                pause: 1500,                               // how long the pause between pulses is in ms
                glow: true,                             // if the glow should be shown too
                //onHover: false                          // if true only pulsate if user hovers over the element
            });


            $(".cmk_contextual_help_toggle").addClass('red');
            $(".cmk_contextual_help_toggle").html(lbl_stop_contextual_help);
            //$(".cmk_contextual_tour").prop('disabled', true);

        } else {

            disable_contextual_help();

        }
    });

    $(document).on("click",".cmk_contextual_tour",function(event) {

        if(cmk_contextual_help_enable) {
            disable_contextual_help();
        }

        console.log($(this));
        console.log($(this).hasClass("cmk_contextual_top"));

        var tour_parent;
        if($(this).hasClass("cmk_contextual_top"))
            tour_parent=$('body');
        else
            tour_parent=$(this).closest('.modal-dialog');

        //startTour($(this).parent().parent().parent()); return;
        startTour(tour_parent);
        $('[data-toggle="popover"]').popover('hide');

    });

    $(document).on('shown.bs.modal','.modal', function(e) {
        //console.log($(this));

        //var $target = $(e.currentTarget);
        var $target = $(this);
        var count_ch = $target.find('.cmk_ch').length;
        console.log(count_ch);

        if(count_ch) {
            $target.find(".ch-right").show();
        }

    });


});






function startTour(topElement) {

    var tour_steps = [];

    //console.log("topElement==>" , topElement);
    if(!topElement)
        topElement=$("body");

    //var list_ch=topElement.find('.cmk_ch');
    var list_ch=topElement.find('.cmk_ch').sort(function(a, b) {
        return +a.getAttribute('data-order') - +b.getAttribute('data-order');
    });

    list_ch.each(function(k,v) {
        //console.log('qqqq',$(v));
        tour_steps.push(
            {
                //element: "#"+$(v).attr("id"),
                element: $(this),
                title:  $(this).attr("title"),
                content:  $(this).data("content"),
                backdrop : true,
                placement : "bottom"
            }
        );




    });
    console.log(tour_steps);
    var tour = new Tour({
        storage : false,
        template : "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation btn-grp'> " +
        "<button class='btn btn-xs btn-success btn-outlined' data-role='prev'>Â« "+lbl_tour_prev+"</button> <button class='btn btn-xs btn-success btn-outlined' data-role='next'>"+
        lbl_tour_next+" Â»</button> <button class='btn btn-xs btn-info btn-outlined' data-role='end'>"+lbl_tour_end+"</button></div></div>",
        steps: tour_steps
    });

// Initialize the tour
    tour.init();

// Start the tour
    tour.start();
}

*/



function show_error_modal(request,thrownError,settings_url=null,settings_data=null,event=null) {
    console.log("event",event);
    console.log("request",request);
    console.log("settings_url",settings_url);
    console.log("settings_data",settings_data);
    console.log("thrownError",thrownError);
    $('#bug_error_msg').html(
        '<p>thrownError:'+ thrownError+'</p>'+	'<p>request.status:'
        + request.status+'</p>'+'<p>request.responseText:'
        + request.responseText+'</p>'+'<p>settings.url:'
        + settings_url+'</p>' +"settings.data:"+settings_data
    );

    glb_error_type = "ajax";
    glb_event = event;
    glb_request= request;
    glb_settings_url= settings_url;
    glb_settings_data= settings_data;
    glb_thrownError= thrownError;

    if(cmk_enable_bug_report==1)
        $('#bug_report_modal').modal();
    else if(cmk_enable_bug_report==2)
        reportJsAjaxError();

    App.unblockUI();
}



function show_msg_log(msg, type) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    switch (type) {
        case 'warning':
            toastr.warning(msg);
            break;
        case 'info':
            toastr.info(msg);
            break;
        case 'success':
            toastr.success(msg);
            break;

        case 'error':
            toastr.error(msg);
            break;
    }

}

window.htmlentities = {
    /**
     * Converts a string to its html characters completely.
     *
     * @param {String} str String with unescaped HTML characters
     **/
    encode : function(str) {
        var buf = [];

        for (var i=str.length-1;i>=0;i--) {
            buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }

        return buf.join('');
    },
    /**
     * Converts an html characterSet into its original character.
     *
     * @param {String} str htmlSet entities
     **/
    decode : function(str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    }
};


function lessString(str,length) {
    if (str.length > length) return '<span title="'+htmlentities.encode(str)+'" alt="'+htmlentities.encode(str)+'">'+str.substring(0,length)+'...</span>';
    else return str;
}
$(document).on("click",".disabled_menu_item,.disabled_menu_item a",function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
});