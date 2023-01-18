// sent from pPHP : vcht_operatorID,vcht_operator,vcht_operatorAvatar
var vcht_checkTimer;
var vcht_lastRep = false;
var vcht_currentLogID = 0;
var vcht_currentDomElement = '';
var vcht_isChatting = false;

var consolePath = base_url_ajax +"assets/cmk/vendors/flat-visual-chat/console/";
var photoPath = base_url_ajax +"assets/sharedfiles/pic_user/";
				

jQuery(document).ready(function () {

	$("#vcht_onlineCB").attr("checked",false);
	
    if (jQuery('#chat').length > 0) {

        $.extend($.tablesorter.themes.bootstrap, {
            // these classes are added to the table. To see other table classes available,
            // look here: http://twitter.github.com/bootstrap/base-css.html#tables
            table: 'table table-bordered',
            caption: 'caption',
            header: 'bootstrap-header', // give the header a gradient background
            footerRow: '',
            footerCells: '',
            icons: '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
            sortNone: 'bootstrap-icon-unsorted',
            sortAsc: 'icon-chevron-up glyphicon glyphicon-chevron-up', // includes classes for Bootstrap v2 & v3
            sortDesc: 'icon-chevron-down glyphicon glyphicon-chevron-down', // includes classes for Bootstrap v2 & v3
            active: '', // applied when column is sorted
            hover: '', // use custom css here - bootstrap class may not override it
            filterRow: '', // filter row class
            even: '', // odd row zebra striping
            odd: ''  // even row zebra striping
        });

        jQuery('#vcht_operatorname').html(vcht_operator);
        jQuery('#vcht_consolePanelContent').hide();
        jQuery('#vcht_onlineCB').change(function () {
        	
            if (jQuery(this).is(':checked')) {
                vcht_operatorConnect();
            } else {
                vcht_operatorDisconnect();
            }
        });
    }
});
function updateIframe() {
	 $("#vcht_consoleFrame").attr("src", "http://192.168.1.201/comunikmail/solutions_crm.html");
}

function vcht_operatorConnect() {
	
    jQuery.ajax({
    	global : false,
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_operatorConnect',
            operatorID: vcht_operatorID,
            configId: $("#configId").val(),
            success: function () {
                vcht_recoverChats();
            }
        }
    });
}
function vcht_operatorDisconnect() {

    clearTimeout(vcht_checkTimer);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_operatorDisconnect',
            operatorID: vcht_operatorID,
            success: function () {
            }
        }
    });
}
function vcht_checkUsers() {
    if (jQuery('#usersList li[data-logid]').length == 0) {
        jQuery('#vcht_btnMinimize').fadeOut(200);
        if (jQuery('#usersList li').length == 1) {
            jQuery('#usersList').append('<li class="vcht_nobody">'+lbl_no_chat_currently+'</li>');
        }
        vcht_minifyChatPanel();
    } else {
        jQuery('#vcht_btnMinimize').fadeIn(200);
        jQuery('#vcht_btnMinimize').delay(250).css('display', 'block');
        jQuery('#usersList .vcht_nobody').remove();
    }
    if (jQuery('#usersList li[data-logid="' + vcht_currentLogID + '"]').length == 0) {
        vcht_currentLogID = 0;
        vcht_minifyChatPanel();
    }
}

function vcht_recoverChats() {
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_recoverChats',
            operatorID: vcht_operatorID
        },
        success: function (repS) {
            var rep = jQuery.parseJSON(repS);
            jQuery.each(rep, function () {
                var chat = this;
                if (chat.id) {

                    var $li = jQuery('<li class="chat" data-logid="' + chat.id + '" data-chatrequest="0" data-userid="' + chat.userID + '" data-username="' + chat.username + '"></li>');
                    $li.append('<a href="javascript:">' + chat.username + '<span class="navbar-unread">1</span></a>');
                    jQuery('#usersList').append($li);
                    $li.children('a').click(vcht_clickUserTab);
                    vcht_createChatPanel(chat);
                    jQuery.each(chat.messages, function () {
                        var msg = this;
                        if (msg.isOperator == 1) {
                            vcht_say(msg, chat.id, msg.avatarOperator);
                        } else {
                            if (chat.avatarImg) {
                                vcht_userSay(msg, chat.id, msg.url, chat.avatarImg);
                            } else {
                                vcht_userSay(msg, chat.id, msg.url);
                            }
                        }
                    });
                }
            });
            vcht_isChatting = true;
            vcht_checkOperatorChat();
            vcht_checkUsers();
        }
    });
}
function vcht_toggleChatPanel() {
    if (jQuery('#vcht_consolePanelContent').is('.opened')) {
        vcht_minifyChatPanel();
    } else {
        vcht_openChatPanel();
    }
}
function vcht_minifyChatPanel() {
    if (jQuery('#vcht_consolePanelContent').is('.opened')) {
        jQuery('#vcht_btnMinimize span').removeClass('glyphicon-chevron-down');
        jQuery('#vcht_btnMinimize span').addClass('glyphicon-chevron-up');
        jQuery('#vcht_consolePanelContent').removeClass('opened');
        jQuery('#vcht_consolePanelContent').hide('bind');
    }
}
function vcht_openChatPanel() {
    if (!jQuery('#vcht_consolePanelContent').is('.opened')) {

        jQuery('#vcht_consolePanelContent > div[data-logid]').each(function () {
            if (jQuery(this).css('display') != 'none') {
                vcht_currentLogID = parseInt(jQuery(this).data('logid'));
            }
        });
        jQuery('#vcht_btnMinimize span').removeClass('glyphicon-chevron-up');
        jQuery('#vcht_btnMinimize span').addClass('glyphicon-chevron-down');
        jQuery('#vcht_consolePanelContent').addClass('opened');
        jQuery('#vcht_consolePanelContent').show('bind');
    }
}

