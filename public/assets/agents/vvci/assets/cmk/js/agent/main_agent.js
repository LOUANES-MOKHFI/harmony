// Begin zabuto_calendar
var tableLostCall;
var ONLINE_TIMER;
var ONLINE_WITH;
var fnBindToexcute = new Function();
var ref_campagne = '';
var ref_fichier = '';
var name_fichier = '';
var name_campagne = '';
var num_contact = '';
var user = $('#user_hidden').val();
var set_curent_month = $('#set_current_month').val();
var datess = "";
var grouped_by = 'obs_c_date_rappel';
var global_date = "";
var global_user = "";
var global_fichier = "";
var global_grouped_by = "";
var poste = $('#poste_hidden').val();
var global_start_date = "";
var global_end_date = "";
var cmk_newfilecreated = "";// definir creation contact vierge
var is_rappel = 0;
var nom_login = $('#nom_login').val();
var cmk_groupe_comptence = $('#cmk_groupe_comptence').val();
var cmk_callblending = $('#cmk_callblending').val();
var us_protocole = $('#us_protocole').val();
var cmktimout = "";
var PREDICTIF_VAR_INTERVAL = "";
var CHECKRAPPEL_VAR_INTERVAL = "";
var CHECKFICHE_VAR_INTERVAL = "";
var CHECKRECEPT_VAR_INTERVAL_ARRAY = [];
var SWITCHCALL_VAR_INTERVAL_ARRAY = [];
var DEBRIEF_VAR_INTERVAL_ARRAY = [];
var CHECKRECEPT_VAR_INTERVAL = "";
var TRANSFERT_VAR_INTERVAL = "";
var CHECKFICHEPPP_VAR_INTERVAL = "";
var PREDICTIF_VAR_TIMEOUT = "";
var counterPREDICTIF_VAR_TIMEOUT = 0;
var is_callblending = 0;
var forceOut = 0;
var status_call_ppp = false;
var go_menu_after_call = false;

var switch_to_recept_callblending = 0;
var new_file = "";
var status_charger_gmaps_api = "";
var mainCalendar = false;
var is_progressif = 0;
var telcall_auto = "";
var telcall_auto_trans = "";

$('.bloc_attente').hide();
$('.bloc_debrief').hide();
$('.dtmf_bloc').hide();
var is_onattente = 0;
var prise_rdv = 0;
$('.attente_ppp').html(lbl_appel_en_attente);
var cmk_date_debut = "";
var cmk_date_debut_init = "";
var bloquer_qualification = 0;
var call_form_search = 0;
var is_web_phone = 0;
var name_campagne_search = "";
var sRemoteNumber;
var forceIntercept = false;
var idcurrentrecept = "";
var TimeoutValiderFichie;
var is_transfered = 0;
var type_global_prod = "";
var current_grp_conf_telecom;

var PlayAutoFindFiche = false;
var auto_prod_reception = 0;
var allow_manage_timeslots = 0;
var allow_pause_coffe = 0;
var counterAutoProdRecept = 5;
var DoNotShowCallQueue = false;
var searchIDsQualif = [];
var IdsQualifSelected = [];
var appel_manuel = 0;
var cmk_forced_to_in = false;
var cmk_hasreception = 0;


$('.bloc_man_prod').addClass('hidden');

$('.bloc_man_prod_qualif').addClass('hidden');
$('.alert-man-rappel').addClass('hidden');
var type_appel = "";
var click_from = "";
var LOAD_QUEUES_ONLY = false;
var autoselectcomm;
var autoselectmode;
var userCurrentState = 'DASHBOARD';
var xhrSwitchCall;

var InPause = 0;
var XhrAbortLoadLMenu = false;
var ignoreInboundCalls = 0;

var cmk_wainting_for_webphone_to_show_contact = false;
var CHECK_PPP_VAR_TIMEOUT = 0;
var CHECKCALLOUTPPP_INTERVAL = 0;
var PPP_CURRENT_LAUNCHED_CONTACT = 0;
var PPP_CURRENT_LAUNCHED_CONTACT_FICHIER = 0;
var PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = 0;
var PPP_CURRENT_LAUNCHED_CONTACT_ISSUE_MAX = 5;

var CMK_CONTACT_INFO_SHOWN_COMPLETE = 0;
var CMK_FILE_INFO_SHOWN_COMPLETE = 0;
var CMK_WBEPHONE_GO_BACK_MENU = true;
var agendaWindow;


function KillTimersRECEPT() {
    //console.log("clear begin of "+CHECKRECEPT_VAR_INTERVAL_ARRAY.length+"elements");
    for (i = 0; i < CHECKRECEPT_VAR_INTERVAL_ARRAY.length; i++) {
        //console.log("clear "+CHECKRECEPT_VAR_INTERVAL_ARRAY[i]);
        clearInterval(CHECKRECEPT_VAR_INTERVAL_ARRAY[i]);
    }
    if (CHECKRECEPT_VAR_INTERVAL_ARRAY.length > 0) CHECKRECEPT_VAR_INTERVAL_ARRAY = [];
}

function addTimersRECEPT(id) {
    //console.log("Added RECEPT");
    CHECKRECEPT_VAR_INTERVAL_ARRAY.push(id);
    //if (CHECKRECEPT_VAR_INTERVAL_ARRAY.length>0) CHECKRECEPT_VAR_INTERVAL_ARRAY=[];
}

function KillTimersSwitchCall() {
    //console.log("clear begin of "+CHECKRECEPT_VAR_INTERVAL_ARRAY.length+"elements");
    for (i = 0; i < SWITCHCALL_VAR_INTERVAL_ARRAY.length; i++) {
        //console.log("clear "+CHECKRECEPT_VAR_INTERVAL_ARRAY[i]);
        clearInterval(SWITCHCALL_VAR_INTERVAL_ARRAY[i]);
    }
    if (SWITCHCALL_VAR_INTERVAL_ARRAY.length > 0) SWITCHCALL_VAR_INTERVAL_ARRAY = [];
}

function addTimersSwitchCall(id) {
    //console.log("Added RECEPT");
    SWITCHCALL_VAR_INTERVAL_ARRAY.push(id);
    //if (CHECKRECEPT_VAR_INTERVAL_ARRAY.length>0) CHECKRECEPT_VAR_INTERVAL_ARRAY=[];
}

function KillTimersPPP() {
    clearTimeout(CHECK_PPP_VAR_TIMEOUT);
    PPP_CURRENT_LAUNCHED_CONTACT = 0;
    PPP_CURRENT_LAUNCHED_CONTACT_FICHIER = 0;
    //PPP_CURRENT_LAUNCHED_CONTACT_ISSUE=0;
}



function KillTimersDebrief() {
    //console.log("clear begin of "+CHECKRECEPT_VAR_INTERVAL_ARRAY.length+"elements");
    for (i = 0; i < DEBRIEF_VAR_INTERVAL_ARRAY.length; i++) {
        //console.log("clear "+CHECKRECEPT_VAR_INTERVAL_ARRAY[i]);
        clearInterval(DEBRIEF_VAR_INTERVAL_ARRAY[i]);
    }
    if (DEBRIEF_VAR_INTERVAL_ARRAY.length > 0) DEBRIEF_VAR_INTERVAL_ARRAY = [];
}

function addTimersDebrief(id) {
    //console.log("Added RECEPT");
    DEBRIEF_VAR_INTERVAL_ARRAY.push(id);
    //if (CHECKRECEPT_VAR_INTERVAL_ARRAY.length>0) CHECKRECEPT_VAR_INTERVAL_ARRAY=[];
}

function killTimers() {
    clearInterval(PREDICTIF_VAR_INTERVAL);
    clearInterval(CHECKRAPPEL_VAR_INTERVAL);
    clearInterval(CHECKFICHE_VAR_INTERVAL);
    clearTimeout(PREDICTIF_VAR_TIMEOUT);

    KillTimersPPP()

    KillTimersRECEPT();
    KillTimersSwitchCall();
    KillTimersDebrief();

    clearInterval(TRANSFERT_VAR_INTERVAL);
    clearInterval(CHECKFICHEPPP_VAR_INTERVAL);


}


function show_msg_log_trans(msg, type) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "400",
        "timeOut": "2000",
        "extendedTimeOut": "1300",
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

function show_msg_log(msg, type) {
    toastr.clear();

    /*toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };*/

    switch (type) {
        case 'warning': {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
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

            toastr.warning(msg);
            break;
        }
        case 'info': {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
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


            toastr.info(msg);
            break;
        }
        case 'success': {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
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


            toastr.success(msg);
            break;
        }
        case 'error': {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            toastr.error(msg);
            break;
        }
    }

}


function show_msg_notif(msg, type, timeout, positionClass) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": positionClass,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout,
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


$('input[name="voip_quality_select"]').attr('checked', false);
var list_color = $('.dropdown-theme-setting > li > ul#list-color > li');
/* keep alive */
keep_alive();
setInterval(keep_alive, 60000);

function keep_alive() {

    $.ajax({
        url: base_url_ajax + "agent/agent/check_connection",
        type: "post", // 'get' or 'post', override for form's 'method'
        global: false,
        async: true,
        success: function (data_result) {

        }
    });

}

/** **************End Keep Alive******** */


/**CheckDebrief**/
var isbackstretch = 0;
//var CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief, 10000);

$(document).on('click', '.hangup_call', function (e) {
    //console.log("is_web_phone="+is_web_phone);


    e.preventDefault();

    //if(appel_manuel==1) $('#li_appel_manuel').show();
    if (is_web_phone) sipHangUp();

    sendHangupMyChannel();
    /*var flagStatus = true;
    var counter = 0;

    var TIMER_STATUS_CALL_CHECK = setInterval(function () {
        if (flagStatus && counter < 3) {
            flagStatus = status_call_agent(false);
            counter++;
        }
        else clearInterval(TIMER_STATUS_CALL_CHECK);
    }, 2000);*/
    if ($('#production_tabs').css('display') == 'none') {
        CheckDebrief();

    }


});
//Test sur debrief appel manuel hors fiche
$('#modal-appel-manuel').on('hidden.bs.modal', function () {


    /*if(appel_manuel==1){
        $('#li_appel_manuel').show();
    }*/
    if ($('#production_tabs').css('display') == 'none') {

        //cas l'appel est en pause n'entre pas dans la debrief
        if (!$('.in_call_hold').hasClass('hidden')) {
            return false;
        }
        //Raccrocher l'appel est fermer la boite dialog
        if (!$('.hangup_call').hasClass('hidden')) {
            return false;
        } else {
            CheckDebrief();
        }

    }
})



window.addEventListener("message", function receiveMessage(event) {
    var data = event.data;
    data = data.split('||');
    if (data.length == 6) {
        if (data[0] == "cmk_call_contact") {
            ref_campagne = data[1];
            ref_fichier = data[2];
            num_contact = data[3];
            name_fichier = data[4];
            name_campagne = data[5];

            is_rappel_auto = 0;
            s_is_recept = 0;
            is_rappel = $(this).data('is_rappel');
            is_rappel_auto = 0;
            poste = $('#poste_hidden').val();
            type_global_prod = 'prev';
            click_from = '';

            $('.bloc_man_prod').addClass('hidden');
            $('button.valider_man_prod').data('action', 'valider_quick_qualif');
            $('.not_bloc_man_prod').removeClass('hidden');
            $('.default_prod').removeClass('hidden');


            call_form_search = 0;

            GetListmSortatnt();

            SuccessPlay();

        }
    }

    event.source.postMessage("Hi! this is a message from other.html.", "*");
});


function openAgenda() {
    agendaWindow = window.open(base_url_ajax + 'externe/externe');
}

function startRappelCountDown(cmk_manualcall_number,cmk_select_numsortant,data_options) {
    var autoRappelCountDown = 5;
    var autoRappelInterval = false;
    var bbMessage = '<p class="text-center"><span class="label label-danger">'+lbl_info_prospect_rappel+'</span> '+lbl_initiaiting_call_to+' <strong><i class="fa fa-phone"></i> '+cmk_manualcall_number+'</strong></p>'
    bbMessage += '<p class="text-center">'+lbl_initiating_call_in+' <span id="cmk_auto_rappel_seconds">'+autoRappelCountDown+'</span> ' + sec_lbl + '...</p>';
    var dialogRappelAuto = bootbox.dialog({
        message: bbMessage,
        closeButton: false,
        buttons: {
            ok: {
                label: lbl_initiate_call_now,
                className: 'btn-info',
                callback: function () {
                    $('.page-container').removeClass('body-flash');
                    dialogRappelAuto.modal('hide');
                    if (autoRappelInterval) {
                        clearInterval(autoRappelInterval);
                        autoRappelInterval = false;
                    }
                    addObsctel(cmk_manualcall_number);
                    addObscclid(cmk_select_numsortant);

                    $.ajax({
                        url: "agent/CallMannuel",
                        type: "post",
                        data: data_options,
                        success: function (data_return) {
                            //console.log(data_return)

                        }
                    });
                }
            }
        }
    });
    // do something in the background
    $('.page-container').addClass('body-flash');


    autoRappelInterval = setInterval(function () {
        autoRappelCountDown--
        $("#cmk_auto_rappel_seconds").text(autoRappelCountDown);
        if (autoRappelCountDown === 0) {
            $('.page-container').removeClass('body-flash');
            dialogRappelAuto.modal('hide');
            clearInterval(autoRappelInterval);
            autoRappelInterval = false;
            addObsctel(cmk_manualcall_number);
            addObscclid(cmk_select_numsortant);

            $.ajax({
                url: "agent/CallMannuel",
                type: "post",
                data: data_options,
                success: function (data_return) {
                    //console.log(data_return)

                }
            });
        }
    }, 1000);

}

jQuery(document).ready(function () {


    $("#modal-contactvierge").on("hidden.bs.modal", function () {
        $("#fichier_vierge_tel").val('');
    });


    $("#modal-contactvierge").on("shown.bs.modal", function () {

        num_campagne = $('#fichier_vierge ').find(':selected').data('campagne');
        getFieldFileSearch(num_campagne, '', true);


    });


    $(".with-tooltip.info-ctc").tooltip({
        container: 'body'
    })
    $("#forcedfiles").multipleSelect();

    $('#li_fiche_vierge').click(function () {
        $("#fichier_vierge_id_recept").val('');
    });
    $("#ct_DT_lost").on("click", ".new_lost_call", function () {
        $('#fichier_vierge').val($(this).data('ref_fichier'));
        $('#fichier_vierge_tel').val($(this).data('num_tel'));
        $("#fichier_vierge_id_recept").val($(this).data('id_recept'));
        $('#modal-contactvierge').modal('show');
    });
    /************************* aziz modif checkficherecpet****/
    if (cmk_callblending == 1) {

        checkFicheRecept();

    }
    /*
    KillTimersRECEPT();
    if (cmk_callblending == 1) {

        //console.log('CHECKBBB documentready');
        CHECKRECEPT_VAR_INTERVAL_DR = setInterval(checkFicheRecept, 5000);
        addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_DR);

    }
    */
    $('#defaultCountdown').countdown({
        since: 0,
        format: 'HMS'
    });
    $('#defaultCountdown').countdown('destroy');
    //InitAgent('MENU', '');
    jQuery(document).trigger("date_picker");
    jQuery(document).trigger("time_picker");


    $('.print_pdf').html('');
    $('#print_pdf').hide();
    //GetJournalAppel();


    //LoadInterfaceAgentSKILS();

    $.ajax({
        type: "POST",
        url: "agent/loadWebservice",
        data: {
            user: user,
            cmk_groupe_comptence: cmk_groupe_comptence,
            poste: poste,
            nom_login: nom_login,
        },
        async: false,
        global: false,
        success: function (data_return) {


            if (data_return != "CMK_NO_WS" && data_return != "") {
                show_msg_log(data_return, 'success');

            }

        }
    });


    LoadMenu();
    CheckDebrief('false');

    $("#cmk_manualsms_number").intlTelInput({
        hiddenInput: 'cmk_manualsms_intlnumber',
        autoHideDialCode: false,
        preferredCountries: ["fr"],
        separateDialCode: true,
        allowFilter: false,
        utilsScript: base_url_ajax + 'assets/cmk/vendors/intl-tel-input/js/utils.js'
    });

    $("#modal-sms-manuel").on('show.bs.modal', function () {
        $("#cmk_manualsms_number").val('');
        $("#cmk_manualsms_text").val('');
        $('#man-sms-form').get(0).reset();
        updateSmsCharsCount();
    });
    $("#cmk_manualsms_text").keyup(updateSmsCharsCount);

    $('#obs_c_tel_histo').val('');
    $('#obs_c_clid_histo').val('');
    call_form_search = 0;

    $('#ctPlanningForm .editable-click').editable({
        type: "combodate",
        format: 'HH:mm',
        mode: "inline",
        viewformat: 'HH:mm',
        template: '  HH : mm',
        combodate: {
            minuteStep: 5
        },
        inputclass: 'input-sm'
    });

    $("#btn-confirm-ctplanning").click(function () {
        var post_data = $('#ctPlanningForm .editable-click').editable('getValue');
        var ctStr = [];
        $.each(actionContacts, function (key, contact) {
            ctStr.push(contact.value);
        });
        //ctStr = {'name' : 'selectCt' , 'value' : ctStr.join('///')};
        post_data.selectCt = ctStr.join('///');
        $.ajax({
            type: 'POST',
            url: base_url_ajax + 'gestioncontacts/gestioncontacts/setPlanning',
            data: post_data,
            success: function (response) {
                $("#modal-affect-planning").modal("hide");
                toastr.success(lbl_params_saved_successfully);
            }
        });
    })

    $(document).on("keydown", function (e) {
        if (e.keyCode == cmk_recep_shortcut_key) {
            if (userCurrentState == "PLAY" && is_onattente && $("#loadQueueDiv tbody tr").length > 0) {
                $("#loadQueueDiv tbody tr:nth-child(1) .call_contact_recept").click();
            }
        }
    })

});

function LoadMenu() {
    if (XhrAbortLoadLMenu == false) {
        $.ajax({
            type: "POST",
            url: "agent/loadMenu",
            data: {
                user: user,
                cmk_groupe_comptence: cmk_groupe_comptence,
                poste: poste,
                nom_login: nom_login,
            },
            dataType: 'json',
            async: false,
            global: false,
            success: function (data_return) {

                $('#external-lists-menu').append(data_return.external_lists);
                getPostits = data_return.getPostits;
                var html = "";
                $.each(getPostits, function (key, value) {
                    var note = value.text;
                    var date = value.created;
                    var id = value.id;
                    html += '<li style="padding:5px"><pre style="word-wrap: break-word;background-color:#ecf3b2">' + note + '<i class="fa fa-trash-o postitdelete" data-postit="' + id + '" style="cursor:pointer;float:right"></i> <i class="fa fa-pencil postitedit" data-postit="' + id + '" style="cursor:pointer;float:right"></i></li></pre><li style="color:#BDBDBD;float:right"><small>' + date + '</small></li><hr />';
                });
                $(html).appendTo("#oldnotes");


                if (data_return.WsLogin != "CMK_NO_WS") {
                    show_msg_log(data, 'success');

                }

                $('#journal_des_appels').html(data_return.JournalDesAppels)
                $('#journal_des_appels .call_contact').tooltip({
                    title: $(this).data('original-title'),
                    container: 'body'
                })


                ListInterfaceAgent = data_return.ListInterfaceAgent;


                //return false;


                $.each(ListInterfaceAgent.data, function (key, value) {

                    //console.log(value,key);
                    stats = value.stats.toString();
                    search_contact = value.search_contact.toString();
                    fiche_vierge = value.fiche_vierge.toString();
                    recordings = value.recordings.toString();
                    appel_manuel = value.appel_manuel.toString();
                    sms_manuel = value.sms_manuel.toString();
                    exit_debrief = value.exit_debrief;
                    duplictc = value.duplictc;
                    get_reception = value.get_reception;
                    bdcon_read = value.bdcon_read;
                    bdcon_add = value.bdcon_add;
                    bdcon_edit = value.bdcon_edit;
                    bdcon_delete = value.bdcon_delete;
                    rappel_plateau = value.rappel_plateau.toString();
                    auto_prod_reception = value.auto_prod_reception.toString();
                    allow_manage_timeslots = value.allow_manage_timeslots.toString();
                    allow_pause_coffe = value.allow_pause_coffe.toString();
                    allow_jobs = value.allow_jobs.toString();
                    allow_ignore_inbound_calls = value.allow_ignore_inbound_calls.toString();

                });


                if (stats == 1)
                    $('#li_stats').removeClass('hidden');
                else
                    $('#li_stats').addClass('hidden');
                if (search_contact == 1)
                    $('#li_search_contact').removeClass('hidden')
                else
                    $('#li_search_contact').addClass('hidden');
                if (fiche_vierge == 1)
                    $('#li_fiche_vierge').removeClass('hidden')
                else
                    $('#li_fiche_vierge').addClass('hidden');
                if (recordings == 1)
                    $('#li_recordings').removeClass('hidden')
                else
                    $('#li_recordings').addClass('hidden');
                if (appel_manuel == 1) {
                    $('#li_appel_manuel').removeClass('hidden');
                    $('#cmk_originate_manuel_shortcut').removeClass('hidden');
                } else {
                    $('#li_appel_manuel').addClass('hidden');
                    $('#cmk_originate_manuel_shortcut').addClass('hidden')
                }
                if (sms_manuel == 1)
                    $('#li_sms_manuel').removeClass('hidden')
                else
                    $('#li_sms_manuel').addClass('hidden');

                if (exit_debrief == 1)
                    $('.exitdebrief').removeClass('hidden');
                else
                    $('.exitdebrief').addClass('hidden');

                if (get_reception == 1)
                    $('#lost_call').removeClass('hidden');
                else
                    $('#lost_call').addClass('hidden');

                if (allow_pause_coffe == 1)
                    $("a[data-target='#modal-pause-cafe']").removeClass('hidden');
                else
                    $("a[data-target='#modal-pause-cafe']").addClass('hidden');

                if (rappel_plateau != 1) {
                    if ($('#obs_c_rappel_etat2').prop('checked')) {
                        $('#obs_c_rappel_etat2').click
                    }

                    $('#obs_c_rappel_etat_modal2').prop('checked', false)
                    $('#obs_c_rappel_etat2').attr('disabled', true)
                    $('#obs_c_rappel_etat_modal2').attr('disabled', true)

                    $('.rp_plateau').addClass('hidden');
                } else {
                    $('#obs_c_rappel_etat2').attr('disabled', false)
                    $('#obs_c_rappel_etat_modal2').attr('disabled', false)
                    $('.rp_plateau').removeClass('hidden');
                }

                if (allow_jobs == 1)
                    $("a[data-target='#modal-jobs']").removeClass('hidden');
                else
                    $("a[data-target='#modal-jobs']").addClass('hidden');

                if (allow_ignore_inbound_calls == 1)
                    $("button.ignore_inbound_calls").removeClass('hidden');
                else
                    $("button.ignore_inbound_calls").addClass('hidden');

                $.uniform.update();

                forceOut = 0;


                if (data_return.nb_unseen_evals > 0)
                    $(".alert_new_evaluation").html("<span class='badge bg-green'>" + data_return.nb_unseen_evals + "</span>");
                else
                    $(".alert_new_evaluation").html("");
                //console.log(data_return)
            }
        });

    }


}

function updateSmsCharsCount() {
    var count = $("#cmk_manualsms_text").val().length;
    var nbSMS = Math.floor(count / 160);
    var remainder = count % 160;
    var smsCount = (160 - remainder).toString() + " / " + (nbSMS + 1).toString();
    $("#man-sms-char-count").html('<strong>' + smsCount + '</strong>');
}

//GetJournalAppel();
$.formUtils.addValidator({
    name: 'validMobile',
    validatorFunction: function (value1, $el, config, language, $form) {
        return $el.intlTelInput('isValidNumber');
    },
    errorMessage: lbl_please_chose_vaild_mobile_number,
    errorMessageKey: 'badMobileNumber'
});


$(document).on("click", ".call_contact_recept", function () {

    var ref_campagne_recept = $(this).data('ref_campagne');
    var ref_fichier_recept = $(this).data('ref_fichier');
    var name_campagne_recept = $(this).data('name_campagne');
    var incoming_recept = $(this).data('incoming');
    var num_contact_recept = $(this).data('num_contact');
    var name_fichier_recept = $(this).data('name_fichier');
    var idrecept = $(this).data('idrecept');
    is_reception = 1;
    var wsSearch = $(this).data('wssearch');
    var show_contact_auto = $(this).data('show_contact_auto');
    forceOut = 1;

    $.ajax({
        type: 'post',
        url: base_url_ajax + 'agent/agent/interceptCall',
        data: { id: $(this).data('idrecept') },
        async: (show_contact_auto != "1")
    })

    decrochageEntrant(ref_campagne_recept, ref_fichier_recept, name_campagne_recept, incoming_recept, num_contact_recept, name_fichier_recept, idrecept, wsSearch, show_contact_auto)

});

$(document).ready(function () {
    $.validate({
        form: '#man-sms-form',
        validateOnBlur: false,
        showHelpOnFocus: false,
        onSuccess: function () {
            var dataForm = $('#man-sms-form').serialize();
            $.ajax({
                type: 'post',
                url: base_url_ajax + 'agent/agent/SendManSMS',
                data: dataForm,
                success: function (response) {
                    if (response == "OK_SENDSMS") {
                        toastr.success('SMS Envoyé');
                        $("#modal-sms-manuel").modal('hide');
                    } else {
                        toastr.error("Une erreur s'est produite lors de l'envoi du SMS");
                    }
                }
            })
            return false;
        }
    });

    $("#btn-sms-man-send").click(function () {
        $("#man-sms-form").submit();
    })

    $('#timeLineItemsContainer').parent().slimScroll({
        height: '400px'
    });
    //$.getScript(base_url_cmk + "/js/agent/interface_agent.js");

    $('.header-avatar').attr('src', $('.avatar-upload').attr('src'));
    var sides = ["top"];

    // Initialize sidebars
    for (var i = 0; i < sides.length; ++i) {
        var cSide = sides[i];
        $(".sidebar." + cSide).sidebar({
            side: cSide
        });
    }

    // Click handlers
    $("#info_ctc_close").click(function () {
        $('.details_info_ctc').hide();
    })
    $(".info-ctc[data-action]").on("click", function () {

        $('.details_info_ctc').show();
        var $this = $(this);
        var action = $this.attr("data-action");
        var side = $this.attr("data-side");

        $(".sidebar." + side).trigger("sidebar:" + action);
        if ($(".sidebar." + side).css('display') == "none") {
            //$('.sidebars').hide();

        }
        //loadinfoprospect();
        $(".sidebar." + side).show();
        return false;
    });

    $(".info-ctc-close").click(function () {

        var dataAgent = {};
        dataAgent.logAction = "details_info_contact";
        dataAgent.logDebut_fin = 1;

        var cmk_commentaires_get = $('#cmk_commentaires').val();
        $('#cmk_commentaires_dupli').val(cmk_commentaires_get)
        agentLogAction(dataAgent);
    })
    $(".info-ctc-open").click(function () {
        var dataAgent = {};
        dataAgent.logAction = "details_info_contact";
        dataAgent.logDebut_fin = 0;
        agentLogAction(dataAgent);
    })
    //$('.sidebars').removeClass('hidden')
    // $('.headerinfocontact').scrollToFixed();
    $(".dashboard_panel").show();
    $(".mailbox").show();

});

$(function () {
    // play();

    $('#form_editor').hide();
    $('#accordion1').hide();
    //setCrmWidgetsValues();
    //setCrmWidgetsValuesProd();

    // BEGIN ACCORDION WITH ICONS
    function toggleChevron(e) {
        $(e.target).prev('.panel-heading').find("i.indicator").toggleClass(
            'glyphicon-chevron-left glyphicon-chevron-down');

    }

    $('#accordion1').on('hidden.bs.collapse', toggleChevron);
    $('#accordion1').on('shown.bs.collapse', toggleChevron);
});

/*
 * Google Mpas Code Comunik
 */

var map;
var directionsService;
var directionsDisplay;
var onChangeHandler;
var markers = [];

function initMap() {

    map = new google.maps.Map(document.getElementById('gmap_basic'),
        {
            center: {
                lat: -33.8688,
                lng: 151.2195
            },
            zoom: 18,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.TERRAIN]
            }
        });

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    directionsDisplay.setMap(map);

    onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    var input = /** @type {!HTMLInputElement} */
        (document.getElementById('pac-input'));
    var input_dest = /** @type {!HTMLInputElement} */
        (document.getElementById('pac-input-dest'));
    var button = (document.getElementById('info_maps'));
    var btn_search = (document.getElementById('search_maps'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_dest);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(btn_search);

    $('#search_maps').css({
        'margin-left': '10px',
        'margin-top': '8px'
    });
    $('#info_maps').css({
        'margin-left': '10px',
        'margin-top': '10px'
    });
    $('#info_maps').hide();
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var autocomplete_dest = new google.maps.places.Autocomplete(input_dest);
    autocomplete_dest.bindTo('bounds', map);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        address: $('#pac-input').val()
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            markers.push(marker);

        } else {
            /*console.log('Geocode was not successful for the following reason: '
             + status);*/
        }
    });

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    //console.log(markers)

    clearMarkers();
    markers = [];
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('distance_maps').innerHTML = "Distance  : " + total
        + ' km';

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsDisplay.addListener('directions_changed', function () {

        if ($('#pac-input-dest').val() != '') {
            $('#info_maps').show();
            computeTotalDistance(directionsDisplay.getDirections());
        } else {
            $('#distance_maps').html('');
            $('#info_maps').hide();
        }

    });

    directionsService.route({
        origin: document.getElementById('pac-input').value,
        destination: document.getElementById('pac-input-dest').value,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {

        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {

            //console.log('Directions request failed due to ' + status);
        }
    });

}

$(document)
    .on(
        "click",
        '#search_maps',
        function () {

            if ($('#pac-input').val() != "") {

                var input = /** @type {!HTMLInputElement} */
                    (document.getElementById('pac-input'));

                var autocomplete = new google.maps.places.Autocomplete(
                    input);
                autocomplete.bindTo('bounds', map);
                var geocoder = new google.maps.Geocoder();
                geocoder
                    .geocode(
                        {
                            address: $('#pac-input').val()
                        },
                        function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                map
                                    .setCenter(results[0].geometry.location);
                                var marker = new google.maps.Marker(
                                    {
                                        map: map,
                                        position: results[0].geometry.location
                                    });
                                markers.push(marker);
                            } else {
                                /*console
                                 .log('Geocode was not successful for the following reason: '
                                 + status);*/
                            }
                        });
            }

            if ($('#pac-input-dest').val() != '') {
                calculateAndDisplayRoute(directionsService,
                    directionsDisplay);
            } else {
                deleteMarkers();
                directionsDisplay.set('directions', null);
            }

        });

/**
 *
 * Fin Code Google Maps Comunik
 *
 */

/*******************************************************************************
 *
 * Upload Image
 *
 *
 */

$("#date-popover").popover({
    html: true,
    trigger: "manual"
});
$("#date-popover").hide();
$("#date-popover").click(function (e) {
    $(this).hide();
});

$('#modal-rappel-calendar').on('shown.bs.modal', function () {
    $("#calendar_modal .fc-button").trigger("click");

});

$('#modal-statsagent').on('shown.bs.modal', function () {
    //$.getScript(base_url_cmk + "/js/statsagents/ratiosagent.js");
});

$('#tableau_dernier_appel').DataTable({
    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
});

// Debut Prochain Rapples
var events_array = [];

$(window)
    .resize(
        function () {

            if (navigator.userAgent
                .match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
                // alert('mobile');

            } else {
                // alert('none');
                $("#my-calendar").html('');
                loadConfRappel(set_curent_month);
            }

        });
//PingHttp(); //REMOVE FACEBOOK PING
CountFacebookApp();

$(document).ready(function () {

    loadConfRappel(set_curent_month);


});


var type_rappel = [];
$.each($(".obs_c_rappel_etat_calendar:checked"), function (k, v) {
    type_rappel.push(v.value);
});

var rappels_option_data = {
    "user[]": user,
    grouped_by: 'obs_c_date_rappel',
    obs_c_rappel_etat: type_rappel,
    session_user: true,
    'qualifs[]': IdsQualifSelected
};

$(document).on("click", ".obs_c_rappel_etat_calendar", function () {
    $(".obs_c_rappel_etat_modal").attr("checked", false);
    var type_rappel = [];
    $.each($(".obs_c_rappel_etat_calendar:checked"), function (k, v) {
        $(".obs_c_rappel_etat_modal[value='" + v.value + "']").attr("checked", true);
        type_rappel.push(v.value);
    });
    $.uniform.update();
    rappels_option_data = {
        "user[]": user,
        grouped_by: 'obs_c_date_rappel',
        obs_c_rappel_etat: type_rappel,
        session_user: true,
        'qualifs[]': IdsQualifSelected
    };
    $('.my-calendar-rappel').fullCalendar('destroy');

    loadConfRappel();

});


$(document).on("click", ".obs_c_rappel_etat_modal", function () {
    $(".obs_c_rappel_etat_calendar").attr("checked", false);
    var type_rappel = [];
    $.each($(".obs_c_rappel_etat_modal:checked"), function (k, v) {
        $(".obs_c_rappel_etat_calendar[value='" + v.value + "']").attr("checked", true);
        type_rappel.push(v.value);
    });
    $.uniform.update();
    rappels_option_data = {
        "user[]": user,
        grouped_by: 'obs_c_date_rappel',
        obs_c_rappel_etat: type_rappel,
        session_user: true,
        'qualifs[]': IdsQualifSelected
    };
    $('.my-calendar-rappel').fullCalendar('destroy');

    loadConfRappel();

    $.ajax({
        url: "../rappel/rappel/show_rappel_list",
        type: "post",
        data: {
            date: $("#hidden_date_rappel").val(),
            "user[]": user,
            grouped_by: 'obs_c_date_rappel',
            mode: 'agent',
            obs_c_rappel_etat: type_rappel,
            ref_groupe_competence: cmk_groupe_comptence,
            'qualifs[]': IdsQualifSelected

        },
        success: function (html_modal_rappel) {
            $("#modal-container").html(html_modal_rappel);
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('#modal-add-event').modal('toggle');
            $('#modal-add-event').zIndex(9999999);
            $.getScript(base_url_cmk + "/js/agent/rappel_modal.js");

        }
    });
});

