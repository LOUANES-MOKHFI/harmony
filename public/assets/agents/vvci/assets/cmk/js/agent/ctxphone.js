/* globals SIP,user,moment, Stopwatch */

var ctxSip;
var ctxUserConf;
var WEBPHONE_REGISTER;
var CountTentativeRegister = 0;
var webphone_version = 2;
var bbDialogCtxOriginate;
var sessionForAtXfer, targetSessionForAtXfer, waitingForXferTarget = false;
var acceptsMultipleCalls = true;
//0 = Disconnected , 1 = Connecting , 2 = Connected and registered
var webPhoneLastStatus = 0;
var countMediaAccessTry = 0;

function updateCallOnHoldByCode(codeCall,hold,tel) {
    $.ajax({
        url : base_url_ajax+'agent/agent/updateCallOnHoldByCode',
        type : 'POST',
        data : {
            codeCall : codeCall,
            num_contact : num_contact,
            ref_fichier : ref_fichier,
            ref_campagne : ref_campagne,
            hold : hold,
            tel : tel
        },
        global : false
    })
}

function setStatus(status){
    webPhoneLastStatus = status;
    switch(status) {
        case 0 :
            $('.status-web-phone').removeClass('font-green font-yellow iconcmk-phone-registered iconcmk-phone-registering').addClass('font-red iconcmk-phone-unregistered').parent().attr('data-original-title', lbl_webphone_disconnected);
            break;
        case 1 :
            $('.status-web-phone').removeClass('font-green  font-red iconcmk-phone-unregistered iconcmk-phone-registered').addClass('font-yellow iconcmk-phone-registering').parent().attr('data-original-title', lbl_webphone_encours_de_connexion);
            break;
        case 2 :
            $('.status-web-phone').removeClass('font-yellow font-red iconcmk-phone-registering iconcmk-phone-unregistered').addClass('font-green iconcmk-phone-registered').parent().attr('data-original-title', lbl_webphone_connected);
            break;

    }
    $.ajax({
        url:  base_url_ajax+"agent/agent/setStatusPhone",
        type: "post",
        global : false,
        data: {
            status : status
        }
    });
}

function showWebphoneTLSErrorModal() {
    var s_websocket_server_url = ctxSip.config.wsServers.replace('wss','https');

    $('#link_to_resolve').attr('href',s_websocket_server_url);

    if($.browser.chrome || $.browser.mozilla|| $.browser.opera ) {
        $('#info_sip_connect').modal('show');
    } else {
        $('#info_sip_connect_incompatible_browser').modal('show');
    }
    set_error =1
}

function showWebphoneRegisterErrorModal(show) {
    if (show && !$("#info_sip_unregistered:visible").length) $('#info_sip_unregistered').modal("show");
    else if (!show) $("#info_sip_unregistered").modal("hide");
}

function showWebphoneRequestMediaErrorModal(show) {
    if (show && !$("#info_sip_requestmedia_error:visible").length) $("#info_sip_requestmedia_error").modal("show");
    else if (!show) $("#info_sip_requestmedia_error").modal("hide");
}

function sipRegister() {
    ctxSip.phone.start();
    ctxSip.phone.register();
}

function sipUnRegister() {
    ctxSip.phone.unregister();
}

function sipHangUp() {
    if (ctxSip.callActiveID) {
        ctxSip.sipHangUp(ctxSip.callActiveID);
        $('#originate_call').removeClass('hidden');
        $('.hangup_call').addClass('hidden');
    }
}

function sipToggleMute() {
    if (ctxSip.callActiveID) {
        var s = ctxSip.Sessions[ctxSip.callActiveID];
        ctxSip.phoneMuteButtonPressed(ctxSip.callActiveID);
        if (s.isMuted) {
            $('#bMute').removeClass('font-green').addClass('font-red');
            $('#class_mute').removeClass('fa fa-microphone-slash font-green').addClass('fa fa-microphone-slash font-red');
            logAction="sip_toggle_mute";
        }else{
            $('#bMute').removeClass('font-red').addClass('font-green');
            $('#class_mute').removeClass('fa fa-microphone-slash font-red').addClass('fa fa-microphone-slash font-green');
            logAction="sip_toggle_unmute";
        }

        var dataAgent={
            logAction:logAction,
        };
        agentLogAction(dataAgent);
    }
}

function sipSendDTMF(c) {
    if (ctxSip.callActiveID) {
        ctxSip.sipSendDTMF(c);
    }
}