function vcht_getLogs(userID) {
    vcht_minifyChatPanel();
    vcht_currentLogID = 0;
    jQuery('#vcht_consoleFrame').prop('src', 'admin.php?page=vcht-logsList&userID=' + userID);
}

function vcht_exitChat(logID) {

	try 
	{
		jQuery('#vcht_consoleFrame').contents().find('.vcht_selectedDom').removeClass('vcht_selectedDom');
	} 
	catch (err) {
	    console.log('Some error occured :' + err);
	}
	
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_closeChat',
            logID: logID
        }, success: function () {
            jQuery('#usersList li[data-logid=' + logID + ']').fadeOut(250);
            jQuery('#usersList li[data-logid=' + logID + ']').delay(500).remove();
            jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').fadeOut(250);
            jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').delay(500).remove();
            vcht_currentLogID = 0;
            vcht_checkUsers();
        }
    });
}

function vcht_createChatPanel(chat) {
    var bgImg = '';
    if (chat.avatarImg && chat.avatarImg != "") {
        bgImg = 'style="background-image: none;"';
    } else {
        chat.avatarImg = '';
    }
    var logsBtn = '';
    if (chat.userID > 0) {
        logsBtn = '<p><a href="javascript:" onclick="vcht_getLogs(' + chat.userID + ');"  class="btn btn-primary"><span class="fui-search"></span>'+lbl_see_user_logs+'</a></p>';
    }

    var panel = jQuery('<div data-logid="' + chat.id + '" data-userid="' + chat.userid + '"></div>');
    panel.append('<div class="col-md-2 palette palette-wet-asphalt" id="vcht_userInfos">' +
    		//'<div class="vcht_avatarImg" style="background-image: url( '+consolePath +'include/files/' + vcht_operatorAvatar + ');"></div>' +
        '<div class="vcht_avatarImg" style="background-image: url( '+photoPath + vcht_operatorAvatar + ');"></div>' +
        '<p><strong class="vcht_username">' + chat.username + '</strong></p>' +
        logsBtn +
        '<p class="vcht_onlineOperatorsNb">'+lbl_online_operators+': <strong>1</strong></p>' +
        '</div>');
    jQuery('#vcht_consolePanelContent').append(panel);
    var historyCt = jQuery('<div class="vcht_chatContent"></div>');
    panel.append(historyCt);
    var history = jQuery('<div class="vcht_chatHistory"></div><div class="cobrowsing"></div>');
    historyCt.append(history);
    historyCt.append('<div class="vcht_chatInfos palette palette-primary"><p><span class="glyphicon glyphicon-time"></span><br/><strong class="vcht_timePast">00:00:00</strong></p>' +
        '<p><div class="dropdown">' +
        '<div class="btn-group select select-block open"><button class="btn dropdown-toggle clearfix btn-primary" data-toggle="dropdown"><span class="filter-option pull-left">'+lbl_transfer_chat+'</span>&nbsp;<span class="caret"></span></button><span class="dropdown-arrow dropdown-arrow-inverse"></span><ul data-logid="' + chat.id + '" class="vcht_transferSelect dropdown-menu dropdown-inverse" role="menu" style="max-height: 616px; overflow-y: auto; min-height: 108px;"></ul></div>' +
        '</div></p>' +
        '<p><a href="javascript:" onclick="vcht_exitChat(' + chat.id + ');" class="btn btn-danger"><span class="fui-cross"></span>'+lbl_stop_chat+'</a></p>' +
        '</div>');
    var panelRep = jQuery('<div class="vcht_chatWrite palette palette-clouds container-fluid"></div>');
    historyCt.append(panelRep);
    if (chat.operatorID == 0) {
        panel.find('.vcht_chatInfos').hide();
        panelRep.append('<p class="vcht_chatWrite_newChat"><a href="javascript:" onclick="vcht_acceptChat(' + chat.id + ');" class="btn btn-primary">'+lbl_accept_chat+'</a></p>');
    } else {
        panel.find('.vcht_chatInfos').fadeIn(200);
        vcht_initChatWrite(chat.id);
    }
}

