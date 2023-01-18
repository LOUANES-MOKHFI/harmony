var socket = new io.connect('https://'+cmk_chat_host+':'+cmk_chat_port,{secure: false});
var VAR_TIMEOUTRECONNECT = false;
var VAR_TIMEOUTRECONNECT_RETRY=0;
var VAR_TIMEOUTRECONNECT_RETRY_MAX=31;
var usersIn = [];
var socketId;
if (cmk_session_type == 'root') {
    var chat_types = ['root','superviseur','user'];
    var chat_groupes = false;
} else if (cmk_session_type == 'superviseur') {
    var chat_types = ['root','superviseur','user'];
    var chat_groupes = cmk_grp_com.split(',');
} else if (cmk_session_type == 'user') {
    var chat_types = ['root','superviseur'];
    var chat_groupes = cmk_grp_com.split(',');
}

var totalMessages = 0;
var force_to_deconnect_user=0;
socket.on('connect_error', function(reason) {
    if (typeof console !== "undefined" && console !== null) {
        //console.log("Connect failed (port " + cmk_chat_port + ") reason:"+reason);
        //console.log("Retrying :"+VAR_TIMEOUTRECONNECT_RETRY+" ON "+VAR_TIMEOUTRECONNECT_RETRY_MAX);


        socket.on('disconnect',function() {
            //addUserChat(cmk_login,cmk_session_type,cmk_account);
        });


        socket.disconnect();
        if(typeof is_onattente!="undefined" && is_onattente==1){
            //Fncdashboard('fromattente'); dÃ©sactivÃ© car il risque de bloquer les agents
        }

        if(is_agent!=0){
            VAR_TIMEOUTRECONNECT_RETRY++;
            if (VAR_TIMEOUTRECONNECT_RETRY< VAR_TIMEOUTRECONNECT_RETRY_MAX){
                VAR_TIMEOUTRECONNECT  = setTimeout(function(){
                    $('#info_node_connect').modal('hide');
                    socket.connect();
                }, 150);
            }else{
                Fncdashboard('fromattente');
                VAR_TIMEOUTRECONNECT_RETRY=0;
                if(!$('#info_node_connect').is(':visible')){
                    $('#info_node_connect').modal('show');
                }
                $('#link_to_resolve_node').attr('href','https://'+cmk_chat_host+':'+cmk_chat_port);

            }
        }

        //
    }

});

// Add a connect listener
socket.on('connect',function() {
    $('#info_node_connect').modal('hide');
    VAR_TIMEOUTRECONNECT_RETRY=0;

    if(is_agent!=0) {
        clearTimeout(VAR_TIMEOUTRECONNECT);
    }
    socketId = socket.io.engine.id;
    addUserChat(cmk_login,cmk_session_type,cmk_account);
    if (cmk_session_type == 'user') checkMyPoste();
});

socket.on("request user",function() {
    addUserChat(cmk_login,cmk_session_type,cmk_account);
})

socket.on('user added',function() {
    getUsers(['root','superviseur','user'],0,cmk_account);
});

socket.on("new user",function(data) {
    getUsers(chat_types,chat_groupes,cmk_account)
})