function checkRegistred() {
    if (is_web_phone) {
        if (!ctxSip.phone || !ctxSip.phone.isConnected() || !ctxSip.phone.isRegistered()) {
            //if (!ctxSip.phone) ctxSip.phone = new SIP.UA(ctxSip.config);
            ctxSip.phone.start();
            ctxSip.phone.register();
            $('.go_prod').attr('disabled', true);
            $('.originate_call').attr('disabled', true);
            $('.call_contact').attr('disabled', true);
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function onlinePosteCtx(session) {
    var callCounter = updateCallCounterCtx();
    sRemoteNumber = session.displayName;
    ONLINE_WITH = session.displayName;
    //$('.encomm_msg').append(' ['+sRemoteNumber+']');
    var startTime = 0;
    if (session.startTime) startTime = parseInt((new Date()).getTime() / 1000) - parseInt(session.startTime.getTime() / 1000);
    startTimerPoste(startTime);
    $('.hangup_call').prop('disabled', false);
    $('.originate_call').addClass('hidden');
    $('.hangup_call').removeClass('hidden');
    $('.meetme-dropdown-list').removeClass('hidden');
    $('.GetTransfert').removeClass('hidden');
    $('.in_call').removeClass('hidden').trigger("in_call_change");
    $('.not_in_call').addClass('hidden');
    if (splitrecording == "1") {
        $('.splitrecording').show();
    } else {
        $('.splitrecording').hide();
    }

    $.ajax({
        type : "POST",
        url : base_url_ajax+"agent/agent/onlinePoste",
        global : false,
        data : { callCounter : callCounter }
    });
}

function hangUpPosteCtx(session) {
    var callCounter = updateCallCounterCtx();
    $.ajax({
        type : "POST",
        url : base_url_ajax+"agent/agent/onlinePoste",
        global : false,
        data : { callCounter : callCounter }
    });
    if (ctxSip.callActiveID && session.ctxid != ctxSip.callActiveID) return;
    if (session && session.displayName) {
        sRemoteNumber = session.displayName;
        $('.encomm_msg').append(' [' + sRemoteNumber + ']');
    }
    stopTimerPoste();


    var status_str = '<span class="badge bg-gray" > <i class="fa fa-phone"></i> ' + lbl_aucun_appel + (callCounter.onhold >0 ? " "+callCounter.onhold+" "+lbl_phone_waiting : "") + '</span>';
    $('.etat_comm_agent').html(status_str);
    //$('.hangup_call').prop('disabled', true);

    $('.originate_call').removeClass('hidden');
    $('.hangup_call').addClass('hidden');
    $('.user_atxfer_action').addClass('hidden');
    $('.meetme-dropdown-list').addClass('hidden');
    $('.GetTransfert').addClass('hidden');
    if (!$('.in_call_pause').hasClass('hidden')) $('.in_call').addClass('hidden').trigger("in_call_change");
    $('.not_in_call').removeClass('hidden');
    //$('.in_call_hold').addClass('hidden');
    $('.splitrecording').hide();

}

function updateCallCounterCtx() {
    var activeSessions = [];
    var ringing = 0, incall = 0, onhold = 0, callCounter = 0;
    if (localStorage.getItem('sipCalls')) {
        activeSessions = JSON.parse(localStorage.getItem('sipCalls'));
    }
    var callDetails = {
        "IN" : {
            "ringing" : 0,
            "incall" : 0,
            "onhold" : 0
        },
        "OUT" : {
            "ringing" : 0,
            "incall" : 0,
            "onhold" : 0
        }
    }
    $.each(activeSessions,function(k,session) {
        var direction = ctxSip.Sessions[k].realDirection;
        switch(session.status) {
            case "ringing" :
                callDetails[direction].ringing++;
                callCounter++;
                break;
            case "answered" :
            case "resumed" :
                callDetails[direction].incall++;
                callCounter++;
                break;
            case "holding" :
                callDetails[direction].onhold++;
                callCounter++;
                break;
            default :
                break;
        }
    })


    notifyInboundCall(callDetails["IN"].ringing);
    $("#cmk_ctx_call_info").html('<span class="bold">'+callCounter+'</span> '+lbl_phone_calls_in_progress+'</h3>');
    return callDetails;
}

function notifyInboundCall(ringing) {
    if (ringing > 0) {
        $(".notification-phone-ringing").removeClass("hidden");
        if (!("Notification" in window)) {
            return;
        } else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var options = {
                body: "Appel entrant",
            };
            var notification = new Notification('Comunik Contacts', options);
            notification.onclick = function (e) {
                window.focus();
            };
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var options = {
                        body: "Appel entrant"
                    };
                    var notification = new Notification('Comunik Contacts', options);
                    notification.onclick = function (e) {
                        window.focus();
                    };
                }
            });
        }
    } else {
        $(".notification-phone-ringing").addClass("hidden");
    }
}

$(".notification-phone-ringing").click(function(e) {
    e.stopPropagation();
    $($('.etat_comm_agent').get(0)).dropdown('toggle');
})

function newCallCtx(transferSessionId) {
    $.ajax({
        url: "agent/GetListNumSortant", // override for form's 'action' attribute
        type: "post",
        data: "cmk_groupe_comptence=" + cmk_groupe_comptence + "&groupe=" + ref_fichier + "&call_form_search=" + call_form_search + '&type_pord=' + type_global_prod,
        global: false,
        success: function (data_result) {
            var bbHtml = '';
            bbHtml += '<div class="row">';
            bbHtml += '<div class="col-md-6">';
            bbHtml += '<div class="form-group">';
            bbHtml += '<label>' + lbl_meetme_number_to_dial + ': </label>';
            bbHtml += '<div class="input-group">';
            bbHtml += '<input list="PhoneList" type="text" id="cmk_ctx_call_number" class="form-control">';
            bbHtml += '<div class="input-group-btn">';
            if (transferSessionId) {
                bbHtml += '<button type="button" class="btn blue dropdown-toggle" data-toggle="dropdown">';
                bbHtml += lbl_phone_xfer;
                bbHtml += '</button>';
                bbHtml += '<ul class="dropdown-menu pull-right">';
                bbHtml += '<li>';
                bbHtml += '<a href="javascript:;" class="ctx_xfer_action" data-action="xfer"> '+lbl_phone_blind_xfer+' </a>';
                bbHtml += '</li>';
                bbHtml += '<li>';
                bbHtml += '<a href="javascript:;" class="ctx_xfer_action" data-action="atXfer"> '+lbl_phone_atxfer+' </a>';
                bbHtml += '</li>';
                bbHtml += '</ul>';
            } else {
                bbHtml += '<button type="button" class="btn blue" id="originate_ctx_call">';
                bbHtml += lbl_phone_originate_action_btn;
                bbHtml += '</button>';
            }
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '<div class="col-md-6">';
            bbHtml += '<div class="form-group">';
            bbHtml += '<label>' + lbl_meetme_caller_id + ': </label>';
            bbHtml += '<select id="cmk_ctx_numsortant" class="form-control">';
            bbHtml += data_result;
            bbHtml += '</select>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';

            bbDialogCtxOriginate = bootbox.dialog({
                message: bbHtml,
                title: '<h4 class="box-heading">'+(transferSessionId ? lbl_phone_xfer_title : lbl_phone_originate_title)+'</h4>',
                buttons: {
                    btnTransferExec : {
                        label : lbl_phone_xfer_exec,
                        className : "btn red btn-square hidden",
                        callback : function() {
                            ctxSip.sipAtXferExecute(sessionForAtXfer,ctxSip.callActiveID);
                            bbDialogCtxOriginate.modal("hide");
                        }
                    },
                    btnCancel: {
                        label: lbl_cancel,
                        className: "btn btn-default btn-outlined btn-square",
                        callback: function () {
                            if (waitingForXferTarget && targetSessionForAtXfer) {
                                ctxSip.Sessions[targetSessionForAtXfer].terminate();
                                var s = ctxSip.Sessions[sessionForAtXfer]
                                if (s && s.isOnHold().local === true) s.unhold();
                            }
                        }
                    }
                }
            });
        }
    });
}