function vcht_checkOperatorChat() {

    if (vcht_isChatting) {
        vcht_checkTimer = setTimeout(function () {
            var currentChats = '';
            jQuery('#usersList li[data-logid]').each(function () {
                var li = this;
                currentChats += jQuery(this).data('logid') + ',';
            });
            if (currentChats.length > 0) {
                currentChats = currentChats.substr(0, currentChats.length - 1);
            }
            jQuery.ajax({
            	global : false,
                url: base_url_ajax +'agent/chatagent/serverAjax',
                type: 'post',
                data: {
                    action: 'vcht_check_operator_chat',
                    operatorID: vcht_operatorID,
                    configId: $("#configId").val(),
                    currentChats: currentChats
                },
                success: function (repS) {
                    var rep = jQuery.parseJSON(repS);
                    vcht_lastRep = rep;
                    var requestsArray = new Array();
                    if (rep.chatRequests.length > 0) {
                        jQuery.each(rep.chatRequests, function () {
                            req = this;
                            requestsArray.push((req.id));
                            if (jQuery('#usersList li[data-logid=' + req.id + ']').length == 0) {
                                var $li = jQuery('<li class="palette palette-turquoise reqChat" data-logid="' + req.id + '" data-chatrequest="1" data-userid="' + req.userID + '" data-username="' + req.username + '"></li>');
                                $li.append('<a href="javascript:">' + req.username + '</a>');
                                jQuery('#usersList').append($li);
                                $li.children('a').click(vcht_clickUserTab);
                                if (jQuery('#vcht_audioMsg').data('enable') != 'false') {
                                    jQuery('#vcht_audioMsg').get(0).play();
                                }

                                if (req.id != vcht_currentLogID && jQuery('#usersList li[data-logid=' + req.id + '] a span').length == 0) {
                                    jQuery('#usersList li[data-logid=' + req.id + '] a').append('<span class="navbar-unread">1</span>');
                                }
                            }
                        });
                    }

                    // remove chats requests past
                    jQuery('#usersList li[data-logid][data-chatrequest="1"]').not('.vcht_accepted').each(function () {
                        var li = this;
                        var chk = false;
                        jQuery.each(rep.chatRequests, function () {
                            req = this;
                            if (parseInt(req.id) == parseInt(jQuery(li).data('logid'))) {
                                chk = true;
                            }
                        });
                        if (!chk) {
                            jQuery(this).remove();
                        }
                    });
                    jQuery.each(rep.chats, function () {
                        var chat = this;
                        var hours = Math.floor(chat.timePast / (60 * 60));
                        var divisor_for_minutes = chat.timePast % (60 * 60);
                        var minutes = Math.floor(divisor_for_minutes / 60);
                        var divisor_for_seconds = divisor_for_minutes % 60;
                        var seconds = Math.ceil(divisor_for_seconds);
                        jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + '] .vcht_timePast').html(hours.toString().replace(/^(\d)$/, '0$1') + ':' + minutes.toString().replace(/^(\d)$/, '0$1') + ':' + seconds.toString().replace(/^(\d)$/, '0$1'));
                        jQuery.each(chat.messages, function () {
                            var msg = this;
                            vcht_userSay(msg, chat.id, msg.url);
                            if (vcht_currentLogID == chat.id && msg.url != jQuery('#vcht_consoleFrame').prop('src')) {
                                jQuery('#vcht_consoleFrame').prop('src', msg.url);
                            }
                            if (chat.id != vcht_currentLogID) {
                                jQuery('#usersList li[data-logid=' + chat.id + '] a > span.navbar-unread').fadeIn(100);
                                if (jQuery('#vcht_audioMsg').data('enable') != 'false') {
                                    jQuery('#vcht_audioMsg').get(0).play();
                                }
                            }
                        });
                        
                        cmk_show_cobrowsing_link(chat.cobrowsing,chat.id);
                        
                    });
                    jQuery.each(rep.chatsClosed, function () {
                        var chatClosed = this;
                        if (jQuery('#usersList li[data-logid=' + chatClosed + ']').length > 0) {
                            if (jQuery('#usersList li[data-logid=' + chatClosed + ']').is('.palette-turquoise')) {
                                vcht_exitChat(chatClosed);
                            } else {
                                jQuery('#usersList li[data-logid=' + chatClosed + ']').addClass('palette palette-concrete');
                                jQuery('#vcht_consolePanelContent > div[data-logid=' + chatClosed + '] .vcht_chatHistory').append('<div class="userAction palette palette-clouds"><div class="avatarImg bubble_photo"></div>'+lbl_user_disconnect+' .</div>');
                                jQuery('#vcht_consolePanelContent > div[data-logid=' + chatClosed + '] .vcht_chatHistory .userAction:last-child').fadeIn(250);
                                jQuery('#vcht_consolePanelContent > div[data-logid=' + chatClosed + '] .vcht_chatWrite').fadeOut(200);
                            }
                        }
                    });
                    // transfers 
                    jQuery.each(rep.transfers, function () {
                        var chat = this;
                        vcht_createChatPanel(chat);
                        jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + '] .vcht_chatInfos').fadeIn(250);
                        jQuery.each(chat.messages, function () {
                            var msg = this;
                            if (msg.isOperator == '1') {
                                vcht_say(msg, chat.id);
                            } else {
                                vcht_userSay(msg, chat.id, msg.url);
                            }

                        });
                        jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + '] .vcht_chatHistory').append('<div class="userAction palette palette-clouds"><div class="avatarImg bubble_photo"></div> '+lbl_discussion_transferred_to_you+'</div>');
                        jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + '] .vcht_chatHistory .userAction:last-child').fadeIn(250);
                        var $li = jQuery('<li class="palette palette-turquoise reqChat" data-logid="' + chat.id + '" data-chatrequest="0" data-userid="' + chat.userID + '" data-username="' + chat.username + '"></li>');
                        $li.append('<a href="javascript:">' + chat.username + '</a>');
                        jQuery('#usersList').append($li);
                        $li.children('a').click(vcht_clickUserTab);
                        jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + ']').find('.vcht_chatContent').scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + chat.id + ']').find('.vcht_chatContent')[0].scrollHeight);

                        if (jQuery('#vcht_audioMsg').data('enable') != 'false') {
                            jQuery('#vcht_audioMsg').get(0).play();
                        }
                    });
                    // operators
                    if (rep.operators.length > 1) {
                        jQuery('ul.vcht_transferSelect').html('<li rel="0" class=""><a tabindex="-1" href="#" class="active"><span class="pull-left">'+lbl_choose_operator+'</span></a></li>');
                    } else {
                        jQuery('ul.vcht_transferSelect').html('<li rel="0" class=""><a tabindex="-1" href="#" class="active"><span class="pull-left">'+lbl_no_operator+' </<span></a></li>');
                    }
                    jQuery.each(rep.operators, function (i) {
                        var operator = this;
                        if (operator.num_login != vcht_operatorID) {
                            var $li = jQuery('<li data-userid="' + operator.num_login + '" rel="' + (i + 1) + '" class=""><a tabindex="-1" href="#" class="active"><span class="pull-left">' + operator.nom + '</span></a></li>');
                            jQuery('ul.vcht_transferSelect').append($li);
                            jQuery('ul.vcht_transferSelect > li[data-userid != 0]').click(function () {
                                var attr = $(this).attr('data-userid');
                                if (typeof attr !== typeof undefined && attr !== false) {
                                    var logID = jQuery(this).parent('ul').data('logid');
                                    var operatorID = jQuery(this).data('userid');
                                    jQuery.ajax({
                                        url: base_url_ajax +'agent/chatagent/serverAjax',
                                        type: 'post',
                                        data: {
                                            action: 'vcht_transferChat',
                                            logID: logID,
                                            operatorID: operatorID
                                        },
                                        success: function () {
                                            jQuery('#usersList li[data-logid=' + logID + ']').fadeOut(250);
                                            jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').fadeOut(250);
                                            setTimeout(function () {
                                                jQuery('#usersList li[data-logid=' + logID + ']').remove();
                                                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').remove();
                                            }, 500);
                                        }
                                    });
                                }
                            });
                        }
                    });
                    jQuery('.vcht_onlineOperatorsNb strong').html(rep.operators.length);
                    vcht_checkUsers();
                    vcht_checkOperatorChat();
                }
            });
        }, 1000);
    }
}