// Add a connect listener
socket.on('new message',function(data) {
    if (cmk_num_login != data.dest) return true;
    var message = data.message;
    socket.emit("received message",{from : data.fromUser.num_login});
    if ($("#quick_sidebar_tab_1").hasClass("page-quick-sidebar-content-item-shown") && $("#chat-messages-div").data("chatwith") == data.fromUser.num_login ) {
        $("#chat-messages-div").empty();
        $.each(data.history,function(k,histomessage) {
            var messageHtml = newMessage(histomessage.direction.toLowerCase(), prettyDateChat(moment(histomessage.sent)), histomessage.from , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', histomessage.message);
            $("#chat-messages-div").append(messageHtml);
        });
        var messageHtml = newMessage('in', prettyDateChat(moment()), data.fromUser.name+ ' ('+data.fromUser.username+')' , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', message);
        $("#chat-messages-div").append(messageHtml);
        $("#chat-messages-div").slimScroll({
            scrollTo: '1000000px'
        });
    }
    /*$("#chat-title").text("Chat avec "+data.fromUser.name)
    $("#chat-messages-div").data("chatfrom",cmk_num_login);
    $("#chat-messages-div").data("chatwith",data.fromUser.num_login);
    $("#chat-messages-div").data("chatwithname",data.fromUser.name);

    $("#quick_sidebar_tab_1").addClass("page-quick-sidebar-content-item-shown");
    $('body').addClass('page-quick-sidebar-open');
    $("#chat-msg-input").focus();*/
    var audio = new Audio(base_url_ajax+'assets/cmk/sounds/facebookchat.mp3');
    audio.play();
});




function show_msg_log_node(msg, type,addClass) {
    toastr.options = {
        "closeButton" : false,
        "debug" : false,
        "positionClass" : "toast-bottom-right"+addClass,
        "onclick" : null,
        "showDuration" : "300",
        "hideDuration" : "400",
        "timeOut" : "500000000000000",
        "extendedTimeOut" : "500000000000000",
        "showEasing" : "swing",
        "hideEasing" : "linear",
        "showMethod" : "fadeIn",
        "hideMethod" : "fadeOut",
        //"containerId": 'toast-container'+KeyConfirm,

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


/*
Gestion de pause
 */

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}



socket.on("reply new pause",function(data) {

    if (cmk_num_login != data.destinataire) return true;
    $('.pause-generic[data-keyconfirmp="'+data.keyConfirm+'"]').attr('data-pause-accepted',(data.type=="OK") ? true : false);
    if((data.type=="OK")){
        $('.pause_traitement[data-keyconfirm="'+data.keyConfirm+'"]').html(lbl_pause_acepter);
    }else{
        InitializeRequestPause(data.keyConfirm);
    }
    show_msg_log(data.message,'info');

});
var keyConfirm="";
var last_id_trace_pause_generic = "";
function InitializeRequestPause(keyConfirm){



    $('.pause-generic[data-keyconfirmp="'+keyConfirm+'"]').attr('data-pause-accepted',false)
    $('.pause-generic[data-keyconfirmp="'+keyConfirm+'"]').attr('data-keyconfirmp','');

    $('.pause_traitement[data-keyconfirm="'+keyConfirm+'"]').html(lbl_pause_wait);
    $('.pause_traitement[data-keyconfirm="'+keyConfirm+'"]').addClass('hidden');
    $('.pause_traitement[data-keyconfirm="'+keyConfirm+'"]').attr('data-keyconfirm','');

    keyConfirm = "";



}

$(document).on('click','.pause-generic', function () {
    idpause = $(this).data('idpause');
    getconFirrm = $(this).attr('data-keyconfirmp');
    PauseAccepted =  $(this).attr('data-pause-accepted');

    var obPauseDemande = $('.pause-generic[data-idpause="'+idpause+'"]');

    confirmation = $(this).data('confirm');
    label = $(this).data('label-pause');

    name_user = $('.profile-usertitle-name').html();

    if(getconFirrm!="" && $('.pause-generic[data-keyconfirmp="'+getconFirrm+'"]').attr('data-pause-accepted') ==false) return false;

    if($('.pause-generic[data-keyconfirmp="'+getconFirrm+'"]').attr('data-pause-accepted')=="true"){
        InitializeRequestPause(getconFirrm);
        sendToPause(idpause);
        //sendToPauseGeneric(idpause);
        $('#defaultCountdownPause').countdown({
            since : 0,
            format : 'HMS'
        });
        $('.title-modal-pause-generic').html(label)

        $('#modal-pause-generic').modal('show')

        return false;
    }

    if(confirmation==1){
        bootbox
            .dialog({
                message: '<p>'+lbl_bootbox_pause_message+'</p>',
                title: '<h4 class="box-heading">'+label+'</h4>',
                size : 'large',
                buttons: {
                    confirm: {
                        label: lbl_bootbox_btn_send_request,
                        className: 'btn-success',
                        callback: function (result) {


                            //send demande pause
                            //gÃ©neration d une clÃ© pour la demande
                            //chat_groupes,cmk_account
                            socket.emit('get users pause', {grp_com : chat_groupes , account : cmk_account,keyPause:makeid() });


                            var data={
                                logAction : "start_pause_generic_confirm"
                            };
                            //data.logAction="start_pause_generic_confirm";
                            agentLogAction(data);
                            //console.log('This was logged in the callback: ' + result);
                        }
                    },
                    cancel: {
                        label: BTN_ANNULER,
                        className: 'btn-default'
                    }
                },

            });


    }else{
        sendToPause(idpause);
        //sendToPauseGeneric(idpause);

        $('#defaultCountdownPause').countdown({
            since : 0,
            format : 'HMS'
        });
        $('.title-modal-pause-generic').html(label)

        $('#modal-pause-generic').modal('show')
    }

});

socket.on("requested users pause",function(data) {
    var users = data.users;
    var lenusers = $.map(users, function(n, i) { return i; }).length;

    if(lenusers>0){
        var keyConfirm = data.keyPause+'_'+cmk_num_login;

        $('.pause-generic[data-idpause="'+idpause+'"]').attr('data-keyconfirmp',keyConfirm);

        $('.pause_traitement[data-idpause="'+idpause+'"]').attr('data-keyconfirm',keyConfirm);
        $('.pause_traitement[data-keyconfirm="'+keyConfirm+'"]').removeClass('hidden');

        if (users != usersIn) {
            $.each(users, function (k, v) {
                socket.emit('request new pause', { message : msg_operator+name_user+", "+lbl_poste+" "+poste+" "+lbl_request_exist_pause+" ("+label+")" , from : cmk_num_login, destinataire : v.num_login,keyConfirm : keyConfirm,account : cmk_account });
            });
            usersIn = users;

        }
    }else{
        show_msg_log(msg_no_responsbale_connect,'error')
        return false;
    }
});


$('#modal-pause-generic').on('hidden.bs.modal', function(e) {
    // do something...
    InPause = 0;
    sendToNotPause();
    sendToNotPauseGeneric();
    $('#defaultCountdownPause').countdown('destroy');
    setCrmWidgetsValuesProd();
});





var PushNotyPauseIds = [];
var nPause = false;
var nPauseArr = [];
var KeyGClosePause = "";
var PushDataPause = [];
socket.on("get new pause",function(data) {

    if(allow_notification==0)   return false;
    if (cmk_num_login != data.destinataire) return true;
    var idNotyPause = data.keyConfirm;
    PushDataPause.push(data);
    if(PushNotyPauseIds.length>0 && PushNotyPauseIds.indexOf(data.from)!==-1){
        // alert('aaaaaaaaaa')
        //notification  bloquer si deja envoyÃ©
     } else {

        nPause = new Noty({
            type: 'info',
            layout: 'centerRight',
            theme: 'mint',
            text: data.message,
            progressBar: true,
            closeWith: ['button'],
            animation: {
                open: 'noty_effects_open',
                close: 'hidden',
            },
            id: idNotyPause,
            force: false,
            killer: false,
            queue: 'QueuePause_'+idNotyPause,
            container: false,
            closable : false,
            sounds: {
                sources: [],
                volume: 1,
                conditions: []
            },
            titleCount: {
                conditions: []
            },
            modal: false,
            callbacks: {
                onShow: function() {
                   
                    $('.noty_close_button').addClass('hidden');
                },
                //Ã  la fermeture de la notification on verfie s'il y une clÃ© generer si oui on envoie une socket pour feremer toute les notifications chez sup concernÃ© avec la mm clÃ©
    
                onClose: function() {
                    //alert(KeyGClose)
                    /* if(KeyGClose!='' && KeyGClose==data.poste_user){
                        socket.emit('forceclose assistance', {id_generate_key : KeyGClose,account : data.account});
                        OnCloseFlag = true;
                        KeyGClose = "";
                    } */
                    
                },
                afterClose: function() {
                    if(KeyGClosePause!=''){
    
                        KeyGClosePause = "";
                    }
                },
                onHover: function() {},
    
            },
            buttons: [
                Noty.button(lbl_pause_acepter_btn, 'btn green btn-xs', function () {
                    socket.emit('reply request new pause', { message : lbl_bootbox_btn_send_request_accepted , from : cmk_num_login, destinataire : data.from,keyConfirm : idNotyPause,account : cmk_account,type: 'OK' });
                    socket.emit('request close noty pause', { message : lbl_bootbox_btn_send_request_accepted , from : cmk_num_login, destinataire : data.from,keyConfirmClose : idNotyPause,account : cmk_account,type: 'OK' });

                }, {id: 'button-pause-ok-'+data.from, 'data-status': 'ok'}),
    
                Noty.button(lbl_pause_reject_btn, 'btn red btn-xs', function () {
                    socket.emit('reply request new pause', { message : lbl_bootbox_btn_send_request_rejected , from : cmk_num_login, destinataire : data.from,keyConfirm : idNotyPause,account : cmk_account,type: 'KO' });
                    socket.emit('request close noty pause', { message : lbl_bootbox_btn_send_request_accepted , from : cmk_num_login, destinataire : data.from,keyConfirmClose : idNotyPause,account : cmk_account,type: 'OK' });
                }, {id: 'button-pause-reject-'+data.from}),
    
                Noty.button(lbl_prendre_encharge_btn_close_all, 'btn purple btn-xs', function () {
                    
                    /*if(PushDataPause.length>0){
                        $.each(PushDataPause,function(i,dataPause){
                            console.log(dataPause,'dataPausedataPausedataPausedataPause')

                            socket.emit('reply request new pause', { message : lbl_bootbox_btn_send_request_rejected , from : cmk_num_login, destinataire : dataPause.from,keyConfirm : dataPause.keyConfirm,account : cmk_account,type: 'KO' });
                            socket.emit('request close noty pause', { message : lbl_bootbox_btn_send_request_accepted , from : cmk_num_login, destinataire : dataPause.from,keyConfirmClose : dataPause.keyConfirm,account : cmk_account,type: 'OK' });    
                            
                        });
                       
                      
                    }*/

                    if(PushNotyPauseIds.length>0){
                        $.each(PushNotyPauseIds,function(i,idNoty){
                            console.log(idNoty,'idNotyidNotyidNotyidNoty')
                            
                            socket.emit('forceclose pause', { account : cmk_account,id_generate_key :idNoty,from:cmk_num_login });
    
                            
                        });
                       
                     
                    }
                    Noty.closeAll();
                    return false;
                }, {id: 'button-pause-close-all-'+data.from})
            ]
        }).show();
//        $('.noty_close_button').addClass('hidden');
        
        PushNotyPauseIds.push(nPause.id);
        nPauseArr.push(nPause)
        return false;
     }
    
});


socket.on("close new pause",function(data) {
    if(cmk_session_type == 'superviseur' || cmk_session_type == 'root'){

        if(cmk_num_login==data.from){
            console.log(data);
            var idNotyP = data.keyConfirmClose;
            console.log(idNotyP,'idNotyPidNotyPidNotyPidNotyPidNotyP')
            Noty.closeAll('QueuePause_'+idNotyP);
            $('#'+idNotyP).remove();
        }
        
    }


});

socket.on("force close pause",function(data_close) {
    console.log(data_close,"force close pause");
    if(data_close.from == cmk_num_login){
         KeyGClosePause = data_close.id_generate_key;
        if(nPauseArr.length>0){
            $.each(nPauseArr,function(i,instancePause){
                
                if(typeof(instancePause)!=="undefined"){
                  
                  
                    if(instancePause.id==KeyGClosePause){
                        instancePause.close(KeyGClosePause);
                        nPauseArr.splice(i, 1);
                    }
                }
                
        
            });
            //
           //nAssistance.close(KeyGClose);
           Noty.closeAll('QueuePause_'+KeyGClosePause);
           $('#'+KeyGClosePause).remove();
           //PushNotyPauseIds = [];
           return false;
        }
    }
   

});


socket.on("message update",function(data) {
    totalMessages = 0;
    $.each(data,function(k,v) {
        if ($("#quick_sidebar_tab_1").hasClass("page-quick-sidebar-content-item-shown") && $("#chat-messages-div").data("chatwith") == k ) $(".chat_user_div[data-numlogin='"+k+"']").find(".nb_msg").text('');
        else {
            $(".chat_user_div[data-numlogin='"+k+"']").find(".nb_msg").text(v);
            totalMessages += parseInt(v);
        }
        window.localStorage.setItem("cmkchatcounter",totalMessages);
        var cmknotifcounter = parseInt(window.localStorage.getItem("cmknotifcounter") ||Â 0);
        if (totalMessages + cmknotifcounter > 0) {
            $("body").removeClass($.cookie('animations'));
            $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><span class="badge badge-danger animated infinite bounce chat-badge">'+(totalMessages+cmknotifcounter)+'</span>');
            $.cookie('animations', 'bounce');
        } else {
            $("body").removeClass($.cookie('animations'));
            $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><i class="icon-logout"></i>');
        }
    });
});
// Add a disconnect listener
socket.on('disconnect',function(reason) {
    /*if (cmk_session_type == "user" && cmk_user_logging_out === 0) {
        if(!$('#info_node_connect').is(':visible')){
            $('#info_node_connect').modal('show');
        }
    }*/
    if(typeof is_onattente!="undefined" && is_onattente==1){
        //Fncdashboard('fromattente');  dÃ©sactivÃ© car il risque de bloquer les agents
    }
    VAR_TIMEOUTRECONNECT_RETRY++;
    if (VAR_TIMEOUTRECONNECT_RETRY< VAR_TIMEOUTRECONNECT_RETRY_MAX){
        VAR_TIMEOUTRECONNECT  = setTimeout(function(){
            $('#info_node_connect').modal('hide');
            socket.connect();
        }, 150);
    }else{
        if (cmk_session_type == "user" && cmk_user_logging_out === 0) {
            if (!$('#info_node_connect').is(':visible')) {
                $('#info_node_connect').modal('show');
            }
            $('#link_to_resolve_node').attr('href', 'https://' + cmk_chat_host + ':' + cmk_chat_port);
            Fncdashboard('fromattente');

        }

        VAR_TIMEOUTRECONNECT_RETRY=0;
    }

});

socket.on("requested users",function(data) {
    var users = data.users;
    if (users != usersIn) {

        var htmlUsers = '';
        $.each(users, function (k, v) {
            htmlUsers += '<li class="media chat_user_div" data-numlogin="'+ v.num_login +'" data-name="'+ v.name +'">';
            htmlUsers += '<div class="media-status">';
            htmlUsers += '<span class="badge badge-success nb_msg">'+(data && data.messages[v.num_login] && data.messages[v.num_login] != 0 ? data.messages[v.num_login] : '' )+'</span>';
            htmlUsers += '</div>';
            htmlUsers += '<img class="media-object"';
            htmlUsers += 'src="' + base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png" alt="...">';
            htmlUsers += '<div class="media-body">';
            htmlUsers += '<h4 class="media-heading">' + v.name + '</h4>';
            htmlUsers += '<div class="media-heading-sub">'+ (v.usertype == 'user' ? 'Agent' : v.usertype)+'</div>';
            htmlUsers += '</div>';
            htmlUsers += '</li>';
        });
        usersIn = users;
        $("#chat-users-list").html(htmlUsers);
    }
});

socket.on("user left",function(data) {
    if (data.num_login == cmk_num_login) addUserChat(cmk_login,cmk_session_type,cmk_account);
    getUsers(chat_types,chat_groupes,cmk_account)
});

/*socket.on("typing",function(data) {
    //if (data.dest == cmk_num_login) console.log(data.username+" IS TYPING");
})*/

socket.on("requested history",function(data) {
    $.each(data,function(k,histomessage) {
        var messageHtml = newMessage(histomessage.direction.toLowerCase(), prettyDateChat(moment(histomessage.sent)), histomessage.from , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', histomessage.message);
        $("#chat-messages-div").append(messageHtml);
        $("#chat-messages-div").slimScroll({
            scrollTo: '1000000px'
        });
    });
});

socket.on("exec command",function(data) {
    if (cmk_session_type == 'user' && data.command == 'statusCall') {
        checkStatusCall(data.postes);
    }
    if (cmk_session_type != 'user' || data.user != cmk_num_user) return true;
    var command = data.command;
    if (command == "checkFiche") {
        disableMenuFromAttenteButton();
        checkFicheNJS(data);
    } else if (command == "checkRecep") {
        disableMenuFromAttenteButton();
        checkRecepNJS(data);
    } else if (command == "checkPPP") {
        checkPPPNJS(data);
    } else if (command == "callNextTelPPP") {
        callNextTelPPPNJS(data);
    } else if (command == "alert_rappel") {
        alertRappel(data);
    }

})



socket.on("check user waiting",function(data) {
    if ((cmk_session_type == 'user') && (data.account == cmk_account) && (data.user == cmk_num_user)) {
        if ((CMK_CONTACT_INFO_SHOWN_COMPLETE==data.contact) && (CMK_FILE_INFO_SHOWN_COMPLETE==data.file)){
            //console.log("process contact ok");
        }
        else{

            if( (type_global_prod=="prd") || (type_global_prod=="inprd")){
                //console.log(type_global_prod+": detected issue contact "+data.contact+" on file "+data.file+" "+PPP_CURRENT_LAUNCHED_CONTACT_ISSUE+" time(s)");
                if (is_web_phone){
                    CMK_WBEPHONE_GO_BACK_MENU=false;
                    sipHangUp();
                    sipUnRegister();
                    //console.log("phone "+data.phone+" re-registred");
                    play();
                }else{
                    show_msg_log(lbl_call_not_passed_to_user+data.phone,'warning');
                }
                PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = PPP_CURRENT_LAUNCHED_CONTACT_ISSUE+1;
                if (PPP_CURRENT_LAUNCHED_CONTACT_ISSUE > PPP_CURRENT_LAUNCHED_CONTACT_ISSUE_MAX){
                    show_msg_log(lbl_general_connection_issue, 'error');
                    setTimeout(function() {
                        $('.attente_ppp').html('');
                        status_call_ppp = false;
                        Fncdashboard('fromattente');
                    },1000);
                }
            }
            else{
                if( (type_global_prod=="iprog") || (type_global_prod=="iniprog")){
                    if (PPP_CURRENT_LAUNCHED_CONTACT_ISSUE > PPP_CURRENT_LAUNCHED_CONTACT_ISSUE_MAX){
                        show_msg_log(lbl_general_connection_issue, 'error');
                        setTimeout(function() {
                            $('.attente_ppp').html('');
                            status_call_ppp = false;
                            Fncdashboard('fromattente');
                        },2000);
                    }
                    else{
                        //console.log(type_global_prod+": detected issue contact "+data.contact+" on file "+data.file +" "+PPP_CURRENT_LAUNCHED_CONTACT_ISSUE+" time(s)");
                        PPP_CURRENT_LAUNCHED_CONTACT_ISSUE = PPP_CURRENT_LAUNCHED_CONTACT_ISSUE+1;
                    }
                }
            }



        }
    }
})


socket.on("send user phone na",function(data) {
    if ((cmk_session_type == 'user') && (data.account == cmk_account) && (data.user == cmk_num_user)) {
        show_msg_log(lbl_call_not_passed_to_user + data.phone, 'error');
    }
})



socket.on("hangup poste",function(data) {
    if (data.poste == cmk_poste_user && typeof hangUpPoste === 'function' && (is_web_phone == 0 || webphone_version == 1))  {
        hangUpPoste();
        forceOut = 0;
    }
})


socket.on("online poste",function(data) {
    if (data.poste == cmk_poste_user) {
        if (cmk_session_type == 'user') {
            if (is_web_phone == 0 || webphone_version == 1) onlinePoste(data);
        } else {
            onlinePostePlive(data)
        }
    }
})

socket.on("check poste response",function(data) {
    if (data) {
        onlinePoste(data);
    } else {
        hangUpPoste();
    }
})

function setUserAttenteNJS() {
    socket.emit('user pred attente',{ account : cmk_account , user : cmk_num_user});
}

function setUserTraitementNJS() {
    socket.emit('user pred traitement',{ account : cmk_account , user : cmk_num_user});
}

function setUserMenuNJS() {
    socket.emit('user pred menu',{ account : cmk_account , user : cmk_num_user});
}

function checkMyPoste() {
    socket.emit('check poste', { poste : cmk_poste_user, account : cmk_account },function(data) {

    });
}

function sendHangupMyChannel() {
    socket.emit('force hangup', { poste : cmk_poste_user, account : cmk_account },function(data) {

    });
}

// Sends a message to the server via sockets
function addUserChat(userName,userType,accountName) {
    socket.emit('add user', { username: userName , usertype : userType , name : cmk_name_user , num_login : cmk_num_login , grp : chat_groupes , account : accountName },function() {
        getUsers(chat_types,chat_groupes,cmk_account)
    });
    //socket.send(message);
};

function sendMessage(message) {
    socket.emit('new message', { message : message , type : 1 , destinataire : 'room' });
}

function getUsers(type,grp_com,account) {
    socket.emit('get users', {type : type , grp_com : grp_com , account : account });
}


function newMessage(dir, time, name, avatar, message) {
    var tpl = '';
    tpl += '<div class="post '+ dir +'">';
    tpl += '<img class="avatar" alt="" src="'+avatar+'" alt="..." />';
    tpl += '<div class="message">';
    tpl += '<span class="arrow"></span>';
    tpl += '<a href="#" class="name">'+name+'</a>&nbsp;';
    tpl += '<span class="datetime">' + time + '</span>';
    tpl += '<span class="body">';
    tpl += message;
    tpl += '</span>';
    tpl += '</div>';
    tpl += '</div>';

    return tpl;
}

function getHistory(with_login) {
    socket.emit('get history',{num_login : with_login});
}

function notifyUser() {

    if (!("Notification" in window)) {
        //console.log("no notification");
    }
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        Push.create("Comunik - Chat", {
            body: "Nouveau message",
            icon: 'icon.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            },
            actions: [
                {action: 'actionYes', 'title': 'Yes'},
                {action: 'actionNo', 'title': 'No'}
            ]
        });
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                Push.create("Comunik - Chat", {
                    body: "Nouveau message",
                    icon: 'icon.png',
                    timeout: 4000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    },
                    actions: [
                        {action: 'actionYes', 'title': 'Yes'},
                        {action: 'actionNo', 'title': 'No'}
                    ]
                });
            }
        });
    }
}