function logRegisterError(description,cause) {
    var dataError={};
    dataError = {
        type_error:"webphone",
        js_message:"Cause : "+cause
    };


    dataError.description = description;
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
        global: false,
        data: dataError
    });
}

$(document).on('click','.ctx_xfer_action',function() {
    if (!sessionForAtXfer) return;
    var target = $("#cmk_ctx_call_number").val();
    if (target == "") return;
    var action = $(this).data("action");
    switch(action) {
        case "xfer" :
            ctxSip.Sessions[sessionForAtXfer].refer(target);
            bbDialogCtxOriginate.modal("hide");
            break;
        case "atXfer" :
            var telToInvite = $("#cmk_ctx_call_number").val();
            var callerId = $("#cmk_ctx_numsortant").val();
            var postData = {
                ref_campagne: ref_campagne,
                ref_fichier: ref_fichier,
                num_contact: num_contact
            }
            if (ctxSip.callActiveID) ctxSip.Sessions[ctxSip.callActiveID].hold();
            postData['cmk_select_numsortant'] = callerId;
            postData['cmk_manualcall_number'] = telToInvite;
            postData['cmk_groupe_competence'] = cmk_groupe_comptence;
            postData['cmk_donot_hangup'] = 1;
            waitingForXferTarget = true;
            $.ajax({
                type : "POST",
                url: "agent/CallMannuel",
                data: postData,
                success: function () {
                }
            });
            break;
    }
})

$(document).on('click','.btnTransferExec',function() {
    ctxSip.sipAtXferExecute(sessionForAtXfer,ctxSip.callActiveID);
})

function xferSessionHandler(e) {
    bbDialogCtxOriginate.modal("hide");
    waitingForXferTarget = false;
}

$(document).on("click","#originate_ctx_call",function() {
    var telToInvite = $("#cmk_ctx_call_number").val();
    var callerId = $("#cmk_ctx_numsortant").val();
    if (telToInvite == "") {
        //TODO SHOW ERR MSG
        return;
    }
    var postData = {
        ref_campagne: ref_campagne,
        ref_fichier: ref_fichier,
        num_contact: num_contact
    }
    if (ctxSip.callActiveID) ctxSip.Sessions[ctxSip.callActiveID].hold();
    postData['cmk_select_numsortant'] = callerId;
    postData['cmk_manualcall_number'] = telToInvite;
    postData['cmk_groupe_competence'] = cmk_groupe_comptence;
    postData['cmk_donot_hangup'] = 1;
    addObsctel(telToInvite);
    $.ajax({
        type : "POST",
        url: "agent/CallMannuel",
        data: postData,
        success: function () {
            bbDialogCtxOriginate.modal("hide");
        }
    });
})

function sendCallsToMeetMe(callCodes,roomNumber) {
    $.ajax({
        "type" : "post",
        "url" : base_url_ajax+"agent/meetme/sendCallsToMeetMe",
        "data" : {
            "callCodes" : callCodes,
            "roomNumber" : roomNumber,
            "join" : 1
        },
        success : function() {
            $("#modal-meetme").modal("show");
            $(".meetme-tabs a[data-meetme-number='"+roomNumber+"']").tab("show");
        }
    })
}