function vcht_getChat(userID, username, isRequest) {
    var rep = false;
    if (vcht_lastRep) {
        if (isRequest) {
            jQuery.each(vcht_lastRep.chatRequests, function () {
                var req = this;
                if (userID > 0 && req.userID == userID) {
                    rep = req;
                } else if (userID == 0 && req.username == username) {
                    rep = req;
                }

            });
        } else {
            jQuery.each(vcht_lastRep.chats, function () {
                var req = this;
                if (userID > 0 && req.userID == userID) {
                    rep = req;
                } else if (userID == 0 && req.username == username) {
                    rep = req;
                }
            });
        }
    }
    return rep;
}

function vcht_clickUserTab() {
    jQuery('.vcht_admin_panel').fadeOut(100);
    jQuery(this).find('span.navbar-unread').fadeOut(100);
    if (jQuery(this).is('palette-turquoise') && jQuery(this).data('chatrequest') == '0') {
        jQuery(this).removeClass('palette-turquoise');
    }
    vcht_loadChatPanel(jQuery(this).parent().data('logid'));
    vcht_currentLogID = jQuery(this).parent().data('logid');
    vcht_openChatPanel();
}

function vcht_isIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function vcht_declineChat(logID) {
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').hide();
    jQuery('#usersList li[data-logid=' + logID + ']').hide();
}