Notification.requestPermission().then(function(result) {
});



function prettyDateChat(time){
    //var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    var date = time.toDate(),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    /*if ( isNaN(day_diff) || day_diff < 0 )
        return  time.format('HH:mm');*/

    var formatted_date ='';
    var formatted_time =time.format('HH:mm');;
    if (day_diff == 0) {
        formatted_date = 'Aujourd\'hui';
    } else if (day_diff == 1) {
        formatted_date = 'Hier';
    } else {
        formatted_date = time.format('DD/MM/YYYY');
    }

    return formatted_date +' '+formatted_time;
}

$(document).ready(function() {
    getUsers(chat_types,chat_groupes,cmk_account);
    $("#chat-send-btn").click(function() {
        var message = $("#chat-msg-input").val();
        var dest = $("#chat-messages-div").data("chatwith");
        var dest_name = $("#chat-messages-div").data("chatwithname");
        socket.emit('new message',{ num_login : dest , message : message , account : cmk_account , from : cmk_num_login });
        //var messageHtml = newMessage('out', moment().format('HH:mm'), cmk_name_user+ ' ('+cmk_login+')' , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', message);
        var messageHtml = newMessage('out', prettyDateChat(moment()), cmk_name_user+ ' ('+cmk_login+')' , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', message);
        //console.log("ttyt",prettyDateChat(moment()));
        $("#chat-messages-div").append(messageHtml);
        $("#chat-msg-input").val("");
        $("#chat-messages-div").slimScroll({
            scrollTo: '1000000px'
        });
        var dataAgent={
            logAction:"chat_send_msg",
            logChat_dest_name:dest_name,
            logChat_message:message,
        };
        if (cmk_session_type == "user") agentLogAction(dataAgent);
    });

    $('#chat-msg-input').keypress(function (e) {
        socket.emit('typing',{ dest : $("#chat-messages-div").data("chatwith") , account : cmk_account });
        if (e.which == 13) {
            var message = $("#chat-msg-input").val();
            var dest = $("#chat-messages-div").data("chatwith");
            var dest_name = $("#chat-messages-div").data("chatwithname");
            socket.emit('new message',{ num_login : dest , message : message , account : cmk_account , from : cmk_num_login });
            var messageHtml = newMessage('out', prettyDateChat(moment()), cmk_name_user+ ' ('+cmk_login+')' , base_url_ajax + 'assets/metronic/assets/layouts/layout4/img/avatar.png', message);
            $("#chat-messages-div").append(messageHtml);
            $("#chat-msg-input").val("");
            $("#chat-messages-div").slimScroll({
                scrollTo: '1000000px'
            });
            if (cmk_session_type == "user") {
                var dataAgent = {
                    logAction: "chat_send_msg",
                    logChat_dest_name: dest_name,
                    logChat_message: message,
                };
                agentLogAction(dataAgent);
            }
        }
    });
})

$(document).on('click','#cmk_log_out_link',function() {
    socket.emit('disconnect',{account : cmk_account});
});

$(document).on('click','.chat_user_div',function () {
    var num_login = $(this).data("numlogin");
    var with_name = $(this).data("name");
    $("#chat-messages-div").data("chatfrom",cmk_num_login);
    $("#chat-messages-div").data("chatwith",num_login);
    $("#chat-messages-div").data("chatwithname",with_name);
    $("#chat-messages-div").empty();
    getHistory(num_login);
    var currentMsg = $(".chat_user_div[data-numlogin='"+num_login+"']").find(".nb_msg").text();
    currentMsg = (currentMsg == '' ? 0 : parseInt(currentMsg));
    totalMessages = totalMessages - currentMsg;
    window.localStorage.setItem("cmkchatcounter",totalMessages);
    var cmknotifcounter = parseInt(window.localStorage.getItem("cmknotifcounter") ||Â 0);
    if (totalMessages + cmknotifcounter > 0) {
        $("body").removeClass($.cookie('animations'));
        $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><span class="badge badge-danger animated infinite bounce chat-badge">'+(totalMessages+cmknotifcounter)+'</span>');
        $.cookie('animations', 'bounce');
    } else {
        $("body").removeClass($.cookie('animations'));
        $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><i class="icon-logout"></i>');
    }
    $(".chat_user_div[data-numlogin='"+num_login+"']").find(".nb_msg").text('');
    $("#chat-title").text(chat_label_chat_with+" "+with_name)
    $("#quick_sidebar_tab_1").addClass("page-quick-sidebar-content-item-shown");
    $("#chat-msg-input").focus();


});
function chatWithNJS(num_login,with_name) {
    $("#chat-messages-div").data("chatfrom", cmk_num_login);
    $("#chat-messages-div").data("chatwith", num_login);
    $("#chat-messages-div").data("chatwithname", with_name);
    $("#chat-messages-div").empty();
    getHistory(num_login);
    var currentMsg = $(".chat_user_div[data-numlogin='"+num_login+"']").find(".nb_msg").text()
    currentMsg = (currentMsg == '' ? 0 : parseInt(currentMsg));
    totalMessages = totalMessages - currentMsg;
    window.localStorage.setItem("cmkchatcounter",totalMessages);
    var cmknotifcounter = parseInt(window.localStorage.getItem("cmknotifcounter") ||Â 0);
    if (totalMessages + cmknotifcounter > 0) {
        $("body").removeClass($.cookie('animations'));
        $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><span class="badge badge-danger animated infinite bounce chat-badge">'+(totalMessages+cmknotifcounter)+'</span>');
        $.cookie('animations', 'bounce');
    } else {
        $("body").removeClass($.cookie('animations'));
        $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><i class="icon-logout"></i>');
    }
    $(".chat_user_div[data-numlogin='" + num_login + "']").find(".nb_msg").text('');
    $("#chat-title").text(chat_label_chat_with+" " + with_name);
    $('body').toggleClass('page-quick-sidebar-open');
    $("#quick_sidebar_tab_1").addClass("page-quick-sidebar-content-item-shown");
    $("#chat-msg-input").focus();
}



// Usage




//Assitance Superviseur
var cmk_id_generate_key =  "";
//Action Noitification Agent/Superviseur
$(document).on('click','.get_assitance',function(){



    //recuperer le nom de l'agent
    name_user = $('.profile-usertitle-name').html();
    //recuperer les superviseur concernÃ©
    socket.emit('get users assistance', {grp_com : chat_groupes , account : cmk_account });

    socket.on("requested users assistance",function(data) {
        var users = data.users;
        var lenusers = $.map(users, function(n, i) { return i; }).length;

        if(lenusers>0){


            if (users != usersIn) {
                cmk_id_generate_key = makeid();
                $.each(users, function (k, v) {


                    socket.emit('request new assistance', { message : msg_operator+name_user+", "+lbl_poste+" "+poste+" "+lbl_request_assistance , from : cmk_num_login, destinataire : v.num_login,account : cmk_account,id_generate_key : cmk_id_generate_key,name_user : name_user,ip_user :cmk_ip_local_com });


                });
                usersIn = users;

            }



        }else{
            show_msg_log(msg_no_responsbale_connect,'info')
            return false;
        }
    });

    cmk_id_generate_key = "";

})

function assitancesip(){
    //return false;
    //recuperer le nom de l'agent
    name_user = $('.profile-usertitle-name').html();
    //recuperer les superviseur concernÃ©
    socket.emit('get users assistance', {grp_com : chat_groupes , account : cmk_account });

    socket.on("requested users assistance",function(data) {
        var users = data.users;
        var lenusers = $.map(users, function(n, i) { return i; }).length;

        if(lenusers>0){


            if (users != usersIn) {
                cmk_id_generate_key = makeid();
                $.each(users, function (k, v) {


                    socket.emit('request new assistance', { message : msg_operator+name_user+", "+lbl_poste+" "+poste+" "+lbl_request_assistance_sip , from : cmk_num_login, destinataire : v.num_login,account : cmk_account,id_generate_key : cmk_id_generate_key,name_user : name_user,ip_user :cmk_ip_local_com,poste_user:cmk_poste_user  });


                });
                usersIn = users;

            }



        }else{
            show_msg_log(msg_no_responsbale_connect,'info')
            return false;
        }
    });

    cmk_id_generate_key = "";
}


var KeyGClose="";
var OnCloseFlag = false;
socket.on("close and assist",function(data_close) {



    if (cmk_num_login == data_close.destinataire){
        show_msg_log_node(data_close.message_to_ta,'info','')
        //return false;
    }
   
    //console.log(nAssistance,'nAssistancenAssistancenAssistancenAssistance assist')
    KeyGClose = data_close.id_generate_key;
    if(nAssitanceArr.length>0){
        $.each(nAssitanceArr,function(i,instanceAssist){
            if(typeof(instanceAssist)!=="undefined"){
                //console.log(instanceAssist,'instance assist')
                //console.log(instanceAssist.id,'instance id assist')
                //console.log(KeyGClose,'instance assist KeyGClose')
        
                if(instanceAssist.id==KeyGClose){
                    instanceAssist.close(KeyGClose);
                    nAssitanceArr.splice(i, 1);
                }
            }
           
    
        });
        //
       //nAssistance.close(KeyGClose);
       $('#'+KeyGClose).remove();
        return false;
    }
   
});

socket.on("refuse assist",function(data_close) {
    //alert('aaaaaaaaaaaaaa')
    if (cmk_num_login == data_close.destinataire){
        show_msg_log_node(data_close.message_to_ta,'error','');
//        return false;

    }

    //console.log(nAssistance,'nAssistancenAssistancenAssistancenAssistance refuse')
    KeyGClose = data_close.id_generate_key;
    if(nAssitanceArr.length>0){
        $.each(nAssitanceArr,function(i,instanceAssist){
            if(typeof(instanceAssist)!=="undefined"){
                //console.log(instanceAssist,'instance Refuse')
                //console.log(instanceAssist.id,'instance id Refuse')
                //console.log(KeyGClose,'instance Refuse KeyGClose')
        
                if(instanceAssist.id==KeyGClose){
                    instanceAssist.close(KeyGClose);
                    nAssitanceArr.splice(i, 1);
                }
            }
            
    
        });
        //
       //nAssistance.close(KeyGClose);
       $('#'+KeyGClose).remove();
       return false;
    }

   

});
socket.on("force close assistance",function(data_close) {
    if (cmk_num_login == data_close.destinataire){
        show_msg_log_node(data_close.message_to_ta,'error','');
//        return false;

    }
    if(cmk_num_login==data_close.from){
        KeyGClose = data_close.id_generate_key;
        if(nAssitanceArr.length>0){
            $.each(nAssitanceArr,function(i,instanceAssist){
                
                if(typeof(instanceAssist)!=="undefined"){
                  
                    //console.log(instanceAssist,'instance Refuse')
                    //console.log(instanceAssist.id,'instance id Refuse')
                    //console.log(KeyGClose,'instance Refuse KeyGClose')
            
                    if(instanceAssist.id==KeyGClose){
                        instanceAssist.close(KeyGClose);
                        nAssitanceArr.splice(i, 1);
                    }
                }
                
        
            });
            //
           //nAssistance.close(KeyGClose);
           $('#'+KeyGClose).remove();
           return false;
        }
    }
   

});
//setInterval(function(){ KeyGClose }, 3000);
var PushNotyIds = [];
nAssistance = false;
nAssitanceArr = [];
socket.on("get new assistance",function(data) {
    if(allow_notification==0)   return false;
    if (cmk_num_login != data.destinataire) return true;
   
    if(PushNotyIds.length>0 && PushNotyIds.indexOf(data.poste_user)!==-1){
       // alert('aaaaaaaaaa')
       //notification  bloquer si deja envoyÃ©
    } else {
        nAssistance = new Noty({
            type: 'info',
            layout: 'centerRight',
            theme: 'mint',
            text: data.message,
            progressBar: true,
            closeWith: ['button'],
            /* animation: {
                open: 'noty_effects_open',
                close: 'hidden',
            }, */
            id: data.poste_user,
            force: false,
            killer: false,
            queue: 'Queue_'+data.poste_user,
            container: false,
            closable : false,
            sounds: {
                sources: [],
                volume: 1,
                conditions: []
            },
            titleCount: {
                conditions: []
            },
            modal: false,
            callbacks: {
                onShow: function() {
                   
                    $('.noty_close_button').addClass('hidden');
                },
                //Ã  la fermeture de la notification on verfie s'il y une clÃ© generer si oui on envoie une socket pour feremer toute les notifications chez sup concernÃ© avec la mm clÃ©
    
                onClose: function() {
                    //alert(KeyGClose)
                    /* if(KeyGClose!='' && KeyGClose==data.poste_user){
                        socket.emit('forceclose assistance', {id_generate_key : KeyGClose,account : data.account});
                        OnCloseFlag = true;
                        KeyGClose = "";
                    } */
                    
                },
                afterClose: function() {
                    if(KeyGClose!=''){
    
                        KeyGClose = "";
                    }
                },
                onHover: function() {},
    
            },
            buttons: [
                Noty.button(lbl_prendre_encharge_btn, 'btn green btn-xs', function () {
                    var textmsg = (cmk_session_type=="superviseur") ? lbl_the_supervisor : '';
                    textmsg += cmk_name_user+txt_msg_prise_en_charge +data.name_user;
                    textmsgtota = lbl_the_supervisor+cmk_name_user+ txt_msg_vous_prend_en_charge;
                    socket.emit('request how assist', { message : textmsg ,message_to_ta : textmsgtota , from : cmk_num_login, destinataire : data.from,account : cmk_account,id_generate_key : data.poste_user,ip_user :cmk_ip_local_com,type_user : cmk_session_type });

                }, {id: 'button-assist-'+data.poste_user}),
    
                Noty.button(lbl_prendre_encharge_btn_refus, 'btn red btn-xs', function () {
                    var textmsg = (cmk_session_type=="superviseur") ? lbl_the_supervisor : '';
                    textmsg += cmk_name_user+ txt_msg_prise_en_charge_refus+data.name_user;
                    textmsgtota = lbl_the_supervisor+cmk_name_user+ txt_msg_vous_prend_en_charge_refus;
                    socket.emit('request how refuse assist', { message : textmsg ,message_to_ta : textmsgtota , from : cmk_num_login, destinataire : data.from,account : cmk_account,id_generate_key : data.poste_user,ip_user :cmk_ip_local_com,type_user : cmk_session_type });
    
                }, {id: 'button-refuse-'+data.poste_user}),

                Noty.button(lbl_prendre_encharge_btn_close_all, 'btn purple btn-xs', function () {
                    var textmsg = (cmk_session_type=="superviseur") ? lbl_the_supervisor : '';
                    textmsg += cmk_name_user+ txt_msg_prise_en_charge_refus+data.name_user;
                    textmsgtota = lbl_the_supervisor+cmk_name_user+ txt_msg_vous_prend_en_charge_refus;
                    if(PushNotyIds.length>0){
                        $.each(PushNotyIds,function(i,idNoty){
                            
                            socket.emit('forceclose assistance', { message : textmsg ,message_to_ta : textmsgtota , from : cmk_num_login, destinataire : data.from,account : cmk_account,id_generate_key :idNoty,ip_user :cmk_ip_local_com,type_user : cmk_session_type });

                            
                        });
                        //
                       //nAssistance.close(KeyGClose);
                       
                       return false;
                    }
                   //Noty.closeAll();
                }, {id: 'button-close-all-'+data.poste_user})
            ]
        }).show();
        //$('.noty_close_button').addClass('hidden');

        PushNotyIds.push(nAssistance.id);
        nAssitanceArr.push(nAssistance)
        return false;
    }
    


});


$(window).on("blur", function(e) {
    /* $.each(PushNotyIds,function(i,item){
        if(PushNotyIds.indexOf(item)!==-1){
            var indexNoty = PushNotyIds.indexOf(item);
            itemNotyKey = PushNotyIds[indexNoty];
            PushNotyIds.splice(indexNoty, 1);
            nAssistance.close(itemNotyKey);
            socket.emit('forceclose assistance', {id_generate_key : itemNotyKey,account : cmk_account});
        }
    }) */
})  



//Fin Assitance Superviseur
$(document).on('click','.action_plive',function(){
    var user_decon = $(this).data('user');
    if($(this).data('action')=='deconnect_plive'){
        socket.emit('send to deconnect user', {user_decon : user_decon , account : cmk_account });
    }

});
socket.on("deconnect user",function(data) {
    if (cmk_session_type == 'user' && data.account == cmk_account && cmk_num_user==data.user_decon) {
        force_to_deconnect_user = 1;
        if(!$('.cdashboard').hasClass('in_prod_mode')){
            force_to_deconnect_user = 0;
            window.location.href = '../login/Deconnect';

        }
    }
});

socket.on("debrief user",function(data) {
    if (cmk_session_type == 'user' && data.account == cmk_account && cmk_num_user==data.user_debrief) {



        if(!$('.hangup_call').hasClass('hidden')){
            return false;
        }


        if($('#production_tabs').css('display') == 'none')
        {

            if ($('#defaultCountdown').hasClass('is-countdown')) {
                $('.bloc_attente').hide();
                $('#defaultCountdown').countdown('destroy');
                $.backstretch("destroy");
                Fncdashboard('fromattente');

            }else{
                CheckDebrief();
            }
            $('.page-sidebar-menu').addClass('hidden')




        }
    }
})


socket.on("exit debrief user",function(data) {
    if (cmk_session_type == 'user' && data.account == cmk_account && cmk_num_user==data.user_debrief) {


        if($('#production_tabs').css('display') == 'none')
        {
            $('.page-sidebar-menu').removeClass('hidden')

            Fncdashboard('fromdebrief')
        }


    }
})

socket.on("process checkFicheRecept",function(data) {
    if (cmk_session_type == 'user' && data.account == cmk_account) {
        if (data.users) {
            if (data.users.indexOf(cmk_num_user) > -1) checkFicheRecept();
        } else {
            checkFicheRecept();
        }

    }
})

socket.on("process notification",function(data) {
    if (cmk_session_type == 'user' && data.account == cmk_account) {

        show_msg_notif(data.msg[global_lang], data.type,data.timeout,data.position);

    }
})

socket.on('user screen data',function(data) {
    var image = '<img src="'+data+'">';
    $('#userScreenCanvas').html(image);
})


socket.on("deconnect responsable",function(data) {
    if (cmk_session_type == 'superviseur' && data.account == cmk_account && cmk_num_user==data.responsable) {
        window.location.href = base_url_ajax+'login/Deconnect';
    }
});


socket.on("meetme update",function(data) {
    if (data.num_login == cmk_num_login) {
        fetchMeetMeInfo(data.roomNumber);
        if (data.member == cmk_poste_user) {
            if (data.event == "MeetmeJoin") onlinePoste({ poste : data.member , phone : data.roomNumber });
            else if (data.event == "MeetmeLeave") hangUpPoste();
        }
    }
})




socket.on('playcontact',function(data) {
    if ( (cmk_session_type == 'user') && (data.account == cmk_account) && (data.num_login == cmk_num_login) ) {



        switch(userCurrentState){
            case "DASHBOARD":
            case "MENU":

                ref_campagne = data.ref_campagne;
                ref_fichier = data.ref_fichier;
                num_contact = data.num_contact;
                name_fichier = data.name_fichier;
                setTimeout(function(){ SuccessPlay(); }, 2500);//SuccessPlay();

            break;

            case "PLAY":

                Fncdashboard('fromattente');

                ref_campagne = data.ref_campagne;
                ref_fichier = data.ref_fichier;
                num_contact = data.num_contact;
                name_fichier = data.name_fichier;
                setTimeout(function(){ SuccessPlay(); }, 2500);//SuccessPlay();
            break;
            case "SUCCESSPLAY":
                //alert(lbl_click_to_call_qualify_contact);
            break;
        }
    }

});

socket.on('webphone register',function(data) {
    if(data.account == cmk_account && data.user == cmk_num_user){
        sipRegister();
    }
});


socket.on('assignment changed',function(data) {
    if (data.account == cmk_account && cmk_session_type == "user" && data.user == cmk_num_user) {
        if (userCurrentState == "PLAY") {
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
            toastr.info(lbl_assignment_changed_notification);
            play();
        }
    }
});

socket.on('reload widgets',function(data) {
    if (data.account == cmk_account && cmk_session_type == "user" && data.user == cmk_num_user) {
        setCrmWidgetsValuesProd();
    }
});

socket.on('user atxfer progress',function(data) {
    if (data.account == cmk_account && cmk_session_type == "user" && data.user == cmk_num_user) {
        handleUserAtxferProgress(data.userdest,data.postedest,data.channel);
    }
});

socket.on('user notifications refresh',function(data) {
   if (data.account == cmk_account && data.num_login == cmk_num_login) {
       console.log("NEW NOTIFICATION" ,data);
       showNotificationPopup(data);
       getNotifications();
   }
});