$(document).on('shown.bs.modal', '#modal-add-event', function () {
    $(".obs_c_rappel_etat_modal").attr("checked", false);
    var type_rappel = [];
    $.each($(".obs_c_rappel_etat_calendar:checked"), function (k, v) {
        $(".obs_c_rappel_etat_modal[value='" + v.value + "']").attr("checked", true);
        type_rappel.push(v.value);
    });
    $.uniform.update();
});

$(document).on("click", ".remove-qualification-selected-filtre", function () {
    var idResetQualification = $(this).data('id-reset-qualification');
    $('#checkbox' + idResetQualification).attr('checked', false);

    IdsQualifSelected = IdsQualifSelected.filter(function (value, index, arr) {
        return value != idResetQualification;
    });

    searchIDsQualif = searchIDsQualif.filter(function (row, indew, arr) {
        return row.id != idResetQualification;
    });
    console.log(IdsQualifSelected, 'IdsQualifSelected');
    $(this).remove();
    $('.my-calendar-rappel').fullCalendar('destroy');
    rappels_option_data = {
        "user[]": user,
        grouped_by: 'obs_c_date_rappel',
        obs_c_rappel_etat: type_rappel,
        session_user: true,
        'qualifs[]': IdsQualifSelected
    };

    loadConfRappel();
    //$('.qualif-ff').click();

});

//appliquer le filtre de qualification
$(document).on('click', '.qualif-ff', function () {
    //searchIDsQualif = "";
    //recuperer les numéro de qualification pour le filtre de rappel
    var html_qualif_selected = "";
    $.each($(".qualif-ff"), function (k, v) {
        //$(".qualif-ff[value='" + v.value + "']").attr("checked", true);
        if ($(".qualif-ff[value='" + v.value + "']").is(':checked')) {
            var label = $('label[for="checkbox' + v.value + '"]').text();
            searchIDsQualif.push({ id: v.value, text: label });
        } else {
            $('[data-id-reset-qualification="' + v.value + '"]').remove();
            idResetQualification = v.value;
            IdsQualifSelected = IdsQualifSelected.filter(function (value, index, arr) {
                return value != idResetQualification;
            });

            searchIDsQualif = searchIDsQualif.filter(function (row, indew, arr) {
                return row.id != idResetQualification;
            });
        }


    });





    const result = [];
    const map = new Map();

    for (const item of searchIDsQualif) {
        if (!map.has(item.id)) {
            map.set(item.id, true);    // set any value to Map
            result.push({
                id: item.id,
                text: item.text
            });

            IdsQualifSelected.push(item.id);

        }
    }

    $.each(result, function (indice, row) {

        console.log(row, 'row selected Qualifications')
        html_qualif_selected += '<span style="cursor: pointer;" class="label label-default remove-qualification-selected-filtre margin-right-10 margin-bottom-10" data-id-reset-qualification="' + row.id + '">  ' + row.text + ' <i class="fa fa-trash font-red"></i> </span> ';

    });


    if (html_qualif_selected != "") {
        $('.selected-filtre-qualification').show();
        $('.selected-filtre-qualification').html(html_qualif_selected);
    } else {
        $('.selected-filtre-qualification').hide();
    }



    //searchIDsQualif = (searchIDsQualif.length>0) ? searchIDsQualif : ['-999999999999'];
    rappels_option_data = {
        "user[]": user,
        grouped_by: 'obs_c_date_rappel',
        obs_c_rappel_etat: type_rappel,
        session_user: true,
        'qualifs[]': IdsQualifSelected
    };

    $('.my-calendar-rappel').fullCalendar('destroy');

    loadConfRappel();
    /**/

});

function loadConfRappel() {
    var current_date = "";
    fichier = $('#campagne_fichier').val();
    if (datess != "") {
        current_date = datess;
    } else {
        current_date = moment().format("YYYY-MM-DD");
    }


    //var option_data = {
    //    "user[]" : user,
    //    grouped_by : 'obs_c_date_rappel',
    //    is_rappel_perso : 1
    //};
    // $('.my-calendar-rappel').fullCalendar('destroy')
    // option_data = $.merge(option_data, post_data);
    $('.my-calendar-rappel')
        .fullCalendar(
            {
                // theme: true,
                height: 400,
                // lang : 'fr',
                defaultView: 'month',
                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: ''
                },

                editable: false,
                defaultDate: current_date,
                events: {
                    url: '../rappel/rappel/show_data',
                    type: 'POST',
                    data: rappels_option_data,
                    success: function (response) {
                        var data_qualif = response.data_qualif;
                        if (data_qualif.length != 0) {
                            //$('.bloc-recherche-qualif-agenda-rappel').removeClass('hidden');
                            //$('.bloc-agenda-rappel').removeClass('col-md-12').addClass('col-md-9');
                            var checked = "";
                            var html = '';
                            $.each(data_qualif, function (indice, data) {
                                $.each(data.qualification_data, function (index, item) {
                                    var exit_in = IdsQualifSelected.indexOf(item.num_qualification);
                                    var couleur = item.couleur;
                                    couleur = (couleur == "") ? "#4A90E2" : couleur;
                                    if (IdsQualifSelected.length == 0) {
                                        checked = "";

                                    } else {
                                        if (exit_in > -1) {
                                            checked = 'checked="checked"';
                                        } else {
                                            checked = "";
                                        }
                                    }


                                    html += ' <div class="funkyradio" >\n' +
                                        '            <input type="checkbox" class="qualif-ff" id="checkbox' + item.num_qualification + '" name="qualifs[]" value="' + item.num_qualification + '" ' + checked + '>\n' +
                                        '            <label for="checkbox' + item.num_qualification + '" style="background-color: ' + couleur + '">' + item.nom + '</label>\n' +
                                        '        </div>';

                                    // style="visibility: hidden"
                                    /* html += ' <button class="btn btn-xs" data-num-qualif="'+item.num_qualification+'" data-couleur="'+item.couleur+'" style="background-color: '+couleur+';color:#FFFFFF">\n' +
                                         '  <label>'+item.nom+'<input type="checkbox" class="qualif-ff" name="qualifs[]" value="'+item.num_qualification+'" '+checked+' style="visibility: hidden">\n' +
                                         '                                        </label> </button>';*/

                                });
                            });
                        } else {
                            //$('.bloc-recherche-qualif-agenda-rappel').addClass('hidden');
                            // $('.bloc-agenda-rappel').removeClass('col-md-9').addClass('col-md-12');
                            html = '<p class="text-warning bold">' + msg_none_qualif_perso_this_month + '</p>';
                        }

                        $('#filtre-qualif').html(html);


                        // Instead of returning the raw response, return only the data
                        // element Fullcalendar wants
                        return response.events;
                    }
                },







                loading: function (bool) {
                    // $("#pageloader7").find('.spinner').toggle(bool);
                },
                eventClick: function (calEvent, jsEvent, view) {
                    var type_rappel = [];
                    $.each($(".obs_c_rappel_etat_calendar:checked"), function (k, v) {
                        type_rappel.push(v.value);
                    });
                    global_date = moment(calEvent.start).format("YYYY-MM-DD");
                    global_user = user;
                    global_fichier = fichier;
                    global_grouped_by = grouped_by;
                    $("#hidden_date_rappel").val(moment(calEvent.start).format("YYYY-MM-DD"));
                    openModal({
                        date: moment(calEvent.start).format("YYYY-MM-DD"),
                        "user[]": user,
                        grouped_by: 'obs_c_date_rappel',
                        mode: 'agent',
                        obs_c_rappel_etat: type_rappel,
                        ref_groupe_competence: cmk_groupe_comptence,
                        "qualifs[]": IdsQualifSelected


                    });

                },
                eventRender: function (event, element) {
                    if (event.className == "content_label") {
                        element.css({
                            'cursor': 'pointer'
                        });
                        // element.css({'cursor':'pointer','height':'34px'});
                        element
                            .prepend('<i class="fa fa-clock-o" style="float:right;margin-top:2px;"></i> ')
                    }
                },
                viewRender: function (view, element) {

                    datess = moment(view.intervalStart).format("YYYY-MM-DD")

                },

                eventAfterAllRender: function (view) {
                    // var b =
                    // $('#my-calendar-rappel').fullCalendar('getDate');
                    datess = moment(view.intervalStart).format("YYYY-MM-DD");
                    global_start_date = moment(view.start).format("DD/MM/YYYY");
                    // / Yesterday at 10:59 AM
                    global_end_date = moment(view.end).subtract(1, 'days').format("DD/MM/YYYY");

                    var month_param = moment(view.end).subtract(1, 'month').format("MM");
                    var year_param = moment(view.end).subtract(1, 'month').format("YYYY");

                },
                eventColor: '#f2994b',
                color: 'yellow', // an option!
                textColor: 'black' //

            });

}


function openModal(data_options) {

    $.ajax({
        url: "../rappel/rappel/show_rappel_list",
        type: "post",
        data: data_options,
        success: function (html_modal_rappel) {
            $("#modal-container").html(html_modal_rappel);
            $('#modal-add-event').modal('toggle');
            $('#modal-add-event').zIndex(9999999);
            $.getScript(base_url_cmk + "/js/agent/rappel_modal.js");

        }
    });

}