function vcht_acceptChat(logID) {
    jQuery('#usersList li[data-logid=' + logID + ']').addClass('vcht_accepted');
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').fadeOut(250);
    jQuery('#vcht_loader').delay(300).fadeIn(100);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_acceptChat',
            logID: logID,
            operatorID: vcht_operatorID
        },
        success: function (rep) {
            if (rep == '1') {
                jQuery('#usersList li[data-logid=' + logID + ']').removeClass('palette');
                jQuery('#usersList li[data-logid=' + logID + ']').removeClass('palette-turquoise').data('chatrequest', '0');
                vcht_initChatWrite(logID);
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatHistory').html('');
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').delay(1500).fadeIn(250);
                jQuery('#vcht_loader').delay(1400).fadeOut(100);
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').delay(300).find('.vcht_chatInfos').fadeIn(200);
            }
        }
    });
}

function vcht_initChatWrite(logID) {
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatWrite').html('<div class="col-md-7"><div class="form-group"><textarea  data-logid="' + logID + '" data-url="" data-domelement="" class="form-control" rows="3" placeholder="'+lbl_write_message_here+'"></textarea></div></div>');
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatWrite').append('<div class="col-md-3"><p>Element selected : <strong class="vcht_hasElementSelected">No</strong></p><p><a href="javascript:" class="btn btn-primary" onclick="vcht_startSelectDomElement();"><span class="fui-eye"></span>'+lbl_select_element+'</a></p></div>');
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatWrite').append('<div class="col-md-2"><a href="javascript:" onclick="vcht_sendMessage(' + logID + ')" class="btn btn-lg btn-primary btn-block vcht_sendBtn"><i class="fa fa-reply"></i></a></div>');
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatWrite textarea').keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            vcht_sendMessage(jQuery(this).data('logid'));
        }
    });
}

function vcht_startSelectDomElement() {
    vcht_minifyChatPanel();
    jQuery('#vcht_consolePanel').delay(500).fadeOut(250);
    jQuery('#vcht_infosPanel > .container > .col-md-12').html('<p>'+lbl_navigate_topage_click_select_button+'.</p>');
    jQuery('#vcht_infosPanel > .container > .col-md-12').append('<p><a href="javascript:" class="btn btn-primary" onclick="vcht_targetDomElement();">'+lbl_select_element+'</a><a href="javascript:" class="btn btn-warning" onclick="vcht_stopSelectDomElement();">'+lbl_cancel+'</a></p>');
    jQuery('#vcht_infosPanel').delay(850).fadeIn(250);
}
function vcht_targetDomElement() {
    jQuery('#vcht_infosPanel > .container > .col-md-12').html('<p>'+lbl_click_desired_item+'</p>');
    console.log(jQuery('#vcht_consoleFrame').get(0));
    console.log(jQuery('#vcht_consoleFrame').get(0).contentWindow);
    try{
    	jQuery('#vcht_consoleFrame').get(0).contentWindow.vcht_startSelection();
    } catch (err) {
	    alert('Some error occured while selection:' + err);
	    jQuery('.vcht_selectedDom').removeClass('vcht_selectedDom');
        jQuery(this).addClass('vcht_selectedDom');
        //window.parent.vcht_selectDomElement(this);
        vcht_selectionMode = false;
        vcht_stopSelectDomElement();
	}
}
function vcht_stopSelectDomElement() {
    jQuery('#vcht_infosPanel').fadeOut(250);
    jQuery('#vcht_consolePanel').delay(300).fadeIn(250);
    setTimeout(function () {
        vcht_openChatPanel();
    }, 600);
}
function vcht_selectDomElement(el) {
    vcht_currentDomElement = el;
    jQuery('#vcht_infosPanel > .container > .col-md-12').html('<p>'+lbl_show_item_user+'</p>');
    jQuery('#vcht_infosPanel > .container > .col-md-12').append('<p><a href="javascript:" class="btn btn-primary" onclick="vcht_confirmDomElement();">'+lbl_yes+'</a><a href="javascript:" class="btn btn-warning" onclick="vcht_targetDomElement();">'+lbl_no+'</a></p>');
}