$(document).ready(function() {
    $("i.status-web-phone").parent().tooltip({
        placement : "bottom"
    })

    var dtmfDialPadContent = '<div align="center">';
    dtmfDialPadContent += '<div class="form-group numpad">';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad1" onclick="sipSendDTMF(\'1\')">1</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad2" onclick="sipSendDTMF(\'2\')">2</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad3" onclick="sipSendDTMF(\'3\')">3</button>';
    dtmfDialPadContent += '<div class="clearfix">&nbsp;</div>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad4" onclick="sipSendDTMF(\'4\')">4</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad5" onclick="sipSendDTMF(\'5\')">5</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad6" onclick="sipSendDTMF(\'6\')">6</button>';
    dtmfDialPadContent += '<div class="clearfix">&nbsp;</div>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad7" onclick="sipSendDTMF(\'7\')">7</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad8" onclick="sipSendDTMF(\'8\')">8</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad9" onclick="sipSendDTMF(\'9\')">9</button>';
    dtmfDialPadContent += '<div class="clearfix">&nbsp;</div>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg num_padast" onclick="sipSendDTMF(\'*\')"><i class="fa fa-asterisk"></i></button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_pad0" onclick="sipSendDTMF(\'0\')">0</button>';
    dtmfDialPadContent += '<button class="btn btn-sm btn-default btn-lg bold num_paddiaz" onclick="sipSendDTMF(\'#\')">#</button>';
    dtmfDialPadContent += '</div>';
    dtmfDialPadContent += '</div>';
    dtmfDialPadContent += '</div>';


    $(".dtmf_toggle_dropdown_button").popover({
        placement : 'top',
        html : true,
        container : 'body',
        trigger : 'manual',
        template : '<div class="popover" style="max-width:350px; !important" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="dtmf-popover popover-content"></div></div>',
        content : dtmfDialPadContent
    });

    $(document).on("click",".dtmf-popover button",function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    $(".dtmf_toggle_dropdown_button").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).popover("toggle");
    });

    $("#header_notification_bar").on("hide.bs.dropdown",function() {
        $(".dtmf_toggle_dropdown_button").popover("hide");
    });

    $(".merge_into_meetme_button").click(function() {
        var roomNumber = $(this).data("meetme-id");
        if (Object.keys(ctxSip.Sessions).length) {
            var activeCallsCodes = [];
            $.each(Object.keys(ctxSip.Sessions),function(k,sessionId) {
                var session = ctxSip.Sessions[sessionId];
                if (session.status == 12) activeCallsCodes.push(session.request.getHeader('CODECALL'));
            });
            if (activeCallsCodes.length > 0) {
                sendCallsToMeetMe(activeCallsCodes,roomNumber);
            }
        } else {
        }
    });

    is_web_phone = 1;
    $.ajax({
        url : base_url_ajax+"agent/agent/GetConfPhone",
        type : "GET",
        dataType : "JSON",
        async : false,
        success : function(response) {
            ctxUserConf = response;
        }
    });

    ctxSip = {
        config : {
            password        : ctxUserConf.pwd,
            displayName     : ctxUserConf.sip,
            uri             : 'sip:'+ctxUserConf.sip+'@'+ctxUserConf.host,
            wsServers       : 'wss://'+ctxUserConf.host+':'+ctxUserConf.siport+'/ws',
            autostart : true,
            register : true,
            registerExpires : 120,
            traceSip        : false,
            log             : {
                level : 0,
            },
            hackWssInTransport : true,
            wsServerMaxReconnection : 5,
            wsServerReconnectionTimeout : 2,
            connectionRecoveryMaxInterval : 2,
            connectionRecoveryMinInterval : 2,
            allowLegacyNotifications : true
        },
        ringtone     : document.getElementById('ringtone'),
        ringbacktone : document.getElementById('ringbacktone'),
        dtmfTone     : document.getElementById('dtmfTone'),

        Sessions     : [],
        callTimers   : {},
        callActiveID : null,
        //callVolume   : 1,
        //Stream       : null,
        /**
         * Parses a SIP uri and returns a formatted US phone number.
         *
         * @param  {string} phone number or uri to format
         * @return {string}       formatted number
         */
        formatPhone : function(phone) {

            var num;

            if (phone.indexOf('@')) {
                num =  phone.split('@')[0];
            } else {
                num = phone;
            }

            num = num.toString().replace(/[^0-9]/g, '');
            return num;
            if (num.length === 10) {
                return '(' + num.substr(0, 3) + ') ' + num.substr(3, 3) + '-' + num.substr(6,4);
            } else if (num.length === 11) {
                return '(' + num.substr(1, 3) + ') ' + num.substr(4, 3) + '-' + num.substr(7,4);
            } else {
                return num;
            }
        },

        // Sound methods
        startRingTone : function() {
            try { ctxSip.ringtone.play(); } catch (e) { }
        },

        stopRingTone : function() {
            try { ctxSip.ringtone.pause(); } catch (e) { }
        },

        startRingbackTone : function() {
            try { ctxSip.ringbacktone.play(); } catch (e) { }
        },

        stopRingbackTone : function() {
            try { ctxSip.ringbacktone.pause(); } catch (e) { }
        },

        // Genereates a rendom string to ID a call
        getUniqueID : function() {
            return Math.random().toString(36).substr(2, 9);
        },

        newSession : function(newSess) {

            newSess.displayName = newSess.remoteIdentity.displayName || newSess.remoteIdentity.uri.user;
            newSess.ctxid       = ctxSip.getUniqueID();

            var status;
            ctxSip.logCall(newSess, 'ringing');
            newSess.realDirection = 'OUT';
            var CMK_CALL_DIRECTION_HEADER = newSess.request.getHeader("CMK_CALL_DIRECTION");
            if (CMK_CALL_DIRECTION_HEADER && CMK_CALL_DIRECTION_HEADER == "IN") newSess.realDirection = "IN";
            if (newSess.direction === 'incoming') {
                status = "Incoming: "+ newSess.displayName;
                if (newSess.autoAnswer) {
                    newSess.accept({
                        media: {
                            stream: ctxSip.Stream,
                            constraints: {audio: true, video: false},
                            render: {
                                remote: $('#audioRemote').get()[0]
                            },
                            RTCConstraints: {"optional": [{'DtlsSrtpKeyAgreement': 'true'}]}
                        }
                    });
                    setTimeout(function(){
                        if (cmk_session_type == "user" && cmk_wainting_for_webphone_to_show_contact){
                            console.log("remontee fiche sans ring");
                            continueSuccessPlay();
                            cmk_wainting_for_webphone_to_show_contact=false;
                        }
                    },200);
                } else {
                    if (!ctxSip.callActiveID) ctxSip.startRingTone();
                }
            } else {
                status = "Trying: "+ newSess.displayName;
                ctxSip.startRingbackTone();
            }
            ctxSip.setCallSessionStatus(status);
            // EVENT CALLBACKS
            newSess.on('progress',function(e) {
                if (e.direction === 'outgoing') {
                    ctxSip.setCallSessionStatus('Calling...');
                }
            });

            newSess.on('connecting',function(e) {
                if (e.direction === 'outgoing') {
                    ctxSip.setCallSessionStatus('Connecting...');
                }
            });

            newSess.on('accepted',function(e) {
                // If there is another active call, hold it
                if (ctxSip.callActiveID && ctxSip.callActiveID !== newSess.ctxid) {
                    ctxSip.phoneHoldButtonPressed(ctxSip.callActiveID);
                }

                ctxSip.stopRingbackTone();
                ctxSip.stopRingTone();
                ctxSip.setCallSessionStatus('Answered');
                ctxSip.logCall(newSess, 'answered');
                ctxSip.callActiveID = newSess.ctxid;
                onlinePosteCtx(newSess);
            });

            newSess.on('hold', function(e) {
                ctxSip.callActiveID = null;
                ctxSip.logCall(newSess, 'holding');
                hangUpPosteCtx(newSess);
                var codeCall = newSess.request.getHeader('CODECALL');
                var tel = newSess.displayName;
                if (codeCall) {
                    updateCallOnHoldByCode(codeCall,1,tel);
                }
            });

            newSess.on('unhold', function(e) {
                ctxSip.logCall(newSess, 'resumed');
                ctxSip.callActiveID = newSess.ctxid;
                onlinePosteCtx(newSess);
                var codeCall = newSess.request.getHeader('CODECALL');
                if (codeCall) {
                    updateCallOnHoldByCode(codeCall, 0,"");
                }
            });

            newSess.on('muted', function(e) {
                ctxSip.Sessions[newSess.ctxid].isMuted = true;
                ctxSip.setCallSessionStatus("Muted");
            });

            newSess.on('unmuted', function(e) {
                ctxSip.Sessions[newSess.ctxid].isMuted = false;
                ctxSip.setCallSessionStatus("Answered");
            });

            newSess.on('cancel', function(e) {
                ctxSip.stopRingTone();
                ctxSip.stopRingbackTone();
                ctxSip.setCallSessionStatus("Canceled");
                hangUpPosteCtx(newSess);
                if (this.direction === 'outgoing') {
                    ctxSip.callActiveID = null;
                    newSess             = null;
                    ctxSip.logCall(this, 'ended');
                }
            });

            newSess.on('bye', function(e) {
                ctxSip.stopRingTone();
                ctxSip.stopRingbackTone();
                ctxSip.setCallSessionStatus("");
                ctxSip.logCall(newSess, 'ended');
                if (newSess.isOnHold().local === true) {
                    var codeCall = newSess.request.getHeader('CODECALL');
                    if (codeCall) updateCallOnHoldByCode(codeCall, 0);
                }
                hangUpPosteCtx(newSess);
                ctxSip.callActiveID = null;
                newSess             = null;
            });

            newSess.on('failed',function(e) {
                ctxSip.stopRingTone();
                ctxSip.stopRingbackTone();
                ctxSip.setCallSessionStatus('Terminated');
                hangUpPosteCtx(newSess);
            });

            newSess.on('rejected',function(e) {
                ctxSip.stopRingTone();
                ctxSip.stopRingbackTone();
                ctxSip.setCallSessionStatus('Rejected');
                hangUpPosteCtx(newSess);
                ctxSip.callActiveID = null;
                ctxSip.logCall(this, 'ended');
                newSess             = null;
            });

            ctxSip.Sessions[newSess.ctxid] = newSess;
            updateCallCounterCtx();

        },

        // getUser media request refused or device was not present
        getUserMediaFailure : function(e) {
            window.console.error('getUserMedia failed:', e);
            ctxSip.setError(true, 'Media Error.', 'You must allow access to your microphone.  Check the address bar.', true);
            showWebphoneRequestMediaErrorModal(true);
            setTimeout(function() {
                countMediaAccessTry++;
                if (countMediaAccessTry <= 5) SIP.WebRTC.getUserMedia({ audio : true, video : false }, ctxSip.getUserMediaSuccess, ctxSip.getUserMediaFailure);
            },5000)
            //SIP.WebRTC.getUserMedia({ audio : true, video : false }, ctxSip.getUserMediaSuccess, ctxSip.getUserMediaFailure);
            $(".go_prod").attr("disabled",true).addClass("disabled");
        },

        getUserMediaSuccess : function(stream) {
            ctxSip.Stream = stream;
            countMediaAccessTry = 0;
            showWebphoneRequestMediaErrorModal(false);
            $(".go_prod").attr("disabled",false).removeClass("disabled");
        },

        /**
         * sets the ui call status field
         *
         * @param {string} status
         */
        setCallSessionStatus : function(status) {
            $('#txtCallStatus').html(status);
            console.log(status);
        },

        /**
         * sets the ui connection status field
         *
         * @param {string} status
         */
        setStatus : function(status,type) {
            toastr[type] = status;
        },

        /**
         * logs a call to localstorage
         *
         * @param  {object} session
         * @param  {string} status Enum 'ringing', 'answered', 'ended', 'holding', 'resumed'
         */
        logCall : function(session, status) {

            var log = {
                    clid : session.displayName,
                    uri  : session.remoteIdentity.uri.toString(),
                    id   : session.ctxid,
                    time : new Date().getTime()
                },
                calllog = JSON.parse(localStorage.getItem('sipCalls'));

            if (!calllog) { calllog = {}; }

            if (!calllog.hasOwnProperty(session.ctxid)) {
                calllog[log.id] = {
                    id    : log.id,
                    clid  : log.clid,
                    uri   : log.uri,
                    start : log.time,
                    flow  : session.direction
                };
            }

            if (status === 'ended') {
                calllog[log.id].stop = log.time;
            }

            if (status === 'ended' && calllog[log.id].status === 'ringing') {
                calllog[log.id].status = 'missed';
            } else {
                calllog[log.id].status = status;
            }

            localStorage.setItem('sipCalls', JSON.stringify(calllog));
            ctxSip.logShow();
        },

        /**
         * adds a ui item to the call log
         *
         * @param  {object} item log item
         */
        logItem : function(item) {
            if (item.status == "ended" || item.status == "missed") return;
            var callActive = (item.status !== 'ended' && item.status !== 'missed'),
                callLength = (item.status !== 'ended')? '<span id="'+item.id+'"></span>': moment.duration(item.stop - item.start).humanize(),
                callClass  = '',
                callIcon,
                i;

            switch (item.status) {
                case 'ringing'  :
                    callClass = 'list-group-item-success';
                    callIcon  = 'fa-bell';
                    break;

                case 'missed'   :
                    callClass = 'list-group-item-danger';
                    if (item.flow === "incoming") { callIcon = 'fa-chevron-left'; }
                    if (item.flow === "outgoing") { callIcon = 'fa-chevron-right'; }
                    break;

                case 'holding'  :
                    callClass = 'list-group-item-warning';
                    callIcon  = 'fa-pause';
                    break;

                case 'answered' :
                case 'resumed'  :
                    callClass = 'list-group-item-info';
                    callIcon  = 'fa-phone-square';
                    break;

                case 'ended'  :
                    if (item.flow === "incoming") { callIcon = 'fa-chevron-left'; }
                    if (item.flow === "outgoing") { callIcon = 'fa-chevron-right'; }
                    break;
            }


            i  = '<div class="list-group-item sip-logitem clearfix '+callClass+'" data-uri="'+item.uri+'" data-sessionid="'+item.id+'">';
            i += '<div class="clearfix"><div class="pull-left">';
            i += '<i class="fa fa-fw '+callIcon+' fa-fw"></i> <strong>'+ctxSip.formatPhone(item.uri)+'</strong><br><small>'+moment(item.start).format('HH:mm')+'</small>';
            i += '</div>';
            i += '<div class="pull-right text-right"><em>'+item.clid+'</em><br>' + callLength+'</div></div>';

            if (callActive) {
                i += '<div class="btn-group btn-group-xs pull-right">';
                if (item.status === 'ringing' && item.flow === 'incoming') {
                    i += '<button class="btn btn-xs btn-success btnCall" title="Call"><i class="fa fa-phone"></i></button>';
                    i += '<button class="btn btn-xs btn-warning btnSilence" title="Stop ringtone"><i class="icon-volume-off"></i></button>';
                } else {
                    i += '<button class="btn btn-xs btn-primary btnHoldResume" title="Hold"><i class="fa fa-pause"></i></button>';
                    if (waitingForXferTarget && targetSessionForAtXfer == item.id) {
                        i += '<button class="btn btn-xs btn-danger btnTransferExec hidden" title="Mettre en relation"><i class="icon-action-redo"></i></button>';
                    } else {
                        i += '<button class="btn btn-xs btn-info btnTransfer" title="Transfer"><i class="icon-action-redo"></i></button>';
                    }
                    i += '<button class="btn btn-xs btn-warning btnMute" title="Mute"><i class="fa fa-fw fa-microphone"></i></button>';
                }

                if (!(item.status === 'ringing' && item.flow === 'incoming')) {
                    i += '<button class="btn btn-xs btn-danger btnHangUp" title="Hangup"><i class="fa fa-stop"></i></button>';
                }
                i += '</div>';
            }
            i += '</div>';

            $('#sip-logitems').append(i);


            // Start call timer on answer
            if (item.status === 'answered') {
                var tEle = document.getElementById(item.id);
                ctxSip.callTimers[item.id] = new Stopwatch(tEle);
                ctxSip.callTimers[item.id].start();
            }

            if (callActive && item.status !== 'ringing') {
                ctxSip.callTimers[item.id].start({startTime : item.start});
            }

            $('#sip-logitems').scrollTop(0);
        },

        /**
         * updates the call log ui
         */
        logShow : function() {
            var incall = 0, onhold = 0, ringing = 0;
            var calllog = JSON.parse(localStorage.getItem('sipCalls')),
                x       = [];

            if (calllog !== null) {

                $('#sip-splash').addClass('hide');
                $('#sip-log').removeClass('hide');

                // empty existing logs
                $('#sip-logitems').empty();

                // JS doesn't guarantee property order so
                // create an array with the start time as
                // the key and sort by that.

                // Add start time to array
                $.each(calllog, function(k,v) {
                    x.push(v);
                });

                // sort descending
                x.sort(function(a, b) {
                    return b.start - a.start;
                });

                $.each(x, function(k, v) {
                    ctxSip.logItem(v);
                    switch(v.status) {
                        case "ringing" :
                            ringing++;
                            break;
                        case "answered" :
                            incall++;
                            break;
                        case "holding" :
                            onhold++;
                            break;
                        default :
                            break;
                    }
                });

            } else {
                $('#sip-splash').removeClass('hide');
                $('#sip-log').addClass('hide');
            }
        },

        /**
         * removes log items from localstorage and updates the UI
         */
        logClear : function() {

            localStorage.removeItem('sipCalls');
            ctxSip.logShow();
        },

        sipCall : function(target) {

            try {
                var s = ctxSip.phone.invite(target, {
                    media : {
                        stream      : ctxSip.Stream,
                        constraints : { audio : true, video : false },
                        render      : {
                            remote : $('#audioRemote').get()[0]
                        },
                        RTCConstraints : { "optional": [{ 'DtlsSrtpKeyAgreement': 'true'} ]}
                    }
                });
                s.direction = 'outgoing';
                ctxSip.newSession(s);

            } catch(e) {
                console.log(e);
            }
        },

        sipTransfer : function(sessionid) {

            var s      = ctxSip.Sessions[sessionid];
                //target = window.prompt('Enter destination number', '');
            newCallCtx(sessionid);
            sessionForAtXfer = sessionid;
            return;

            ctxSip.setCallSessionStatus('<i>Transfering the call...</i>');
            s.refer(target);
        },
        sipAtXferExecute : function(sessionId,targetSessionId) {
            var s       = ctxSip.Sessions[sessionId];
            ctxSip.setCallSessionStatus('<i>Transfering the call...</i>');
            try {
                s.refer(ctxSip.Sessions[targetSessionId]);
            } catch(err) {

            }
        },

        sipHangUp : function(sessionid) {

            var s = ctxSip.Sessions[sessionid];
            // s.terminate();
            if (!s) {
                return;
            } else if (s.startTime) {
                s.bye();
            } else if (s.reject) {
                s.reject();
            } else if (s.cancel) {
                s.cancel();
            }

        },

        sipSendDTMF : function(digit) {

            try { ctxSip.dtmfTone.play(); } catch(e) { }

            var a = ctxSip.callActiveID;
            if (a) {
                var s = ctxSip.Sessions[a];
                s.dtmf(digit);
            }
        },

        phoneCallButtonPressed : function(sessionid) {

            var s      = ctxSip.Sessions[sessionid],
                target = $("#numDisplay").val();

            if (!s && target != "") {

                $("#numDisplay").val("");
                ctxSip.sipCall(target);

            } else if (s.accept && !s.startTime) {

                s.accept({
                    media : {
                        stream      : ctxSip.Stream,
                        constraints : { audio : true, video : false },
                        render      : {
                            remote : $('#audioRemote').get()[0]
                        },
                        RTCConstraints : { "optional": [{ 'DtlsSrtpKeyAgreement': 'true'} ]}
                    }
                });
                setTimeout(function(){
                    if (cmk_session_type == "user" && cmk_wainting_for_webphone_to_show_contact){
                        console.log("remontee fiche reception avec ring");
                        continueSuccessPlay();
                        cmk_wainting_for_webphone_to_show_contact=false;
                    }
                },200);
            }
        },

        silenceButtonPressed : function(sessionId) {

        },

        phoneMuteButtonPressed : function (sessionid) {

            var s = ctxSip.Sessions[sessionid];

            if (!s.isMuted) {
                s.mute();
            } else {
                s.unmute();
            }
        },

        phoneHoldButtonPressed : function(sessionid) {
            var s = ctxSip.Sessions[sessionid];
            if (s.isOnHold().local === true) {
                if (ctxSip.callActiveID) ctxSip.Sessions[ctxSip.callActiveID].hold();
                s.unhold();
            } else {
                s.hold();
            }
        },


        setError : function(err, title, msg, closable) {
            console.error(msg);
            // Show modal if err = true
            if (err === true) {
                $("#mdlError p").html(msg);
                $("#mdlError").modal('show');

                if (closable) {
                    var b = '<button type="button" class="close" data-dismiss="modal">&times;</button>';
                    $("#mdlError .modal-header").find('button').remove();
                    $("#mdlError .modal-header").prepend(b);
                    $("#mdlError .modal-title").html(title);
                    $("#mdlError").modal({ keyboard : true });
                } else {
                    $("#mdlError .modal-header").find('button').remove();
                    $("#mdlError .modal-title").html(title);
                    $("#mdlError").modal({ keyboard : false });
                }
                $('#numDisplay').prop('disabled', 'disabled');
            } else {
                $('#numDisplay').removeProp('disabled');
                $("#mdlError").modal('hide');
            }
        },

        /**
         * Tests for a capable browser, return bool, and shows an
         * error modal on fail.
         */
        hasWebRTC : function() {

            if (navigator.webkitGetUserMedia) {
                return true;
            } else if (navigator.mozGetUserMedia) {
                return true;
            } else if (navigator.getUserMedia) {
                return true;
            } else {
                ctxSip.setError(true, 'Unsupported Browser.', 'Your browser does not support the features required for this phone.');
                window.console.error("WebRTC support not found");
                return false;
            }
        }
    };




    // Throw an error if the browser can't hack it.
    if (!ctxSip.hasWebRTC()) {
        return true;
    }

    ctxSip.phone = new SIP.UA(ctxSip.config);
    //ctxSip.phone.start();

    ctxSip.phone.on('connected', function(e) {
        ctxSip.setStatus("Connected");
        show_msg_log("<i class='fa fa-phone'></i> "+lbl_phone_registering,"success");
    });

    ctxSip.phone.on('connecting', function(e) {
        setStatus(1);
        show_msg_log("Connecting","info");
    })

    ctxSip.phone.on('disconnected', function(e) {
        $('.status-web-phone').removeClass('font-green font-yellow iconcmk-phone-registered iconcmk-phone-registering').addClass('font-red iconcmk-phone-unregistered').parent().attr('data-original-title', lbl_webphone_disconnected);;
        setStatus(0);
        //console.log(e);

        // disable phone
        ctxSip.setError(true, 'Websocket Disconnected.', 'An Error occurred connecting to the websocket.');

        // remove existing sessions
        $("#sessions > .session").each(function(i, session) {
            ctxSip.removeSession(session, 500);
        });

        //ctxSip.phone.stop();

        showWebphoneTLSErrorModal();


    });

    ctxSip.phone.on('registered', function(e) {
        console.log("registered");
        $('.go_prod').attr('disabled', false);
        $('.originate_call').attr('disabled', false);
        $('.call_contact').attr('disabled', false);
        showWebphoneRegisterErrorModal(false);
        clearTimeout(WEBPHONE_REGISTER);
        CountTentativeRegister = 0;
        var closeEditorWarning = function() {
            return 'If you close this window, you will not be able to make or receive calls from your browser.';
        };

        var closePhone = function() {
            ctxSip.phone.stop();
        };
        window.onunload       = closePhone;

        if (webPhoneLastStatus != 2) show_msg_log(lbl_phone_ready,"success");
        setStatus(2);


        // Get the userMedia and cache the stream
        if (SIP.WebRTC.isSupported()) {
            SIP.WebRTC.getUserMedia({ audio : true, video : false }, ctxSip.getUserMediaSuccess, ctxSip.getUserMediaFailure);
        }
        CountTentativeRegister = 0;
    });

    ctxSip.phone.on('registrationFailed', function(e,cause) {
        ctxSip.setError(true, 'Registration Error.', 'An Error occurred registering your phone. Check your settings.');
        show_msg_log(lbl_phone_register_error,"error");
        console.log("registration failed event",e,cause);
        logRegisterError("register failed",cause);
        showWebphoneRegisterErrorModal(true);
        setStatus(0);
    });

    ctxSip.phone.on('unregistered', function(e,cause) {
        ctxSip.setError(true, 'Registration Error.', 'An Error occurred registering your phone. Check your settings.');
        show_msg_log(lbl_phone_register_error,"error");
        console.log("unregister event",e,cause);
        logRegisterError("unregistered",cause);
        showWebphoneRegisterErrorModal(true);
        setStatus(0);
        clearTimeout(WEBPHONE_REGISTER);
        if (!ctxSip.phone.isRegistered() && CountTentativeRegister < 5) {
            WEBPHONE_REGISTER = setTimeout(function () {
                CountTentativeRegister++;
                show_msg_log(msg_webphone_attempt_5 + ' ' + CountTentativeRegister + '/5', 'info');
                $('.go_prod').attr('disabled', false);
                $('.originate_call').attr('disabled', false);
                $('.call_contact').attr('disabled', false);
                if (CountTentativeRegister >= 5) {
                    assitancesip();
                    show_msg_log(msg_webphone_unable_to_connnect, 'error')
                    //CountTentativeRegister = 0;
                    //ctxSip.phone.stop();
                } else {
                    from_set = 1;
                    ctxSip.phone.start();
                    ctxSip.phone.register();
                }
            }, 5000);
        }
    });

    ctxSip.phone.on('invite', function (incomingSession) {
        var s = incomingSession;
        s.direction = 'incoming';
        s.autoAnswer = (typeof s.request.getHeader('CMK_AUTO_ANSWER') === "undefined" || s.request.getHeader('CMK_AUTO_ANSWER') == "1" ? true : false) ;
        ctxSip.newSession(s);

        //AtXfer : Check if this session is xfer target
        //XFER EVENTS
        if (waitingForXferTarget) {
            targetSessionForAtXfer = s.ctxid;
            s.on("accepted", function(e) {
                $('button[data-bb-handler="btnTransferExec"],.btnTransferExec').removeClass("hidden");
            });
            s.on("rejected", xferSessionHandler);
            s.on("failed", xferSessionHandler);
            s.on("terminated", xferSessionHandler);
            s.on("cancel", xferSessionHandler);
            s.on("bye", xferSessionHandler);
        }
    });

    // Auto-focus number input on backspace.
    $('#sipClient').keydown(function(event) {
        if (event.which === 8) {
            $('#numDisplay').focus();
        }
    });

    $('#numDisplay').keypress(function(e) {
        // Enter pressed? so Dial.
        if (e.which === 13) {
            ctxSip.phoneCallButtonPressed();
        }
    });

    $('.digit').click(function(event) {
        event.preventDefault();
        var num = $('#numDisplay').val(),
            dig = $(this).data('digit');

        $('#numDisplay').val(num+dig);

        ctxSip.sipSendDTMF(dig);
        return false;
    });

    $('#phoneUI .dropdown-menu').click(function(e) {
        e.preventDefault();
    });

    $('#phoneUI').delegate('.btnCall', 'click', function(event) {
        ctxSip.phoneCallButtonPressed();
        // to close the dropdown
        return true;
    });

    $('.sipLogClear').click(function(event) {
        event.preventDefault();
        ctxSip.logClear();
    });

    $('#sip-logitems').delegate('.sip-logitem .btnCall', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.phoneCallButtonPressed(sessionid);
        return false;
    });

    $('#sip-logitems').delegate('.sip-logitem .btnSilence', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.stopRingTone();
        return false;
    });

    $('#sip-logitems').delegate('.sip-logitem .btnHoldResume', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.phoneHoldButtonPressed(sessionid);
        return false;
    });

    $('#sip-logitems').delegate('.sip-logitem .btnHangUp', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.sipHangUp(sessionid);
        return false;
    });

    $('#sip-logitems').delegate('.sip-logitem .btnTransfer', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.sipTransfer(sessionid);
        return false;
    });

    $('#sip-logitems').delegate('.sip-logitem .btnMute', 'click', function(event) {
        var sessionid = $(this).closest('.sip-logitem').data('sessionid');
        ctxSip.phoneMuteButtonPressed(sessionid);
        return false;
    });

    /*$('#sip-logitems').delegate('.sip-logitem', 'dblclick', function(event) {
        event.preventDefault();

        var uri = $(this).data('uri');
        $('#numDisplay').val(uri);
        ctxSip.phoneCallButtonPressed();
    });*/

    $('#sldVolume').on('change', function() {

        var v      = $(this).val() / 100,
            // player = $('audio').get()[0],
            btn    = $('#btnVol'),
            icon   = $('#btnVol').find('i'),
            active = ctxSip.callActiveID;

        // Set the object and media stream volumes
        if (ctxSip.Sessions[active]) {
            ctxSip.Sessions[active].player.volume = v;
            ctxSip.callVolume                     = v;
        }

        // Set the others
        $('audio').each(function() {
            $(this).get()[0].volume = v;
        });

        if (v < 0.1) {
            btn.removeClass(function (index, css) {
                return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
            })
                .addClass('btn btn-sm btn-danger');
            icon.removeClass().addClass('fa fa-fw fa-volume-off');
        } else if (v < 0.8) {
            btn.removeClass(function (index, css) {
                return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
            }).addClass('btn btn-sm btn-info');
            icon.removeClass().addClass('fa fa-fw fa-volume-down');
        } else {
            btn.removeClass(function (index, css) {
                return (css.match (/(^|\s)btn\S+/g) || []).join(' ');
            }).addClass('btn btn-sm btn-primary');
            icon.removeClass().addClass('fa fa-fw fa-volume-up');
        }
        return false;
    });

    // Hide the spalsh after 3 secs.
    ctxSip.logClear();
    setTimeout(function() {
        ctxSip.logShow();
    }, 3000);


    /**
     * Stopwatch object used for call timers
     *
     * @param {dom element} elem
     * @param {[object]} options
     */
    var Stopwatch = function(elem, options) {

        // private functions
        function createTimer() {
            return document.createElement("span");
        }

        var timer = createTimer(),
            offset,
            clock,
            interval;

        // default options
        options           = options || {};
        options.delay     = options.delay || 1000;
        options.startTime = options.startTime || Date.now();

        // append elements
        //elem.appendChild(timer);

        function start() {
            if (!interval) {
                offset   = options.startTime;
                interval = setInterval(update, options.delay);
            }
        }

        function stop() {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }

        function reset() {
            clock = 0;
            render();
        }

        function update() {
            clock += delta();
            render();
        }

        function render() {
            timer.innerHTML = moment(clock).format('mm:ss');
        }

        function delta() {
            var now = Date.now(),
                d   = now - offset;

            offset = now;
            return d;
        }

        // initialize
        reset();

        // public API
        this.start = start; //function() { start; }
        this.stop  = stop; //function() { stop; }
    };

});