// Notification remontée fiche
function notifyUserFiche() {

    if (!("Notification" in window)) {
        return;
    } else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options = {
            body: lbl_nouvelle_fiche_remonte,
            //icon : base_url_ajax+'assets/images/'+icon,
            /*data : {
                idnotif : id,
                itemid : itemid,
                itemtype : itemtype,
                inboundid : inboundid,
                usertype : user_type
            }*/
        };
        var notification = new Notification('Comunik Contacts', options);
        notification.onclick = function (e) {
            notification.close();
        };
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var options = {
                    body: lbl_nouvelle_fiche_remonte,
                    //icon : base_url_ajax+'assets/images/'+icon,
                    /*data : {
                        idnotif : id,
                        itemid : itemid,
                        itemtype : itemtype,
                        inboundid : inboundid,
                        usertype : user_type
                    }*/
                };
                var notification = new Notification('Comunik Contacts', options);
                notification.onclick = function (e) {
                    notification.close();
                };
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

// Get Rappel

$(document).on("click", ".get_rappel_prevus", function () {
    var type_rappel = [];
    date_Rappel = $(this).attr('data-date-rappel');
    $.each($(".obs_c_rappel_etat_calendar:checked"), function (k, v) {
        type_rappel.push(v.value);
    });
    $("#hidden_date_rappel").val(date_Rappel);
    openModal({
        date: date_Rappel,
        "user[]": user,
        grouped_by: 'obs_c_date_rappel',
        mode: 'agent',
        obs_c_rappel_etat: type_rappel,
        ref_groupe_competence: cmk_groupe_comptence,
        'qualifs[]': IdsQualifSelected
    });
});

// Fin Script Prochain Rappels

function GetJournalAppel() {

    $.ajax({
        url: "agent/JournalDesAppels",
        success: function (html_data) {

            $('#journal_des_appels').html(html_data);
            $('#journal_des_appels [data-toggle="tooltip"]').tooltip({
                container: 'body'
            });

        }
    });

}

// Qualite de Son
$(document).on("click", '.voip_quality_select', function () {


    if ($(this).is(':checked')) {


        if ($('#rgpd_qualif').val() == "" && $('#IsRgpdQualifBloc').css('display') == "block") {
            $('.valider_fiche,.valider_man_prod').attr('disabled', true);
        } else {
            jQuery('.QualiteSon').pulsate("destroy");
            $('.valider_fiche,.valider_man_prod').attr('disabled', false);
            $('#voip_quality').val($(this).val())
        }


    } else {
        $('.valider_fiche,.valider_man_prod').attr('disabled', true);
    }
    //console.log('Hello there' + $(this).is(':checked'));
});

function IsQualiteSon(data_result) {

    if (data_result == "1") {
        $('#IsQualiteSonBloc').show();
        $('.QualiteSon').pulsate("destroy");
        $('.QualiteSon').pulsate({
            color: "#bf1c56"
        });
        $('.voip_quality_select').attr('checked', false)
        $.uniform.update();
        if ($('#IsQualiteSonBloc').css('display') === "block" || $('#IsRgpdQualifBloc').css('display') === "block") {
            $('.valider_fiche,.valider_man_prod').attr('disabled', true)
        }
    } else {

        $('#IsQualiteSonBloc').hide();
    }
}

// Fin Qualité de son


//Rgpd Validation
$(document).on("change", '#rgpd_qualif', function () {

    if ($(this).val() != "") {
        if (!$('.voip_quality_select').is(':checked') && $('#IsQualiteSonBloc').css('display') == "block") {
            $('.valider_fiche,.valider_man_prod').attr('disabled', true);
        } else {
            jQuery('.Rgpd').pulsate("destroy");
            $('.valider_fiche,.valider_man_prod').attr('disabled', false);
        }

    } else {
        $('.valider_fiche,.valider_man_prod').attr('disabled', true);
    }
    //console.log('Hello there' + $(this).is(':checked'));
});

function IsRgpd(data_result) {


    if (data_result != "-1") {

        var option = '<option value=""></option>';

        $.each(data_result, function (index, item) {
            option += '<option value="' + item.id + '">' + item.label + '</option>';
        })

        $('#rgpd_qualif').html(option);

        $('#IsRgpdQualifBloc').show();
        $('.Rgpd').pulsate("destroy");
        $('.Rgpd').pulsate({
            color: "#bf1c56"
        });
        $('#rgpd_qualif').val('');
        $.uniform.update();

        if ($('#IsQualiteSonBloc').css('display') == "block" || $('#IsRgpdQualifBloc').css('display') == "block") {
            $('.valider_fiche,.valider_man_prod').attr('disabled', true)
        }


    } else {
        $('#IsRgpdQualifBloc').hide();
        $('#rgpd_qualif').val('')
    }
}


// Creation fichier vierge

function create_contact_man_prod(cmk_manualcall_number, ref_fichier_g) {
    user = $('#user_hidden').val();
    poste = $('#poste_hidden').val();
    fichier_vierge_tel = cmk_manualcall_number;
    ref_fichier = ref_fichier_g;
    data_option_vierge = {
        ref_fichier: ref_fichier_g,
        name_fichier: name_fichier,
        incoming: fichier_vierge_tel,
        champs_search_vierge: 'tel1'

    };


    var ContactExist = 0;
    var DataContact;


    $.ajax({
        url: "agent/SearchContact",
        type: "post",
        data: {
            ref_fichier: ref_fichier_g,
            name_fichier: name_fichier,
            incoming: fichier_vierge_tel,
            champs_search_vierge: 'tel1'

        },
        dataType: 'json',
        async: false,
        success: function (response) {
            ContactExist = response.data.length;
            DataContact = response.data;


            if (ContactExist > 0) {
                num_contact = DataContact[0].num_contact;
                $('#cmk_man_file_name').val(DataContact[0].nom);
            } else {
                num_contact = CallbackVierge(data_option_vierge)
            }
            $.ajax({
                url: base_url_ajax + 'agent/agent/addTypeRemonte',
                type: 'POST',
                data: {
                    name_fichier: name_fichier,
                    num_contact: num_contact,
                    type_remonte: 'man',
                    obs_c_user: cmk_num_user
                },
                success: function (response) {
                    window.sessionStorage['id_last_remonte'] = response;
                }
            })

        }
    });
}

$(document).on('click', '.close_modal_man_call', function (e) {
    e.preventDefault();
    $('#modal-appel-manuel').modal('hide');
    $('.bloc_man_prod').addClass('hidden');
    $('.default_prod').removeClass('hidden');
    $('.not_bloc_man_prod').removeClass('hidden');
    $('.user_logout').css('display', 'block')
    type_global_prod = "";
})

var table_vierges;
var table_vierges_WS;
var struct_ct_ws;
var list_ct_ws;
var bbDialog;


$(document).on('change', '#fichier_vierge', function () {
    if (($(this).val() == "" || $(this).val() == null)) return false;
    num_campagne = $('#fichier_vierge ').find(':selected').data('campagne');
    getFieldFileSearch(num_campagne, $(this).val(), false)

});


function getFieldFileSearch(num_campagne, fichier_vierge, refresh_files) {

    //if(fichier_vierge=="" || fichier_vierge==null) return false;
    $('#champs_search_vierge').html('')
    $.ajax({
        url: "agent/getFieldFileSearch",
        type: "post",
        data: {
            num_campagne: num_campagne,
            fichier_vierge: fichier_vierge
        },
        dataType: 'json',
        success: function (response) {
            if (refresh_files) $('#fichier_vierge').html(response.list_fichier)
            $.each(response.field, function (i, value) {
                $('#champs_search_vierge').append($('<option>').text(value.text).attr('value', value.option));
            });
        }
    })

}

$(document).on('keyup', '#fichier_vierge_tel', function () {
    value = $(this).val();
    champs_search_vierge = $('#champs_search_vierge').val();
    if ((champs_search_vierge == "tel1" || champs_search_vierge == "tel2" || champs_search_vierge == "tel3" || champs_search_vierge == "fax1" || champs_search_vierge == "fax2")) {
        if (/\D/g.test(value)) $(this).val(value.replace(/\D/g, ''))
    }

})

$(document).on(
    "click",
    ".new_fichier_vierge",
    function () {

        user = $('#user_hidden').val();
        poste = $('#poste_hidden').val();
        ref_fichier = $('#fichier_vierge').val();

        champs_search_vierge = $('#champs_search_vierge').val();


        name_fichier = $('#fichier_vierge option:selected').text();
        fichier_vierge_tel = $('#fichier_vierge_tel').val();
        var fichier_vierge_id_recept = $("#fichier_vierge_id_recept").val();
        var is_lost_call = fichier_vierge_id_recept != '' ? 1 : 0;
        if (fichier_vierge_tel == "") {
            show_msg_log(lbl_create_fiche_enter_number, 'error');
            return false;
        }

        var pattern = /^\+?\d+$/;
        if (!pattern.test(fichier_vierge_tel) && (champs_search_vierge == "tel1" || champs_search_vierge == "tel2" || champs_search_vierge == "tel3" || champs_search_vierge == "fax1" || champs_search_vierge == "fax2")) {
            show_msg_log(lbl_create_fiche_number_format, 'error');
            return false;
        }


        if (!ref_fichier || ref_fichier == '') {
            show_msg_log(lbl_create_fiche_select_file, 'error');
            return false;
        }
        data_option_vierge = {
            ref_fichier: ref_fichier,
            name_fichier: name_fichier,
            incoming: fichier_vierge_tel,
            id_recept: fichier_vierge_id_recept,
            champs_search_vierge: champs_search_vierge

        };

        var s_is_recept = 1;
        var ContactExist = 0;
        var DataContact;
        //
        if (fichier_vierge_tel != "") {
            $.ajax({
                url: "agent/SearchContact",
                type: "post",
                data: {
                    ref_fichier: ref_fichier,
                    name_fichier: name_fichier,
                    incoming: fichier_vierge_tel,
                    champs_search_vierge: champs_search_vierge

                },
                dataType: 'json',
                async: false,
                success: function (response) {
                    ContactExist = response.data.length;
                    DataContact = response.data;


                    if (ContactExist > 0) {

                        $('#modal-contactvierge').modal('hide');
                        var bbHtml = '';
                        bbHtml += '<table id="ct_DT_vierges" class="table table-hover table-striped  table-advanced tablesorter table-condensed tb-sticky-header table-sm display">';
                        bbHtml += '<thead>';
                        bbHtml += '<tr>';
                        bbHtml += '</tr>';
                        bbHtml += '</thead>';
                        bbHtml += '</table>';

                        if(cmk_is_ulticom==='1')
                        {
                            bbDialog = bootbox
                            .dialog({
                                message: '<p>' + ContactExist + ' ' + lbl_ctc_exist + '</p>' + bbHtml,
                                title: '<h4 class="box-heading">' + lbl_ctc_exist_heading + '</h4>',
                                size: 'large',
                                
                            });

                        }
                        else{
                            bbDialog = bootbox
                            .dialog({
                                message: '<p>' + ContactExist + ' ' + lbl_ctc_exist + '</p>' + bbHtml,
                                title: '<h4 class="box-heading">' + lbl_ctc_exist_heading + '</h4>',
                                size: 'large',
                                buttons: {
                                    main: {
                                        label: lbl_btn_prop1,
                                        className: "btn btn-default btn-outlined btn-square",
                                        callback: function () {
                                            CallbackVierge(data_option_vierge)

                                        }
                                    },
                                    /*success: {
                                     label: lbl_btn_prop2,
                                     className: "btn blue",
                                     callback: function() {
                                     return false;
                                     $('.bootbox').modal('hide');
                                     $('#ModalContactsSearch').modal('show');



                                     }
                                     }*/
                                }
                            });

                        }
                       

                        bbDialog.init(function () {
                            if (table_vierges) table_vierges.destroy();
                            if (true) {
                                table_vierges = $('#ct_DT_vierges').DataTable({
                                    "data": DataContact,
                                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],
                                    "order": [[1, 'asc'], [3, 'asc']],
                                    "columns": [
                                        {
                                            "title": tableheader_call,
                                            "render": function (data, type, row) {
                                                return '<a class="btn blue btn-outline call_contact" title="' + tableheader_call_title + '" data-is_lost_call="' + is_lost_call + '" data-id_recept="' + fichier_vierge_id_recept + '" data-ref_campagne="' + row['num_campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] + '" data-is_recept="' + s_is_recept + '"><i class="fa fa-phone"></i> ' + lbl_open_contact_form + '</a>';
                                            }
                                        },
                                        { "data": "fichier", "title": tableheader_group },
                                        { "data": "agent_nom", "title": tableheader_agent },
                                        { "data": "num_contact", "title": tableheader_num },
                                        { "data": "nom", "title": tableheader_name },
                                        { "data": "tel1", "title": tableheader_tel1 },
                                        { "data": "tel2", "title": tableheader_tel2 },
                                        { "data": "tel3", "title": tableheader_tel3 },
                                        { "data": "fax1", "title": tableheader_fax1 },
                                        { "data": "fax2", "title": tableheader_fax2 },
                                        { "data": "ct_qualif", "title": tableheader_qualif },
                                        { "data": "last_date_fin", "title": tableheader_procdate },
                                        { "data": "last_date_rappel", "title": tableheader_recalldate },
                                        {
                                            "title": tableheader_dupp,
                                            "render": function (data, type, row) {
                                                return '<a class="fa fa-copy copy_contact" title="' + tableheader_dupp_title + '" data-ref_campagne="' + row['num_campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] + '"></a>';
                                            },
                                            "visible": (duplictc == '1')
                                        },

                                    ],
                                    "columnDefs": [
                                        //{ "visible" : false, "targets" : [10,13,14,15,16,17,18] },
                                    ]
                                });
                            } else {
                                table_vierges.clear().rows.add(response.data).columns.adjust().draw();
                            }
                        })


                    } else {
                        CallbackVierge(data_option_vierge)
                    }


                }
            });
        } else {
            CallbackVierge(data_option_vierge)
        }


    });


function CallbackVierge(data_option_vierge) {


    //alert('Hello lllllll')

    $.ajax({
        url: "agent/CreateFicheVierge",
        type: "post",
        data: data_option_vierge,
        dataType: 'json',
        async: false,
        success: function (data_result) {
            show_msg_log(lbl_contact_vierge_created, 'success');
            $noCallbackVierge = data_result.data_prd;

            ref_campagne = $noCallbackVierge.ref_campagne;
            ref_fichier = $noCallbackVierge.ref_fichier;
            name_campagne = $noCallbackVierge.name_campagne;

            num_contact = $noCallbackVierge.num_contact;
            name_fichier = $noCallbackVierge.name_fichier;
            is_rappel = $noCallbackVierge.is_rappel;
            type = $noCallbackVierge.type;
            // cmk_date_debut_init = $noCallbackVierge.cmk_date_debut_init;
            new_file = $noCallbackVierge.new_file;
            $('#modal-contactvierge').modal('hide');
            $('#content_ecran_conf').html('');

            if (type_global_prod != "man") {
                type_global_prod = (type == "") ? "contact_vierge" : type;

                SuccessPlay();
            }
        }
    });
    return num_contact;
}

$(document).on("click", ".copy_contact", function () {

    var fichier = $(this).data('ref_fichier');
    var from_contact = $(this).data('num_contact');
    var fichier_name = $(this).data('name_fichier');


    bootbox
        .dialog({
            message: '<p>' + lbl_copy_contact_msg + '</p>',
            title: '<h4 class="box-heading">' + lbl_copy_contact_header + '</h4>',
            buttons: {
                main: {
                    label: BTN_ANNULER,
                    className: "btn btn-default btn-outlined btn-square",
                    callback: function () {

                    }
                },
                success: {
                    label: BTN_VALIDER,
                    className: "btn blue",
                    callback: function () {
                        $.ajax({
                            url: "agent/DupplicateContact",
                            type: "post",
                            data: 'ref_fichier=' + fichier + '&name_fichier='
                                + fichier_name + "&incoming=" + "&from_contact=" + from_contact,
                            dataType: 'json',
                            async: false,
                            success: function (data_result) {

                                $noDupplicateContact = data_result.data_prd;

                                ref_campagne = $noDupplicateContact.ref_campagne;
                                ref_fichier = $noDupplicateContact.ref_fichier;
                                name_campagne = $noDupplicateContact.name_campagne;

                                num_contact = $noDupplicateContact.num_contact;
                                name_fichier = $noDupplicateContact.name_fichier;
                                is_rappel = $noDupplicateContact.is_rappel;
                                type = $noDupplicateContact.type;
                                // cmk_date_debut_init = $noDupplicateContact.cmk_date_debut_init;
                                new_file = $noDupplicateContact.new_file;
                                $('#modal-gestioncontacts').modal('hide');
                                $('#content_ecran_conf').html('');
                                SuccessPlay();

                                var dataAgent = {};
                                dataAgent.logAction = "dupliquer_contact";
                                dataAgent.logRef_campagne = ref_campagne;
                                dataAgent.logRef_fichier = ref_fichier;
                                dataAgent.logNum_contact = from_contact;
                                agentLogAction(dataAgent);

                            }
                        });
                        bootbox.hideAll();
                    }
                }
            }
        });

    return false;


});

// Debut Process Fiche


$('#supuser_modal_fichier').on('show.bs.modal   ', function (e) {

    data_result_forced = "<option value='-1'>AUTO</option>";
    $.ajax({
        url: "agent/getForcedFile",
        global: false,
        type: 'post',
        async: false,
        success: function (data_result) {
            $('#forcedfiles').html(data_result_forced + data_result);
            $('#forcedfiles').multipleSelect('refresh');
            $("#forcedfiles").multipleSelect('setSelects', ['-1']);
        }
    });

});
$(document).on("click", ".go_prod", function () {
    click_from = '';
    var supuser = $(this).data('supuser');
    ignoreInboundCalls = 0;
    if (supuser == 1) {

        $('#supuser_modal_fichier').modal('show');

    } else {
        $('#defaultCountdown').countdown('destroy');
        play();
        $('.sticky-wrapper').css('height', '')
    }


});

$(document).on("click", ".ignore_inbound_calls", function () {
    ignoreInboundCalls = 1;
    play();
    $('.sticky-wrapper').css('height', '')
})

$(document).on('click', '.setforcedfiles', function (e) {
    e.preventDefault();
    var forcedfiles = $('#forcedfiles').val();
    $.ajax({
        url: "agent/SetSessionForced",
        global: false,
        type: 'post',
        data: {
            forcedfiles: forcedfiles
        },
        success: function (data_result) {
            $('#supuser_modal_fichier').modal('hide');
            play();
            return false;
        }
    });


});


function StartAutoPlay() {
    // PlayAutoFindFiche = setInterval(play, 60000);
    $.ajax({
        url: "agent/getExploitable",
        type: "post",
        global: false,
        data: {
            user: user,
        },
        success: function (data_result) {
            if (data_result == "true") {


                if (ONLINE_TIMER == false) {


                    if (($("#modal-appel-manuel").data('bs.modal') || {}).isShown) {
                        $('#modal-appel-manuel').modal('hide');
                    }

                    checkIfFicheExiste = 0;
                    clearInterval(PlayAutoFindFiche);
                    PlayAutoFindFiche = false;
                    ignoreInboundCalls = 0;
                    play();

                } else {

                    show_msg_log(info_msg_reprise_prod_call_man, 'info');
                    clearInterval(PlayAutoFindFiche);

                    PlayAutoFindFiche = setInterval(function () {
                        StartAutoPlay();
                    }, 10000);
                }

            } else {

                clearInterval(PlayAutoFindFiche);
                PlayAutoFindFiche = setInterval(function () {
                    StartAutoPlay();
                }, 10000);

            }
        }
    });

}

function StopAutoPlay() {
    clearInterval(PlayAutoFindFiche);
    checkIfFicheExiste = 0;
    PlayAutoFindFiche = false;
}

var checkIfFicheExiste = 0;

$(document).on('click', '#PlayAuto', function (e) {
    e.preventDefault();
    checkIfFicheExiste = 1;

    PlayAutoFindFiche = setInterval(function () {
        StartAutoPlay();
    }, 10000);


});






function show_msg_cnx_lente(my_time1, my_time2) {


    my_time2 = my_time2.getTime(); // second time variable
    var diff = (my_time2 - my_time1); // difference in time
    if (diff > 3000) {
        $.scojs_message(lbl_msg_waring_speed_cnx, $.scojs_message.TYPE_ERROR);

    }
}


function play() {
    cmk_forced_to_in = false;
    if (is_web_phone){
        var checkSip = checkRegistred();

        if (!checkSip) {
            console.log("phone not connected");
            return false;
        }
    }

    $('.show_in_menu').addClass("hidden");
    enableMenuFromAttenteButton();
    setUserAttenteNJS();
    userCurrentState = 'PLAY';
    varWatchState = userCurrentState;
    is_onattente = 0;
    $('.retour_menu_principale').show();
    $('.details_info_ctc').hide();
    $('.user_logout').hide();

    var my_time1 = new Date(); // date object 
    my_time1 = my_time1.getTime(); // first time variable

    var xhrGetDateDebutIntial = $.ajax({
        url: "agent/GetDateDebutIntial",
        global: false,
        async: false,
        success: function (data_result) {
            cmk_date_debut_init = $.trim(data_result);
        }
    });
    if (cmk_activate_check_connection) {
        if (xhrGetDateDebutIntial.readyState == 0) {

            Offline.check();
            //show_msg_log('Un souci de connexion est détecté','warning');
            return false
        }

        var my_time2 = new Date(); // date object
        show_msg_cnx_lente(my_time1, my_time2);

    }




    $('.attente_ppp').html(lbl_agent_attente + '...');
    $('#content_ecran_conf').html('');

    user = $('#user_hidden').val();
    poste = $('#poste_hidden').val();
    var $noFunctionPlay = "";
    var define_CHECK_FICHE_PREDICTIF = $('#define_CHECK_FICHE_PREDICTIF_hidden')
        .val();

    var my_time1 = new Date(); // date object 
    my_time1 = my_time1.getTime(); // first time variable

    var xhrplay = $.ajax({
        url: "agent/play",
        type: "post",
        global: false,
        data: 'user=' + user + '&poste=' + poste + '&forceOut=' + forceOut + '&ignoreInboundCalls=' + ignoreInboundCalls,
        dataType: 'json',
        async: false,
        success: function (data_result) {
            $noFunctionPlay = data_result.data_prd;
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    if (cmk_activate_check_connection) {

        if (xhrplay.readyState == 0) {

            Offline.check();

            //show_msg_log('Un souci de connexion est détecté','warning');
            return false
        }
        var my_time2 = new Date(); // date object


        show_msg_cnx_lente(my_time1, my_time2);
    }

    if ($noFunctionPlay.session_lost == 1) {
        window.location.href = base_url_ajax+"login/Deconnect";
        return false;
    }

    type = $noFunctionPlay.type;
    type_global_prod = type;



    if ($noFunctionPlay.no_file == 1) {
        userCurrentState = 'DASHBOARD';
        show_msg_log(lbl_no_file_started, "error");
        $('.user_logout').css('display', 'block');
        return false;
    }


    if ($noFunctionPlay.no_affected_user == 1) {
        userCurrentState = 'DASHBOARD';
        show_msg_log(lbl_no_affected_user, "error");
        $('.user_logout').css('display', 'block');
        return false;
    }

    if ($noFunctionPlay.no_identique_time_zone == 1) {
        userCurrentState = 'DASHBOARD';
        show_msg_log(lbl_affected_time_zone_error+" "+$noFunctionPlay.msg_time_zone, "error");
        $('.user_logout').css('display', 'block');
        return false;
    }

    if (type != "man") {

        $('.bloc_man_prod').addClass('hidden');
        $('.not_bloc_man_prod').removeClass('hidden');
        $('.default_prod').removeClass('hidden');
        type_appel = $noFunctionPlay.type;
        telcall_auto_trans = $noFunctionPlay.telcall_auto;
        if ($noFunctionPlay.back_menu == 0) {
            $('.retour_menu_principale').hide();
        } else {
            $('.retour_menu_principale').show();
        }

        //console.log("back_menu :::: ::: "+$noFunctionPlay.back_menu)
        ref_campagne = $noFunctionPlay.ref_campagne;
        ref_fichier = $noFunctionPlay.ref_fichier;
        name_campagne = $noFunctionPlay.name_campagne;

        num_contact = $noFunctionPlay.num_contact;
        name_fichier = $noFunctionPlay.name_fichier;
        is_rappel = $noFunctionPlay.is_rappel;
        is_rappel_auto = $noFunctionPlay.is_rappel_auto;
        cmk_hasreception = ($noFunctionPlay.hasreception ? $noFunctionPlay.hasreception : 0);
        //GetListmSortatnt();
        // cmk_date_debut_init = $noFunctionPlay.cmk_date_debut_init;
        if (is_rappel == '1') {
            StopAutoPlay();
            // alert(data_result);
            killTimers();
            telcall_auto = $noFunctionPlay.telcall_auto;
            rappel_launch_auto = $noFunctionPlay.rappel_launch_auto;
            var cmk_select_numsortant = $('#cmk_select_numsortant').val();
            var cmk_manualcall_number = telcall_auto;

            data_options = {
                ref_campagne: ref_campagne,
                cmk_select_numsortant: cmk_select_numsortant,
                cmk_manualcall_number: cmk_manualcall_number,
                ref_fichier: ref_fichier,
                num_contact: num_contact
            };

            if (rappel_launch_auto == 1) {
                if ($noFunctionPlay.countdown_rappel_launch_auto && $noFunctionPlay.countdown_rappel_launch_auto == "1") startRappelCountDown(cmk_manualcall_number,cmk_select_numsortant,data_options)
                else {
                    addObsctel(cmk_manualcall_number);
                    addObscclid(cmk_select_numsortant);

                    $.ajax({
                        url: "agent/CallMannuel",
                        type: "post",
                        data: data_options,
                        success: function (data_return) {
                            //console.log(data_return)

                        }
                    });
                }
            }


            SuccessPlay();
            return false;
            //SuccessPlay();
        }
        LOAD_QUEUES_ONLY = false;
        //console.log('Type production :::: ' + type)
        killTimers();


        switch (type) {
            case 'prd':
                StopAutoPlay();
                //console.log('In case Type production :::: ' + type)
                $('.bloc_attente').show();
                GoAttente();
                is_onattente = 1;
                is_callblending = 0;
                //CHECKFICHE_VAR_INTERVAL = setInterval(checkFiche, define_CHECK_FICHE_PREDICTIF);
                CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                break;
            case 'inprd':
                StopAutoPlay();

                $('.bloc_attente').show();
                GoAttente();
                is_onattente = 1;
                //CHECKFICHE_VAR_INTERVAL = setInterval(checkFiche,define_CHECK_FICHE_PREDICTIF);

                /************************* aziz modif checkficherecpet****/
                checkFicheRecept();
                /*
                KillTimersRECEPT();
                //console.log('CHECKBBB play');
                CHECKRECEPT_VAR_INTERVAL_PLAY = setInterval(checkFicheRecept, 1000);
                addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_PLAY);
                */
                CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                is_callblending = ($noFunctionPlay.is_callblending) ? 1 : 0;

                break;

            case 'ppp':
            case 'inppp':
                StopAutoPlay();

                $('.bloc_attente').show();
                //console.log('type AAAA'+type);

                // GoAttentePPP();
                is_onattente = 1;
                is_callblending = $noFunctionPlay.is_callblending;
                callForPPP();
                if (!cmk_forced_to_in) {
                    GoAttentePPP();
                    //CHECKFICHEPPP_VAR_INTERVAL = setInterval(GoAttentePPP,
                    //  define_CHECK_FICHE_PREDICTIF);
                    $('.attente_ppp').html(lbl_entrain_dappeler);
                    $.backstretch([base_url_th + "/assets/pages/media/bg/1.jpg",
                    base_url_th + "/assets/pages/media/bg/2.jpg",
                    base_url_th + "/assets/pages/media/bg/3.jpg",
                    base_url_th + "/assets/pages/media/bg/4.jpg"], {
                        fade: 3500,
                        duration: define_CHECK_FICHE_PREDICTIF
                    });
                    CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                    TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                }
                break;


            case 'recup':
                StopAutoPlay();

                $('.bloc_attente').show();
                is_callblending = 0;
                SuccessPlay();

                break;
            case 'no_contact0':
            case 'no_contact1':
            case 'no_contact':
                resume_fichier = $noFunctionPlay.resume_fichier;


                show_msg_log(lbl_warning_no_contact, 'error');
                $('.bloc_attente').hide();
                $('#production_tabs').hide();
                $('.in_prospect_btn').hide();
                $('.dashboard_panel').show();
                is_callblending = 0;
                Fncdashboard('fromattente')
                $('.content_resume_fichier_info').html(resume_fichier);
                if (checkIfFicheExiste == 0 && PlayAutoFindFiche == false)
                    $('#ModalResumeFichierInfo').modal('show');

                return false;
                break;

            case 'in':
                StopAutoPlay();

                $('.bloc_attente').show();
                GoAttenteRecept();
                is_onattente = 1;
                /************************* aziz modif checkficherecpet****/
                checkFicheRecept();
                /*
                KillTimersRECEPT();
                //console.log('CHECKBBB play in');
                CHECKRECEPT_VAR_INTERVAL_playin = setInterval(checkFicheRecept, 1000);
                addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_playin);
                */
                CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                is_callblending = ($noFunctionPlay.is_callblending) ? 1 : 0;
                break;

            case 'out':
                StopAutoPlay();

                telcall_auto = $noFunctionPlay.telcall_auto;
                is_callblending = 0;
                var cmk_select_numsortant = $('#cmk_select_numsortant').val();
                var cmk_manualcall_number = telcall_auto;

                data_options = {
                    ref_campagne: ref_campagne,
                    cmk_select_numsortant: cmk_select_numsortant,
                    cmk_manualcall_number: cmk_manualcall_number,
                    ref_fichier: ref_fichier,
                    num_contact: num_contact
                };
                addObsctel(cmk_manualcall_number);
                addObscclid(cmk_select_numsortant);

                $.ajax({
                    url: "agent/CallMannuel",
                    type: "post",
                    data: data_options,
                    success: function (data_return) {
                        //console.log(data_return)

                    }
                });
                is_progressif = 1;
                SuccessPlay();
                break;

            default:
                StopAutoPlay();
                // preview
                // $("#pageloader7").find('.spinner').show();
                SuccessPlay();
                break;
        }
        return false;
    } else {
        StopAutoPlay();
        $('.dashboard_panel').show();
        $('.valider_fiche,.valider_man_prod').attr('disabled', false)

        IsQualiteSon($noFunctionPlay.voip_quality);
        IsRgpd($noFunctionPlay.IsRgpd);
        ref_campagne = $noFunctionPlay.ref_campagne;
        ref_fichier = $noFunctionPlay.ref_fichier;
        num_contact = $noFunctionPlay.num_contact;
        name_campagne = $noFunctionPlay.name_campagne;
        name_fichier = $noFunctionPlay.name_fichier;
        $('#ref_fichier').val(ref_fichier);
        $('#ref_campagne').val(ref_campagne);
        $('.bloc_man_prod').removeClass('hidden');
        $('button.valider_man_prod').data('action', 'valider_man_prod');
        $('.not_bloc_man_prod').addClass('hidden');
        $('.default_prod').addClass('hidden');


        $('#ref_qualif_prd_man').html('<option></option>');
        option_list_qualif = $.ajax({
            url: base_url_ajax + "formbuilder/formbuilder/LoadQualifElement",
            async: false,
            type: "post", // 'get' or 'post', override for form's 'method'
            data: 'ref_campagne=' + ref_campagne
        }).responseText;

        $('#ref_qualif_prd_man').append(option_list_qualif)

        $('#modal-appel-manuel').modal('show');
        $('.alert-man-rappel').addClass('hidden');
        if ($noFunctionPlay.is_rappel == 1) {
            //killTimers();
            telcall_auto = $noFunctionPlay.telcall_auto;
            rappel_launch_auto = $noFunctionPlay.rappel_launch_auto;
            var cmk_select_numsortant = $('#cmk_select_numsortant').val();
            var cmk_manualcall_number = telcall_auto;
            $("#cmk_manualcall_number").val(telcall_auto);
            $("#cmk_man_file_name").val($noFunctionPlay.nom_contact);
            $('#cmk_manualcall_number').attr('readonly', true);
            $('.close_modal_man_call').addClass('hidden');
            $('.bloc_man_prod_qualif').removeClass('hidden');
            $('.alert-man-rappel').removeClass('hidden');
            $('#obs_c_tel_histo').val('');
            $('#obs_c_clid_histo').val('');
            $.ajax({
                url: "agent/GetDateDebutIntial",
                global: false,
                async: false,
                success: function (data_result) {
                    cmk_date_debut_init = $.trim(data_result);
                    //cmk_date_debut = cmk_date_debut_init
                }
            });

            window.sessionStorage['num_contact'] = num_contact;
            window.sessionStorage['name_fichier'] = name_fichier;
            window.sessionStorage['ref_fichier'] = ref_fichier;
            window.sessionStorage['ref_campagne'] = ref_campagne;

            InitAgent('PRODUCTION', '')
            data_options = {
                ref_campagne: ref_campagne,
                cmk_select_numsortant: cmk_select_numsortant,
                cmk_manualcall_number: cmk_manualcall_number,
                ref_fichier: ref_fichier,
                num_contact: num_contact
            };

            if (rappel_launch_auto == 1) {
                //alert('Launch Call')

                addObsctel(cmk_manualcall_number);
                addObscclid(cmk_select_numsortant);

                $.ajax({
                    url: "agent/CallMannuel",
                    type: "post",
                    data: data_options,
                    success: function (data_return) {
                        //console.log(data_return)

                    }
                });
            }

        }
    }
}

$(document).on('click', '.act_qualify', function (e) {
    e.preventDefault();
    ref_campagne = $(this).data('ref_campagne');
    ref_fichier = $(this).data('ref_fichier');
    num_contact = $(this).data('num_contact');
    name_fichier = $(this).data('name_fichier');
    var flagMaxQualif = true;
    $.ajax({
        type: 'post',
        url: base_url_ajax + 'agent/agent/VerifqualifContactAjax',
        async: false,
        dataType: 'json',
        data: {
            ref_fichier: ref_fichier,
            name_fichier: name_fichier,
            num_contact: num_contact
        },
        success: function (response) {
            if (response.bloquer_qualification) {
                bootbox.confirm({
                    message: response.bloquer_qualification_msg,
                    callback: function (result) {
                        if (result) {
                            $('#ref_quick_qualif').html('<option></option>');
                            option_list_qualif = $.ajax({
                                url: base_url_ajax + "agent/agent/QuickQualif",
                                async: false,
                                type: "post", // 'get' or 'post', override for form's 'method'
                                data: 'ref_campagne=' + ref_campagne
                            }).responseText;
                            $('#ref_quick_qualif').append(option_list_qualif)
                            $('.bloc_man_prod').removeClass('hidden');
                            $('button.valider_man_prod').data('action', 'valider_quick_qualif');
                            $('.not_bloc_man_prod').addClass('hidden');
                            $('.default_prod').addClass('hidden');

                            $('#QualificationContactModal').modal('show');
                        }
                    },
                    buttons: {
                        confirm: {
                            label: 'Poursuivre',
                            className: 'blue'
                        },
                        cancel: {
                            label: 'Annuler',
                            className: 'default'
                        }
                    }
                });
            } else {
                $('#ref_quick_qualif').html('<option></option>');
                option_list_qualif = $.ajax({
                    url: base_url_ajax + "agent/agent/QuickQualif",
                    async: false,
                    type: "post", // 'get' or 'post', override for form's 'method'
                    data: 'ref_campagne=' + ref_campagne
                }).responseText;
                $('#ref_quick_qualif').append(option_list_qualif)
                $('.bloc_man_prod').removeClass('hidden');
                $('.not_bloc_man_prod').addClass('hidden');
                $('.default_prod').addClass('hidden');
                $('button.valider_man_prod').data('action', 'valider_quick_qualif');

                $('#QualificationContactModal').modal('show');
            }

        }
    })

})
var from_search = 0;
$(document).on('click', '.qualify_quick', function (e) {
    e.preventDefault();

    if ($('#ref_quick_qualif').val() == "") {
        show_msg_log(lbl_warning_select_qualification, 'warning');
        return false;
    }


    QualifierFiche($('#ref_quick_qualif').val(), '', '', '', '', '', '');

    $('#QualificationContactModal').modal('hide');


    //setTimeout(function(){ $("#CMK_GO_SEARCH").click(); }, 3000);
    $.ajax({
        url: base_url_ajax + "agent/agent/QuickQualifTraceRemonteFiche",
        type: "post",
        data: {
            'name_fichier': name_fichier,
            'num_contact': num_contact,
            'user': user
        }
    })
    return false;

})


function suivi_remonte(type) {

    if (is_reception == 1) return 'in';

    type = (is_rappel == 1) ? 'rappel_force' : type;
    type = (type == undefined) ? 'search' : type;
    type = (click_from == "journal") ? 'journal' : type;
    type = (click_from == "lost_call") ? 'lost_call' : type;
    type = (type == "contact_vierge") ? "contact_vierge" : type;
    return type;

}

var is_loadedjs = 0;

function CheckNbrQualif(data_return) {

    bloquer_qualification = data_return.bloquer_qualification;
}


// Télévente
var salesTableNouvelleCommande;
var salesTableListeCommande;
var salesTableListeCommandeAgent;

var emplacementLibelleArticle = "";
var emplacementPrixHt = "";
var emplacementTauxRemise = "";
var emplacementTauxTva = "";
var emplacementCodeArticle = "";

var emplacementReference = "";
var emplacementDescription = "";

var arrayDonneesCommandeDetail = [];

var globalNumeroCommande = "";
var globalNumerosCommandes = [];

var numeroCommandeModal = "";
var salesModalTableListeCommandeDetail = "";

var gloabal_televente_list_champ_a_afficher = "";
var global_televente_list_famille_campagne;
var global_televente_champs_raison_sociale = "";
var global_televente_valeur_raison_sociale = "";

var global_columns_name = [];
var global_id_famille = "";


//Chargement de la liste des commandes agents
$(document).on('show.bs.modal', '#modalSalesListeCommande', function (e) {
    salesTableListeCommandeAgent = $('#sales_table_liste_commande_agent').DataTable({
        "aLengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "bProcessing": false,
        "bDestroy": true,
        "bSort": false,
        paging: false,
        "aoColumnDefs": [

            { "sClass": "dt-body-right", "aTargets": [4, 5, 6, 7, 8, 9] },
            { "sClass": "dt-body-center", "aTargets": [3] }
            //You can also set 'sType' to 'numeric' and use the built in css.
        ]
    });

    $.ajax({
        type: 'POST',
        url: "agent/getListeCommande",
        data: {
            ref_agent: cmk_num_login
        },
        dataType: "json",
        success: function (data) {
            salesTableListeCommandeAgent.rows()
                .remove()
                .draw();

            if (data && data.length > 0) {
                var yDataTable = [];
                for (var i = 0; i < data.length; i++) {
                    yDataTable.push(data[i]["NumeroCommande"]);
                    yDataTable.push(data[i]["DateCommande"]);
                    yDataTable.push(data[i]["RaisonSociale"]);
                    yDataTable.push('<span class="label" style="background-color:' + data[i]["CodeCouleur"] + '">' + data[i]["LibelleStatutCommande"] + '</span>');
                    yDataTable.push(data[i]["BaseHorsTaxe"]);
                    yDataTable.push(data[i]["TotalRemise"]);
                    yDataTable.push(data[i]["TotalHorsTaxe"]);
                    yDataTable.push(data[i]["TotalTva"]);
                    yDataTable.push(data[i]["FraisPort"]);
                    yDataTable.push(data[i]["TotalTTC"]);
                    yDataTable.push('<a href="#televenteModalCommandeDetailAgent" data-numeroCommande="' + data[i]["NumeroCommande"] + '" data-toggle="modal" class="btn default btn-xs green" id="bTeleventeShowDetailCommande"><i class="fa fa-list"></i>Afficher</a>');
                    salesTableListeCommandeAgent.row.add(yDataTable).draw();
                    yDataTable = [];
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

});
//Fin

$(document).on('shown.bs.modal', '#televenteModalCommandeDetail', function (e) {
    if (numeroCommandeModal == "") {
        $('#televenteModalCommandeDetail').modal('toggle');
        return;
    }

    //Get info commande
    $.ajax({
        type: 'POST',
        url: "agent/getCommandeClient",
        data: {
            numeroCommande: numeroCommandeModal
        },
        dataType: "json",
        success: function (data) {
            if (data != null) {

                $('.classTeleventeModalNumeroCommande').html(data[0]['NumeroCommande']);
                $('.classTeleventeModalDateCommande').html(data[0]['DateCommande']);
                $('.classTeleventeModalStatut').html(data[0]['LibelleStatutCommande']);
                $('.classTeleventeModalTotalTTC').html(data[0]['TotalTTC']);
                $('.classTeleventeModalDateLivraison').html(data[0]['DateLivraison']);
                $('.classTeleventeModalFraisPort').html(data[0]['FraisPort']);

                $('.classTeleventeModalCodeClient').html(data[0]['CodeClient']);
                $('.classTeleventeModalNomClient').html(data[0]['RaisonSociale']);
                $('.classTeleventeModalEmailClient').html();
                $('.classTeleventeModalVilleClient').html();
                $('.classTeleventeModalNumeroClient').html();
                $('.classTeleventeModalAdresseClient').html();

                $('.classTeleventeModalBaseHorsTaxe').html(data[0]['BaseHorsTaxe']);
                $('.classTeleventeModalTotalRemise').html(data[0]['TotalRemise']);
                $('.classTeleventeModalTotalHorsTaxe').html(data[0]['TotalHorsTaxe']);
                $('.classTeleventeModalTotalTva').html(data[0]['TotalTva']);
                $('.classTeleventeModalTotalTTC').html(data[0]['TotalTTC']);

            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    //Get info commande Détail
    $.ajax({
        type: 'POST',
        url: "agent/getCommandeClientDetail",
        data: {
            numeroCommande: numeroCommandeModal
        },
        dataType: "json",
        success: function (data) {
            salesModalTableListeCommandeDetail.rows()
                .remove()
                .draw();

            if (data && data != null) {
                if (data.length > 0) {
                    var yDataTable = [];
                    for (var i = 0; i < data.length; i++) {
                        yDataTable.push(i + 1);
                        yDataTable.push(data[i]["NumeroCommande"]);
                        yDataTable.push(data[i]["LibelleArticle"]);
                        yDataTable.push(data[i]["Quantite"]);
                        yDataTable.push(data[i]["Prix"]);
                        yDataTable.push(data[i]["TauxRemise"]);
                        yDataTable.push(data[i]["TauxTVA"]);
                        salesModalTableListeCommandeDetail.row.add(yDataTable).draw();
                        yDataTable = [];
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

});


$(document).on('shown.bs.modal', '#televenteModalCommandeDetailAgent', function (e) {

    if (numeroCommandeModal == "") {
        $('#televenteModalCommandeDetail').modal('toggle');
        return;
    }

    var salesModalTableListeCommandeDetailAgent = $('#modalTaleventeTableCommandeDetailAgent').DataTable({
        "aLengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "bProcessing": false,
        "bDestroy": true,
        "bSort": false,
        paging: false,
        "aoColumnDefs": [

            { "sClass": "dt-body-right", "aTargets": [4, 5, 6] }
            //You can also set 'sType' to 'numeric' and use the built in css.
        ]
    });

    //Get info commande
    $.ajax({
        type: 'POST',
        url: "agent/getCommandeClient",
        data: {
            numeroCommande: numeroCommandeModal
        },
        dataType: "json",
        success: function (data) {
            if (data != null) {

                $('.classTeleventeModalNumeroCommande').html(data[0]['NumeroCommande']);
                $('.classTeleventeModalDateCommande').html(data[0]['DateCommande']);
                $('.classTeleventeModalStatut').html(data[0]['LibelleStatutCommande']);
                $('.classTeleventeModalTotalTTC').html(data[0]['TotalTTC']);
                $('.classTeleventeModalDateLivraison').html(data[0]['DateLivraison']);
                $('.classTeleventeModalFraisPort').html(data[0]['FraisPort']);

                $('.classTeleventeModalCodeClient').html(data[0]['CodeClient']);
                $('.classTeleventeModalNomClient').html(data[0]['RaisonSociale']);
                $('.classTeleventeModalEmailClient').html();
                $('.classTeleventeModalVilleClient').html();
                $('.classTeleventeModalNumeroClient').html();
                $('.classTeleventeModalAdresseClient').html();

                $('.classTeleventeModalBaseHorsTaxe').html(data[0]['BaseHorsTaxe']);
                $('.classTeleventeModalTotalRemise').html(data[0]['TotalRemise']);
                $('.classTeleventeModalTotalHorsTaxe').html(data[0]['TotalHorsTaxe']);
                $('.classTeleventeModalTotalTva').html(data[0]['TotalTva']);
                $('.classTeleventeModalTotalTTC').html(data[0]['TotalTTC']);

            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    //Get info commande Détail
    $.ajax({
        type: 'POST',
        url: "agent/getCommandeClientDetail",
        data: {
            numeroCommande: numeroCommandeModal
        },
        dataType: "json",
        success: function (data) {
            salesModalTableListeCommandeDetailAgent.rows()
                .remove()
                .draw();

            if (data && data != null) {
                if (data.length > 0) {
                    var yDataTable = [];
                    for (var i = 0; i < data.length; i++) {
                        yDataTable.push(i + 1);
                        yDataTable.push(data[i]["NumeroCommande"]);
                        yDataTable.push(data[i]["LibelleArticle"]);
                        yDataTable.push(data[i]["Quantite"]);
                        yDataTable.push(data[i]["Prix"]);
                        yDataTable.push(data[i]["TauxRemise"]);
                        yDataTable.push(data[i]["TauxTVA"]);
                        salesModalTableListeCommandeDetailAgent.row.add(yDataTable).draw();
                        yDataTable = [];
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

});

$(document).on('click', '#bTeleventeShowDetailCommande', function (e) {
    e.preventDefault();
    numeroCommandeModal = $(this).attr('data-numeroCommande');
});

function LoadModalDatatableCommandeDetail() {
    salesModalTableListeCommandeDetail = $('#modalTaleventeTableCommandeDetail').DataTable({
        "aLengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "bProcessing": false,
        "bDestroy": true,
        "bSort": false,
        paging: false,
        "aoColumnDefs": [

            { "sClass": "dt-body-right", "aTargets": [4, 5, 6] }
            //You can also set 'sType' to 'numeric' and use the built in css.
        ]
    });
}

$(document).on("change", '.classSalesListFamilleArticle', function (e) {
    var yValue = $(this).val();
    var ySearch = "";
    if (yValue != null) {
        //console.log(yValue);
        if (yValue.length == 1) {
            salesTableNouvelleCommande
                .column(parseInt(emplacementCodeArticle) + 1)
                .search($(this).val())
                .draw();
        } else if (yValue.length > 1) {
            ySearch = yValue.join('|');
            salesTableNouvelleCommande
                .column(parseInt(emplacementCodeArticle) + 1)
                .search(ySearch, true, false)
                .draw();
        }
    }
});

function LoadTableNouvelleCommande(list_champs, list_familles) {
    var columns = [];
    global_columns_name = [];
    $.each(list_champs, function (k, v) {
        if (v.Show == 1) {
            global_columns_name.push(v.LibelleChamp);
            var column = {
                data: v.LibelleChamp,
                title: v.LibelleChamp
            };
            columns.push(column);
        }
    });

    columns.push({
        "data": "CodeArticle",
        "title": "CodeArticle",
        "visible": false,
        "searchable": false
    });

    columns.push({
        "data": "IdFichier",
        "title": "IdFichier",
        "visible": false,
        "searchable": true
    });

    global_columns_name.push("CodeArticle");
    global_columns_name.push("IdFichier");


    $('#sales_table_nouvelle_commande').empty();
    salesTableNouvelleCommande = $('#sales_table_nouvelle_commande').DataTable({
        "aLengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "bProcessing": false,
        "bSort": false,
        "bDestroy": true,
        paging: true,
        "pageLength": 10,
        language: dataTablesLang,
        columns: columns
    });

    if (list_familles != null) {
        $('.classSalesListFamilleArticle').empty();

        global_id_famille = "";
        $.each(list_familles, function (k, v) {
            if (v.RefCampagne != null) {
                global_id_famille += v.IdFamilleArticle + ",";
                $('.classSalesListFamilleArticle').append($('<option>', {
                    value: v.IdFamilleArticle,
                    text: v.LibelleFamille
                }));
            }
        });

        $(".classSalesListFamilleArticle option").prop("selected", "selected");

        function format(state) {
            if (!state.id) return state.text; // optgroup
            return state.text;
        }

        $(".classSalesListFamilleArticle").select2({
            placeholder: "Choisissez",
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });

        $(".select2-selection--multiple").css("height", "34px");
        $(".select2-selection--multiple").css("overflow-y", "auto");

        global_id_famille = global_id_famille.substring(0, global_id_famille.length - 1);
    }
}

$(document).on('click', "#tablistsales", function (e) {
    e.preventDefault();
    if (!salesTableNouvelleCommande.data().count()) {
        LoadArticleByIdFamilleColumns(global_id_famille, global_columns_name);
    } else {
        $("#bSalesRemettreAZero").click();
    }
});

function LoadTableListeCommande() {
    salesTableListeCommande = $('#sales_table_liste_commande').DataTable({
        "aLengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "bProcessing": false,
        "bDestroy": true,
        "bSort": false,
        paging: false,
        "aoColumnDefs": [

            { "sClass": "dt-body-right", "aTargets": [4, 5, 6, 7, 8, 9] },
            { "sClass": "dt-body-center", "aTargets": [3] }
        ]
    });

    LoadDataTableListeCommande();
}

function LoadDataTableListeCommande() {
    $.ajax({
        type: 'POST',
        url: "agent/getListeCommandeByIdContact",
        data: {
            ref_client: num_contact
        },
        dataType: "json",
        success: function (data) {
            salesTableListeCommande.rows()
                .remove()
                .draw();

            if (data && data.length > 0) {
                var yDataTable = [];
                for (var i = 0; i < data.length; i++) {
                    yDataTable.push(data[i]["NumeroCommande"]);
                    yDataTable.push(data[i]["DateCommande"]);
                    yDataTable.push(data[i]["RaisonSociale"]);
                    yDataTable.push('<span class="label" style="background-color:' + data[i]["CodeCouleur"] + '">' + data[i]["LibelleStatutCommande"] + '</span>');
                    yDataTable.push(data[i]["BaseHorsTaxe"]);
                    yDataTable.push(data[i]["TotalRemise"]);
                    yDataTable.push(data[i]["TotalHorsTaxe"]);
                    yDataTable.push(data[i]["TotalTva"]);
                    yDataTable.push(data[i]["FraisPort"]);
                    yDataTable.push(data[i]["TotalTTC"]);
                    yDataTable.push('<a href="#televenteModalCommandeDetail" data-numeroCommande="' + data[i]["NumeroCommande"] + '" data-toggle="modal" class="btn default btn-xs green" id="bTeleventeShowDetailCommande"><i class="fa fa-list"></i>Afficher</a>');
                    salesTableListeCommande.row.add(yDataTable).draw();
                    yDataTable = [];
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function LoadArticleByIdFamilleColumns(idFamille, columnsArray) {
    emplacementLibelleArticle = columnsArray.indexOf('LibelleArticle');
    emplacementTauxRemise = columnsArray.indexOf('TauxRemise');
    emplacementTauxTva = columnsArray.indexOf('TauxTva');
    emplacementCodeArticle = columnsArray.indexOf('CodeArticle');
    emplacementPrixHt = columnsArray.indexOf('PrixHT');

    emplacementReference = columnsArray.indexOf('Reference');
    emplacementDescription = columnsArray.indexOf('Description');
    $.ajax({
        type: 'POST',
        url: "agent/listArticleNouvelleCommande",
        data: {
            idFamilles: idFamille
        },

        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data && data.length > 0) {
                salesTableNouvelleCommande.rows.add(data).draw();
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

$(document).on('change', '.salesSelectQuantite', function (e) {
    var yDataTable = salesTableNouvelleCommande.rows().data();
    var codeArticle = $(this).attr('data-idarticle');
    var libelleArticle;
    var quantite = this.value;
    var prix = 0;
    var tauxRemise = 0;
    var tauxTva = 0;

    for (var i = 0; i < yDataTable.length; i++) {
        if (yDataTable[i].CodeArticle == codeArticle) {
            libelleArticle = yDataTable[i].LibelleArticle;
            prix = yDataTable[i].PrixHT;
            tauxRemise = yDataTable[i].TauxRemise;
            tauxTva = yDataTable[i].TauxTVA;
        }
    }

    var donnees = {
        IdCommande: "",
        NumeroCommande: "",
        CodeArticle: "",
        LibelleArticle: "",
        Quantite: "",
        Prix: "",
        TauxRemise: "",
        TauxTVA: "",
        Description: ""
    };

    donnees = {
        IdCommande: "",
        NumeroCommande: "",
        CodeArticle: codeArticle,
        LibelleArticle: libelleArticle,
        Quantite: quantite,
        Prix: prix,
        TauxRemise: tauxRemise,
        TauxTVA: tauxTva,
        Description: ""
    };

    if (quantite > 0) {
        deleteArticleFromCommandeDetail(codeArticle);
        saveArticleToCommandeDetail(donnees);
    } else {
        deleteArticleFromCommandeDetail(codeArticle);
    }

    calculSales(arrayDonneesCommandeDetail);
});

function saveArticleToCommandeDetail(data) {
    arrayDonneesCommandeDetail.push(data);
}

function deleteArticleFromCommandeDetail(codeArticle) {
    arrayDonneesCommandeDetail = arrayDonneesCommandeDetail.filter(function (el) {
        return el.CodeArticle !== codeArticle;
    });
}

$(document).on('click', '#bSalesRemettreAZero', function (e) {
    e.preventDefault();
    arrayDonneesCommandeDetail = [];
    $('.salesSelectQuantite').val(0);
    calculSales(arrayDonneesCommandeDetail);
    $('.CMK_S_DATE_LIVRAISON').datepicker('setDate', null);
    $('#totalTTCRes').html(0);
    $('#totalTVARes').html(0);
    $('#totalremiseRes').html(0);
    $('#basehtRes').html(0);
    $(".classSalesListFamilleArticle > option").prop("selected", "selected");
    $(".classSalesListFamilleArticle").trigger("change");

});

$(document).on('click', '#bSaveSalesCommande', function (e) {
    e.preventDefault();
    var dateTime = new Date($('.CMK_S_DATE_LIVRAISON').datepicker("getDate"));
    var yDateLivraison = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
    var baseHorsTaxe = parseFloat($('#basehtRes').contents().text());
    var totalRemise = parseFloat($('#totalremiseRes').contents().text());
    var totalHorsTaxe = parseFloat(baseHorsTaxe - totalRemise)
    var totalTVA = parseFloat($('#totalTVARes').contents().text());
    var totalTTC = parseFloat($('#totalTTCRes').contents().text());
    var fraisPort = parseFloat($('#sales_montant_frais_port_pour_ajout').val());
    var refFichier = ref_fichier;
    var codeClient = num_contact;
    var raisonSociale = (global_televente_valeur_raison_sociale == "" ? name_contact : global_televente_valeur_raison_sociale);
    var codeUtilisateur = cmk_num_login;
    var num_obs_c = "";
    var idStatutCommande = $('#sales_statut_nouvelle_commande').val();

    if (yDateLivraison == null) {
        //toastr.warning('La date de livraison est ', "Notification");
        //return;

        yDateLivraison = moment().add(3, 'days').format('YYYY-MM-DD');
    }

    if (yDateLivraison == "1970-1-1") {
        //toastr.warning('Merci de saisir la date de livraison', "Notification");
        //return;
        yDateLivraison = moment().add(3, 'days').format('YYYY-MM-DD');
    }

    if (arrayDonneesCommandeDetail.length == 0) {
        toastr.warning('Merci de sélectionner au moins un produit!', "Notification");
        return;
    }

    var yFraisPort = parseFloat($('#sales_montant_frais_port').val());
    if (parseFloat(totalTTC) >= parseFloat(yFraisPort)) {
        fraisPort = 0;
    }

    $.ajax({
        type: 'POST',
        url: "agent/saveCommandeClient",
        data: {
            dateLivraison: yDateLivraison,
            ref_campagne: ref_campagne,
            refFichier: refFichier,
            codeClient: codeClient,
            raisonSociale: raisonSociale,
            baseHorsTaxe: baseHorsTaxe,
            totalRemise: totalRemise,
            totalHorsTaxe: totalHorsTaxe,
            totalTVA: totalTVA,
            totalTTC: totalTTC,
            codeUtilisateur: codeUtilisateur,
            idStatutCommande: idStatutCommande,
            num_obs_c: num_obs_c,
            fraisPort: fraisPort,
            name_fichier: name_fichier
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data == "erreurtemplate") {
                toastr.error('Merci de demander à un superviseur de configurer la template des numéros commande!', "Notification");
            } else if (data == "deppassement") {
                toastr.warning('Erreur numéro commande!', "Notification");
            } else {
                var yNumeroCommande = data;
                globalNumeroCommande = yNumeroCommande;
                globalNumerosCommandes.push(globalNumeroCommande);
                if (yNumeroCommande != "") {
                    for (i = 0; i < arrayDonneesCommandeDetail.length; i++) {
                        $.ajax({
                            type: 'POST',
                            url: 'agent/saveCommandeClientDetail',
                            async: false,
                            data: {
                                numeroCommande: yNumeroCommande,
                                codeArticle: arrayDonneesCommandeDetail[i]["CodeArticle"],
                                libelleArticle: arrayDonneesCommandeDetail[i]["LibelleArticle"],
                                quantite: arrayDonneesCommandeDetail[i]["Quantite"],
                                prix: arrayDonneesCommandeDetail[i]["Prix"],
                                tauxRemise: arrayDonneesCommandeDetail[i]["TauxRemise"],
                                tauxTVA: arrayDonneesCommandeDetail[i]["TauxTVA"],
                                description: arrayDonneesCommandeDetail[i]["Description"]
                            },
                            dataType: "json",
                            success: function (data) {
                                //console.log(data);
                            },
                            error: function () {
                                console.log("bad save commande detail");
                            }
                        });
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    toastr.success('Commande sauvegardé avec succès', "Notification");
    setTimeout(function () {
        //LoadDataTableListeCommande();
        $('#bSalesRemettreAZero').click();
    }, 100);
});

//function de la calcul des tva, ht, ttc
function calculSales(detailCommande) {
    var yFraisPort = parseFloat($('#sales_montant_frais_port').val());
    var yFraisPortMontant = parseFloat($('#sales_montant_frais_port_pour_ajout').val());

    var baseHorsTaxe = 0;
    var totalRemise = 0;
    var totalTVA = 0;
    var totalTTC = 0;

    //parcourir de la tableau et faire le calcul
    for (var iter = 0; iter < detailCommande.length; iter++) {
        if (parseFloat(detailCommande[iter]["Quantite"]) != 0) {
            var ybaseHorsTaxe = (parseFloat(detailCommande[iter]["Quantite"]) * parseFloat(detailCommande[iter]["Prix"])).toPrecision(5);
            var ytotalRemise = ((parseFloat(ybaseHorsTaxe) * parseFloat(detailCommande[iter]["TauxRemise"])) / 100).toPrecision(5);
            var ytotalTVA = (((parseFloat(ybaseHorsTaxe) - parseFloat(ytotalRemise)) * parseFloat(detailCommande[iter]["TauxTVA"])) / 100).toPrecision(5);
            var ytotalTTC = (parseFloat(ybaseHorsTaxe) - parseFloat(ytotalRemise) + parseFloat(ytotalTVA));


            baseHorsTaxe = parseFloat(baseHorsTaxe) + parseFloat(ybaseHorsTaxe);
            totalRemise = parseFloat(totalRemise) + parseFloat(ytotalRemise);
            totalTVA = parseFloat(totalTVA) + parseFloat(ytotalTVA);
            totalTTC = parseFloat(totalTTC) + parseFloat(ytotalTTC);

        }
    }

    $('#basehtRes').html(baseHorsTaxe.toFixed(2));
    $('#totalremiseRes').html(totalRemise.toFixed(2));
    $('#totalhtRes').html((baseHorsTaxe - totalRemise).toFixed(2));
    $('#totalTVARes').html(totalTVA.toFixed(2));

    if (parseFloat(totalTTC) >= parseFloat(yFraisPort)) {
        $('#totalTTCRes').html(totalTTC.toFixed(2));
    } else {
        $('#totalTTCRes').html((parseFloat(totalTTC) + parseFloat(yFraisPortMontant)).toFixed(2));
    }
}

$(document).on('click', '.classTabClickSales', function (e) {
    e.preventDefault();
    if ($(this).attr("data-type") == "list-commande") {
        LoadTableListeCommande();
    }
});

// END Télévente

function SuccessPlay() {
    CMK_CONTACT_INFO_SHOWN_COMPLETE = 0;
    CMK_FILE_INFO_SHOWN_COMPLETE = 0;
    CMK_WBEPHONE_GO_BACK_MENU = true;
    //Si la remontée est depuis le proédictif ou le i-progressif et qu'on utilise le webphone, on attend le webphone pour afficher les information contact
    var type_de_la_remontee = suivi_remonte(type_global_prod);
    if (is_web_phone && ((type_de_la_remontee == "prd") || (type_de_la_remontee == "inprd") || (type_de_la_remontee == "ppp") || (type_de_la_remontee == "inppp"))) {
        cmk_wainting_for_webphone_to_show_contact = true;
        setTimeout(function () {
            if (cmk_wainting_for_webphone_to_show_contact) {
                cmk_wainting_for_webphone_to_show_contact = false;
                play();
            }
        }, 6000);
    } else if (is_web_phone && type_de_la_remontee == 'in') {
        setTimeout(continueSuccessPlay,500);
    } else {
        continueSuccessPlay();
    }
}

function continueSuccessPlay() {
    PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = 0;
    cmk_wainting_for_webphone_to_show_contact = false;
    $('#tel_prefered_cmk').html('')
    userCurrentState = 'SUCCESSPLAY';
    varWatchState = userCurrentState;
    setUserTraitementNJS();
    //setCrmWidgetsValuesProd();
    forceOut = 0;
    DoNotShowCallQueue = false;

    is_callblending = 0;


    $('.show_in_menu').addClass("hidden");
    $('#Phonning').removeClass('active in');
    $('#agendapartager').removeClass('active in');
    $('#livechat').removeClass('active in');
    $('#listweb').removeClass('active in');
    $('#objection').removeClass('active in');
    $('#livechat').removeClass('active in');
    $('.facebooktabs').removeClass('active in');
    $('#ModalLostCall').modal('hide');


    if (type_global_prod == "man") {
        $('.bloc_man_prod').removeClass('hidden');
        $('button.valider_man_prod').data('action', 'valider_man_prod')
        $('.default_prod').addClass('hidden');
    } else {
        $('.bloc_man_prod').addClass('hidden');
        $('.default_prod').removeClass('hidden');
    }


    if (type_appel == "transfert") {
        show_msg_log("<b>" + info_transfert_appel + "</b>", 'info');
    }

    $('#transfer_alert_div').html("");

    set_previous_active = "";
    current_ecran = "";
    num_qualification = "";
    cmk_input_type_rappel_final = 0;
    type_qualifcation = 0;
    argumente = 0;
    mail_global = 0;
    min_date = moment().add(1, 'days').calendar();
    max_date = moment().add(365, 'days').calendar();
    curent_parent = null;
    form_id = '';
    previous = "";
    $('#content_ecran_conf').html('');

    $('#ModalContactsSearch').modal('hide');

    window.sessionStorage['name_fichier'] = "";
    window.sessionStorage['num_contact'] = "";
    window.sessionStorage['ref_fichier'] = "";
    window.sessionStorage['ref_campagne'] = "";
    window.sessionStorage['id_last_remonte'] = "";

    window.sessionStorage['name_fichier'] = name_fichier;
    window.sessionStorage['num_contact'] = num_contact;
    window.sessionStorage['ref_fichier'] = ref_fichier;
    window.sessionStorage['ref_campagne'] = ref_campagne;


    killTimers();

    GetEcranInitial = "";

    //clearInterval(CHECKDEBRIEF_VAR_INTERVAL);
    CHECKDEBRIEF_VAR_INTERVAL = "";
    //$('.send_mail').show();
    $('.send_fax').show();
    $('.send_sms').show();
    $('.sep_multi_canal').show();

    if ($('#defaultCountdown').hasClass('is-countdown')) {
        $('#defaultCountdown').countdown('destroy');
        $.backstretch("destroy");
    }
    /* 3al 7it aziz else{
        //si aucune attent mettre cmk_date_debut == cmk_date_debut_init
        cmk_date_debut = cmk_date_debut_init;
    }*/

    var transfert = (type_appel == "transfert") ? 1 : 0;
    typeR = (type_global_prod != "contact_dupliquer") ? suivi_remonte(type_global_prod) : 'contact_dupliquer';
    $('#type_remonte').val(typeR);

    /* $("#myTabProd").sticky({topSpacing:78});
     $('.myTabProd').offset({"top":$('#google-auth').offset().top});
     $("html, body").animate({ scrollTop: $('.myTabProd').offset().top }, {
         duration : 2000,
         step : sticky_relocate
     });*/

    var my_time1 = new Date(); // date object 
    my_time1 = my_time1.getTime(); // first time variable

    var xhrSuccessPlay = $.ajax({
        url: "agent/SuccessPlay",
        type: 'post',
        global: false,
        dataType: 'json',
        data: {
            user: user,
            ref_campagne: ref_campagne,
            ref_fichier: ref_fichier,
            name_fichier: name_fichier,
            num_contact: num_contact,
            poste: poste,
            idcurrentrecept: idcurrentrecept,
            forceIntercept: forceIntercept ? 1 : 0,
            nom_login: nom_login,
            cmk_groupe_comptence: cmk_groupe_comptence,
            type: 'PRODUCTION',
            new_file: new_file,
            cmk_groupe_comptence: cmk_groupe_comptence,
            sales: sales,
            transfert: transfert,
            is_reception: is_reception,
            typeR: typeR
        },
        async: false,
        success: function (data_result) {
            if (data_result.session_lost == 1) {
                window.location.href = base_url_ajax+"login/Deconnect";
                return false;
            }
            click_from = "";
            allow_time_slot = data_result.allow_time_slot;
            $("#tab_prospect_information > a").tab("show");
            if (allow_manage_timeslots == 1 && allow_time_slot == 1) {
                $("#li_planning_prospect").removeClass("hidden");
            } else {
                $("#li_planning_prospect").addClass("hidden");
            }


            $("#ctPlanningForm").find('.editable-click').editable('option', 'pk', name_fichier + '||' + num_contact);
            if (type_global_prod == 'prd' || type_global_prod == 'ppp') notifyUserFiche();


            launchafter = data_result.launchafter;

            /*if (launchafter != 0) {
                PREDICTIF_VAR_TIMEOUT = setTimeout(
                    function () {
                        callAfterDMAMAX(0);
                    }, launchafter * 1000);
            }*/





            counterPREDICTIF_VAR_TIMEOUT = 0;

            if (launchafter != 0) {
                PREDICTIF_VAR_TIMEOUT = setInterval(function () {
                    callAfterDMAMAX(0);
                    counterPREDICTIF_VAR_TIMEOUT++;
                    //console.log("Counter is: " + counter);

                    if (counterPREDICTIF_VAR_TIMEOUT >= 3) {
                        clearInterval(PREDICTIF_VAR_TIMEOUT);
                    }

                }, launchafter * 1000);
            }


            idcurrentrecept = "";
            forceIntercept = false;
            current_grp_conf_telecom = data_result.conf_telecom;
            // if(cmk_date_debut=="") cmk_date_debut = data_result.GetDateDebutIntial;

            //Fix bug date de remonté de fiche
            ///if (type_global_prod!="man" && !(is_callblending==1 && type_global_prod=="inprev" && is_reception!=1) && !(is_callblending==1 && type_global_prod=="inout" && is_reception!=1) && type_global_prod!="out" && type_global_prod!="prev" || (typeR=="journal" || typeR=="search")  ) {
            if (type_global_prod == "prd" || type_global_prod == "inprd" || type_global_prod == "ppp" || type_global_prod == "inppp" || type_global_prod == "in" || (type_global_prod == "inout" && is_callblending == 1 && !is_reception == 1) || type_global_prod == "recup" || typeR == "journal" || typeR == "search" || typeR == "rappel_force" || typeR == "rappel" || typeR == "contact_vierge") {
                cmk_date_debut = data_result.GetDateDebutIntial;
            } else {
                cmk_date_debut = cmk_date_debut_init;
            }
            /* alert(type_global_prod);
             alert(cmk_date_debut);
             alert(cmk_date_debut_init);
 */

            var htmlFooter = '';


            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_no_argumente + '</strong> ' + data_result.CrmWidgetsValues.nbrNoArgumente + '</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_argumente + '</strong> ' + data_result.CrmWidgetsValues.nbrArgumente + ' (' + data_result.CrmWidgetsValues.prctArgumente + '%)</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_positif + '</strong> ' + data_result.CrmWidgetsValues.nbrPositif + ' (' + data_result.CrmWidgetsValues.prctPositif + '%)</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_rappel + '</strong> ' + data_result.CrmWidgetsValues.nbrRappel + '</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_fiches + '</strong> ' + data_result.CrmWidgetsValues.total + '</div></div></div>';
            $("#footer-widgets").html(htmlFooter);
            $("#testDiv").html(htmlFooter);
            if (data_result.CrmWidgetsValues['objectifResult'] && data_result.CrmWidgetsValues['objectifResult'] == "show_message" && data_result.CrmWidgetsValues['objectifMessage'] && data_result.CrmWidgetsValues['objectifMessage'] != '') {
                //toastr.success(data_result.CrmWidgetsValues['objectifMessage']);
                $.scojs_message(data_result.CrmWidgetsValues['objectifMessage'], 2);
            }
            LoadDataLisedfichier_joint(data_result.Listfichier_joint, data_result.TimeLineFichierJoint);

            ListInterfaceAgent = data_result.ListInterfaceAgent

            $.each(ListInterfaceAgent.data, function (key, value) {
                stats = value.stats.toString();
                search_contact = value.search_contact.toString();
                fiche_vierge = value.fiche_vierge.toString();
                recordings = value.recordings.toString();
                appel_manuel = value.appel_manuel.toString();
                exit_debrief = value.exit_debrief;
                duplictc = value.duplictc;

            });

            if (stats == 1)
                $('#li_stats').removeClass('hidden');
            else
                $('#li_stats').addClass('hidden');
            if (search_contact == 1)
                $('#li_search_contact').removeClass('hidden')
            else
                $('#li_search_contact').addClass('hidden');
            if (fiche_vierge == 1)
                $('#li_fiche_vierge').removeClass('hidden')
            else
                $('#li_fiche_vierge').addClass('hidden');
            if (recordings == 1)
                $('#li_recordings').removeClass('hidden')
            else
                $('#li_recordings').addClass('hidden');
            if (appel_manuel == 1) {
                $('#li_appel_manuel').removeClass('hidden');
                $('#cmk_originate_manuel_shortcut').removeClass('hidden');
            } else {
                $('#li_appel_manuel').addClass('hidden');
                $('#cmk_originate_manuel_shortcut').addClass('hidden')
            }

            if (exit_debrief == 1)
                $('.exitdebrief').removeClass('hidden');
            else
                $('.exitdebrief').addClass('hidden');

            window.sessionStorage['id_last_remonte'] = data_result.TypeRemonteFiche;
            GetProspoectInfo = data_result.GetProspoectInfo;
            GetHistoContact = data_result.GetHistoContact;
            loadinfoprospect(GetProspoectInfo, GetHistoContact);


            GetOrderTabs = data_result.GetOrderTabs;
            order_tabs(GetOrderTabs);
            $('.in_prospect_btn').show();
            loadinterface(data_result.loadInterface)

            if (data_result.isVerrouContact != '0' && type_global_prod != "man") {
                $('.retour_menu_principale').show();
            }

            GetListWeb = data_result.GetListWeb;
            web(GetListWeb);

            GetCountCommercialFichier = data_result.GetCountCommercialFichier;
            display_agenda(GetCountCommercialFichier);

            VerifqualifContact = data_result.VerifqualifContact;
            CheckNbrQualif(VerifqualifContact);



            //Load_form_element(data_result.GetEcranInitial, ref_campagne, ref_fichier, name_fichier, num_contact, user);//Modification Sofiene 2019/05/30
            GetEcranInitial = data_result.GetEcranInitial;//Modification Sofiene 2019/05/30
            data_traduction = JSON.parse(data_result.data_traduction);//Recuperer la config et la traduction du fichier
            $('.selectorLangTraduction').addClass('hidden').removeClass('display-inline');
            data_lang = JSON.parse(data_result.data_lang);//Recuperer la config et la traduction du fichier
            window.localStorage.removeItem('default.lang.script.traduction');
            window.localStorage.removeItem('global.lang.script.traduction');
            if (data_lang.length > 0) {

                var setDefaultTraduction = [];
                var setDefaultLanguageScript = 0;
                var htmlLangTraduction = "";
                var countDefaultLang = 0;
                var master_script_option = '<option value="0">MASTER_SCRIPT</option>'
                $.each(data_lang, function (i, item) {
                    //var resultFind = data_traduction.find(itemTrad => itemTrad.id_cmk_traduction_lang_script === item.id_cmk_lang_script);

                    var resultFind = $.grep(data_traduction, function (e) { return e.ref_id_cmk_lang_script == item.id_cmk_lang_script; });
                    if (resultFind.length !== 0) {
                        if (item.is_default == 1) {
                            countDefaultLang++;
                            setDefaultLanguageScript = item.id_cmk_lang_script;
                            window.localStorage.setItem('default.lang.script', item.id_cmk_lang_script);
                        }

                        htmlLangTraduction += '<option value="' + item.id_cmk_lang_script + '">' + item.label_lang + '</option>'
                    }

                })


                if (countDefaultLang == 0) {
                    htmlLangTraduction = master_script_option + htmlLangTraduction;
                    if (!window.localStorage.getItem('default.lang.script')) window.localStorage.setItem('default.lang.script', 0);
                }
                setDefaultLanguageScript = window.localStorage.getItem('default.lang.script');
                if (htmlLangTraduction != "" && setDefaultLanguageScript != null) {
                    $('.selectorLangTraduction').removeClass('hidden').addClass('display-inline');
                    $('.selectorLangTraduction').html(htmlLangTraduction);

                    if (setDefaultLanguageScript != 0) {

                        j = 0;
                        $.each(data_traduction, function (i, item) {
                            if (item.ref_id_cmk_lang_script == setDefaultLanguageScript) {
                                setDefaultTraduction[j] = item;
                                j++
                            }
                        })

                    }
                }



                $('.selectorLangTraduction').val(window.localStorage.getItem('default.lang.script'));
                window.localStorage.setItem('default.lang.script.traduction', LZString.compress(JSON.stringify(setDefaultTraduction)));
                window.localStorage.setItem('global.lang.script.traduction', LZString.compress(JSON.stringify(data_traduction)));

                //Dev spécifique gallup
                if (data_result.sessionStorageData && typeof data_result.sessionStorageData == 'object') {
                    $.each(data_result.sessionStorageData, function (storageKey, storageValue) {
                        window.localStorage.removeItem(storageKey);
                        window.localStorage.setItem(storageKey, (typeof storageValue == 'object' ? LZString.compress(JSON.stringify(storageValue)) : LZString.compress(storageValue)));
                    });
                }
            }




            GetObjection = data_result.GetObjection;
            GetBasedeconnaissance = data_result.GetBasedeconnaissance;
            $('#print_pdf').hide();
            getFichesByGrp = data_result.getFichesByGrp;
            var html_print = '';
            $.each(getFichesByGrp, function (k, val) {
                $.each(val.fiches, function (j, fiche) {
                    html_print += '<li><a  class="fiche_print log_action" data-ficheid="' + fiche.id + '" data-log-action="generer_pdf" data-log-ref_fichier="' + fiche.id + '">' + fiche.nom + '</a></li>';
                });
                $.each(val.fiches_rdv, function (j, fiche_rdv) {
                    html_print += '<li><a  data-ficheid="' + fiche_rdv.id + '"" class="ficheoff_print">' + fiche_rdv.nom + '</a></li>';
                });
                html_print += '</ul></li>'
            });
            if (html_print != "") {

                $(".print_pdf").html(html_print);
                $('#print_pdf').show();

            }
            $('.objection-container').html('');

            if (GetObjection == "0" || GetObjection.length == 0) {
                $('#li_objection').hide();
            } else {
                $('#li_objection').show();
                $.each(GetObjection, function (index, value) {
                    var html = template_content_objection(value);
                    $('.objection-container').append(html);
                });
            }
            $('.basedeconnaissance-container').html('');


            if (GetBasedeconnaissance == "0" || GetBasedeconnaissance.length == 0 || bdcon_read == 0) {
                $('#li_basedeconnaissance').addClass('hidden');

            } else {
                $('#li_basedeconnaissance').removeClass('hidden');

                $.each(GetBasedeconnaissance, function (index, value) {
                    var html = template_content_basedeconnaissance(value);
                    $('.basedeconnaissance-container').append(html);
                });
            }


            if (bdcon_add == 1)
                $('.process_bdcon_add').removeClass('hidden');
            else
                $('.process_bdcon_add').addClass('hidden');


            if (bdcon_edit == 1)
                $('.process_bdcon_edit').removeClass('hidden');
            else
                $('.process_bdcon_edit').addClass('hidden');

            if (bdcon_delete == "1")
                $('.delete_bdcon').removeClass('hidden');
            else
                $('.delete_bdcon').addClass('hidden');
            $('.valider_fiche,.valider_man_prod').attr('disabled', false)
            IsQualiteSon(data_result.IsQualiteSon);
            IsRgpd(data_result.IsRgpd);


            getAutoselectMod = data_result.getAutoselectMod;
            autoselectcomm = getAutoselectMod.autoselectcomm;
            autoselectmode = getAutoselectMod.autoselectmode;

            data_info_fichier = data_result.info_groupe;

            if (data_info_fichier != "") {

                if (data_info_fichier['type_groupe'] == "out" && data_info_fichier['mode_auto_num'] == "1") {
                    $('.mode_auto_num').removeClass('hidden');
                } else {
                    $('.mode_auto_num').addClass('hidden');
                }
            }

            //Télévente
            var yMontantFraisPort = "";
            if (data_result.televente_frais_port_montant != null) {
                $('#sales_montant_frais_port_pour_ajout').val(data_result.televente_frais_port_montant[0]["Montant"]);
                yMontantFraisPort = data_result.televente_frais_port_montant[0]["Montant"];


                $('.CMK_S_DATE_LIVRAISON').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    autoclose: true
                });
            }

            if (data_result.televente_frais_port != null) {
                $('#sales_montant_frais_port').val(data_result.televente_frais_port[0]["Montant"]);
                $('.lSalesFraisPort').html("<center>Montant à partir duquel le frais de port est gratuit (<b>" + data_result.televente_frais_port[0]["Montant"] + "</b>) <br/> Frais de port : " + yMontantFraisPort + "</center>")
            }

            if (data_result.televente_list_champ_a_afficher != null) {
                var yColumns = "";
                var yNbreLigne = 0;
                for (var i = 0; i < data_result.televente_list_champ_a_afficher.length; i++) {
                    if (data_result.televente_list_champ_a_afficher[i]["Show"] == 1) {
                        yNbreLigne++;

                        var yLibelle = "";
                        if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "LibelleArticle") {
                            yLibelle = "Libellé d'article";
                            yColumns += data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] + ",";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "Reference") {
                            yLibelle = "Référence";
                            yColumns += data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] + ",";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "Quantite") {
                            yLibelle = "Quantité";
                            yColumns += data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] + ",";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "PrixHT") {
                            yLibelle = "Prix HT";
                            yColumns += "Prix,";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "TauxTVA") {
                            yLibelle = "Taux TVA";
                            yColumns += "TauxTva,";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "TauxRemise") {
                            yLibelle = "Taux Remise";
                            yColumns += data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] + ",";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "PrixTTC") {
                            yLibelle = "Prix TTC";
                            yColumns += "0 AS PrixTTC,";
                        } else if (data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] == "Description") {
                            yLibelle = "Description article";
                            yColumns += "DescriptionArticle,";
                        } else {
                            yLibelle = data_result.televente_list_champ_a_afficher[i]["LibelleChamp"];
                            yColumns += data_result.televente_list_champ_a_afficher[i]["LibelleChamp"] + ",";
                        }
                        $('#sales_table_nouvelle_commande_tr').append(' <th>' + yLibelle + '</th>');
                    }
                }

                yColumns += "CodeArticle,IdFichier";
                //console.log(yColumns);
                global_televente_champs_raison_sociale = data_result.televente_champs_raison_sociale.LibelleChamp;
                $('#sales_table_nouvelle_commande_tr').append(' <th>Code Article </th><th>idFamille </th>');

                gloabal_televente_list_champ_a_afficher = data_result.televente_list_champ_a_afficher;
                global_televente_list_famille_campagne = data_result.televente_list_famille_campagne;
                LoadTableNouvelleCommande(gloabal_televente_list_champ_a_afficher, global_televente_list_famille_campagne);
                //LoadTableNouvelleCommande(data_result.televente_list_champ_a_afficher, data_result.televente_list_famille_campagne);
                //LoadTableListeCommande();
                LoadModalDatatableCommandeDetail();





            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR gg", jqXHR);
            console.log("textStatus", textStatus);
            console.log("errorThrown", errorThrown);
            //show_error_modal(null,jqXHR, textStatus, errorThrown);
            show_error_modal(jqXHR, errorThrown, this.url, this.data);
        }
    });
    if (cmk_activate_check_connection) {
        if (xhrSuccessPlay.readyState == 0) {

            Offline.check();
            //show_msg_log('Un souci de connexion est détecté','warning');
            return false
        }
        var my_time2 = new Date(); // date object
        show_msg_cnx_lente(my_time1, my_time2);

    }


    is_onattente = 0;

    // is_callblending = 0;
    $('#production_tabs').show();
    //$('.in_prospect_btn').show();
    $('.dashboard_panel').hide();
    $("#form_editor").show();
    $('.bloc_attente').hide();
    $("#accordion1").show();
    p = $('.icon-call-out');
    var position = p.position();


    rdv_data = false;
    rdv_start_date = false;
    $("#rdvDiv").hide();
    $("#calendar").show();
    //$.getScript(base_url_cmk + "/js/agent/scripteur.js");
    ctc_contact_list();


    //


    is_loadedjs = 1;


    $('.cdashboard').addClass('in_prod_mode');
    if (is_rappel == 1) {
        InitRappel();
    }

    //$('#print_pdf').hide();
    /************************* aziz modif checkficherecpet****/

    //    KillTimersRECEPT();
    if (cmk_callblending == 1) {


        LOAD_QUEUES_ONLY = true;
        checkFicheRecept();
        //console.log('CHECKBBB SuccessPlay');
        //CHECKRECEPT_VAR_INTERVAL_SP = setInterval(checkFicheRecept, 5000);
        //addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_SP);


    }

    //Modification Sofiene 2019/05/30
    setTimeout(function () {
        Load_form_element(GetEcranInitial, ref_campagne, ref_fichier, name_fichier, num_contact, user);
        if (window.localStorage.getItem('default.lang.script') != 0 || window.localStorage.getItem('default.lang.script')!=null) {
           if(window.localStorage.getItem('default.lang.script.traduction')!=null){
                var defaultTraduction = JSON.parse(LZString.decompress(window.localStorage.getItem('default.lang.script.traduction')));

                $.each(defaultTraduction, function (i, item) {
                    if (item.ref_element_option_id == 0) {
                        $('[data-class="traduction-' + item.ref_form_id + '-' + item.ref_element_id + '"]').html(item.label_text)
                    } else {
                        $('[data-class="traduction-' + item.ref_form_id + '-' + item.ref_element_id + '-' + item.ref_element_option_id + '"]').html(item.label_text)
                    }
                });
           }
            
        }


    }, 200);

    CMK_CONTACT_INFO_SHOWN_COMPLETE = num_contact;
    CMK_FILE_INFO_SHOWN_COMPLETE = ref_fichier;

    return false;
}

$(document).on('click', "#print_pdf", function (event) {
    event.stopPropagation();
})
$(document).on('click', '.fiche_print', function (event) {

    id_fiche = $(this).data('ficheid');
    $("#result_fiche_pdf").empty();
    $('#fiche_print_pdf').modal('hide');

    $.getJSON(base_url_ajax + 'gestioncontacts/gestioncontacts/dumpfiche/' + id_fiche + '/' + ref_campagne + '/' + ref_fichier + '/' + name_fichier + '/' + num_contact + '/pdf/print', function (data) {

        $("#result_fiche_pdf_button").attr('href', data.link);
        $('#result_save_to_piece_jointe').data('save_link', data.link_save);
        $("#result_fiche_pdf").html(data.object);
        $('#fiche_print_pdf').modal('show');
        event.stopPropagation();

    });


    /*
     $( "#result_fiche_pdf" ).load( base_url_ajax+'gestioncontacts/gestioncontacts/dumpfiche/'+id_fiche+'/'+ref_campagne+'/'+ref_fichier+'/'+name_fichier+'/'+num_contact+'/pdf/print',function() {
     printDocument('pdfDocument');
     });
     */

});

$(document).on('click', '.ficheoff_print', function () {


    id_fiche = $(this).data('ficheid');
    $("#result_fiche_pdf").empty();

    $('#fiche_print_pdf').modal('hide');
    $.getJSON(base_url_ajax + 'gestioncontacts/gestioncontacts/dumpficheoff/' + id_fiche + '/' + ref_campagne + '/' + ref_fichier + '/' + name_fichier + '/' + num_contact + '/pdf/print', function (data) {

        $("#result_fiche_pdf_button").attr('href', data.link);
        $('#result_save_to_piece_jointe').data('save_link', data.link_save);

        $("#result_fiche_pdf").html(data.object);
        $('#fiche_print_pdf').modal('show');

    });


});

function InitRappel() {
    //console.log('Init Rappel');
    jQuery.ajax({
        type: 'POST', // Le type de ma requete
        url: 'agent/InitRappel',
        global: false,
        data: "name_fichier=" + name_fichier + "&num_contact=" + num_contact,
        async: false
    });
}

function resetUserQueue() {
    $.ajax({
        global: false,
        url: base_url_ajax + "agent/agent/resetUserQueue",
        type: "POST",
        data: 'user=' + user + '&poste=' + poste + "&cmk_groupe_comptence="
            + cmk_groupe_comptence + "&ref_campagne=" + ref_campagne + "&is_recept=1"
            + "&ref_fichier=" + ref_fichier,
    })
}

function GoAttenteRecept() {

    $('#defaultCountdown').countdown({
        since: 0,
        format: 'HMS'
    });

    $.backstretch([base_url_th + "/assets/pages/media/bg/1.jpg",
    base_url_th + "/assets/pages/media/bg/2.jpg",
    base_url_th + "/assets/pages/media/bg/3.jpg",
    base_url_th + "/assets/pages/media/bg/4.jpg"], {
        fade: 1000,
        duration: 10000
    });
    $.ajax({
        url: "agent/attente", // override for form's 'action' attribute
        type: "post",
        data: 'user=' + user + '&poste=' + poste + "&cmk_groupe_comptence="
            + cmk_groupe_comptence + "&ref_campagne=" + ref_campagne + "&is_recept=1"
            + "&ref_fichier=" + ref_fichier,
        dataType: 'json',
        // async : false,
        global: false,
        beforeSend: function () {

            $('.dashboard_panel').hide();
        },
        success: function (data_result) {

            // var pa = data_result.param_attente;
            // cmktimout = pa.cmk_prd_timout;
            // PREDICTIF_VAR_INTERVAL = setInterval(callAfterDMAMAX, cmktimout);
            // setTimeout(callAfterDMAMAX, 2500);
            setTimeout(function () {
                if (is_onattente) {
                    resetUserQueue();
                }
            }, 120000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (cmk_activate_check_connection) {
                console.log(jqXHR, 'From attente')
                if (jqXHR.readyState == 0) {

                    Offline.check();
                    //show_msg_log('Un souci de connexion est détecté','warning');
                    return false
                }
            }

        }
    });


}


function GoAttente() {
    $('#defaultCountdown').countdown({
        since: 0,
        format: 'HMS'
    });

    //lancer le timer

    $.backstretch([base_url_th + "/assets/pages/media/bg/1.jpg",
    base_url_th + "/assets/pages/media/bg/2.jpg",
    base_url_th + "/assets/pages/media/bg/3.jpg",
    base_url_th + "/assets/pages/media/bg/4.jpg"], {
        fade: 1000,
        duration: 10000
    });
    //console.log('CADMAX 0');
    $.ajax({
        url: "agent/attente", // override for form's 'action' attribute
        type: "post",
        data: 'user=' + user + '&poste=' + poste + "&cmk_groupe_comptence="
            + cmk_groupe_comptence + "&ref_campagne=" + ref_campagne + "&forceOut=" + forceOut
            + "&ref_fichier=" + ref_fichier,
        dataType: 'json',
        // async : false,
        global: false,
        beforeSend: function () {

            $('.dashboard_panel').hide();
        },
        success: function (data_result) {
            //console.log('CADMAX 1');

            var pa = data_result.param_attente;
            cmktimout = pa.cmk_prd_timout;
            KillTimersSwitchCall();
            PREDICTIF_VAR_INTERVAL = setInterval(function () {
                callAfterDMAMAX(1);
            }, parseInt(cmktimout));
            addTimersSwitchCall(PREDICTIF_VAR_INTERVAL);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (cmk_activate_check_connection) {
                console.log(jqXHR, 'From attente')
                if (jqXHR.readyState == 0) {

                    Offline.check();
                    //show_msg_log('Un souci de connexion est détecté','warning');
                    return false
                }
            }

        }
    });

}

function GoAttentePPP() {
    $('#defaultCountdown').countdown({
        since: 0,
        format: 'HMS'
    });
    var ref_fichier_ppp = ref_fichier;

    $.ajax({
        url: "agent/attente_ppp", // override for form's 'action' attribute
        type: "post",
        data: 'user=' + user + '&poste=' + poste + "&cmk_groupe_comptence="
            + cmk_groupe_comptence + "&ref_campagne=" + ref_campagne
            + "&ref_fichier=" + ref_fichier,
        dataType: 'json',
        // async : false,
        global: false,
        beforeSend: function () {

            $('.dashboard_panel').hide();
        },
        success: function (data_result) {
            $noAttentePPP = data_result.data_prd;
            if ($noAttentePPP != undefined) {
                if ($noAttentePPP.length != 0) {
                    telcall_auto = $noAttentePPP.telcall_auto;
                    //addObsctel(telcall_auto);
                    ref_campagne = $noAttentePPP.ref_campagne;
                    ref_fichier = $noAttentePPP.ref_fichier;
                    name_campagne = $noAttentePPP.name_campagne;
                    num_contact = $noAttentePPP.num_contact;
                    name_fichier = $noAttentePPP.name_fichier;
                    is_rappel = $noAttentePPP.is_rappel;
                    type = $noAttentePPP.type;
                    // cmk_date_debut_init = $noAttentePPP.cmk_date_debut_init;
                    switch ($noAttentePPP.state) {
                        case '1':
                            status_call_ppp = false;
                            go_menu_after_call = false;
                            addObscclid($noAttentePPP.callerid);
                            killTimers();
                            SuccessPlay();
                            break;
                        case '0':
                            $('.attente_ppp').html(
                                lbl_checkPPPNJS_entrain_dappeler + $noAttentePPP.name_prospect
                                + lbl_checkPPPNJS_entrain_dappeler_sur + $noAttentePPP.telcall_auto);
                            status_call_ppp = true;
                            break;
                        case '2':
                            if ($noAttentePPP.notemptygrps.length) {
                                if ($noAttentePPP.notemptygrps.indexOf(ref_fichier_ppp) !== -1) {

                                }
                            } else {
                                if ($noAttentePPP.resume_fichier && $noAttentePPP.resume_fichier != '') {
                                    show_msg_log(lbl_warning_no_contact, 'error');
                                    $('.bloc_attente').hide();
                                    $('#production_tabs').hide();
                                    $('.in_prospect_btn').hide();
                                    $('.dashboard_panel').show();
                                    is_callblending = 0;
                                    status_call_ppp = false;
                                    Fncdashboard('fromattente');
                                    $('.content_resume_fichier_info').html($noAttentePPP.resume_fichier);
                                    if (checkIfFicheExiste == 0 && PlayAutoFindFiche == false)
                                        $('#ModalResumeFichierInfo').modal('show');
                                }
                            }
                            break;
                        default:
                            $('.attente_ppp').html(
                                lbl_checkPPPNJS_appele_vers + $noAttentePPP.name_prospect
                                + lbl_checkPPPNJS_appele_vers_non_abouti + $noAttentePPP.raison);
                            if (go_menu_after_call) {
                                status_call_ppp = false;
                                Fncdashboard('fromattente');
                            } else {
                                if ($noAttentePPP.notemptygrps.length) {
                                    callForPPP();
                                    if ($noAttentePPP.notemptygrps.indexOf(ref_fichier_ppp) !== -1) {

                                    }
                                } else {
                                    if (false && $noAttentePPP.resume_fichier && $noAttentePPP.resume_fichier != '') {
                                        cmk_hasreception = ($noAttentePPP.hasreception ? $noAttentePPP.hasreception : 0);
                                        if ($noAttentePPP.hasreception && $noAttentePPP.hasreception == 1) {
                                            StopAutoPlay();

                                            $('.bloc_attente').show();
                                            GoAttenteRecept();
                                            is_onattente = 1;
                                            checkFicheRecept();
                                            CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                                            TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                                            is_callblending = 1;
                                        } else {
                                            show_msg_log(lbl_warning_no_contact, 'error');
                                            $('.bloc_attente').hide();
                                            $('#production_tabs').hide();
                                            $('.in_prospect_btn').hide();
                                            $('.dashboard_panel').show();
                                            is_callblending = 0;
                                            status_call_ppp = false;
                                            Fncdashboard('fromattente')
                                            $('.content_resume_fichier_info').html($noAttentePPP.resume_fichier);
                                            if (checkIfFicheExiste == 0 && PlayAutoFindFiche == false)
                                                $('#ModalResumeFichierInfo').modal('show');
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }
            }
        }
        ,
        error: function (jqXHR, textStatus, errorThrown) {
            if (cmk_activate_check_connection) {
                console.log(jqXHR, 'From attente')
                if (jqXHR.readyState == 0) {

                    Offline.check();
                    //show_msg_log('Un souci de connexion est détecté','warning');
                    return false
                }
            }

        }
    });


}

// Checking Prod

function checkFiche() {

    // alert('groupe=' + groupe + '&nom_groupe=' + nom_groupe + '&user=' + user+
    // '&poste=' + poste);
    // var define_CHECK_FICHE_PREDICTIF
    // =$('#define_CHECK_FICHE_PREDICTIF_hidden').val();
    //
    $.ajax({
        url: "agent/checkprd", // override for form's 'action' attribute
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        data: 'user=' + user + '&poste=' + poste,
        dataType: 'json',
        global: false,
        // async : false,
        beforeSend: function () {
            // $("#pageloader7").find('.spinner').show();

        },
        success: function (data_result) {

            $noCheckPRD = data_result.data_prd;
            //console.log($noCheckPRD.length)
            if ($noCheckPRD.length != 0) {

                ref_campagne = $noCheckPRD.ref_campagne;
                ref_fichier = $noCheckPRD.ref_fichier;
                name_campagne = $noCheckPRD.name_campagne;
                telcall_auto = $noCheckPRD.telcall_auto;
                num_contact = $noCheckPRD.num_contact;
                name_fichier = $noCheckPRD.name_fichier;
                is_rappel = $noCheckPRD.is_rappel;
                type = $noCheckPRD.type;
                // cmk_date_debut_init = $no.cmk_date_debut_init;

                killTimers();
                addObsctel(telcall_auto);

                SuccessPlay();
            }
            /*else {
             checkTransfer();
             checkFicheRecept();
             }*/
        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (cmk_activate_check_connection) {
                console.log(jqXHR, 'From attente')
                if (jqXHR.readyState == 0) {

                    Offline.check();
                    //show_msg_log('Un souci de connexion est détecté','warning');
                    return false
                }
            }

        }
    });

    // SuccessPlay();
}

function checkPPPNJS($nocheckPPPNJS) {
    if (is_onattente != 1) return false;
    if ($nocheckPPPNJS != undefined) {
        if ($nocheckPPPNJS.length != 0) {


            telcall_auto = $nocheckPPPNJS.telcall_auto;
            ref_campagne = $nocheckPPPNJS.ref_campagne;
            ref_fichier = $nocheckPPPNJS.ref_fichier;
            name_campagne = $nocheckPPPNJS.name_campagne;

            num_contact = $nocheckPPPNJS.num_contact;
            name_fichier = $nocheckPPPNJS.name_fichier;
            is_rappel = $nocheckPPPNJS.is_rappel;
            type = $nocheckPPPNJS.type;
            // cmk_date_debut_init = $nocheckPPPNJS.cmk_date_debut_init;

            switch ($nocheckPPPNJS.state) {

                case '1': {
                    status_call_ppp = false;
                    go_menu_after_call = false;
                    addObsctel(telcall_auto);
                    addObscclid($nocheckPPPNJS.callerid);
                    killTimers();
                    SuccessPlay();
                }
                    break;

                case '0':
                    $('.attente_ppp').html(
                        lbl_checkPPPNJS_entrain_dappeler + $nocheckPPPNJS.name_prospect
                        + lbl_checkPPPNJS_entrain_dappeler_sur + $nocheckPPPNJS.telcall_auto);
                    status_call_ppp = true;
                    break;
                default:
                    $('.attente_ppp').html(
                        lbl_checkPPPNJS_appele_vers + $nocheckPPPNJS.name_prospect + lbl_checkPPPNJS_entrain_dappeler_sur + $nocheckPPPNJS.telcall_auto
                        + lbl_checkPPPNJS_appele_vers_non_abouti + $nocheckPPPNJS.raison);
                    if (go_menu_after_call) {
                        status_call_ppp = false;
                        setTimeout(function () {
                            Fncdashboard('fromattente');
                        }, 1500);
                    } else {
                        setTimeout(function () {
                            callForPPP();
                            if (is_onattente == 1 && !cmk_forced_to_in) GoAttentePPP();
                        }, 1500)
                    }
                    break;
            }

        }
    }
}

function callNextTelPPPNJS($nocallNextTelPPPNJS) {
    if (is_onattente != 1) return false;
    if ($nocallNextTelPPPNJS != undefined) {
        if ($nocallNextTelPPPNJS.length != 0) {


            telcall_auto = $nocallNextTelPPPNJS.telcall_auto;
            addObsctel(telcall_auto);
            //addObsctel($nocallNextTelPPPNJS.nextNumber);
            ref_campagne = $nocallNextTelPPPNJS.ref_campagne;
            ref_fichier = $nocallNextTelPPPNJS.ref_fichier;
            name_campagne = $nocallNextTelPPPNJS.name_campagne;

            num_contact = $nocallNextTelPPPNJS.num_contact;
            name_fichier = $nocallNextTelPPPNJS.name_fichier;
            is_rappel = $nocallNextTelPPPNJS.is_rappel;
            type = $nocallNextTelPPPNJS.type;
            // cmk_date_debut_init = $nocallNextTelPPPNJS.cmk_date_debut_init;


            $('.attente_ppp').html(
                lbl_checkPPPNJS_appele_vers + $nocallNextTelPPPNJS.name_prospect + lbl_checkPPPNJS_entrain_dappeler_sur + $nocallNextTelPPPNJS.telcall_auto
                + lbl_checkPPPNJS_appele_vers_non_abouti + $nocallNextTelPPPNJS.raison + lbl_checkPPPNJS_appel_prochain_tel + $nocallNextTelPPPNJS.nextNumber);

        }
    }

}

function checkFicheNJS($nocheckFicheNJS) {
    //console.log($nocheckFicheNJS);
    if ($nocheckFicheNJS.length != 0) {

        ref_campagne = $nocheckFicheNJS.ref_campagne;
        ref_fichier = $nocheckFicheNJS.ref_fichier;
        name_campagne = $nocheckFicheNJS.name_campagne;
        telcall_auto = $nocheckFicheNJS.telcall_auto;
        num_contact = $nocheckFicheNJS.num_contact;
        name_fichier = $nocheckFicheNJS.name_fichier;
        is_rappel = 0;
        type = '';


        killTimers();
        addObsctel(telcall_auto);
        addObscclid($nocheckFicheNJS.callerid);

        SuccessPlay();
    }

}

function checkRappel() {
    var $nocheckRappel;
    $.ajax({
        url: "agent/checkrappel", // override for form's 'action' attribute
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        data: 'user=' + user,
        dataType: 'json',
        global: false,
        success: function (data_result) {

            $nocheckRappel = data_result.data_prd;

            if ($nocheckRappel.no_affected_user == 1) {
                show_msg_log(lbl_no_affected_user, "info");
                return false;
            }

            // cmk_date_debut_init = $nocheckRappel.cmk_date_debut_init;

            if ($nocheckRappel.is_rappel === 1) {
                ref_campagne = $nocheckRappel.ref_campagne;
                ref_fichier = $nocheckRappel.ref_fichier;
                name_campagne = $nocheckRappel.name_campagne;
                telcall_auto = $nocheckRappel.telcall_auto;
                num_contact = $nocheckRappel.num_contact;
                name_fichier = $nocheckRappel.name_fichier;
                is_rappel = $nocheckRappel.is_rappel;
                type = $nocheckRappel.type;
                addObsctel(telcall_auto);

                killTimers();
                SuccessPlay();
            }


            // $('#debug_checkfiche').html(data_result);

        }
    });
}

Notification.requestPermission().then(function (result) {
    //console.log(result, 'requestPermission');
});
var n = "";

function notifReceptionAppel(msg) {
    var options = {
        body: msg,
        icon: '',
        lang: 'fr-FR',
        onClick: '',
        onClose: '',
        onError: '',

    };
    // $("#easyNotify").easyNotify(options);

    if (($('.cdashboard').hasClass('in_prod_mode') == false) && (userCurrentState != 'DASHBOARD')) {
        var audio = new Audio(base_url_ajax + 'assets/cmk/sounds/gentle-alarm.mp3');
        audio.play();
    }

    n = new Notification(lbl_notifReceptionAppel, options);
    setTimeout(n.close.bind(n), 4000);
    //audio.stop();

}

var is_reception = 0;
var fromqueueattente = 0;


var tmp_nbr_call = 0;
var varWatch = 0;
var frequenceNotification = 0;
var frequenceMaxxNotification = 6;
WatchChange();
setInterval(WatchChange, 6000);

function WatchChange() {
    if (frequenceNotification >= frequenceMaxxNotification) {
        if (tmp_nbr_call != varWatch) {
            notifReceptionAppel(varWatch + " " + lbl_appel_inqueue);
            frequenceNotification = 0;
        }
    }
}


var counterGlobalCFR = 0;
var newCountdown = false;
var dialogProdAuto = false;
var TimeAutoPlayRecept = false;

function checkFicheRecept() {

    if (agendaWindow) agendaWindow.postMessage('cmk_check_fiche_recept');
    //console.log('CHECKAAA'+counterGlobalCFR);
    counterGlobalCFR++;
    //BEGIN LOAD QUEUES
    //console.log('forceOut AAAA0 '+forceOut);
    if (forceOut == 1) return;
    forceOut = 0;
    frequenceNotification++;
    $.ajax({
        url: base_url_ajax + "agent/agent/loadQueues", // override for form's 'action' attribute
        type: "post",
        // 'get' or 'post', override for form's 'method'
        // attribute
        dataType: 'json',
        //data : 'user=' + user + '&poste=' + poste + '&is_callblending='
        data: { user: user, force_contact: (is_onattente ? 1 : null), count: 0, is_callblending: is_callblending },
        global: false,
        success: function (queues_result) {
            varWatch = queues_result.data.length;
            if (varWatch == 0 && newCountdown != false) {


                $('.page-container').removeClass('body-flash');
                dialogProdAuto.modal('hide')
                counterAutoProdRecept = 5;
                clearInterval(newCountdown);
                clearTimeout(TimeAutoPlayRecept)
                newCountdown = false;
                //return false;
            }
            if (is_onattente) {
                $("#header_queue_count").hide();
                if (queues_result.data.length) {
                    var html = '';
                    $.each(queues_result.data, function (k, v) {
                        html += '<tr style="background: url(' + base_url_ajax + 'assets/metronic/assets/pages/img/bg-white.png) repeat;">';
                        html += '<td>' + v.Entrant + '</td>';
                        html += '<td>' + v.nomContact + '</td>';
                        html += '<td>' + v.Depuis + '</td>';
                        html += '<td>' + v.Fichier + '</td>';
                        html += '<td>' + v.Etat + '</td>';
                        if (v.decroche_auto == '0')
                            html += '<td><a class="btn green call_contact_recept" title="' + tableheader_call_title + '" data-ref_campagne="' + v.num_campagne + '" data-num_contact="' + v.Contact + '" data-ref_fichier="' + v.num_groupe + '" data-name_fichier="' + v.Fichier + '" data-name_campagne="' + v.nom_campagne + '" data-incoming="' + v.Entrant + '" data-idrecept="' + v.idrecept + '" data-wssearch="' + v.wsSearch + '" data-show_contact_auto="' + v.show_contact_auto + '"><i class="fa fa-phone"></i> ' + lbl_decr_auto_off + '</a></td>';
                        else html += '<td>' + lbl_decr_auto + '</td>'
                        html += '</tr>';
                    });


                    $("#queues-table").html(html);
                    if (DoNotShowCallQueue) $("#loadQueueDiv").hide();
                    else $("#loadQueueDiv").show();
                } else {
                    forceOut = 0;
                    //console.log('is_onattente im here no call is_callblending==='+is_callblending)
                    if (is_callblending) {
                        if (userCurrentState == "PLAY") {
                            $("#loadQueueDiv").hide();
                            killTimers();
                            ignoreInboundCalls = 0;
                            //enlevé par sofiene, cause des soucis dans le callblending
                            //play();
                            KillTimersRECEPT();
                        }

                    } else {
                        $("#loadQueueDiv").hide();


                    }
                }
            } else {
                $(".header_queue_count_li").html("<span class='badge " + (queues_result.data.length > 0 ? "bg-red" : "bg-gray") + "'><i class='fa fa-bell'></i> " + queues_result.data.length + " " + lbl_appel_inqueue + "</span>");
                if (queues_result.data.length) {

                    var html = '';
                    $.each(queues_result.data, function (k, v) {
                        html += '<li>';
                        html += '<a style="cursor:default !important;" href="#">';
                        html += '<span class="subject" style="margin-left:0px">';
                        if (v.nomContact == '') html += '<span class="from"><i class="fa fa-phone"></i> ' + v.Entrant + ' </span>';
                        else html += '<span class="from"><i class="fa fa-user"></i>' + v.nomContact + ' (<i class="fa fa-phone"></i> ' + v.Entrant + ') </span>';
                        html += '<span class="time">' + v.Depuis + '</span>';
                        html += '</span>';
                        html += '<span class="message" style="margin-left:0px"> Fichier : ' + v.Fichier + ' / Etat : ' + v.Etat + ' </span>';
                        html += '</a>';
                        html += '</li>';

                    });
                    $(".header_queue_count_ul").html(html);

                    if (userCurrentState == "DASHBOARD" && auto_prod_reception == 1 && InPause === 0 && $('.bloc_debrief').is(':visible') === false && varWatch != 0 && newCountdown == false) {
                        dialogProdAuto = bootbox.dialog({
                            message: '<p class="text-center">' + lbl_notification_prod_auto + ' <span id="wait_seconnde">5 ' + sec_lbl + '...</p>',
                            closeButton: false,
                            buttons: {
                                ok: {
                                    label: lbl_notification_prod_auto_btn,
                                    className: 'btn-info',
                                    callback: function () {
                                        $('.page-container').removeClass('body-flash');
                                        dialogProdAuto.modal('hide');
                                        ignoreInboundCalls = 0;
                                        play();
                                        return false;
                                    }
                                }
                            }
                        });
                        // do something in the background
                        $('.page-container').addClass('body-flash');


                        newCountdown = setInterval(function () {
                            console.log(counterAutoProdRecept);
                            counterAutoProdRecept--
                            countdownAutoProdRecept();
                            if (counterAutoProdRecept === 0) {
                                counterAutoProdRecept = 5;
                                clearInterval(newCountdown);
                                newCountdown = false;
                            }
                        }, 1000);


                        TimeAutoPlayRecept = setTimeout(function () {
                            $('.page-container').removeClass('body-flash');
                            dialogProdAuto.modal('hide')
                            ignoreInboundCalls = 0;
                            play();
                        }, 6800);


                    }
                    //$(".header_queue_count_ul").parent().closest('ul').show();
                } else {
                    //$(".header_queue_count_ul").parent().closest('ul').hide();

                }
                $("#header_queue_count").show();
            }
        }
    });
    return true;
    //END LOAD QUEUES

    /*var $no;
    $.ajax({
        url : "agent/checkrecept", // override for form's 'action' attribute
        type : "post", // 'get' or 'post', override for form's 'method'
        // attribute
        dataType : 'json',
        data : 'user=' + user + '&poste=' + poste + '&is_callblending='
        + is_callblending,
        global : false,
        success : function(data_result) {

            //console.log(data_result)

            $no = data_result.data_prd;

            if ($no != undefined) {
                if ($no.switch_recept == 1) {
                    switch_to_recept_callblending = 1;
                    play();// GoAttenteRecept();
                } else {

                    killTimers();
                    ref_campagne = $no.ref_campagne;
                    ref_fichier = $no.ref_fichier;
                    name_campagne = $no.name_campagne;
                    incoming = $no.incoming;
                    num_contact = $no.num_contact;
                    name_fichier = $no.name_fichier;
                    idcurrentrecept = $no.idcurrentrecept;
                    is_rappel = $no.is_rappel;
                    type = $no.type;
                    // cmk_date_debut_init = $no.cmk_date_debut_init;
                    addObsctel(incoming);
                    is_reception = 1;
                    is_rappel = false;
                    SuccessPlay();
                }
            }

        }
    });*/
}

function countdownAutoProdRecept() {
    $('#wait_seconnde').html(counterAutoProdRecept + ' ' + sec_lbl + '...')
}


document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
});


function checkRecepNJS($nocheckRecepNJS) {
    if ($nocheckRecepNJS.switch_recept == 1) {
        switch_to_recept_callblending = 1;
        ignoreInboundCalls = 0;
        play();// GoAttenteRecept();
    } else {


        //console.log('RECEPTION');

        killTimers();
        ref_campagne = $nocheckRecepNJS.ref_campagne;
        ref_fichier = $nocheckRecepNJS.ref_fichier;
        name_campagne = $nocheckRecepNJS.name_campagne;
        incoming = $nocheckRecepNJS.incoming;
        num_contact = $nocheckRecepNJS.num_contact;
        name_fichier = $nocheckRecepNJS.name_fichier;
        idcurrentrecept = $nocheckRecepNJS.idcurrentrecept;
        forceIntercept = 0;
        is_rappel = $nocheckRecepNJS.is_rappel;
        type = $nocheckRecepNJS.type;
        // cmk_date_debut_init = $nocheckRecepNJS.cmk_date_debut_init;
        addObsctel(incoming);
        is_reception = 1;
        is_rappel = false;
        SuccessPlay();
    }
}

function decrochageEntrant(ref_campagne_recept, ref_fichier_recept, name_campagne_recept, incoming_recept, num_contact_recept, name_fichier_recept, idrecept, wssearch, show_contact_auto) {
    forceIntercept = false;
    idcurrentrecept = idrecept;
    if (num_contact_recept != "-1" && show_contact_auto == "1") {
        ref_campagne = ref_campagne_recept;
        ref_fichier = ref_fichier_recept;
        num_contact = num_contact_recept;
        name_fichier = name_fichier_recept;
        poste = $('#poste_hidden').val();
        is_reception = $(this).data('is_recept');
        setTimeout(SuccessPlay, 1500);
        return;
    }
    if (num_contact_recept == '-1' && wssearch == 0) {
        $('#fichier_vierge').val(ref_fichier_recept);
        $('#fichier_vierge_tel').val(incoming_recept);
        $('#fichier_vierge_id_recept').val('');
        $('#modal-contactvierge').modal('show');
    } else {


        user = $('#user_hidden').val();
        poste = $('#poste_hidden').val();
        ref_fichier = ref_fichier_recept;
        name_fichier = name_fichier_recept;
        fichier_vierge_tel = incoming_recept;

        data_option_vierge = {
            ref_fichier: ref_fichier_recept,
            name_fichier: name_fichier_recept,
            incoming: incoming_recept

        };


        var ContactExist = 0;
        var DataContact;
        var DataWS;
        var ConfWS;
        var s_is_recept = 1;
        //
        list_ct_ws = [];
        struct_ct_ws = [];
        if (fichier_vierge_tel != "") {
            $.ajax({
                url: "agent/SearchContact",
                type: "post",
                data: {
                    ref_fichier: ref_fichier_recept,
                    name_fichier: name_fichier_recept,
                    incoming: incoming_recept,
                    champs_search_vierge: 'tel1'
                },
                dataType: 'json',
                async: false,
                success: function (response) {
                    ContactExist = response.data.length;
                    DataContact = response.data;
                    DataWS = response.dataws;
                    ConfWS = response.confws;
                    create_vierge = response.create_vierge;
                    var class_hide_create_vierge = (create_vierge == 0) ? 'hidden' : '';
                    if (ContactExist > 0 || !(Object.keys(ConfWS).length === 0 && ConfWS.constructor === Object)) {

                        var bbHtml = '';
                        bbHtml += '<div class="row" id="ct_Vierges_div">';
                        bbHtml += '<div class="col-md-12">';
                        bbHtml += '<div class="panel panel-default">';
                        bbHtml += '<div class="panel-heading">';
                        bbHtml += '<h3 class="panel-title">' + (ContactExist > 0 ? ContactExist + ' ' + lbl_ctc_exist + ' <small>' + lbl_ctc_exist_help : lbl_no_contact_found) + '</small></h3>';
                        bbHtml += '</div>';
                        bbHtml += '<div class="panel-body">'
                        bbHtml += '<table id="ct_DT_vierges" class="table table-hover table-striped  table-advanced tablesorter table-condensed tb-sticky-header table-sm display">';
                        bbHtml += '<thead>';
                        bbHtml += '<tr>';
                        bbHtml += '</tr>';
                        bbHtml += '</thead>';
                        bbHtml += '</table>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '<div class="row" id="ws_conf_div">';
                        bbHtml += '<div class="col-md-12">';
                        bbHtml += '<div class="panel panel-default">';
                        bbHtml += '<div class="panel-heading">';
                        bbHtml += '<h3 class="panel-title">' + lbl_search_contact_externe + '</h3>';
                        bbHtml += '</div>';
                        bbHtml += '<div class="panel-body">';
                        bbHtml += '<div class="col-md-12">';
                        bbHtml += (ConfWS.external_logo != '-1' ? '<img src="' + ConfWS.external_logo + '"> ' : '') + '<strong>' + ConfWS.external_title + '</strong>';
                        bbHtml += '</div>';
                        bbHtml += '<div id="ws_params_div">'
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>'
                        bbHtml += '<div class="row" id="ct_Vierges_WS_div" style="display:none">';
                        bbHtml += '<div class="col-md-12">';
                        bbHtml += '<div class="panel panel-default">';
                        bbHtml += '<div class="panel-heading">';
                        bbHtml += '<h3 class="panel-title" id="ws_result_title"></small></h3>';
                        bbHtml += '</div>';
                        bbHtml += '<div class="panel-body" id="ct_Vierges_WS_panel">'
                        bbHtml += '<table id="ct_DT_vierges_WS" class="table table-hover table-striped  table-advanced tablesorter table-condensed tb-sticky-header table-sm display">';
                        bbHtml += '<thead>';
                        bbHtml += '<tr>';
                        bbHtml += '</tr>';
                        bbHtml += '</thead>';
                        bbHtml += '</table>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbHtml += '</div>';
                        bbDialog = bootbox
                            .dialog({
                                message: bbHtml,
                                title: '<h4 class="box-heading">' + lbl_ctc_exist_heading + '</h4>',
                                size: 'large',
                                buttons: {
                                    searchCtc: {
                                        label: lbl_search_contact,
                                        className: "btn blue btn-outlined btn-square",
                                        callback: function () {
                                            bbDialog.modal('hide');
                                            $("#modal-gestioncontacts").modal("show");
                                        }
                                    },
                                    main: {
                                        label: lbl_btn_prop3 + fichier_vierge_tel,
                                        className: "btn btn-default btn-outlined btn-square " + class_hide_create_vierge,
                                        callback: function () {
                                            CallbackVierge(data_option_vierge)

                                        }
                                    }
                                    /*success: {
                                     label: lbl_btn_prop2,
                                     className: "btn blue",
                                     callback: function() {
                                     return false;
                                     $('.bootbox').modal('hide');
                                     $('#ModalContactsSearch').modal('show');



                                     }
                                     }*/
                                }
                            });


                        bbDialog.init(function () {
                            if (ContactExist) {
                                if (table_vierges) table_vierges.destroy();
                                table_vierges = $('#ct_DT_vierges').DataTable({
                                    "data": DataContact,
                                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],
                                    "order": [[1, 'asc'], [3, 'asc']],
                                    "columns": [
                                        {
                                            "title": tableheader_remonter,
                                            "render": function (data, type, row) {
                                                return '<a class="btn green call_contact" title="' + tableheader_remonter_title + '" data-ref_campagne="' + row['num_campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] + '" data-is_recept="' + s_is_recept + '"><i class="fa fa-phone"> ' + lbl_open_contact_form + '</i></a>';
                                            }
                                        },
                                        { "data": "fichier", "title": tableheader_group },
                                        { "data": "agent_nom", "title": tableheader_agent },
                                        { "data": "num_contact", "title": tableheader_num },
                                        { "data": "nom", "title": tableheader_name },
                                        { "data": "tel1", "title": tableheader_tel1 },
                                        { "data": "tel2", "title": tableheader_tel2 },
                                        { "data": "tel3", "title": tableheader_tel3 },
                                        { "data": "fax1", "title": tableheader_fax1 },
                                        { "data": "fax2", "title": tableheader_fax2 },
                                        { "data": "ct_qualif", "title": tableheader_qualif },
                                        { "data": "last_date_fin", "title": tableheader_procdate },
                                        { "data": "last_date_rappel", "title": tableheader_recalldate },
                                        {
                                            "title": tableheader_dupp,
                                            "render": function (data, type, row) {
                                                return '<a class="fa fa-copy copy_contact" title="' + tableheader_dupp_title + '" data-ref_campagne="' + row['num_campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] + '"></a>';
                                            },
                                            "visible": (duplictc == '1')
                                        },

                                    ],
                                    "columnDefs": [
                                        //{ "visible" : false, "targets" : [10,13,14,15,16,17,18] },
                                    ]
                                });
                            } else {
                                $("#ct_Vierges_div").hide();
                            }
                            if (ConfWS) {
                                var paramsWs = ConfWS.param_querys.split('___');
                                var valeursWs = ConfWS.val_querys.split('___');
                                var wsHtml = ''
                                wsHtml += '<div class="col-md-12"><form id="ws_search_form">';
                                $.each(paramsWs, function (k, v) {
                                    wsHtml += '<div class="form-group">';
                                    wsHtml += '<label>' + v + '</label>';
                                    wsHtml += '<input type="text" name="ws_search_param[' + v + ']" class="form-control ws_search_param" ' + (valeursWs[k] == 'com_unik_tel1' ? 'value="' + incoming_recept + '"' : '') + '>';
                                    wsHtml += '</div>';
                                });
                                wsHtml += '<button class="btn btn-sm blue" type="button" data-wsid="' + ConfWS.id + '" data-nomfichier="' + name_fichier_recept + '" data-reffichier="' + ref_fichier_recept + '" id="ws_search_submit">' + lbl_search + '</button>';
                                wsHtml += '</form></div>';
                                $("#ws_params_div").html(wsHtml);
                                if ($(".ws_search_param").filter('[value=""]').length == 0) {
                                    $('#ws_search_submit').trigger('click');
                                }
                            } else {
                                $("#ws_conf_div").hide();
                            }

                            //if (!(Object.keys(DataWS).length === 0 && DataWS.constructor === Object)) {
                            //    list_ct_ws = DataWS.contacts;
                            //    var columnsWS = [{
                            //        "title" : tableheader_remonter,
                            //        "render" : function(data,type,full,meta) {
                            //            return '<a data-ctindex="'+meta.row+'" data-nomfichier="'+name_fichier_recept+'" data-reffichier="'+ref_fichier_recept+'" href="javascript:;" class="call_contact_ws"><i class="fa fa-phone"></i></a>';
                            //        }
                            //    }];
                            //    $.each(DataWS.structure, function (k, v) {
                            //        columnsWS.push({
                            //            "data": k,
                            //            "title": v
                            //        });
                            //        struct_ct_ws.push(v);
                            //    });
                            //
                            //    if (table_vierges_WS) table_vierges_WS.destroy();
                            //    table_vierges_WS = $("#ct_DT_vierges_WS").DataTable({
                            //        "data": DataWS.contacts,
                            //        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],
                            //        "order": false,
                            //        "columns": columnsWS
                            //    });
                            //} else {
                            //    $("#ct_Vierges_WS_div").hide();
                            //}

                        })


                    } else {
                        CallbackVierge(data_option_vierge)
                    }


                }
            });
        } else {
            CallbackVierge(data_option_vierge)
        }
    }
}

function checkTransfer() {

    var use_transfert_contact = 1;

    if ($('#use_transfert_contact')) {
        use_transfert_contact = parseInt($('#use_transfert_contact').val(), 10);
    }
    if (use_transfert_contact) {

        var user = $('#user_hidden').val();

        $.ajax({
            url: "agent/checktransfert",
            type: "post",
            dataType: "json",
            data: 'user=' + user + '&getjson=1',
            global: false,
            success: function (data_result) {
                var $nocheckTransfer = data_result.data_prd;
                //console.log($no.length,'checktransfert');


                if ($nocheckTransfer.telcall_auto != undefined) {
                    telcall_auto = $nocheckTransfer.telcall_auto;
                    type_appel = $nocheckTransfer.type;
                    addObsctel(telcall_auto);
                    addObscclid($nocheckTransfer.callerid);

                    name_campagne = $nocheckTransfer.name_campagne;

                    name_fichier = $nocheckTransfer.name_fichier;
                    num_contact = $nocheckTransfer.num_contact;
                    ref_campagne = $nocheckTransfer.ref_campagne;
                    ref_fichier = $nocheckTransfer.ref_fichier;
                    killTimers();
                    SuccessPlay();

                }


            }
        });

    }
}



function callForPPP() {

    var datatopost = 'cmk_switch_function=CMK_LAUNCHCALL_PPP' + '&user=' + user + "&poste=" + poste;
    setUserAttenteNJS();
    KillTimersPPP();
    PPP_CURRENT_LAUNCHED_CONTACT = 0;
    PPP_CURRENT_LAUNCHED_CONTACT_FICHIER = 0;
    $.ajax({
        url: "agent/switch_call", // override for form's 'action' attribute
        type: "post",
        global: false,
        async: false,
        data: datatopost,
        dataType: 'json',
        success: function (data_result) {
            if (data_result == 0) {
                if (cmk_hasreception) {
                    cmk_forced_to_in = true;
                    status_call_ppp = false;
                    StopAutoPlay();
                    $('.attente_ppp').html(lbl_agent_attente + '...');
                    $('.bloc_attente').show();
                    GoAttenteRecept();
                    is_onattente = 1;
                    checkFicheRecept();
                    CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                    TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                    CHECKCALLOUTPPP_INTERVAL = setTimeout(function () {
                        if (userCurrentState == "PLAY") {
                            callForPPP();
                            if (!cmk_forced_to_in) {
                                GoAttentePPP();
                                var define_CHECK_FICHE_PREDICTIF = $('#define_CHECK_FICHE_PREDICTIF_hidden').val();
                                $('.attente_ppp').html(lbl_entrain_dappeler);
                                $.backstretch([base_url_th + "/assets/pages/media/bg/1.jpg",
                                base_url_th + "/assets/pages/media/bg/2.jpg",
                                base_url_th + "/assets/pages/media/bg/3.jpg",
                                base_url_th + "/assets/pages/media/bg/4.jpg"], {
                                    fade: 3500,
                                    duration: define_CHECK_FICHE_PREDICTIF
                                });
                                CHECKRAPPEL_VAR_INTERVAL = setInterval(checkRappel, 60000);
                                TRANSFERT_VAR_INTERVAL = setInterval(checkTransfer, 10000);
                            }
                        }
                    }, 60000);
                    is_callblending = 1;
                } else {
                    show_msg_log(lbl_no_contact_found_in_your_files, 'error');
                    setTimeout(function () {
                        status_call_ppp = false;
                        $('.attente_ppp').html('');
                        Fncdashboard('fromattente');
                    }, 2000);
                }
            } else {
                //alert(data_result);alert(data_result["contacts_called"]);
                cmk_forced_to_in = false;
                PPP_CURRENT_LAUNCHED_CONTACT = data_result["contacts_called"];
                PPP_CURRENT_LAUNCHED_CONTACT_FICHIER = data_result["groupe"];
                console.log("Calling contact " + data_result["contacts_called"] + " on file " + data_result["groupe"] + " issues detection " + PPP_CURRENT_LAUNCHED_CONTACT_ISSUE + " time(s)");

                CHECK_PPP_VAR_TIMEOUT = setTimeout(
                    function () {

                        //PPPcheckCurrentContact(100);
                        if ((userCurrentState == "PLAY") && (PPP_CURRENT_LAUNCHED_CONTACT_FICHIER == data_result["groupe"]) && (PPP_CURRENT_LAUNCHED_CONTACT == data_result["contacts_called"]) && (PPP_CURRENT_LAUNCHED_CONTACT_FICHIER != 0) && (PPP_CURRENT_LAUNCHED_CONTACT != 0)) {
                            if (PPP_CURRENT_LAUNCHED_CONTACT_ISSUE > PPP_CURRENT_LAUNCHED_CONTACT_ISSUE_MAX) {
                                show_msg_log(lbl_general_connection_issue, 'error');
                                setTimeout(function () {
                                    $('.attente_ppp').html('');
                                    status_call_ppp = false;
                                    Fncdashboard('fromattente');
                                }, 1000);
                            }
                            else {
                                PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = PPP_CURRENT_LAUNCHED_CONTACT_ISSUE + 1;
                                play();
                            }
                        }

                    }, 60000);
            }
        }
    });
}


function callAfterDMAMAX(userWaiting = 1) {
    if (userWaiting != 1) {
        if ((userCurrentState != "PLAY") && (userCurrentState != "SUCCESSPLAY")) return;
    }
    var datatopost = 'cmk_switch_function=CMK_LAUNCHCALL_PRD' + '&user=' + user
        + "&poste=" + poste + "&userWaiting=" + userWaiting;
    if (userWaiting) setUserAttenteNJS();  //désactivée si 0 car elle informe le nodejs que j'attend une fiche alors que je veux juste que le prédictif lance un appel quand userwaiting=0
    DoNotShowCallQueue = true; $("#loadQueueDiv").hide();
    xhrSwitchCall = $.ajax({
        url: "agent/switch_call", // override for form's 'action' attribute
        type: "post",
        global: false,
        data: datatopost,
        success: function (data_result) {
        }
    });
}


//wind

var CMK_INTERVALL_WIDGET = null;
var CMK_TIME_EXEC_WIDGET = 60000 * 5;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function launchBreak() {
    //console.log('Taking a break...');
    //await sleep(1000);
    setCrmWidgetsValuesProd();
    //console.log('Two seconds later');
    //console.log('Taking a break...');

    await sleep(CMK_TIME_EXEC_WIDGET);

    //console.log('6 minute plutard ....');

    LaunchIntervalWidget();


}

launchBreak();

function LaunchIntervalWidget() {

    if (userCurrentState == "DASHBOARD") {


        clearInterval(CMK_INTERVALL_WIDGET);
        CMK_INTERVALL_WIDGET = setInterval(setCrmWidgetsValuesProd, CMK_TIME_EXEC_WIDGET);

    }

}


Object.defineProperty(this, 'varWatchState', {
    get: function () {
        return userCurrentState;
    },
    set: function (v) {
        userCurrentState = v;
        clearInterval(CMK_INTERVALL_WIDGET);
        if (v == "DASHBOARD") {

            //launch widget
            setCrmWidgetsValuesProd();
            //await sleep(1000);
            CMK_INTERVALL_WIDGET = setInterval(setCrmWidgetsValuesProd, CMK_TIME_EXEC_WIDGET);

        } else {
            clearInterval(CMK_INTERVALL_WIDGET);
        }
        //console.log('Value changed! New value: ' + v);
    }
});

function Fncdashboard(param) {
    if (param != "fromdebrief") {
        if (userCurrentState == "DASHBOARD") return false;
    }
    if (status_call_ppp) {
        show_msg_log(lbl_msg_call_in_progress, 'warning');
        go_menu_after_call = true;
        return;
    }
    PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = 0;
    DoNotShowCallQueue = false;
    go_menu_after_call = false;
    status_call_ppp = false;
    userCurrentState = 'DASHBOARD';
    varWatchState = userCurrentState;
    setUserMenuNJS();
    //Generic class show_in_menu pour tout element a afficher lors du retour au menu
    $('.show_in_menu').removeClass("hidden");

    $("#queues-table").html('');
    $("#loadQueueDiv").hide();

    is_reception = 0;
    forceOut = 0;
    $('#piece_jointe').addClass('hidden');
    $('#obs_c_tel_histo').val('');
    $('#obs_c_clid_histo').val('');
    $('.details_info_ctc').hide();

    $.LoadingOverlay("hide");
    $('.user_logout').show();
    clearInterval(CALENDAR_VAR_INTERVAL);
    KillTimersRECEPT();
    KillTimersPPP();
    $("#header_queue_count").hide();

    if (xhrSwitchCall) xhrSwitchCall.abort();
    var clean = "";

    switch (param) {
        case 'fromattente':

            clean = 2;

            break;
        case 'fromdebrief':
            clean = 0;
            break;
        case 1:


            clean = 1;
            break;
    }
    //param = (param==1) ? 'fromcontact' : param;

    ref_fichier = (ref_fichier) ? ref_fichier : -1;
    ref_campagne = (ref_campagne) ? ref_campagne : -1;
    num_contact = (num_contact) ? num_contact : -1;


    var data_return;

    $.ajax({
        url: base_url_ajax + "agent/agent/initToDashboard",
        type: "post",
        global: false,
        dataType: 'json',
        async: false,
        data: {
            user: user,
            poste: poste,
            paramFrom: param,
            ref_fichier: ref_fichier,
            name_fichier: name_fichier,
            ref_campagne: ref_campagne,
            num_contact: num_contact,
            clean: clean,
            nom_login: nom_login,
            cmk_groupe_comptence: cmk_groupe_comptence

        },
        success: function (json_return) {

            data_return = json_return;
            $('#ref_fichier').val('')
            $('#ref_campagne').val('')
        }

    });


    $('#journal_des_appels').html(data_return.JournalDesAppels);
    $('#journal_des_appels .call_contact').tooltip({
        title: $(this).data('original-title'),
        container: 'body'
    });
    ListInterfaceAgent = data_return.ListInterfaceAgent;


    //return false;


    $.each(ListInterfaceAgent.data, function (key, value) {

        //console.log(value,key);
        stats = value.stats.toString();
        search_contact = value.search_contact.toString();
        fiche_vierge = value.fiche_vierge.toString();
        recordings = value.recordings.toString();
        appel_manuel = value.appel_manuel.toString();
        sms_manuel = value.sms_manuel.toString();
        exit_debrief = value.exit_debrief;
        duplictc = value.duplictc;
        get_reception = value.get_reception;
        bdcon_read = value.bdcon_read;
        bdcon_add = value.bdcon_add;
        bdcon_edit = value.bdcon_edit;
        bdcon_delete = value.bdcon_delete;
        rappel_plateau = value.rappel_plateau.toString();
        auto_prod_reception = value.auto_prod_reception.toString();

    });

    if (stats == 1)
        $('#li_stats').removeClass('hidden');
    else
        $('#li_stats').addClass('hidden');
    if (search_contact == 1)
        $('#li_search_contact').removeClass('hidden');
    else
        $('#li_search_contact').addClass('hidden');
    if (fiche_vierge == 1)
        $('#li_fiche_vierge').removeClass('hidden')
    else
        $('#li_fiche_vierge').addClass('hidden');
    if (recordings == 1)
        $('#li_recordings').removeClass('hidden')
    else
        $('#li_recordings').addClass('hidden');
    if (appel_manuel == 1) {
        $('#li_appel_manuel').removeClass('hidden');
        $('#cmk_originate_manuel_shortcut').removeClass('hidden');
    } else {
        $('#li_appel_manuel').addClass('hidden');
        $('#cmk_originate_manuel_shortcut').addClass('hidden');
    }
    if (sms_manuel == 1)
        $('#li_sms_manuel').removeClass('hidden');
    else
        $('#li_sms_manuel').addClass('hidden');

    if (exit_debrief == 1)
        $('.exitdebrief').removeClass('hidden');
    else
        $('.exitdebrief').addClass('hidden');

    if (get_reception == 1)
        $('#lost_call').removeClass('hidden');
    else
        $('#lost_call').addClass('hidden');

    if (rappel_plateau != 1) {
        if ($('#obs_c_rappel_etat2').prop('checked')) {
            $('#obs_c_rappel_etat2').click
        }

        $('#obs_c_rappel_etat_modal2').prop('checked', false);
        $('#obs_c_rappel_etat2').attr('disabled', true);
        $('#obs_c_rappel_etat_modal2').attr('disabled', true);
        $('.rp_plateau').addClass('hidden');

    } else {
        $('#obs_c_rappel_etat2').attr('disabled', false);
        $('#obs_c_rappel_etat_modal2').attr('disabled', false);
        $('.rp_plateau').removeClass('hidden');

    }

    $.uniform.update();


    if (param == "fromattente") {

        killTimers();
        mainCalendar = false;
        if ($('#defaultCountdown').hasClass('is-countdown')) {
            $('#defaultCountdown').countdown('destroy');
            $.backstretch("destroy");
        }
        //InitProdFiche(2);
        //InitAgent('MENU', 'fromcontact');

        $('#production_tabs').hide();
        $('.in_prospect_btn').hide();
        $('.dashboard_panel').show();
        $('.bloc_attente').hide();
        $("#accordion1").hide();

        $('.cdashboard').removeClass('in_prod_mode');

        ref_campagne = '';
        ref_fichier = '';
        name_fichier = '';
        name_campagne = '';
        num_contact = '';
        cmk_date_debut_init = "";
        cmk_newfilecreated = "";// definir creation contact vierge
        is_rappel = 0;
        cmktimout = "";
        is_callblending = 0;
        is_onattente = 0;

        PREDICTIF_VAR_INTERVAL = "";
        CHECKRAPPEL_VAR_INTERVAL = "";
        CHECKFICHE_VAR_INTERVAL = "";
        CHECKRECEPT_VAR_INTERVAL = "";
        TRANSFERT_VAR_INTERVAL = "";
        CHECKFICHEPPP_VAR_INTERVAL = "";
        mainCalendar = false;
        CALENDAR_VAR_INTERVAL = "";
        //InitAgent('MENU', 'fromcontact')

        var ret = verifDebrief(data_return.debrief);
        if (ret == false) {
            return ret;
        }


    }


    if (param == "fromdebrief") {

        killTimers();
        mainCalendar = false;
        $('.page-sidebar-menu').removeClass('hidden');

        $('#defaultCountdown').countdown('destroy');
        $.backstretch("destroy");

        //InitProdFiche(1);// a revoir
        //InitAgent('MENU', 'fromdebrief');
        //CheckDebrief(true);

        $('#production_tabs').hide();
        $('.in_prospect_btn').hide();
        $('.dashboard_panel').show();
        $('.bloc_attente').hide();
        $('.bloc_debrief').hide();
        $("#accordion1").hide();
        $('.dashboard_panel').removeClass('hidden');
        $('.cdashboard').removeClass('in_prod_mode');
        $('.user_logout').show();
        isbackstretch = 0;
        $("#accordion1").hide();

        $('.bloc_debrief').hide();
        $('.dashboard_panel').removeClass('hidden');

        $('.cdashboard').removeClass('in_prod_mode');

        ref_campagne = '';
        ref_fichier = '';
        name_fichier = '';
        name_campagne = '';
        num_contact = '';
        cmk_date_debut_init = "";
        cmk_newfilecreated = "";// definir creation contact vierge
        is_rappel = 0;
        cmktimout = "";
        is_callblending = 0;

        PREDICTIF_VAR_INTERVAL = "";
        CHECKRAPPEL_VAR_INTERVAL = "";
        CHECKFICHE_VAR_INTERVAL = "";
        CHECKRECEPT_VAR_INTERVAL = "";
        TRANSFERT_VAR_INTERVAL = "";
        CHECKFICHEPPP_VAR_INTERVAL = "";
        mainCalendar = false;
    }


    if ($('.cdashboard').hasClass('in_prod_mode')) {


        //InitProdFiche(1);
        //InitAgent('MENU', 'fromcontact');

        $('#production_tabs').hide();
        $('.in_prospect_btn').hide();
        $('.dashboard_panel').show();
        $('.bloc_attente').hide();
        $('.bloc_debrief').hide();
        $("#accordion1").hide();
    } else {
        // $('.dashboard_panel').hide()
    }

    /************************* aziz modif checkficherecpet****/

    if (cmk_callblending == 1) {
        checkFicheRecept();
        //console.log('CHECKBBB Fncdashboard');
        //CHECKRECEPT_VAR_INTERVAL_DBOARD = setInterval(checkFicheRecept, 5000);
        //addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_DBOARD);
    }
    /*
    KillTimersRECEPT();

    if (cmk_callblending == 1) {
        //console.log('CHECKBBB Fncdashboard');
        CHECKRECEPT_VAR_INTERVAL_DBOARD = setInterval(checkFicheRecept, 5000);
        addTimersRECEPT(CHECKRECEPT_VAR_INTERVAL_DBOARD);
    }
    */

    /*var is_module_ticket =false;
     if(document.getElementById("cmk_sites_reference_frame") && document.getElementById("cmk_sites_reference_frame").contentWindow.is_module_ticket){
     is_module_ticket = document.getElementById("cmk_sites_reference_frame").contentWindow.is_module_ticket;
     if(is_module_ticket==true) {
     document.getElementById("cmk_sites_reference_frame").contentWindow.KillstartTime();
     }
     }*/

    var dataAgent = {};
    dataAgent.logAction = "retour_menu_principale";
    dataAgent.logDB_from = param;
    agentLogAction(dataAgent);
    $("#calendar_main.my-calendar-rappel").fullCalendar('refetchEvents');

    if (data_return.nb_unseen_evals > 0)
        $(".alert_new_evaluation").html("<span class='badge bg-green'>" + data_return.nb_unseen_evals + "</span>");
    else
        $(".alert_new_evaluation").html("");

    var ret = verifDebrief(data_return.debrief);
    if (ret == false) {
        return ret;
    }

    $("#connectedAgents").html(data_return.CrmWidgetsValues["connectedAgents"]);
    $("#currentCompains").html(data_return.CrmWidgetsValues["currentCompains"]);
    $("#prodTime").html(data_return.CrmWidgetsValues["prodTime"]);
    $("#cafeTime").html(data_return.CrmWidgetsValues["cafeTime"]);
    $("#debriefTime").html(data_return.CrmWidgetsValues["debriefTime"]);
    $("#presenceTime").html(data_return.CrmWidgetsValues["presenceTime"]);

    $("#filesStats").html(data_return.CrmWidgetsValues["filesStats"]);
    $("#nbrArgumente").html(data_return.CrmWidgetsValues["nbrArgumente"]);
    $("#nbrNoArgumente").html(data_return.CrmWidgetsValues["nbrNoArgumente"]);
    $("#prctArgumente").html(data_return.CrmWidgetsValues["prctArgumente"]);
    $("#nbrPositif").html(data_return.CrmWidgetsValues["nbrPositif"]);
    $("#prctPositif").html(data_return.CrmWidgetsValues["prctPositif"]);
    $("#prctPositifArg").html(data_return.CrmWidgetsValues["prctPositifArg"]);
    $("#nbrRappel").html(data_return.CrmWidgetsValues["nbrRappel"]);
    $("#nbrRDV").html(data_return.CrmWidgetsValues["total"]);
    /*$("#nbrRecus").html(data_return.CrmWidgetsValues["nbrRecus"]);
    $("#nbrEmis").html(data_return.CrmWidgetsValues["nbrEmis"]);*/
    var htmlFooter = '';


    htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_no_argumente + '</strong> ' + data_return.CrmWidgetsValues.nbrNoArgumente + '</div></div></div>';
    htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_argumente + '</strong> ' + data_return.CrmWidgetsValues.nbrArgumente + ' (' + data_return.CrmWidgetsValues.prctArgumente + '%)</div></div></div>';
    htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_positif + '</strong> ' + data_return.CrmWidgetsValues.nbrPositif + ' (' + data_return.CrmWidgetsValues.prctPositif + '%)</div></div></div>';
    htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_rappel + '</strong> ' + data_return.CrmWidgetsValues.nbrRappel + '</div></div></div>';
    htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_fiches + '</strong> ' + data_return.CrmWidgetsValues.total + '</div></div></div>';
    $("#footer-widgets").html(htmlFooter);
    $("#testDiv").html(htmlFooter);

    if (force_to_deconnect_user == 1) {
        window.location.href = '../login/Deconnect';
    }

}

function verifDebrief(type) {
    if (type == 'in') {

        if (InPause === 1) {
            $('#modal-pause-cafe').modal('hide');
        }


        GoDebrief();
        return false;
    } else if (type == "out") {

    } else {
        CHECKDEBRIEF_VAR_INTERVAL = "";
        if (isbackstretch == 1) {
            if ($('#defaultCountdown').hasClass('is-countdown')) {
                $('#defaultCountdown').countdown('destroy');
                $.backstretch("destroy");
            }

            //InitAgent('MENU', 'fromdebrief');
            //setCrmWidgetsValues();
            //setCrmWidgetsValuesProd();
            $('#production_tabs').hide();
            $('.in_prospect_btn').hide();
            $('.dashboard_panel').show();
            $('.bloc_attente').hide();
            $('.bloc_debrief').hide();
            $("#accordion1").hide();
            $('.dashboard_panel').removeClass('hidden');
            $('.cdashboard').removeClass('in_prod_mode');
            $('.user_logout').show();
            isbackstretch = 0;

        }
    }
    return true;
}

function callIt() {

    name_fichier = window.sessionStorage['name_fichier'];
    num_contact = window.sessionStorage['num_contact'];
    ref_fichier = window.sessionStorage['ref_fichier'];
    ref_campagne = window.sessionStorage['ref_campagne'];
    //InitAgent('MENU', 'fromcontact');
    if (name_fichier) InitProdFiche(1);
    $('#obs_c_tel_histo').val('');
    $('#obs_c_clid_histo').val('');


}

window.addEventListener("beforeunload",


    callIt()
);


function InitAfterValidate() {
    $('#gmaps_api').remove();
    $('[name="gm-master"]').remove();
    $('#ref_mail').val(0);
    $('#ref_fax').val(0);
    $('#ref_sms').val(0);
    $('#set_fichier_to_transfert').val(0);


    $("#calendar_main.my-calendar-rappel").fullCalendar('refetchEvents');
    $('.cdashboard').removeClass('in_prod_mode');
    mainCalendar = false;

    ref_campagne = '';
    ref_fichier = '';
    name_fichier = '';
    name_campagne = '';
    num_contact = '';
    cmk_date_debut_init = "";
    cmk_newfilecreated = "";// definir creation contact vierge
    is_rappel = 0;
    cmktimout = "";
    PREDICTIF_VAR_INTERVAL = "";
    CHECKRAPPEL_VAR_INTERVAL = "";
    CHECKFICHE_VAR_INTERVAL = "";
    CHECKRECEPT_VAR_INTERVAL = "";
    CHECKFICHEPPP_VAR_INTERVAL = "";
    $('.send_mail').hide();
    $('.send_fax').hide();
    $('.send_sms').hide();
    $('.sep_multi_canal').hide();


    /*var is_module_ticket =false;
     if(document.getElementById("cmk_sites_reference_frame") && document.getElementById("cmk_sites_reference_frame").contentWindow.is_module_ticket ){
     is_module_ticket = document.getElementById("cmk_sites_reference_frame").contentWindow.is_module_ticket;
     if(is_module_ticket==true) {
     document.getElementById("cmk_sites_reference_frame").contentWindow.KillstartTime();
     }
     }*/
    $('#obs_c_tel_histo').val('');
    $('#obs_c_clid_histo').val('');

    window.sessionStorage['name_fichier'] = "";
    window.sessionStorage['num_contact'] = "";
    window.sessionStorage['ref_fichier'] = "";
    window.sessionStorage['ref_campagne'] = "";

}

function InitProdFiche(param) {
    $('.send_mail').hide();
    $('.send_fax').hide();
    $('.send_sms').hide();
    $('.sep_multi_canal').hide();
    $("#queues-table").html('');
    $("#loadQueueDiv").hide();
    $('#obs_c_tel_histo').val('');
    $('#obs_c_clid_histo').val('');

    if (param == 2) {
        InitAfterValidate();
    } else {
        if (param != 1) {
            param = 0;
        }

        /*
         console.log('Intialisation de fiche ::' + "name_fichier=" + name_fichier
         + "&num_contact=" + num_contact + "&user=" + user + "&poste="
         + poste + "&ref_fichier=" + ref_fichier + "&param=" + param)
         */


        jQuery.ajax({
            type: 'POST', // Le type de ma requete
            url: 'agent/InitProdFiche', // L'url vers laquelle la requete sera
            data: "name_fichier=" + name_fichier + "&num_contact=" + num_contact
                + "&user=" + user + "&poste=" + poste + "&ref_fichier="
                + ref_fichier + "&ref_campagne=" + ref_campagne + "&clean="
                + param,
            async: false,
            success: function (data_result) {
                InitAfterValidate();
            }
        });
    }


}

function alertRappel(data) {
    if (parseInt(data.escalade) < 1) {
        if (!("Notification" in window)) {
            return;
        } else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var options = {
                body: lbl_rappel_alert,
                //icon : base_url_ajax+'assets/images/'+icon,
                /*data : {
                    idnotif : id,
                    itemid : itemid,
                    itemtype : itemtype,
                    inboundid : inboundid,
                    usertype : user_type
                }*/
            };
            var notification = new Notification('Comunik Contacts', options);
            notification.onclick = function (e) {
                if (userCurrentState == "MENU") {
                    ref_campagne = data.cmk_ref_campagne;
                    ref_fichier = data.cmk_num_groupe;
                    num_contact = data.num_contact;
                    name_fichier = data.cmk_nom_fichier;
                    is_rappel_auto = 0;
                    var id_lost_call = 0;

                    s_is_recept = 0;

                    name_campagne = data.nom_campagne;
                    is_rappel = 1;
                    poste = cmk_poste_user;
                    type_global_prod = data.type_groupe;
                    click_from = '';
                    cmk_manualcall_number = (data.obs_c_tel != '' ? data.obs_c_tel : data.tel1);
                    call_form_search = 0;
                    //GetListmSortatnt();
                    SuccessPlay();
                }
            };
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var options = {
                        body: lbl_rappel_alert,
                        //icon : base_url_ajax+'assets/images/'+icon,
                        /*data : {
                            idnotif : id,
                            itemid : itemid,
                            itemtype : itemtype,
                            inboundid : inboundid,
                            usertype : user_type
                        }*/
                    };
                    var notification = new Notification('Comunik Contacts', options);
                    notification.onclick = function (e) {
                        if (userCurrentState == "MENU") {
                            ref_campagne = data.cmk_ref_campagne;
                            ref_fichier = data.cmk_num_groupe;
                            num_contact = data.num_contact;
                            name_fichier = data.cmk_nom_fichier;
                            is_rappel_auto = 0;
                            var id_lost_call = 0;

                            s_is_recept = 0;

                            name_campagne = data.nom_campagne;
                            is_rappel = 1;
                            poste = cmk_poste_user;
                            type_global_prod = data.type_groupe;
                            click_from = '';
                            cmk_manualcall_number = (data.obs_c_tel != '' ? data.obs_c_tel : data.tel1);
                            call_form_search = 0;
                            //GetListmSortatnt();
                            SuccessPlay();
                        }
                    };
                }
            });
        }
    } else {
        if (userCurrentState == "MENU") {
            ref_campagne = data.cmk_ref_campagne;
            ref_fichier = data.cmk_num_groupe;
            num_contact = data.num_contact;
            name_fichier = data.cmk_nom_fichier;
            is_rappel_auto = 0;
            var id_lost_call = 0;

            s_is_recept = 0;

            name_campagne = data.nom_campagne;
            is_rappel = 1;
            poste = cmk_poste_user;
            type_global_prod = data.type_groupe;
            click_from = '';
            cmk_manualcall_number = (data.obs_c_tel != '' ? data.obs_c_tel : data.tel1);
            call_form_search = 0;
            SuccessPlay();
        }
    }
}

//$.getScript(base_url_cmk + "/js/agent/gestioncontacts.js");
//$.getScript(base_url_cmk + "/js/agent/contactdetails.js");

$(document).on('click', '#ws_search_submit', function () {
    var name_fichier_recept = $(this).data("nomfichier");
    var ref_fichier_recept = $(this).data("reffichier");
    var form_data = $("#ws_search_form").serializeArray();
    var wsId = $(this).data('wsid');
    form_data.push({ 'name': 'wsId', 'value': wsId });
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: form_data,
        url: base_url_ajax + 'agent/agent/searchContactWs',
        success: function (response) {
            DataWS = response.dataws;
            if (table_vierges_WS) table_vierges_WS.destroy();
            $("#ct_Vierges_WS_panel").html('<table id="ct_DT_vierges_WS" class="table table-hover table-striped  table-advanced tablesorter table-condensed tb-sticky-header table-sm display"><thead><tr></tr></thead></table>');
            $("#ct_DT_vierges_WS").hide();
            if (!(Object.keys(DataWS).length === 0 && DataWS.constructor === Object)) {
                $("#ct_DT_vierges_WS").show();
                var columnsWS = [{
                    "title": tableheader_creer_remonter,
                    "defaultContent": "-",
                    "render": function (data, type, full, meta) {
                        return '<a data-ctindex="' + meta.row + '" data-nomfichier="' + name_fichier_recept + '" data-reffichier="' + ref_fichier_recept + '" href="javascript:;" class="call_contact_ws"><i class="fa fa-phone"></i></a>';
                    }
                }];

                if (DataWS.success && DataWS.data) {
                    list_ct_ws = DataWS.data;
                    if (list_ct_ws.length) {
                        var dataKeys = Object.keys(DataWS.data[0]);
                        $.each(dataKeys, function (k, v) {
                            columnsWS.push({
                                "data": v,
                                "title": v
                            });
                            struct_ct_ws.push(v);
                        });
                    }
                    $("#ws_result_title").html((!(Object.keys(DataWS).length === 0 && DataWS.constructor === Object) && DataWS.success && DataWS.data.length > 0 ? 'Contact(s) externe(s) : ' + DataWS.data.length + ' ' + lbl_ctc_exist + ' <small>' + lbl_ctc_ws_exist_help : lbl_no_ctc_ws_help));
                } else {
                    list_ct_ws = DataWS.contacts;
                    $.each(DataWS.structure, function (k, v) {
                        columnsWS.push({
                            "data": k,
                            "title": v
                        });
                        struct_ct_ws.push(v);
                    });
                    $("#ws_result_title").html((!(Object.keys(DataWS).length === 0 && DataWS.constructor === Object) && DataWS.contacts.length > 0 ? 'Contact(s) externe(s) : ' + DataWS.contacts.length + ' ' + lbl_ctc_exist + ' <small>' + lbl_ctc_ws_exist_help : lbl_no_ctc_ws_help));
                }


                table_vierges_WS = $("#ct_DT_vierges_WS").DataTable({
                    "data": list_ct_ws,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],
                    "order": false,
                    "columns": columnsWS
                });
            }

            $("#ct_Vierges_WS_div").show();
        }
    })
})

$(document).on('click', '.call_contact_ws', function () {
    var ctIndex = $(this).data('ctindex');
    var ref_fichier = $(this).data('reffichier');
    var name_fichier = $(this).data('nomfichier');
    var ctData = list_ct_ws[ctIndex];
    $.ajax({
        url: base_url_ajax + "agent/agent/CreateFicheViergeWS",
        type: "post",
        data: {
            ctData: ctData,
            ctStruct: struct_ct_ws,
            group: name_fichier,
            num_group: ref_fichier
        },
        dataType: 'json',
        async: false,
        success: function (data_result) {
            $noCreateFicheViergeWS = data_result.data_prd;
            forceIntercept = false;
            ref_campagne = $noCreateFicheViergeWS.ref_campagne;
            ref_fichier = $noCreateFicheViergeWS.ref_fichier;
            name_campagne = $noCreateFicheViergeWS.name_campagne;

            num_contact = $noCreateFicheViergeWS.num_contact;
            name_fichier = $noCreateFicheViergeWS.name_fichier;
            is_rappel = $noCreateFicheViergeWS.is_rappel;
            type = $noCreateFicheViergeWS.type;
            // cmk_date_debut_init = $noCreateFicheViergeWS.cmk_date_debut_init;
            new_file = $noCreateFicheViergeWS.new_file;
            bbDialog.modal('hide');
            $('#content_ecran_conf').html('');
            SuccessPlay();
        }
    });

})

$(document).on('click', '#recept_search_ctc', function () {
    //$("")
});

function checkRequiredFieldContact(filedContactRequired) {
    $('.editable').parent().find('strong').removeClass('font-red');
    //console.log(filedContactRequired,'filedContactRequiredfiledContactRequiredfiledContactRequiredfiledContactRequiredfiledContactRequiredfiledContactRequiredfiledContactRequired')
    if (filedContactRequired.length > 0) {
        var htmlErrorFieldInfoContact = "";
        $.each(filedContactRequired, function (i, valueField) {
            if ($('#' + valueField).data('value') == "" && $('#' + valueField).text() == "----------") {
                htmlErrorFieldInfoContact += '<p>' + lbl_msg_error_field_contact + ' ' + $('#' + valueField).parent().find('strong').text() + '</p>';
                $('#' + valueField).parent().find('strong').addClass('font-red');
            }
        });

        if (htmlErrorFieldInfoContact != "") {
            show_msg_log(htmlErrorFieldInfoContact, 'error');
            $('.details_info_ctc').show();
            $(".sidebar.top").show();
            $(".sidebar.top").css({ 'top': '0px' });
            return 0;
        } else {


            return 1;
        }
    } else {


        return 1;
    }
}

// Action btn Validation Fiche
$(document)
    .on(
        'click',
        '.valider_fiche',
        function (e) {
            if (cmk_activate_check_connection) {
                if (Offline.state === "down") {
                    alert('Veuillez vérifier votre connexion internet ou contacter votre prestataire!')
                    return false;
                }
            }

            var cmk_commentaires_dupli = $('#cmk_commentaires_dupli').val();

            e.stopImmediatePropagation();
            e.preventDefault();

            var checkReqField = 1;
            if (typeR === "contact_vierge" || typeR === "contact_dupliquer") {
                checkReqField = checkRequiredFieldContact(champs_modifiable_creation_obligatoire);
            } else {
                checkReqField = checkRequiredFieldContact(champs_modifiable_obligatoire);
            }

            if (!checkReqField) {
                return false;
            }

            $('.valider_fiche').attr('disabled', true);
            $("#queues-table").html('');
            $("#loadQueueDiv").hide();

            if (prise_rdv == 1 && rdv_data == false) {
                // $("#DialogQualificationSubmit").modal('hide');
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
                }

                $('[href="#agendapartager"]').tab('show');
                toastr.error(lbl_check_rdv_msg_error);
                $('.valider_fiche').attr('disabled', false);

                return false;
            }

            if (prise_rdv == 0 && rdv_data.length > 0) {
                // $("#DialogQualificationSubmit").modal('hide');
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
                toastr.error(lbl_check_qualif_rdv_error);
                $('.valider_fiche').attr('disabled', false)
                return false;
            }

            // $("#DialogQualificationSubmit").modal('hide');

            if ($('#SCRIPTEUR_cmk_input_type_rappel_perso').is(
                ':checked')) {
                cmk_input_type_rappel_final = 1
            }

            if ($('#SCRIPTEUR_cmk_input_type_rappel_plateau').is(
                ':checked')) {
                cmk_input_type_rappel_final = 2
            }

            var action = $(this).data('action');

            $("#DialogQualificationSubmit").modal('hide');
            $.LoadingOverlay("show");
            SendPostTmp();

            TimeoutValiderFichie = setTimeout(
                function () {

                    ValiderFiche(
                        {
                            user: user,
                            ref_fichier: ref_fichier,
                            name_fichier: name_fichier,
                            num_contact: num_contact,
                            ref_campagne: ref_campagne,
                            name_campagne: name_campagne,
                            cmk_date_debut_init: cmk_date_debut_init,
                            poste: poste,
                            cmk_id_qualification: num_qualification,
                            cmk_date_debut: cmk_date_debut,
                            cmk_commentaires: cmk_commentaires_dupli,
                            cmk_input_type_rappel_final: cmk_input_type_rappel_final,
                            date_rappel: $('#date_rappel')
                                .val(),
                            type_qualifcation: type_qualifcation,
                            argumente: argumente,
                            tel_rappel_cmk: $('#tel_rappel_cmk').val(),
                            tel_prefered_cmk: $('#tel_prefered_cmk').val(),
                            voip_quality: $('#voip_quality')
                                .val(),
                            rgpd_qualif: $('#rgpd_qualif')
                                .val(),
                            ref_mail: $('#ref_mail').val(),
                            ref_sms: $('#ref_sms').val(),
                            ref_fax: $('#ref_fax').val(),
                            ref_depot: $('#ref_depot').val(),
                            rdv_data: rdv_data,
                            num_commande: globalNumerosCommandes,
                            obs_c_tel_histo: $('#obs_c_tel_histo').val(),
                            obs_c_clid_histo: $('#obs_c_clid_histo').val(),
                            transfered: is_transfered,
                            ID_HISTO_REMONTE: window.sessionStorage['id_last_remonte'],
                            COMM_ALL_rdv: $("#rdvResumeHidden").text(),
                            is_reception: is_reception,
                            CMK_type_remonte: $("#type_remonte").val(),
                            set_fichier_to_transfert: $('#set_fichier_to_transfert').val()
                        }, action);

                }, 500);

        });

$(document).on('click', '.qualify', function () {


    if ($('#ref_qualif_prd_man').val() == "") {
        show_msg_log(lbl_warning_select_qualification, 'warning');
        return false;
    }


    QualifierFiche($('#ref_qualif_prd_man').val(), '', '', '', '', '', '');

    return false;

})
$(document).on('click', '.valider_man_prod', function () {

    if (cmk_activate_check_connection) {

        if (Offline.state === "down") {
            alert('Veuillez vérifier votre connexion internet ou contacter votre prestataire!')
            return false;
        }
    }

    $("#queues-table").html('');
    $("#loadQueueDiv").hide();

    if ($('#SCRIPTEUR_cmk_input_type_rappel_perso').is(
        ':checked')) {
        cmk_input_type_rappel_final = 1
    }

    if ($('#SCRIPTEUR_cmk_input_type_rappel_plateau').is(
        ':checked')) {
        cmk_input_type_rappel_final = 2
    }
    $("#DialogQualificationSubmit").modal('hide');
    $.LoadingOverlay("show");
    var action = $(this).data('action');



    var commentaire = $('#cmk_man_file_comment').val();
    commentaire = (commentaire == "") ? $('#cmk_commentaires_dupli').val() : commentaire;


    setTimeout(
        function () {

            ValiderFiche(
                {
                    user: user,
                    ref_fichier: ref_fichier,
                    name_fichier: name_fichier,
                    num_contact: num_contact,
                    ref_campagne: ref_campagne,
                    name_campagne: name_campagne,
                    cmk_date_debut_init: cmk_date_debut_init,
                    poste: poste,
                    cmk_id_qualification: num_qualification,
                    cmk_date_debut: cmk_date_debut,
                    cmk_commentaires: commentaire,
                    cmk_input_type_rappel_final: cmk_input_type_rappel_final,
                    date_rappel: $('#date_rappel')
                        .val(),
                    type_qualifcation: type_qualifcation,
                    argumente: argumente,
                    tel_rappel_cmk: $('#tel_rappel_cmk').val(),
                    tel_prefered_cmk: $('#tel_prefered_cmk').val(),
                    voip_quality: $('#voip_quality')
                        .val(),
                    rgpd_qualif: $('#rgpd_qualif')
                        .val(),
                    ref_mail: '',
                    ref_sms: '',
                    ref_fax: '',
                    ref_depot: '',
                    rdv_data: '',
                    num_commande: 0,
                    current_ecran: '',
                    obs_c_tel_histo: $('#obs_c_tel_histo').val(),
                    obs_c_clid_histo: $('#obs_c_clid_histo').val(),
                    transfered: is_transfered,
                    nom: $('#cmk_man_file_name').val(),
                    tel: $('#cmk_manualcall_number').val(),
                    ID_HISTO_REMONTE: window.sessionStorage['id_last_remonte'],
                    COMM_ALL_rdv: $("#rdvResumeHidden").text(),
                    is_reception: is_reception

                }, action);

        }, 500);
});


//Enregistre les données scripteur sans nouvelle qualification


$(document)
    .on(
        'click',
        '.btn_save',
        function () {
            if (cmk_activate_check_connection) {

                if (Offline.state === "down") {
                    alert('Veuillez vérifier votre connexion internet ou contacter votre prestataire!')
                    return false;
                }
            }

            $.LoadingOverlay("show");
            SendPostTmp();

            setTimeout(
                function () {

                    ValiderFiche(
                        {
                            user: user,
                            ref_fichier: ref_fichier,
                            name_fichier: name_fichier,
                            num_contact: num_contact,
                            ref_campagne: ref_campagne,
                            name_campagne: name_campagne,
                            cmk_date_debut_init: cmk_date_debut_init,
                            poste: poste,
                            cmk_id_qualification: num_qualification,
                            cmk_date_debut: cmk_date_debut,
                            cmk_commentaires: $(
                                '#cmk_commentaires').val(),
                            cmk_input_type_rappel_final: cmk_input_type_rappel_final,
                            date_rappel: $('#date_rappel')
                                .val(),
                            type_qualifcation: type_qualifcation,
                            argumente: argumente,
                            tel_rappel_cmk: $('#tel_rappel_cmk').val(),
                            tel_prefered_cmk: $('#tel_prefered_cmk').val(),
                            voip_quality: $('#voip_quality')
                                .val(),
                            rgpd_qualif: $('#rgpd_qualif')
                                .val(),
                            ref_mail: $('#ref_mail').val(),
                            ref_sms: $('#ref_sms').val(),
                            ref_fax: $('#ref_fax').val(),
                            ref_depot: $('#ref_depot').val(),
                            rdv_data: rdv_data,
                            num_commande: globalNumerosCommandes,
                            current_ecran: $('#current_ecran').val(),
                            obs_c_tel_histo: $('#obs_c_tel_histo').val(),
                            obs_c_clid_histo: $('#obs_c_clid_histo').val(),
                            transfered: is_transfered,
                            ID_HISTO_REMONTE: window.sessionStorage['id_last_remonte'],
                            COMM_ALL_rdv: $("#rdvResumeHidden").text(),
                            is_reception: is_reception,
                            set_fichier_to_transfert: $('#set_fichier_to_transfert').val()


                        }, 'save_data_only');

                }, 500);


        });


// Extra link

$(document)
    .on(
        'click',
        '.extra_link_action',
        function () {
            SendPostTmp(current_ecran);
            var data_param = $(this).data('param');
            var data_query = $(this).data('query');
            data_query = data_query.toString();
            data_param = data_param.toString();
            var btnid = $(this).data('btnid');
            var form_id_origine = $(this).data('form_id');
            var value_element = "";
            data_form_extra = {};
            if (data_param != "") {
                var params_querys = data_param.split('___');
                var vals_querys = data_query.split('___');

                $
                    .each(
                        params_querys,
                        function (index, value) {

                            value_element = vals_querys[index];

                            var explode_value_element = (ContainString(value_element, 'input_elem')) ? value_element.split('_') : value_element;

                            //console.log(explode_value_element);
                            if (Array.isArray(explode_value_element)) {
                                var form_id_value = ((explode_value_element.length) == 4 && explode_value_element[3] != 'other') ? explode_value_element[3]
                                    : explode_value_element[2];
                                form_id_value = form_id_value
                                    .replace('[]', '');

                                if (form_id_value == form_id_origine) {
                                    if (ContainString(
                                        value_element, '[]')) {
                                        value_element = $(
                                            '[name="'
                                            + value_element
                                            + '"]:checked')
                                            .map(
                                                function (_,
                                                    el) {

                                                    return $(
                                                        el)
                                                        .val();
                                                })
                                            .get();
                                        value_element = value_element
                                            .join(';');
                                    } else {
                                        value_element = $(
                                            '[name="'
                                            + value_element
                                            + '"]')
                                            .val();
                                    }

                                }

                            }

                            data_form_extra[value] = value_element;
                        });

            }
            data_form_extra['url'] = $(this).data('url');
            data_form_extra['methode'] = $(this).data('methode');
            data_form_extra['form_id'] = form_id_origine;
            data_form_extra['ref_campagne'] = ref_campagne;
            data_form_extra['name_fichier'] = name_fichier;
            data_form_extra['num_contact'] = num_contact;
            data_form_extra['num_user'] = user;
            data_form_extra['ref_fichier'] = ref_fichier;
            data_form_extra['query_rest'] = $(this).data('query-rest');
            data_form_extra['send_contact'] = $(this).data('send-contact');

            data_form_extra['param_querys'] = $(this).data('param');
            data_form_extra['actionws'] = $(this).data('actionws');
            data_form_extra['ws'] = $(this).data('ws');
            //return false;
            var data_return_content = "";
            $.ajax({
                type: 'POST',
                url: base_url_ajax + 'formbuilder/formbuilder/redirection_url', // L'url
                async: false,
                data: data_form_extra,
                success: function (data_return_content, textStatus, jqXHR) {
                    $('.content_extra_link_' + btnid).html(data_return_content)
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Une erreur s'est produite lors de la requete
                }
            });

            $.ajax({
                type: 'POST',
                url: base_url_ajax + 'formbuilder/formbuilder/LoadDataFormTemp', // L'url
                async: false,
                data: data_form_extra,
                dataType: 'json',
                success: function (data_return, textStatus, jqXHR) {
                    populateForm($('.content_extra_link_' + btnid), data_return);
                    populateFormById($('.content_extra_link_' + btnid), data_return)

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Une erreur s'est produite lors de la requete
                }
            })


        });

function populateFormById($form, data) {
    $.each(data, function (keys, object) {

        $.each(object, function (key, value) {

            //console.log(value);
            var $ctrl = $form.find('[id=' + key + ']');
            if ($ctrl.is('select')) {

                $ctrl.select2('val', value);
                $('option', $ctrl).each(function () {
                    if (this.value == value)
                        this.selected = true;

                });

            } else if ($ctrl.is('textarea')) {
                $ctrl.val(value);
            } else {
                switch ($ctrl.attr("type")) {
                    case "text":
                    case "hidden":
                        $ctrl.val(value);
                        break;
                    case "checkbox":
                    case "radio":

                        if ($('input[id="' + key + '"]').attr('value') == value) {

                            $('input[id="' + key + '"]').attr('checked', true);
                        } else {
                            $('input[id="' + key + '"]').attr('checked', false);

                        }


                        break;

                }
            }
            $.uniform.update();
        });

    });
}

function populateForm($form, data) {
    $.each(data, function (key, value) {

        var $ctrl = $form.find('[name=' + key + ']');
        if ($ctrl.is('select')) {

            $ctrl.select2('val', value);
            $('option', $ctrl).each(function () {
                if (this.value == value)
                    this.selected = true;

            });

        } else if ($ctrl.is('textarea')) {
            $ctrl.val(value);
        } else {
            switch ($ctrl.attr("type")) {
                case "text":
                case "hidden":
                    $ctrl.val(value);
                    break;
                case "checkbox":
                case "radio":

                    if ($('input[name="' + key + '"]').attr('value') == value) {

                        $('input[name="' + key + '"]').attr('checked', true);
                    } else {
                        $('input[name="' + key + '"]').attr('checked', false);

                    }


                    break;

            }
        }
        $.uniform.update();
    });
}

// Retour Historique
$(document).on('click', '.backward', function (e) {
    e.preventDefault();
    set_previous_active = 1;
    var previous = $('#previous').val();
    SubmitToEcranSuivant(previous, '', '', '', '', set_previous_active)
});

function LinkToContact(value, linkchamps) {
    /*console.log("value :: " + value + " pk :: " + ref_campagne + " name ::"
     + linkchamps)
     */
    $
        .ajax({
            type: "POST",
            url: base_url_ajax + 'agent/agent/UpdateContact?num_contact='
                + num_contact + "&name_fichier=" + name_fichier,
            data: "pk=" + ref_campagne + "&value=" + value + "&name="
                + linkchamps,
            global: false

        });
}

// Hamma Validation RDV*
$("#btn-save-rdv,#btn-save-rdv-script").click(function (ev) {
    ev.preventDefault();

    if ($("#type_rdv").val() == '')
        return false;
    rdv_data = $("#rdvform").serializeArray();
    rdv_start_date = $("#date-rdv").val();
    $("#rdvPrisComm").text($("#comm-rdv option[value='" + $("#comm-rdv").val() + "']").data("nomcomm"));
    $("#rdvPrisEtat").text($("#type_rdv option[value='" + $("#type_rdv").val() + "']").data("label"));
    $("#rdvPrisEtat").css("background-color", $("#type_rdv option[value='" + $("#type_rdv").val() + "']").data("colorcode"));
    $("#rdvPrisObs").text("Observation : " + $("#obsv-rdv").val());
    var momentRdv = moment($("#date-rdv").val(), 'YYYY-MM-DD HH:mm:ss');
    $("#rdvPrisDate").html("<i class='fa fa-calendar'></i> " + momentRdv.format('DD/MM/YYYY HH:mm'));
    $("#modal-rdv").modal("hide");
    clearInterval(CALENDAR_VAR_INTERVAL);
    $("#rdvDiv").show().prependTo("#rdvHistoryDiv");

    //$("#rdvResumeHidden").text($("#comm-rdv").val()+";;;"+$("#type_rdv").val()+";;;"+$("#obsv-rdv").val()+";;;"+moment($("#date-rdv").val(),'YYYY-MM-DD HH:mm:ss'));
    $("#rdvResumeHidden").text($("#comm-rdv").val() + ";;;" + $("#type_rdv").val() + ";;;" + $("#obsv-rdv").val() + ";;;" + $("#date-rdv").val());
    //$("#calendar").fadeOut(function() {
    //  $("#rdvDiv").fadeIn();
    //});
    if (ev.currentTarget.attributes.id.value == 'btn-save-rdv-script') $("[href='#Phonning']").tab("show");
    else $("[href='#agendahisto']").tab("show");
    toastr.success(lbl_add_rdv_success);
});

function setCrmWidgetsValuesProd() {

    $.ajax({
        type: "POST",
        url: base_url_ajax + "agent/agent/getCrmWidgets",
        data: {
            date_begin: moment().format("YYYY-MM-DD"),
            date_end: moment().format("YYYY-MM-DD"),
            user: user,
            //onlyProd: true,
        },
        dataType: "json",
        success: function (data_result) {
            //console.log(data_result)
            $("#connectedAgents").html(data_result["connectedAgents"]);
            $("#currentCompains").html(data_result["currentCompains"]);
            $("#prodTime").html(data_result["prodTime"]);
            $("#cafeTime").html(data_result["cafeTime"]);
            $("#debriefTime").html(data_result["debriefTime"]);
            $("#presenceTime").html(data_result["presenceTime"]);

            $("#filesStats").html(data_result["filesStats"]);
            $("#nbrArgumente").html(data_result["nbrArgumente"]);
            $("#nbrNoArgumente").html(data_result["nbrNoArgumente"]);
            $("#prctArgumente").html(data_result["prctArgumente"]);
            $("#nbrPositif").html(data_result["nbrPositif"]);
            $("#prctPositif").html(data_result["prctPositif"]);
            $("#prctPositifArg").html(data_result["prctPositifArg"]);
            $("#nbrRappel").html(data_result["nbrRappel"]);
            $("#nbrRDV").html(data_result["total"]);
            $("#nbrRecus").html(data_result["nbrRecus"]);
            $("#nbrEmis").html(data_result["nbrEmis"]);
            var htmlFooter = '';
            if (data_result['objectifResult'] && data_result['objectifResult'] == "show_message" && data_result['objectifMessage'] && data_result['objectifMessage'] != '') {
                $.scojs_message(data_result['objectifMessage'], 2);
            }


            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_no_argumente + '</strong> ' + data_result.nbrNoArgumente + '</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_argumente + '</strong> ' + data_result.nbrArgumente + ' (' + data_result.prctArgumente + '%)</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_positif + '</strong> ' + data_result.nbrPositif + ' (' + data_result.prctPositif + '%)</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_rappel + '</strong> ' + data_result.nbrRappel + '</div></div></div>';
            htmlFooter += '<div class="stat-right pull-right" style ="margin-right:5px"><div class="stat-number"><div class="title font-blue"><strong>' + lbl_agent_stats_fiches + '</strong> ' + data_result.total + '</div></div></div>';
            $("#footer-widgets").html(htmlFooter);
            $("#testDiv").html(htmlFooter);
            /*
             * $("#prctRDV").html(data_result["prctRDV"]);
             * $("#prctRDVArg").html(data_result["prctRDVArg"]);
             */

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Une erreur s'est produite lors de la requete
            show_msg_log("error", " Erreur :: " + textStatus + " :: "
                + errorThrown);
        }

    });

}

function InitAgent(type, from) {
    var ufrom = "";
    fromcontact = false, fromdebrief = false;
    switch (from) {
        case 'fromcontact':
            fromcontact = true;
            fromdebrief = false;

            break;
        case 'fromdebrief':
            fromdebrief = true;
            fromcontact = false;

            break;
    }
    ref_fichier = (ref_fichier) ? ref_fichier : -1;
    ref_campagne = (ref_campagne) ? ref_campagne : -1;
    num_contact = (num_contact) ? num_contact : -1;
    fromcontact = (fromcontact) ? 1 : 0;
    fromdebrief = (fromdebrief) ? 1 : 0;
    $.ajax({
        type: "POST",
        url: "agent/InitEtatAgent/" + user + "/" + cmk_groupe_comptence + "/" + poste + "/" + nom_login + "/" + ref_fichier + "/" + ref_campagne + "/" + num_contact + "/" + type + "/" + fromcontact + "/" + fromdebrief,
        async: false,
        global: false,
        success: function (data_return) {
            //console.log(data_return)
        }
    });
    if (type == "MENU") {
        $('.print_pdf').html('');
        $('#print_pdf').hide();
        //GetJournalAppel();
        if (from != "") LoadInterfaceAgentSKILS();
        $('#obs_c_tel_histo').val('');
        $('#obs_c_clid_histo').val('');
        call_form_search = 0;
        //$('.my-calendar-rappel').fullCalendar('destroy');
        if (!fromdebrief) $("#calendar_main.my-calendar-rappel").fullCalendar('refetchEvents');
        //loadConfRappel();
    }

    //$.getScript(base_url_cmk + "/js/agent/interface_agent.js");

}


$('#modal-jobs').on('shown.bs.modal', function (e) {
    // do something...
    fetchMyJobs();
});
// pause café
$('#modal-pause-cafe').on('shown.bs.modal', function (e) {
    // do something...
    InPause = 1;
    sendToPause(0);
    $('#defaultCountdownCafe').countdown({
        since: 0,
        format: 'HMS'
    });
});


$('#modal-pause-cafe').on('hide.bs.modal', function (e) {
    // do something...
    InPause = 0;

    sendToNotPause();
    $('#defaultCountdownCafe').countdown('destroy');
    //setCrmWidgetsValues();
    setCrmWidgetsValuesProd();
    if (auto_prod_reception == 1) checkFicheRecept();
});

$('#ErrorMod').on('hidden.bs.modal', function (e) {
    $('#error-message-wrapper').html('')
});

$("body").on("shown.bs.tab", "a[data-toggle='tab'][href='#agendapartager']",
    function () {
        if (mainCalendar) {
            $("#calendar").fullCalendar("refetchEvents");
        }
        CALENDAR_VAR_INTERVAL = setInterval(fetchDispo, 180000);
    });

$("body").on("hidden.bs.tab", "a[data-toggle='tab'][href='#agendapartager']",
    function () {
        clearInterval(CALENDAR_VAR_INTERVAL);
    });
var date_begin_pause = "";
var last_id_pause;

function sendToPause(idpause) {
    InPause = 1;
    last_id_pause = idpause;
    var trace = idpause != 0 ? 1 : 0;
    var datatopost = 'cmk_switch_function=CMK_PAUSECAFE_USER' + '&user=' + user
        + '&onContact=0&poste=' + poste + "&trace=" + trace + "&ref_pause=" + idpause + "&ref_groupe_competence=" + cmk_groupe_comptence;
    $.ajax({
        url: "agent/switch_call", // alert(datatopost);
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        dataType: 'JSON',
        data: datatopost,
        success: function (data_result) {
            date_begin_pause = data_result.debut;
            last_id_trace_pause_generic = data_result.trace;
        }
    });
}

function sendToPauseGeneric(id_pause) {
    $.ajax({
        url: "agent/TracePause", // alert(datatopost);
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        async: false,
        data: {
            ref_user: user,
            ref_groupe_competence: cmk_groupe_comptence,
            ref_pause: id_pause,

        },
        success: function (data_result) {
            last_id_trace_pause_generic = data_result
        }
    });
}

function sendToNotPauseGeneric() {
    $.ajax({
        url: "agent/updateTracePause", // alert(datatopost);
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        async: false,
        data: {
            id: last_id_trace_pause_generic,

        },
        success: function (data_result) {
        }
    });
}

function sendToNotPause() {
    var datatopost = 'cmk_switch_function=CMK_REMOVE_PAUSECAFE_USER' + '&user='
        + user + '&onContact=0&poste=' + poste + "&date_begin_pause=" + date_begin_pause + "&cmk_groupe_competence=" + cmk_groupe_comptence + "&ref_pause=" + last_id_pause;
    $.ajax({
        url: "agent/switch_call", // alert(datatopost);
        type: "post", // 'get' or 'post', override for form's 'method'
        // attribute
        data: datatopost, // override for form's 'action' attribute

        success: function (data_result) {
            // alert(data_result);
            date_begin_pause = "";
        }
    });
}

// /OPing

function ping(ip, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('responded');

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('responded', e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {

            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}

function CountFacebookApp() {
    $.ajax({
        url: base_url_ajax + "agent/agent/CountFacebookApp",
        async: false,
        success: function (data_count_fb) {
            count_fb = data_count_fb
        }
    });

    if (count_fb > 0) {
        $('#li_facebook').show();
        $.getScript(base_url_cmk + "/js/facebook/facebook.js", function (data, textStatus, jqxhr) {
        });

    } else {
        $('#li_facebook').hide();
    }
}

function PingHttp() {
    $('#li_facebook').hide();
    $.ajax({
        url: base_url_ajax + "agent/agent/PingHttp",
        data: {
            host: 'https://www.facebook.com'
        },
        type: "get",
        success: function (data_result) {
            //console.log(data_result,'PingHttp');

            $.ajax({
                url: base_url_ajax + "agent/agent/CountFacebookApp",
                async: false,
                success: function (data_count_fb) {
                    count_fb = data_count_fb
                }
            });

            if (data_result == '1' && count_fb > 0) {
                $('#li_facebook').show();
                $.getScript(base_url_cmk + "/js/facebook/facebook.js", function (data,
                    textStatus, jqxhr) {
                    //console.log(data); // Data returned
                    //console.log(textStatus); // Success
                    //console.log(jqxhr.status); // 200
                    //console.log("Load js facebook.js was performed.");
                });

            } else {
                $('#li_facebook').hide();
            }

        }
    });
}


// Randomize Table Scripteur

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Randomize Table Scripteur
function RandomizeResponse() {
    var TAB_NUM_FIELD = [];
    $.each($("tbody tr.rotate").closest('div'), function (index, obj) {
        //console.log($(this).attr('data-numfield'))
        TAB_NUM_FIELD.push($(this).attr('data-numfield'));
    });
    var is_mtx = 0;
    $.each(TAB_NUM_FIELD, function (index, num_field) {


        if ($('.seqinverted_' + num_field).val() == "") {

            var elems = $("div[data-numfield='" + num_field + "'] tbody tr.rotate");
            if (elems.hasClass('matrix')) {
                is_mtx = 1;
            }
            var newElemsFirst = [];
            var newElems = [];
            var elems_not_rotate = $("div[data-numfield='" + num_field + "'] tbody tr:not(.rotate)");
            var newElems_not_rotate = [];
            var newElems_all = [];
            // The number of answers to be fixed at the end of the list
            var fixedAnswers = 0;


            $("div[data-numfield='" + num_field + "'] tbody tr.rotate").each(function () {
                newElemsFirst.push($(this).closest('tr'));

            });
            //console.log(newElemsFirst,'NEW');
            //console.log()


            $("div[data-numfield='" + num_field + "'] tbody tr").each(function () {

                if (!$(this).hasClass('rotate')) {
                    newElems_all.push($(this).closest('tr'));

                } else {
                    newElems_all.push('');

                }
                $(this).remove();
            });


            newElems = shuffle(newElemsFirst);
            var position = Math.floor(Math.random() * newElems.length);
            newElems = rotation(newElems, position, num_field, is_mtx);


            //Ordre Alèatoire
            var count = 0;
            var seq = [];
            var seq_inverted = [];

            $.each(newElems_all, function (k, val) {
                //console.log(val,'contenu');
                if (val != "") {
                    valeur = (!is_mtx) ? val.find('[type="checkbox"],[type="radio"]').val() : val.find('[type="checkbox"],[type="radio"]').data('valeur-ligne');

                    $("div[data-numfield='" + num_field + "'] tbody").append(val);
                } else {
                    $.each(newElems, function (ki, vali) {
                        if (count == ki) {
                            $("div[data-numfield='" + num_field + "'] tbody").append(vali);
                            valeur = (!is_mtx) ? vali.find('[type="checkbox"],[type="radio"]').val() : vali.find('[type="checkbox"],[type="radio"]').data('valeur-ligne');
                            seq_inverted.push(valeur);

                        }
                    });


                    count++;
                }
                // if(valeur!=undefined)  console.log(valeur,'Sequence');

                if (valeur != undefined) seq.push(valeur);

            });
            if ($('.readseq_' + num_field).val() == "") {
                $('.readseq_' + num_field).val(seq.join(','));
                $('.readseq_' + num_field).html(seq.join(','));
            }
            $('.seqinverted_' + num_field).val(seq_inverted.join(','));

        } else {
            $('.readseq_' + num_field).html($('input.readseq_' + num_field).val());
            $('.seqinverted_' + num_field).html($('input.seqinverted_' + num_field).val());
            var firs_seq = $('input.readseq_' + num_field).val();
            if (firs_seq != "" && firs_seq != undefined) {

                Tfirst = firs_seq.split(',');
                $('.readfirst_' + num_field).html(Tfirst[0])
            }

        }


    });
}


function rotation(arrData, position, num_field, is_mtx) {
    var newArr = arrData.slice();
    var arrLen = newArr.length;

    var num = (position < 0) ? arrLen - (position % arrLen) : position % arrLen;
    var firstelem = (!is_mtx) ? arrData[num].find('[type="checkbox"],[type="radio"]').val() : arrData[num].find('[type="checkbox"],[type="radio"]').data('valeur-ligne');
    if ($('.readfirst_' + num_field).val() == "") {
        $('.readfirst_' + num_field).val(firstelem);
        $('.readfirst_' + num_field).html(firstelem);
    }

    var tempArr = newArr.splice(0, num);
    //newArr.push.apply(newArr, (tempArr.shuffle()).sort());
    newArr.push.apply(newArr, tempArr);

    return newArr;
}

function RandomizeResponseCircle() {


    var TAB_NUM_FIELD = [];
    $.each($("tbody tr.rotate_circle").closest('div'), function (index, obj) {
        //console.log($(this).attr('data-numfield'))
        TAB_NUM_FIELD.push($(this).attr('data-numfield'));
    });
    var is_mtx = 0;
    $.each(TAB_NUM_FIELD, function (index, num_field) {


        if ($('.seqinverted_' + num_field).val() == "") {
            var elems = $("div[data-numfield='" + num_field + "'] tbody tr.rotate_circle");
            if (elems.hasClass('matrix')) {
                is_mtx = 1;
            }
            var newElemsFirst = [];
            var newElems = [];
            var elems_not_rotate = $("div[data-numfield='" + num_field + "'] tbody tr:not(.rotate_circle)");
            var newElems_not_rotate = [];
            var newElems_all = [];
            // The number of answers to be fixed at the end of the list
            var fixedAnswers = 0;


            $("div[data-numfield='" + num_field + "'] tbody tr.rotate_circle").each(function () {
                newElemsFirst.push($(this).closest('tr'));

            });
            //console.log(newElemsFirst,'NEW');
            var position = Math.floor(Math.random() * newElemsFirst.length);
            newElems = rotation(newElemsFirst, position, num_field, is_mtx);
            //console.log()


            $("div[data-numfield='" + num_field + "'] tbody tr").each(function () {

                if (!$(this).hasClass('rotate_circle')) {
                    newElems_all.push($(this).closest('tr'));

                } else {
                    newElems_all.push('');

                }
                $(this).remove();
            });


            //Ordre Alèatoire
            var count = 0;
            var seq = [];
            var seq_inverted = [];
            $.each(newElems_all, function (k, val) {
                //console.log(val,'contenu');
                if (val != "") {
                    valeur = (!is_mtx) ? val.find('[type="checkbox"],[type="radio"]').val() : val.find('[type="checkbox"],[type="radio"]').data('valeur-ligne');

                    $("div[data-numfield='" + num_field + "'] tbody").append(val);
                } else {
                    $.each(newElems, function (ki, vali) {
                        if (count == ki) {
                            $("div[data-numfield='" + num_field + "'] tbody").append(vali);
                            valeur = (!is_mtx) ? vali.find('[type="checkbox"],[type="radio"]').val() : vali.find('[type="checkbox"],[type="radio"]').data('valeur-ligne');
                            seq_inverted.push(valeur);

                        }
                    });


                    count++;
                }
                if (valeur != undefined) seq.push(valeur);

            });

            if ($('.readseq_' + num_field).val() == "") {
                $('.readseq_' + num_field).val(seq.join(','));
                $('.readseq_' + num_field).html(seq.join(','));
            }
            $('.seqinverted_' + num_field).val(seq_inverted.join(','));
        } else {
            $('.readseq_' + num_field).html($('input.readseq_' + num_field).val());
            $('.seqinverted_' + num_field).html($('input.seqinverted_' + num_field).val());
            var firs_seq = $('input.readseq_' + num_field).val();
            if (firs_seq != "" && firs_seq != undefined) {

                Tfirst = firs_seq.split(',');
                $('.readfirst_' + num_field).html(Tfirst[0])
            }

        }


    });


}

(function ($, global) {

    var _hash = "!", noBackPlease = function () {
        global.location.href += "#";

        setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };

    global.setInterval(function () {
        if (global.location.hash != _hash) {
            global.location.hash = _hash;
        }
    }, 100);

    global.onload = function () {
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        $(document.body).keydown(function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which == 8 && elm !== 'input' && elm !== 'textarea') {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        });
    }

})(jQuery, window);


//Get List Numéro sortant

function GetListmSortatnt() {
    $.ajax({
        url: "agent/GetListNumSortant", // override for form's 'action' attribute
        type: "post",
        data: "cmk_groupe_comptence=" + cmk_groupe_comptence + "&groupe=" + ref_fichier + "&call_form_search=" + call_form_search + '&type_pord=' + type_global_prod,
        async: false,
        global: false,
        success: function (data_result) {

            $('#cmk_select_numsortant').html(data_result);
            $("select#cmk_select_numsortant")
                .change(function () {
                    //  console.log('wajdi change');
                    var x = $(this).val();
                    //  console.log(x);
                    if (x == 'Anonymous') { $('#info_bul_note_anonyme').show(); } else { $('#info_bul_note_anonyme').hide(); }
                })
                .change();

        }
    });

    $("#cmk_select_numsortant").val($("#cmk_select_numsortant option:first").val()).trigger("change");


}

var status_call = 0;

//Etat Comm Agent

function checkStatusCall(data) {
    //console.log('checkStatusCall')
    if (typeof oSipStack != "undefined") {
        if (oSipSessionCall == null) {
            $('.etat_comm_agent').hide();
        }
    }
    var flag = false;
    $.each(data, function (k, v) {
        obs_c_tel_histo = $('#obs_c_tel_histo').val();
        if (sRemoteNumber) {
            TsRemoteNumber = sRemoteNumber.split(' ');
            sRemoteNumber = TsRemoteNumber[0];//$('#cmk_manualcall_number').val();
        } else {
            Tobs_c_tel_histo = obs_c_tel_histo.split(',');
            sRemoteNumber = (Tobs_c_tel_histo.length == 1) ? obs_c_tel_histo : Tobs_c_tel_histo[Tobs_c_tel_histo.length];
        }
        sRemoteNumber = (!sRemoteNumber) ? telcall_auto_trans : sRemoteNumber;
        $('.encomm_msg').append(' [' + sRemoteNumber + ']');

        if (v.poste == cmk_poste_user) {
            var status_str = '<span class="badge bg-green encomm_msg"> <i class="fa fa-phone"></i> En communication ' + v.time_diff + '</span>';
            $('.etat_comm_agent').html(status_str);
            $('.hangup_call').prop('disabled', false);
            $('.originate_call').addClass('hidden');
            $('.hangup_call').removeClass('hidden');
            $('.GetTransfert').removeClass('hidden');
            $('.in_call').removeClass('hidden').trigger("in_call_change");
            $('.in_call_hold').addClass('hidden');

            if (splitrecording == "1") {
                $('.splitrecording').show();
            } else {
                $('.splitrecording').hide();
            }
            flag = true;
            return false;
        }
    })
    if (!flag) {
        var status_str = '<span class="badge bg-gray" > <i class="fa fa-phone"></i> ' + lbl_aucun_appel + '</span>';
        $('.etat_comm_agent').html(status_str);
        //$('.hangup_call').prop('disabled', true);

        $('.originate_call').removeClass('hidden');
        $('.hangup_call').addClass('hidden');
        $('.GetTransfert').addClass('hidden');
        $('.in_call').addClass('hidden').trigger("in_call_change");
        $('.splitrecording').hide();
    }
}
$('.in_call').on('in_call_change', function () {

    var incallClassHide = $(this).hasClass('hidden');

    if (incallClassHide) {
        if (appel_manuel == 1) {
            $('#li_appel_manuel').show();
        }

    } else {
        $('#li_appel_manuel').hide();

    }


});
function startTimerPoste(start) {
    //if (ONLINE_TIMER) return false;
    //console.log('checkStatusCall')
    if (typeof oSipStack != "undefined") {
        if (oSipSessionCall == null) {
            $('.etat_comm_agent').hide();
        }
    }
    stopTimerPoste();
    var onlineTimer = start;
    ONLINE_TIMER = setInterval(function () {
        var hours = Math.floor(onlineTimer / 3600);
        var rest = onlineTimer % 3600;
        var minutes = Math.floor(rest / 60);
        var seconds = rest % 60;
        var status_str = '<span class="badge bg-green encomm_msg"> <i class="fa fa-phone"></i> ' + lbl_appel_en_cours + ' ' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + ' [' + ONLINE_WITH + ']</span>';
        $('.etat_comm_agent').html(status_str);
        $('.etat_comm_agent').show();
        onlineTimer++;
    }, 1000);
}

function stopTimerPoste() {
    clearInterval(ONLINE_TIMER);
    ONLINE_TIMER = false;
}

function onlinePoste(data) {
    if (data.poste == cmk_poste_user) {
        obs_c_tel_histo = $('#obs_c_tel_histo').val();
        if (sRemoteNumber) {
            TsRemoteNumber = sRemoteNumber.split(' ');
            sRemoteNumber = TsRemoteNumber[0];//$('#cmk_manualcall_number').val();
        } else {
            Tobs_c_tel_histo = obs_c_tel_histo.split(',');
            sRemoteNumber = (Tobs_c_tel_histo.length == 1) ? obs_c_tel_histo : Tobs_c_tel_histo[Tobs_c_tel_histo.length];
        }
        sRemoteNumber = (!sRemoteNumber) ? telcall_auto_trans : sRemoteNumber;
        ONLINE_WITH = data.phone;
        //$('.encomm_msg').append(' ['+sRemoteNumber+']');
        if (!data.notimer) {
            var startTime = 0;
            if (data.started && data.now) startTime = parseInt(data.now) - parseInt(data.started);
            startTimerPoste(startTime);
        }
        $('.hangup_call').prop('disabled', false);
        $('.originate_call').addClass('hidden');
        $('.hangup_call').removeClass('hidden');
        $('.GetTransfert').removeClass('hidden');
        $('.in_call').removeClass('hidden').trigger("in_call_change");
        $('.not_in_call').addClass('hidden');
        if (splitrecording == "1") {
            $('.splitrecording').show();
        } else {
            $('.splitrecording').hide();
        }
    }
}


function setCurrentUserCallStatus(isOnline) {
    $.ajax({
        url: base_url_ajax + "agent/agent/setCurrentUserCallStatus",
        type: "post",
        global: false,
        async: true,
        data: {
            isOnline: isOnline
        },
        success: function (data_result) {

        }
    });
}


function hangUpPoste() {
    obs_c_tel_histo = $('#obs_c_tel_histo').val();
    if (sRemoteNumber) {
        TsRemoteNumber = sRemoteNumber.split(' ');
        sRemoteNumber = TsRemoteNumber[0];//$('#cmk_manualcall_number').val();
    } else {
        Tobs_c_tel_histo = obs_c_tel_histo.split(',');
        sRemoteNumber = (Tobs_c_tel_histo.length == 1) ? obs_c_tel_histo : Tobs_c_tel_histo[Tobs_c_tel_histo.length];
    }
    sRemoteNumber = (!sRemoteNumber) ? telcall_auto_trans : sRemoteNumber;
    stopTimerPoste();
    $('.encomm_msg').append(' [' + sRemoteNumber + ']');

    var status_str = '<span class="badge bg-gray" > <i class="fa fa-phone"></i> ' + lbl_aucun_appel + '</span>';
    $('.etat_comm_agent').html(status_str);
    //$('.hangup_call').prop('disabled', true);

    $('.originate_call').removeClass('hidden');
    $('.hangup_call').addClass('hidden');
    $('.user_atxfer_action').addClass('hidden');
    $('.GetTransfert').addClass('hidden');
    if (!$('.in_call_pause').hasClass('hidden')) $('.in_call').addClass('hidden').trigger("in_call_change");
    $('.not_in_call').removeClass('hidden');
    //$('.in_call_hold').addClass('hidden');
    $('.splitrecording').hide();
}


function status_call_agent(async) {


    if ($('.cdashboard').hasClass('in_prod_mode')) {
        in_prod_mode = 1;

    } else {
        in_prod_mode = 0;

    }
    var returnFlag = false;
    $.ajax({
        url: "agent/status_call_agent", // override for form's 'action' attribute
        type: "post",
        data: {
            date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            poste: poste,
            in_prod_mode: in_prod_mode
        },
        async: async,
        global: false,
        dataType: 'json',
        success: function (data_result) {
            if (data_result.status_call == 0) {
                hangUpPoste();
                returnFlag = false;
                return;
            } else {
                obs_c_tel_histo = $('#obs_c_tel_histo').val();
                if (sRemoteNumber) {
                    TsRemoteNumber = sRemoteNumber.split(' ');
                    sRemoteNumber = TsRemoteNumber[0];//$('#cmk_manualcall_number').val();
                } else {
                    Tobs_c_tel_histo = obs_c_tel_histo.split(',');
                    sRemoteNumber = (Tobs_c_tel_histo.length == 1) ? obs_c_tel_histo : Tobs_c_tel_histo[Tobs_c_tel_histo.length];
                }
                onlinePoste({ phone: sRemoteNumber, poste: poste, notimer: 1 });
                returnFlag = true;
            }

            return;
        }
    });
    return returnFlag;
}

function CheckDebrief(fromdebrief) {
    //alert(fromdebrief)
    fromdebrief = (fromdebrief == undefined) ? 'false' : fromdebrief;
    var place_debrief = "";
    //console.log(fromdebrief);
    $.ajax({
        url: base_url_ajax + "agent/agent/checkDebriefNow",
        type: "post",
        dataType: 'json',
        global: false,
        async: false,
        data: {
            fromdebrief: fromdebrief
        },
        success: function (data_result) {
            place_debrief = data_result.place_debrief;
        }
    });

    if (place_debrief != "" && place_debrief != undefined) {
        switch (place_debrief) {
            case 'out':
                XhrAbortLoadLMenu = false;
                //CheckDebrief('true')
                //RemoveDebrief();

                break;
            case 'in':
                XhrAbortLoadLMenu = true;

                if (InPause === 1) {
                    $('#modal-pause-cafe').modal('hide');
                }

                GoDebrief();

                return false;
                break;
        }
    } else {
        //KillTimersDebrief();
        XhrAbortLoadLMenu = false;
        CHECKDEBRIEF_VAR_INTERVAL = "";
        if (isbackstretch == 1) {
            if ($('#defaultCountdown').hasClass('is-countdown')) {
                $('#defaultCountdown').countdown('destroy');
                $.backstretch("destroy");
            }

            //InitAgent('MENU', 'fromdebrief');
            //setCrmWidgetsValues();
            //setCrmWidgetsValuesProd();
            $('#production_tabs').hide();
            $('.in_prospect_btn').hide();
            $('.dashboard_panel').show();
            $('.bloc_attente').hide();
            $('.bloc_debrief').hide();
            $("#accordion1").hide();
            $('.dashboard_panel').removeClass('hidden');
            $('.cdashboard').removeClass('in_prod_mode');
            $('.user_logout').show();
            isbackstretch = 0;

        }
        //CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief, 10000);
        //addTimersDebrief(CHECKDEBRIEF_VAR_INTERVAL);

        return true;
    }
}

function RemoveDebrief() {
    Fncdashboard('fromdebrief')
}

function GoDebrief() {

    $('.user_logout').hide();
    $('.dashboard_panel').addClass('hidden');
    $('.page-sidebar-menu').addClass('hidden');
    $('.bloc_debrief').show();
    $('#modal-gestioncontacts').modal('hide');
    $('#modal-rappel-calendar').modal('hide');
    $('#modal-statsagent').modal('hide');
    $('#modal-contactvierge').modal('hide');
    $('#modal-appel-manuel').modal('hide');
    $('#modal-sms-manuel').modal('hide');
    $('#modal-live-chat').modal('hide');
    $('#twitter_modal').modal('hide');
    $('#modalSalesListeCommande').modal('hide');
    $('#ModalLostCall').modal('hide');
    $('#piece_jointe_modal').modal('hide');
    $('#facebook_modal').modal('hide');
    $('#modal-dispatch').modal('hide')
    $('#televenteModalCommandeDetailAgent').modal('hide');
    $('#modal-jobs').modal('hide');
    $('#modal-add-event').modal('hide');

    show_msg_log(lbl_msg_mise_en_debrief_responsable, 'info');

    isbackstretch = 1;
    $('#defaultCountdown').countdown({
        since: 0,
        format: 'HMS'
    });

    $.backstretch([base_url_th + "/assets/pages/media/bg/1.jpg",
    base_url_th + "/assets/pages/media/bg/2.jpg",
    base_url_th + "/assets/pages/media/bg/3.jpg",
    base_url_th + "/assets/pages/media/bg/4.jpg"], {
        fade: 1000,
        duration: 10000
    });

    InitAgent("DEBRIEF", '');

    return false;

}


function addObsctel(telcall_auto) {
    $('#obs_c_tel_histo').val(($('#obs_c_tel_histo').val() != "") ? $('#obs_c_tel_histo').val() + ',' + telcall_auto : telcall_auto);
    $('#obs_c_tel_histo_last').val(telcall_auto);
}

function addObscclid(callerid) {
    $('#obs_c_clid_histo').val(($('#obs_c_clid_histo').val() != "") ? $('#obs_c_clid_histo').val() + ',' + callerid : callerid);
}

$(document).on('click', '#result_save_to_piece_jointe', function (e) {
    e.preventDefault();
    var file_link = $(this).data('save_link');
    $.ajax({
        url: base_url_ajax + "agent/agent/SaveDataJointe",
        type: "post",
        data: {
            ref_user: user,
            ref_campagne: ref_campagne,
            num_contact: num_contact,
            ref_fichier: ref_fichier,
            file: file_link
        },
        success: function (data_result) {
            $.ajax({
                url: base_url_ajax + "agent/agent/Listfichier_jointAjax",
                type: "post",
                data: {
                    ref_campagne: ref_campagne,
                    ref_fichier: ref_fichier,
                    num_contact: num_contact
                },
                dataType: 'json',
                success: function (data_result) {

                    LoadDataLisedfichier_joint(data_result.Listfichier_joint, data_result.TimeLineFichierJoint);
                    $("#timeLineItemsContainer").html(contact_timeline(data_result.timeline, data_result.enreg_path));
                }
            });
            show_msg_log(info_file_saved, 'success');


        }
    });


});
$('#ModalLostCall').on('show.bs.modal', function (e) {
    GetLostCall();
});


function GetLostCall() {
    $.ajax({
        type: 'POST',
        url: base_url_ajax + 'agent/agent/getLostCall', // L'url
        data: {
            cmk_groupe_comptence: cmk_groupe_comptence,
            user: user
        },
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            //console.log(response.data);

            if (!tableLostCall) {
                tableLostCall = $('#ct_DT_lost').DataTable({
                    "data": response.data,
                    //responsive: true,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "columns": [
                        {
                            "title": lbl_cid_incoming,
                            "render": function (data, type, row) {
                                return '<img style="max-width: 15px;max-height: 15px;" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMzMDNDNDI7IiBkPSJNMTI4LDE3MC42NjdjNS44OTYsMCwxMC42NjctNC43NzEsMTAuNjY3LTEwLjY2N3YtNTkuNTgzbDEwOS43OTIsMTA5Ljc5MiAgIGMyLjA4MywyLjA4Myw0LjgxMywzLjEyNSw3LjU0MiwzLjEyNWMyLjcyOSwwLDUuNDU4LTEuMDQyLDcuNTQyLTMuMTI1bDEyOC0xMjhjNC4xNjctNC4xNjcsNC4xNjctMTAuOTE3LDAtMTUuMDgzICAgYy00LjE2Ny00LjE2Ny0xMC45MTctNC4xNjctMTUuMDgzLDBMMjU2LDE4Ny41ODNMMTUzLjc1LDg1LjMzM2g1OS41ODNjNS44OTYsMCwxMC42NjctNC43NzEsMTAuNjY3LTEwLjY2NyAgIEMyMjQsNjguNzcxLDIxOS4yMjksNjQsMjEzLjMzMyw2NEgxMjhjLTUuODk2LDAtMTAuNjY3LDQuNzcxLTEwLjY2NywxMC42NjdWMTYwQzExNy4zMzMsMTY1Ljg5NiwxMjIuMTA0LDE3MC42NjcsMTI4LDE3MC42Njd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMzAzQzQyOyIgZD0iTTUwMy4yOCwzNDIuMzU0Yy02Ni4wMjktNjkuNDM4LTE1My44NTItMTA3LjY4OC0yNDcuMjkxLTEwNy42ODggICBjLTkzLjQyOCwwLTE4MS4yNTEsMzguMjUtMjQ3LjI3LDEwNy42ODhjLTExLjYyNiwxMi4yMjktMTEuNjI2LDMyLjExNSwwLDQ0LjMzM2w0OS4xNzMsNTEuNzQgICBjMTEuNTY0LDEyLjE0NiwzMi4wODcsMTIuMTQ2LDQzLjY1MSwwYzE2LjQ1LTE3LjMwMiwzNS4xNS0zMS41NjMsNTUuNDg2LTQyLjMzM2MxMC4xODktNS4yNSwxNi43NzMtMTYuMzAyLDE2LjY3OS0yNi43NSAgIGw3LjQzOC01Ni4wNjNjNTMuNTktMTcuMTM1LDk2LjYyNi0xNy4xNDYsMTQ5LjcxNi0wLjAxbDcuMzM0LDU0LjY2N2MwLDExLjgyMyw2LjI3MiwyMi42MTUsMTYuNTIzLDI4LjI1ICAgYzIwLjQ0LDEwLjgyMywzOS4xNCwyNS4wODMsNTUuNjAxLDQyLjM3NWM1Ljc4Miw2LjA5NCwxMy41MzMsOS40MzgsMjEuODI2LDkuNDM4YzguMjgyLDAsMTYuMDMzLTMuMzQ0LDIxLjgxNS05LjQyN2w0OS4zMTktNTEuODc1ICAgQzUxNC45MDcsMzc0LjQ2OSw1MTQuOTA3LDM1NC41ODMsNTAzLjI4LDM0Mi4zNTR6Ii8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6I0U1MzkzNTsiIGQ9Ik00ODcuODIsMzcxLjk5bC00OS4zMTgsNTEuODg1Yy0zLjQ0OCwzLjYxNS05LjI5MywzLjYwNC0xMi43Mi0wLjAxICBjLTE4LjA1NC0xOC45NjktMzguNTk4LTM0LjYyNS02MC45MzUtNDYuNDQ4Yy0zLjMyMy0xLjgzMy01LjMxMy01LjM3NS01LjQwNy0xMC44ODVsLTguMzE0LTYyLjY4OCAgYy0wLjUzMS00LjAxLTMuMjkyLTcuMzc1LTcuMTE1LTguNjg4Yy0zMS4xMTgtMTAuNjU2LTU5LjQxNC0xNS45NzktODcuNzkyLTE1Ljk3OWMtMjguMzY4LDAtNTYuODA5LDUuMzIzLTg4LjE5OCwxNS45NjkgIGMtMy44NDQsMS4zMDItNi42MTUsNC42NzctNy4xNDcsOC42OThsLTguNDA3LDY0LjA5NGMwLDMuODk2LTIuMDk0LDcuNTk0LTUuMzEzLDkuMjVjLTIyLjQ4MiwxMS45MDYtNDMuMDI2LDI3LjU2My02MS4wNyw0Ni41MzEgIGMtMy40MzgsMy42MDQtOS4yOTMsMy41OTQtMTIuNzMxLDAuMDFMMjQuMTgsMzcxLjk5Yy0zLjg1NS00LjA0Mi0zLjg1NS0xMC44ODUsMC0xNC45MjdDODYuMTM2LDI5MS44ODUsMTY4LjQ1OCwyNTYsMjU1Ljk5LDI1NiAgczE2OS44NjUsMzUuODg1LDIzMS44MywxMDEuMDYzQzQ5MS42NzUsMzYxLjEwNCw0OTEuNjc1LDM2Ny45NDgsNDg3LjgyLDM3MS45OXoiLz4KPHBhdGggc3R5bGU9Im9wYWNpdHk6MC4xO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7IiBkPSJNMTUyLjIyOSwzMzQuNjkzYy0xNC43MTcsOC4xNjktMjguNTY2LDE4LjEwMy00MS4zNywyOS42NjMgIEM5Ny41LDM3Ni40MTQsNzcuMTg5LDM3Ni4xMzgsNjUuMSwzNjIuODA2bC0yMS43MTUtMjMuOTQ1Yy02LjUyOSw1Ljg4LTEzLjAxOCwxMS44MjYtMTkuMTYxLDE4LjI4OCAgYy0zLjg1NCw0LjA0Mi0zLjg1NCwxMC44ODUsMCwxNC45MjdsNDkuMTczLDUxLjc0YzMuNDM4LDMuNTgzLDkuMjkzLDMuNTk0LDEyLjczLTAuMDFjMTguMDQ0LTE4Ljk2OSwzOC41ODktMzQuNjI1LDYxLjA3LTQ2LjUzMSAgYzMuMjE5LTEuNjU2LDUuMzEzLTUuMzU0LDUuMzEzLTkuMjVsNS40MDYtNDEuMjE1QzE1Ni4yNjIsMzMwLjI5NiwxNTQuMDEsMzMzLjczMiwxNTIuMjI5LDMzNC42OTN6Ii8+CjxwYXRoIHN0eWxlPSJvcGFjaXR5OjAuMTtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTQ4Ny44NjUsMzU3LjE0OGMtNi4xMjgtNi40NDUtMTIuNjA1LTEyLjM3NS0xOS4xMTctMTguMjQxbC0yMS44MTYsMjQuMDU1ICBjLTEyLjA4MywxMy4zMjMtMzIuMzg1LDEzLjYwMi00NS43MzYsMS41NDhjLTEyLjgwMS0xMS41NTYtMjYuNjIxLTIxLjQ3NS00MS4yNDctMjkuNTg5Yy0xLjc5Mi0xLjAzNi0zLjk3NS0zLjkxNS01LjYyLTcuMTg2ICBsNS4xNTYsMzguODgyYzAuMDk0LDUuNTEsMi4wODMsOS4wNTIsNS40MDYsMTAuODg1YzIyLjMzNiwxMS44MjMsNDIuODgsMjcuNDc5LDYwLjkzNSw0Ni40NDhjMy40MjcsMy42MTUsOS4yNzIsMy42MjUsMTIuNzIsMC4wMSAgbDQ5LjMxOS01MS44ODVDNDkxLjcxOSwzNjguMDM0LDQ5MS43MTksMzYxLjE5LDQ4Ny44NjUsMzU3LjE0OHoiLz4KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNDMuNTU3NSIgeTE9IjYzOC4wNDU3IiB4Mj0iLTIyLjk4MzQiIHkyPSI2MjguNDUzNiIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgyMS4zMzMzIDAgMCAtMjEuMzMzMyA5OTYuMzMzMyAxMzc5MS42NjcpIj4KCTxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MC4yIi8+Cgk8c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkY7c3RvcC1vcGFjaXR5OjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggc3R5bGU9ImZpbGw6dXJsKCNTVkdJRF8xXyk7IiBkPSJNMTI4LDE3MC42NjdjNS44OTYsMCwxMC42NjctNC43NzEsMTAuNjY3LTEwLjY2N3YtNTkuNTgzbDEwOS43OTIsMTA5Ljc5MiAgYzIuMDgzLDIuMDgzLDQuODEzLDMuMTI1LDcuNTQyLDMuMTI1YzIuNzI5LDAsNS40NTgtMS4wNDIsNy41NDItMy4xMjVsMTI4LTEyOGM0LjE2Ny00LjE2Nyw0LjE2Ny0xMC45MTcsMC0xNS4wODMgIGMtNC4xNjctNC4xNjctMTAuOTE3LTQuMTY3LTE1LjA4MywwTDI1NiwxODcuNTgzTDE1My43NSw4NS4zMzNoNTkuNTgzYzUuODk2LDAsMTAuNjY3LTQuNzcxLDEwLjY2Ny0xMC42NjcgIEMyMjQsNjguNzcxLDIxOS4yMjksNjQsMjEzLjMzMyw2NEgxMjhjLTUuODk2LDAtMTAuNjY3LDQuNzcxLTEwLjY2NywxMC42NjdWMTYwQzExNy4zMzMsMTY1Ljg5NiwxMjIuMTA0LDE3MC42NjcsMTI4LDE3MC42Njd6ICAgTTUwMy4yOCwzNDIuMzU0Yy02Ni4wMjktNjkuNDM4LTE1My44NTItMTA3LjY4OC0yNDcuMjktMTA3LjY4OGMtOTMuNDI4LDAtMTgxLjI1MSwzOC4yNS0yNDcuMjcsMTA3LjY4OCAgYy0xMS42MjYsMTIuMjI5LTExLjYyNiwzMi4xMTUsMCw0NC4zMzNsNDkuMTcyLDUxLjc0YzExLjU2NSwxMi4xNDYsMzIuMDg3LDEyLjE0Niw0My42NTIsMCAgYzE2LjQ0OS0xNy4zMDIsMzUuMTUtMzEuNTYzLDU1LjQ4Ni00Mi4zMzNjMTAuMTg5LTUuMjUsMTYuNzcyLTE2LjMwMiwxNi42NzgtMjYuNzVsNy40MzktNTYuMDYzICBjNTMuNTktMTcuMTM1LDk2LjYyNi0xNy4xNDYsMTQ5LjcxNi0wLjAxbDcuMzM1LDU0LjY2N2MwLDExLjgyMyw2LjI3MSwyMi42MTUsMTYuNTIyLDI4LjI1YzIwLjQ0LDEwLjgyMywzOS4xNDEsMjUuMDgzLDU1LjYsNDIuMzc1ICBjNS43ODMsNi4wOTQsMTMuNTM0LDkuNDM4LDIxLjgyNyw5LjQzOGM4LjI4MSwwLDE2LjAzMy0zLjM0NCwyMS44MTUtOS40MjdsNDkuMzE4LTUxLjg3NSAgQzUxNC45MDYsMzc0LjQ2OSw1MTQuOTA2LDM1NC41ODMsNTAzLjI4LDM0Mi4zNTR6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />&nbsp;&nbsp;'
                                    + row['cid_incoming'];
                            },
                        },
                        {
                            "title": lbl_nom_contact_lost_call,
                            "render": function (data, type, row) {
                                return row["nom_contact"];
                            },
                        },
                        {
                            "title": lbl_campagne_name,
                            "render": function (data, type, row) {


                                //console.log(row['type_groupe'],'');
                                if (row['num_contact'] > 0) {
                                    return row["nom_campagne"];
                                } else {
                                    return '<span class="label label-sm label-danger">' + lbl_notexist_fem + '</span>';
                                }
                                // return (row['num_contact']>0) ? '<a class="btn green call_contact log_action"  data-log-action="ouvrir_fiche_contact"   data-log-action="ouvrir_fiche_contact" data-log-num_contact="' + row['num_contact'] + '"  data-from-lost="true" data-type-prod="'+row['type_groupe']+'" title="Appeler le contact" data-clickfrom="journal" data-tel="'+data+'" data-name_campagne="'+row['nom_campagne']+'" data-ref_campagne="' + row['campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '"><i class="fa fa-phone"></i> '+lbl_open_contact_form+'</a>' : '<a class="btn green btn-outline new_lost_call" data-id_recept="'+row['id']+'" data-num_tel="'+row['cid_incoming']+'" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '" href="#"><i class="fa fa-plus"></i> '+lbl_create_new_entry+'</a>';
                            },
                        },
                        {
                            "title": lbl_fichier_name,
                            "render": function (data, type, row) {


                                //console.log(row['type_groupe'],'');
                                if (row['num_contact'] > 0) {
                                    return row["name_fichier"];
                                } else {
                                    return '<span class="label label-sm label-danger">' + lbl_notexist_mas + '</span>';
                                }
                                // return (row['num_contact']>0) ? '<a class="btn green call_contact log_action"  data-log-action="ouvrir_fiche_contact"   data-log-action="ouvrir_fiche_contact" data-log-num_contact="' + row['num_contact'] + '"  data-from-lost="true" data-type-prod="'+row['type_groupe']+'" title="Appeler le contact" data-clickfrom="journal" data-tel="'+data+'" data-name_campagne="'+row['nom_campagne']+'" data-ref_campagne="' + row['campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '"><i class="fa fa-phone"></i> '+lbl_open_contact_form+'</a>' : '<a class="btn green btn-outline new_lost_call" data-id_recept="'+row['id']+'" data-num_tel="'+row['cid_incoming']+'" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '" href="#"><i class="fa fa-plus"></i> '+lbl_create_new_entry+'</a>';
                            },
                        },
                        {
                            "data": "date_in_queue",
                            "title": lbl_lost_call_date,
                            "render": function (data, type, row) {
                                if (type == 'display' || type == 'filter') {
                                    return moment(data).format('DD/MM/YYYY HH:mm:ss')
                                }
                                return data;
                            }
                        },
                        {
                            "title": lbl_lost_call_action,
                            "render": function (data, type, row) {

                                if (row['num_contact'] > 0) {
                                    var actBtn = '<a class="btn green call_contact log_action" data-log-action="ouvrir_fiche_contact"  data-toggle="tooltip" data-original-title="' + tableheader_call_title + '" data-makecall="1" data-tel="' + row['cid_incoming'] + '" data-from-lost="true" data-type-prod="' + row['type_groupe'] + '" title="' + tableheader_call_title + '" data-clickfrom="lost_call" data-ref_campagne="' + row['campagne'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '"><i class="fa fa-phone"></i></a>';
                                    actBtn += '<a class="btn blue call_contact log_action"  data-log-action="ouvrir_fiche_contact"  data-toggle="tooltip" data-original-title="' + tableheader_view_title + '"   data-log-num_contact="' + row['num_contact'] + '"  data-from-lost="true" data-type-prod="' + row['type_groupe'] + '" title="' + tableheader_view_title + '" data-clickfrom="lost_call" data-tel="' + data + '" data-name_campagne="' + row['nom_campagne'] + '" data-ref_campagne="' + row['campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '"><i class="fa fa-eye"></i></a>';
                                    return actBtn;

                                } else {
                                    return '<a class="btn red-flamingo  new_lost_call" data-id_recept="' + row['id'] + '"   data-toggle="tooltip" data-original-title="' + lbl_save + '" title="' + lbl_save + '" data-num_tel="' + row['cid_incoming'] + '" data-ref_fichier="' + row['groupe'] + '" data-name_fichier="' + row['name_fichier'] + '" href="#"><i class="fa fa-plus"></i></a>';
                                }
                            },
                        }
                    ],
                    "order": [],
                    "initComplete": function (settings, json) {
                    },
                    "drawCallback": function (settings) {
                        $("#ct_DT_lost [data-toggle='tooltip']").tooltip();
                        $("#ct_DT_lost button[data-toggle='tooltip'], #ct_DT a[data-toggle='tooltip']").tooltip();
                        $("#ct_DT_lost tr td a[data-toggle='popover']").popover({
                            placement: "right",
                            html: true,
                            trigger: 'manual',
                        });


                    }
                });
                $("#ct_DT_lost").on("shown.bs.popover", function (e) {
                    $("#" + $(e.target).attr('aria-describedby') + " .ct_DT_lost_action button").tooltip();
                });

            } else {
                tableLostCall.clear().rows.add(response.data).columns.adjust().draw();

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Une erreur s'est produite lors de la requete
        }
    });

}


// holds or resumes the call
function sipPause() {


    $.ajax({
        url: base_url_ajax + "agent/agent/holdcall",
        type: "post",
        global: false,
        async: true,
        data: {
            poste: poste,
            user: user,
            ref_fichier: ref_fichier,
            name_fichier: name_fichier,
            num_contact: num_contact,
            ref_campagne: ref_campagne,
            name_campagne: name_campagne,
            telcontact: $('#obs_c_tel_histo_last').val()
        },
        success: function (data_result) {
            //alert(data_result);

            if (data_result == 0) {
                $('.in_call_hold').addClass('hidden');
                $('.in_call_pause').removeClass('hidden')

                show_msg_log(lbl_msg_mise_en_attente_echoue, 'warning');
            } else {
                $('.in_call_hold').removeClass('hidden');
                $('.in_call_pause').addClass('hidden')
                show_msg_log(lbl_msg_mise_en_attente, 'success');
            }
            //alert(data_result);
        }
    });

}

function sipRecupePause() {


    $.ajax({
        url: base_url_ajax + "agent/agent/holdcallRecup",
        type: "post",
        global: false,
        async: true,
        data: {
            poste: poste
        },
        success: function (data_result) {

            if (data_result == 0) {
                show_msg_log(lbl_msg_mise_en_attente_appel_perdu, 'error');
                $('.in_call_pause').addClass('hidden');
                hangUpPoste();
            } else {
                $('.in_call_pause').removeClass('hidden')
                show_msg_log(lbl_msg_mise_en_attente_reprise, 'success');
            }
            $('.in_call_hold').addClass('hidden');


        }
    });

}


$(document).on('click', '.appel_auto_prog', function () {

    //TODO il sert a quoi cette fonctionnalité???????????????????????
    //dans info prospect vous allez trouver le boutton d'appel à la ligne 60 61
    // alert('Lancer la numérotation automatique emplacement de l\'alerte main_agent.js fin de fichier')
});


$(document).on('click', '.external-list-a', function (e) {
    e.preventDefault();
    var external_list = $(this).data('external');
    $('#external-list-modal-title').html(lbl_ex_list + ": " + external_list);
    $('#external-list-modal-desc').text(lbl_ex_list_modal_desc + " " + external_list + ".");


    if ($.fn.DataTable.isDataTable('#external-list-datatable')) {
        $('#external-list-datatable').DataTable().clear().destroy();
    }

    $.ajax({
        url: base_url_ajax + "listexterne/listexterne/get_fields",
        type: 'POST',
        data: {
            table: external_list
        },
        dataType: 'json',
        success: function (response) {
            var head = '';
            // head += '<th>Cmk_id</th>';
            for (var i in response) {
                head += '<th>' + response[i].field + '</th>';
            }
            $('#external-list-datatable-head').html(head);
            $('#tab_external_list').modal('show');

            $('#external-list-datatable').DataTable({
                "ajax": {
                    "url": base_url_ajax + "listexterne/listexterne/displayTable",
                    "data": {
                        table: external_list
                    },
                    "type": 'POST',
                    "dataSrc": "data"
                }
                //,destroy : true
            });

        }
    })


});

$(document).on('click', '.refresh-external-datatable', function (e) {
    e.preventDefault();
    $('#external-list-datatable').DataTable().ajax.reload();
});


var yData = [];
var oTableExterneDetailsJournal = "";


var tableExterne = '';

$(document).on('click', '.show_content_details_journal', function (e) {
    e.preventDefault();
    var datas_click = $(this).data();
    id_campagne = $(this).data('ref_campagne');
    id_groupe = $(this).data('ref_fichier');
    groupe_name = $(this).data('name_fichier');
    id_fiche = $(this).data('num_contact');

    $('.liste_details_journal').attr('data-name', groupe_name);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: base_url_ajax + 'agent/agent/getcolnameFichier',
        data: {
            id_campagne: id_campagne,
            id_groupe: id_groupe,
            groupe_name: groupe_name,
            id_fiche: id_fiche,
        },
        success: function (field_name) {
            datasss = field_name.columns;
            //console.log(datasss.length);
            if (oTableExterneDetailsJournal != "") {
                oTableExterneDetailsJournal.api().destroy();
                $('.liste_details_journal[data-name="' + groupe_name + '"]').empty();
                //oTableExterneDetailsJournal.clear().draw();
            }


            oTableExterneDetailsJournal = $('.liste_details_journal[data-name="' + groupe_name + '"]').dataTable({
                responsive: true,
                'ordering': true,
                'destroy': true,
                'searching': true,
                'serverSide': true,
                'pageLength': 1000,
                'lengthMenu': [[100, 500, 1000, 5000, 10000], [100, 500, "1 000", "5 000", "10 000"]],
                'scrollY': 200,
                'ajax': {
                    url: base_url_ajax + 'agent/agent/getDonneesFichier',

                    "type": "POST",
                    data: {
                        table: groupe_name,
                        groupe_name: groupe_name,
                        id_fiche: id_fiche,

                    },
                },
                'columns': field_name.columns,
                "columnDefs": [{
                    "targets": datasss.length - 1,
                    "render": function (data, type, full, meta) {
                        return actionButtonDetailFichier(datas_click, groupe_name);

                    },
                }]

            });


        }

    });


});

function actionButtonDetailFichier(row, table_name) {

    html = '<a data-ref_fichier="' + row.ref_fichier + '" data-name_fichier="' + row.name_fichier + '" data-log-num_contact="' + row.logNum_contact + '" data-log-ref_campagne="' + row.logRef_campagne + '" data-log-action="appeler_contact" data-log-ref_fichier="' + row.logRef_fichier + '" data-num_contact="' + row.num_contact + '" data-ref_campagne="' + row.ref_campagne + '" data-name_campagne="' + row.name_campagne + '" data-makecall="1" data-clickfrom="journal" data-tel="' + row.tel + '" data-type-prod="' + row.typeProd + '" data-toggle="tooltip" data-placement="top" data-original-title=""  class="btn green btn-xs call_contact log_action close_modal_details"><i class="fa fa-phone-square"></i></a>'
    html += '<a data-ref_fichier="' + row.ref_fichier + '" data-name_fichier="' + row.name_fichier + '" data-log-num_contact="' + row.logNum_contact + '" data-log-ref_campagne="' + row.logRef_campagne + '" data-log-action="afficher_contact" data-log-ref_fichier="' + row.logRef_fichier + '" data-num_contact="' + row.num_contact + '" data-ref_campagne="' + row.ref_campagne + '" data-name_campagne="' + row.name_campagne + '" data-makecall="0" data-clickfrom="journal" data-tel="' + row.tel + '" data-type-prod="' + row.typeProd + '" data-toggle="tooltip" data-placement="top" data-original-title="" class="btn blue btn-xs call_contact log_action close_modal_details"><i class="fa fa-plus-square"></i></a>'
    return html;
}

$(document).on('click', '.close_modal_details', function (e) {
    e.preventDefault();
    $('#modal-details-fichier').modal('hide');
});


function agentLogAction(dataAgent) {
    dataAgent.logDashboard_etat = userCurrentState;

    if (dataAgent.logAction == "call_man_appeler") {
        dataAgent.cmk_manualcall_number = $('#cmk_manualcall_number').val();
    }
    //TODO revoir l'emplacement du teste
    if (dataAgent.logAction == "call_man_raccrocher") {
        $.ajax({
            url: "agent/JournalDesAppels",
            success: function (html_data) {

                $('#journal_des_appels').html(html_data);
                $('#journal_des_appels [data-toggle="tooltip"]').tooltip({
                    container: 'body'
                });

            }
        });
    }


    socket.emit("log action agent", {
        num_login: cmk_num_login,
        account: cmk_account,
        language: $('#currentLanguage').val(),
        poste: poste,
        num_user: cmk_num_user,
        post: dataAgent,
        crm_directory: crm_directory

    });


    /*
    $.ajax({
        type : "POST",
        url : base_url_ajax+"common/common/agentLogAction",
        data: dataAgent,
        success : function(response) {

        }
    });*/
}


//Test sur debrief appel manuel hors fiche
$('#modal-appel-manuel').on('shown.bs.modal', function () {


    if (userCurrentState == "DASHBOARD") {
        ref_campagne = "";
        ref_fichier = "";
        name_campagne = "";
        name_fichier = "";
        num_contact = "";
        $('#ref_campagne').val('');
        $('#ref_fichier').val('');
    }

    GetListmSortatnt();

    var getPhoneList = window.sessionStorage['HISTOAPP'];
    //console.log(getPhoneList)

    if (getPhoneList != undefined) {
        getPhoneList = getPhoneList.split(',')

        var optionListPhone = '';
        $.each(getPhoneList, function (i, item) {
            if (item != "")
                optionListPhone += '<option value="' + item + '">';
        });


        console.log(optionListPhone)
        $('#PhoneList').html(optionListPhone)
    }
});



function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


/*
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#myTabProd').offset().top;
    div_top -= 78;

    if (window_top > div_top) {
        $('#myTabProd').addClass('stick');
        $('#myTabProd').css({
            "z-index" : 999,
            "background-color":"#FFFFFF",
            "width" : ""
        })
    } else {
        $('#myTabProd').removeClass('stick');

    }
}*/


$(document).on('click', '.echo-test', function () {

    var data_options = {
        cmk_select_numsortant: '',
        cmk_manualcall_number: 9999

    };
    $.ajax({
        url: "agent/CallMannuel",
        type: "post",
        data: data_options,
        success: function (data_return) {
            //console.log(data_return)

        }
    });
})

$(document).on('click', '.set_link_iframe', function () {
    $('.modal-lien-externe-title').html($(this).data('label'));
    $('#iframe-external-link-menu-attente').attr('src', $(this).data('link'));
});

if (cmk_activate_check_connection) {

    ///check offline
    Offline.options = {
        game: false,
        interceptRequests: false,
        requests: false,
        reconnect: true,
        checks: {
            xhr: {
                url: function () {
                    return "/favicon.ico?_=" + ((new Date()).getTime());
                },
                timeout: 1000,
                type: 'HEAD'
            },

            active: 'xhr'
        },
        checkOnLoad: true,
    }
    var IntervalRun = setInterval(run, 60000);

    var run = function () {
        Offline.check();
    }

    Offline.on('down', function () {
        $('.page-container').addClass('disabledBody')
        $('.modal-footer').addClass('disabledBody');

    });

    Offline.on('confirmed-down', function () {
        $('.offline-ui-down').show();

        $('.page-container').addClass('disabledBody')
        $('.modal-footer').addClass('disabledBody');

    });

    Offline.on('up', function () {
        Offline.check();
        $('.offline-ui-down').hide();
        $('.page-container').removeClass('disabledBody')
        $('.modal-footer').removeClass('disabledBody')

    });


    $('.page-header.navbar.navbar-fixed-top').css({
        "z-index": "90"
    })

    $(document).on('click', '.offline-ui-down', function () {
        Offline.check();
    });

    $(document).on('click', '.disabledBody', function () {
        Offline.check();
    });
    //

}


function disableMenuFromAttenteButton() {
    $(".bloc_attente .back-to-menu").attr('disabled',true);
}

function enableMenuFromAttenteButton() {
    $(".bloc_attente .back-to-menu").attr('disabled',false);
}