function vcht_confirmDomElement(el) {
    var path = vcht_getPath(vcht_currentDomElement);
    jQuery('#vcht_consolePanelContent > div[data-logid=' + vcht_currentLogID + '] .vcht_chatWrite .vcht_hasElementSelected').html('Yes');
    jQuery('#vcht_consolePanelContent > div[data-logid=' + vcht_currentLogID + '] .vcht_chatWrite textarea').data('domelement', path);
    jQuery('#vcht_consolePanelContent > div[data-logid=' + vcht_currentLogID + '] .vcht_chatWrite textarea').data('url', jQuery('#vcht_consoleFrame').get(0).contentWindow.document.location.href);
    vcht_stopSelectDomElement();
}
function vcht_getPath(el) {
    var path = '';
    if (jQuery(el).length > 0 && typeof (jQuery(el).prop('tagName')) != "undefined") {
        if (!jQuery(el).attr('id') || jQuery(el).attr('id').indexOf('yui') > -1) {
            path = '>' + jQuery(el).prop('tagName') + ':nth-child(' + (jQuery(el).index() + 1) + ')' + path;
            path = vcht_getPath(jQuery(el).parent()) + path;
        } else {
            path += '#' + jQuery(el).attr('id');
        }
    }
    return path;
}
function vcht_sendMessage(logID) {
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').parent().removeClass('has-error');
    var msg = jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').val();
    if (msg == "") {
        jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').parent().addClass('has-error');
    } else {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (h > 12) {
            h = h - 12;
        }
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        var date = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
        msg = msg.replace(/\n/g, '<br/>');
        jQuery.ajax({
            url: base_url_ajax +'agent/chatagent/serverAjax',
            type: 'post',
            data: {
                action: 'vcht_operatorSay',
                logID: logID,
                operatorID: vcht_operatorID,
                msg: msg,
                operatorname: vcht_operator,
                domElement: jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').data('domelement'),
                url: jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').data('url')
            },
            success: function (repS) {
                vcht_say({content: msg, date: repS}, logID);
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatWrite .vcht_hasElementSelected').html('No');
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').val('');
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').data('domelement', '');
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatWrite textarea').data('url', '');
            }
        });
    }
}

function vcht_userSay(msg, logID, url, avatarImg) {
    var bubble = jQuery('<div class="bubble_left palette palette-clouds" data-url="' + url + '"></div>');
    bubble.append('<div class="bubble_arrow"></div>');
    bubble.append(msg.content);
    var username = jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_username').html();
    var hour = msg.date.substr(msg.date.indexOf(' ') + 1);
    bubble.append('<div class="bubble_meta">' + hour + ' - ' + username + '</div>');

    bubble.append('<div class="avatarImg bubble_photo"></div>');

    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatHistory').append(bubble);
    bubble.fadeIn(250);
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent').scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent')[0].scrollHeight);
}

function cmk_show_cobrowsing_link(link,logID) {
	
	
	if (link!="") {
		console.log(chat.cobrowsing);
		var bubble = jQuery('<div class="bubble_right palette palette-turquoise"></div>');
		
		bubble.append('<div class="bubble_arrow"></div>');
		//bubble.append('<a class="btn green" href="'+link+'">Accept Cobrowsing Request</a>');
		bubble.append('<div><a class="btn green" href="'+link+'" target="_blank">'+lbl_accept_cobrowsing_request+'</a></div>');
		//bubble.append('<div class="avatarImg bubble_photo" ></div>'); 
		//bubble.append('<div class="bubble_meta">' + "10h" + ' - ' + "cmoi" + '</div>');
		
		
		//jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatHistory').append(bubble);
		jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.cobrowsing').html(bubble);
		//bubble.fadeIn(250);
	    bubble.show();
	    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent').scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.cobrowsing')[0].scrollHeight);
    	
	} else {
		jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.cobrowsing').html("");
	}
	
	
}


