var notifsShown = [];
var notifsArr = [];

function notifyUser(message,id,itemid,itemtype,inboundid,user_type,title,icon) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {

    }
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options  = {
            body : message,
            icon : base_url_ajax+'assets/cmk/images/'+icon,
            data : {
                idnotif : id,
                itemid : itemid,
                itemtype : itemtype,
                inboundid : inboundid,
                usertype : user_type
            }
        };
        var notification = new Notification(title,options);
        notifsArr.push(notification);
        //notification.onclose = function(e) {
        //   cancelNotif(e.target.data.idnotif);
        //};
        notification.onclick = function(e) {
            cancelNotif(e.target.data.idnotif);
            notification.close();
            shownotifItem(e.target.data.itemid,e.target.data.itemtype,e.target.data.inboundid,e.target.data.usertype)
        };
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var options  = {
                    body : message,
                    icon : base_url_ajax+'assets/images/'+icon,
                    data : {
                        idnotif : id,
                        itemid : itemid,
                        itemtype : itemtype,
                        inboundid : inboundid,
                        usertype : user_type
                    }
                };
                var notification = new Notification(title,options);
                notifsArr.push(notification);
                //notification.onclose = function(e) {
                //    cancelNotif(e.target.data.idnotif);
                //};
                notification.onclick = function(e) {
                    cancelNotif(e.target.data.idnotif);
                    notification.close();
                    shownotifItem(e.target.data.itemid,e.target.data.itemtype,e.target.data.inboundid,e.target.data.usertype);
                };
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

Notification.requestPermission().then(function(result) {
});

$(window).bind("beforeunload", function() {
    $.each(notifsArr,function(k,v) {
        v.close();
    });
});
function cancelNotif(id) {
    $.ajax({
        global : false,
        type : 'POST',
        dataType : 'json',
        url : base_url_ajax+'agent/inbox/cancelNotif',
        data : { id : id },
        success : function(response) {

        }
    })
}

function shownotifItem(id,type,inbound,source) {
    $.ajax({
        global : false,
        type: 'POST',
        dataType: 'json',
        url: base_url_ajax + 'agent/inbox/getnotifitem',
        data: {id: id, type: type , inbound : inbound , source : source },
        success: function (response) {
            if (type == '1') {

                $("#mail_dispatch").data('id', id);
                $("#mail_dispatch").data('inbound', inbound);
                $("#mail_trash").data('id', id);
                $("#mail_trash").data('inbound', inbound);
                $("#mail_date").text(response.mail.DATE_RECEIVED);
                $("#mail_from_mail").text(response.mail.FROM_NAME);
                $("#mail_to").text('<' + response.mail.TO + '>' + ' ' + response.mail.CC);
                $("#mail_subject").text(lbl_mail_object + ' : ' + response.mail.SUBJECT);
                $("#mail_body").html(response.mail.BODY);

                $("#mail_dest_addr_reply").val(response.FROM_MAIL);
                $("#mail_subject_reply").val("RE : "+response.SUBJECT);
                $("#mail_body_reply").val('');
                $("#mail_reply_div").hide();

                if (source == '1') {
                    $("#mail_reply").hide();
                    $("#mail_save").hide();
                    $("#mail_dispatch").show();
                    $("#mail_trash").show();
                } else {
                    $("#mail_reply").show();
                    $("#mail_save").show();
                    $("#mail_dispatch").hide();
                    $("#mail_trash").hide();
                }

                var html = '';
                $.each(response.attach, function (k, v) {
                    html += '<div class="margin-bottom-25">';
                    html += '<div>';
                    html += '<strong>' + v.URL + '</strong>';
                    html += '</div>';
                    html += '</div>';
                });

                $("#mail_attach").html(html);
                if (source == '1') $("#mail_dispatch").show();
                else $("#mail_dispatch").hide();

                $("#modal-view").modal("show");
            } else if (type == '3') {
                $("#sms_dispatch").data('id', id);
                $("#sms_dispatch").data('inbound', inbound);
                $("#sms_trash").data('id', id);
                $("#sms_trash").data('inbound', inbound);
                $("#sms_date").text(response.date_received);
                $("#sms_from").text(response.from);
                $("#sms_body").html(response.message);
                if (source == '1') {
                    $("#sms_reply").hide();
                    $("#sms_save").hide();
                    $("#sms_dispatch").show();
                    $("#sms_trash").show();
                } else {
                    $("#sms_reply").show();
                    $("#sms_save").show();
                    $("#sms_dispatch").hide();
                    $("#sms_trash").hide();
                }

                $("#modal-view-sms").modal("show");
            }
        }
    })
}

function checkNotifs() {
    $.ajax({
        global : false,
        type : 'POST',
        url : base_url_ajax+'agent/inbox/checkNotifs',
        data : {'campagnes' : $("#list_campagne").val().split(',') },
        success : function(response) {
            response = $.parseJSON(response);
            if (response.dispatch.length > 0)  {
                $.each(response.dispatch,function(k,v) {
                    if (notifsShown.indexOf(v.id) === -1) {
                        var icon;
                        if (v.type == '1') {
                            icon = 'envelope.png';
                        } else if (v.type == '2') {
                            icon = 'fax.png';
                        } else if (v.type == '3') {
                            icon = 'sms.png';
                        }
                        notifyUser(v.message, v.id, v.extra_id, v.type , v.inboundid , v.user_type , 'Nouvel Ã©lÃ©ment non dispatchÃ©',icon);
                        notifsShown.push(v.id);
                    }
                });
            }
            //if (response.inbox.length > 0)  {
            //    $.each(response.inbox,function(k,v) {
            //        if (notifsShown.indexOf(v.id) === -1) {
            //            var icon;
            //            if (v.level == '3') {
            //                icon = 'exclam_high.png';
            //            } else if (v.level == '2') {
            //                icon = 'exclam_normal.png';
            //            } else if (v.level == '1') {
            //                icon = 'exclam_low.png';
            //            }
            //            notifyUser(v.message, v.id, v.extra_id, v.type , v.inboundid , v.user_type , 'BoÃ®te de rÃ©ception',icon);
            //            notifsShown.push(v.id);
            //        }
            //    });
            //}
        }
    })

}
$(function() {
    //var timerNotifs=setInterval("checkNotifs()", 5000);

    $("#mail_dispatch").click(function() {
        var id = $(this).data('id');
        var campJob = $(this).data('campagne');
        $("#item_type").val('MAIL_INBOUND');
        $("#item_id").val(id);
        $("#binddossier_id").val('');
        $("#findjob").typeahead('val','');
        $("#labelJob").parent().hide();
        $("#create_job").attr("checked",false).trigger("change");
        $("#create_contact_job").attr("checked",false).trigger("change");
        $.uniform.update();
        $("#bind_campagne").val($(this).data("campagne"));
        $("#findctjob").typeahead('val','');
        $("#bindcampnum").val('');
        $("#bindgroupnum").val('');
        $("#bindctnum").val('');
        $.ajax({
            type : 'POST',
            url : base_url_ajax+'agent/jobs/findGroupsJob',
            data : { 'campagne' : campJob},
            dataType : 'json',
            success : function(response) {
                var htmlGrpJob = '';
                $.each(response,function(k,v) {
                    htmlGrpJob += '<option value="'+ v.num_groupe +'">'+v.nom+'</option>';
                });
                $("#ctgroupjob").html(htmlGrpJob);
            }
        })
        $("#modal-assign").modal("show");
    });
});