function vcht_say(msg, logID, avatarOperator) {

    var bubble = jQuery('<div class="bubble_right palette palette-turquoise"></div>');
    bubble.append(msg.content);
    var username = jQuery('#vcht_operatorname').html();
    if (msg.username && msg.username != "") {
        username = msg.username;
    }
    var hour = msg.date.substr(msg.date.indexOf(' ') + 1);
    bubble.append('<div class="bubble_meta">' + hour + ' - ' + username + '</div>');
    bubble.append('<div class="bubble_arrow"></div>');
    if (avatarOperator) {
    	//bubble.append('<div class="avatarImg bubble_photo" style="background-image: url('+consolePath +'include/files/' + avatarOperator + ');"></div>');
    	bubble.append('<div class="avatarImg bubble_photo" style="background-image: url('+ photoPath + avatarOperator + ');"></div>');
        //bubble.append('<div class="avatarImg bubble_photo" style="background-image: url('+ photoPath + vcht_operatorAvatar + ');"></div>');
    } else {
    	//bubble.append('<div class="avatarImg bubble_photo" style="background-image: url('+consolePath +'include/files/' + vcht_operatorAvatar + ');"></div>');
        bubble.append('<div class="avatarImg bubble_photo" style="background-image: url('+photoPath + vcht_operatorAvatar + ');"></div>');
    }
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatHistory').append(bubble);
    bubble.fadeIn(250);
    jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent').scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent')[0].scrollHeight);
}

function vcht_loadChatPanel(logID) {

    if (jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').length > 0) {
        jQuery('#vcht_consolePanelContent > div').fadeOut(250);
        jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').delay(300).fadeIn(250);
        setTimeout(function () {
            jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent').scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent')[0].scrollHeight);
        }, 800);
        var userUrl = '';
        userUrl = jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + '] .vcht_chatHistory .bubble_left:last-child').data('url');
        jQuery('#vcht_consoleFrame').prop('src', userUrl);
    } else {
        jQuery('#vcht_loader').fadeIn(100);
        jQuery.ajax({
            url: base_url_ajax +'agent/chatagent/serverAjax',
            type: 'post',
            data: {
                action: 'vcht_getLogChat',
                logID: logID
            }, success: function (repS) {
                var rep = jQuery.parseJSON(repS);
                jQuery('#vcht_consolePanelContent > div').fadeOut(500);
                vcht_createChatPanel(rep);
                var userURL = '';
                jQuery.each(rep.messages, function () {
                    var msg = this;
                    if (msg.isOperator == 1) {
                        var bubble = jQuery('<div class="bubble_right palette palette-turquoise"></div>');
                        bubble.append(msg.content);
                        bubble.append('<div class="bubble_arrow"></div>');
                    } else {
                        var bubble = jQuery('<div class="bubble_left palette palette-clouds" data-url="' + msg.url + '"></div>');
                        bubble.append('<div class="bubble_arrow"></div>');
                        bubble.append(msg.content);
                        userURL = msg.url;
                    }
                    bubble.append('<div class="avatarImg bubble_photo"></div>');
                    var panel = jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']');
                    panel.find('.vcht_chatHistory').append(bubble);
                    bubble.fadeIn(250);
                    panel.find('.vcht_chatContent').delay(500).scrollTop(panel.find('.vcht_chatContent')[0].scrollHeight);
                });
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').delay(1000).fadeIn(500);
                jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent').delay(1500).scrollTop(jQuery('#vcht_consolePanelContent > div[data-logid=' + logID + ']').find('.vcht_chatContent')[0].scrollHeight);
                jQuery('#vcht_consoleFrame').prop('src', userURL);
                jQuery('#vcht_loader').fadeOut(100);
            }
        });
    }
}

// Home
function vcht_homeOpen() {
    jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeIn(250);

}

// settings
function vcht_settingsOpen() {
    jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeOut(250);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_settings_view'
        },
        success: function (rep) {
            jQuery('#vcht_admin_settings').html(rep);
            jQuery('#vcht_admin_settings').fadeIn(250);
            jQuery('.colorpick').each(function () {
                var $this = jQuery(this);
                jQuery(this).colpick({
                    color: $this.val().substr(1, 7),
                    onChange: function (hsb, hex, rgb, el, bySetColor) {
                        jQuery(el).val('#' + hex);
                    }
                });
            });
        }
    });
}
function vcht_settingsSave(panel) {

    var formData = new FormData(jQuery('#form_settings')[0]);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            return myXhr;
        },
        success: function (rep) {
            if (rep == 'updated') {
                document.location.href = document.location.href;
            }
            if (rep == 'no') {
                jQuery("#set_purchaseCode").parent().addClass('has-error');
            }
            jQuery("#vcht_admin_settings .vcht_response").html('<div class="alert alert-success" role="alert"><p>'+lbl_settings_saved+'</p></div>');
            jQuery("#vcht_admin_settings .vcht_response").fadeIn(250);
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    });
}

// logs
function vcht_logsOpen(filter) {
    jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeOut(250);
    jQuery.ajax({
    	url: base_url_ajax +'agent/chatagent/serverAjax',
        //url: '../assets/cmk/vendors/flat-visual-chat/console/include/serverAjax.php',
        type: 'post',
        data: {
            action: 'vcht_logs_view',
            filter: filter
        },
        success: function (rep) {
            jQuery('#vcht_admin_logs').html(rep);
            jQuery(".tablesorter_lc").tablesorter({
                theme: "bootstrap",
                widthFixed: true,
                headerTemplate: '{content} {icon}',
                sortList: [
                    [0, 1],
                    [1, 1]
                ],
                widgets: ["uitheme", "filter", "zebra"],
                widgetOptions: {
                    zebra: ["even", "odd"],
                    filter_reset: ".reset"

                },
                initialized: function (table) {
                    jQuery('.tablesorter-filter').addClass('form-control').prop('placeholder', 'Filter');
                }
            })/*.tablesorterPager({
             container: jQuery(".ts-pager"),
             cssGoto: ".pagenum",
             removeRows: false,
             output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'

             })*/;
            jQuery('#vcht_admin_logs').fadeIn(250);
        }
    });
}
function vcht_logRemove(logID) {

    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_log_remove',
            logID: logID
        },
        success: function (rep) {
            jQuery("#vcht_admin_logs .vcht_response").html('<div class="alert alert-success" role="alert"><p>'+lbl_log_deleted+'</strong></p></div>');
            jQuery("#vcht_admin_logs .vcht_response").fadeIn(250);
            vcht_logsOpen();
        }
    });
}
function vcht_logOpen(logID) {
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_log_view',
            logID: logID
        },
        success: function (rep) {
            jQuery('#vcht_admin_logs').html(rep);
            jQuery('#vcht_admin_logs').fadeIn(250);
        }
    });
}
// operators
function vcht_showMain() {
	jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeOut(250);
    jQuery('#vcht_admin_settings').html(rep);
    jQuery('#vcht_admin_settings').fadeIn(250);
}

function vcht_operatorsOpen() {
    jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeOut(250);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_operators_view'
        },
        success: function (rep) {
            jQuery('#vcht_admin_operators').html(rep);
            jQuery('#vcht_admin_operators').fadeIn(250);
        }
    });
}

/*function vcht_operatorsOpen() {
    jQuery('.vcht_admin_panel').fadeOut(500);
    jQuery('#vcht_consoleFrame').fadeOut(250);
    jQuery.ajax({
        url: base_url_ajax +'listusers/listusers/livechatusers',
        type: 'post',
        data: "",
        success: function (rep) {
            jQuery('#vcht_admin_operators').html(rep);
            jQuery('#vcht_admin_operators').fadeIn(250);
        }
    });
}*/

function vcht_operatorRemove(operatorID) {
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_operator_remove',
            operatorID: operatorID
        },
        success: function (rep) {
            jQuery("#vcht_admin_logs .vcht_response").html('<div class="alert alert-success" role="alert"><p>Operator <strong>deleted</strong></p></div>');
            jQuery("#vcht_admin_logs .vcht_response").fadeIn(250);
            vcht_operatorsOpen();
        }
    });
}
function vcht_operatorOpen(operatorID) {
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        data: {
            action: 'vcht_operator_view',
            operatorID: operatorID
        },
        success: function (rep) {
            jQuery('#vcht_admin_operators').html(rep);
            jQuery('#vcht_admin_operators').fadeIn(250);

        }
    });
}
function vcht_operatorSave(operatorID) {
    var operatorID_s = 0;
    if (operatorID) {
        operatorID_s = operatorID;
    }
    var formData = new FormData(jQuery('#form_operator')[0]);
    jQuery.ajax({
        url: base_url_ajax +'agent/chatagent/serverAjax',
        type: 'post',
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            return myXhr;
        },
        success: function (rep) {
            jQuery("#vcht_admin_operators .vcht_response").html('<div class="alert alert-success" role="alert"><p>Operator <strong>saved</strong></p></div>');
            jQuery("#vcht_admin_operators .vcht_response").fadeIn(250);
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    });
}