var bbDialogMeetMe;
$(document).ready(function() {
    $(".meetme-action-btn").click(function() {
        var action = $(this).data("action");
        var roomNumber = $(this).data("meetme-id");
        var postData = {
            room : roomNumber,
            ref_campagne: ref_campagne,
            ref_fichier: ref_fichier,
            num_contact: num_contact
        }

        if (action == "inviteCallToMeetme") {
            var telToInvite = $(this).siblings("div").find('.meetme-invite-tel').val();
            if (telToInvite == "") {
                //TODO SHOW ERR MSG
                return;
            }
            postData['tel'] = telToInvite;
            postData['cmk_groupe_competence'] = cmk_groupe_comptence;
        }
        $.ajax({
            type : "POST",
            url : base_url_ajax+"agent/meetme/"+action,
            data : postData,
            dataType : "JSON",
            success : function(response) {
                fetchMeetMeInfo(roomNumber);
            }
        })
    })

    //
})

$(document).on("click",".meetme-member-action",function(e) {
   var member = $(this).data("member");
   var roomNumber = $(this).data("room");
   var action = $(this).data("action");
   $.ajax({
       type : "POST",
       url : base_url_ajax+"agent/meetme/meetmeMemberGenericAction",
       global : false,
       data : {
           room : roomNumber,
           member : member,
           action : action
       },
       success : function () {
           fetchMeetMeInfo(roomNumber);
       }
   })
});

$(document).on("click",".meetme-invite-btn",function() {
    openModalInvite($(this).data("meetme-id"));
});

function openModalInvite(roomNumber) {
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
            bbHtml += '<label>'+lbl_meetme_number_to_dial+': </label>';
            bbHtml += '<div class="input-group">';
            bbHtml += '<input list="PhoneList" type="text" id="cmk_meetme_number" class="form-control">';
            bbHtml += '<div class="input-group-btn">';
            bbHtml += '<button type="button" class="btn blue dropdown-toggle" id="originate_meetme_call" data-toggle="dropdown">';
            bbHtml += lbl_action+' <i class="fa fa-angle-down"></i>';
            bbHtml += '</button>';
            bbHtml += '<ul class="dropdown-menu pull-right">';
            bbHtml += '<li>';
            bbHtml += '<a href="javascript:;" class="originate_meetme_invite" data-action="call" data-meetme-id="'+roomNumber+'"> '+lbl_meetme_call_before_adding+' </a>';
            bbHtml += '</li>';
            bbHtml += '<li>';
            bbHtml += '<a href="javascript:;" class="originate_meetme_invite" data-action="add" data-meetme-id="'+roomNumber+'"> '+lbl_meetme_add_to_conference+' </a>';
            bbHtml += '</li>';
            bbHtml += '</ul>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '<div class="col-md-6">';
            bbHtml += '<div class="form-group">';
            bbHtml += '<label>'+lbl_meetme_caller_id+': </label>';
            bbHtml += '<select id="cmk_meetme_numsortant" class="form-control">';
            bbHtml += data_result;
            bbHtml += '</select>';
            bbHtml += '</div>';
            bbHtml += '</div>';
            bbHtml += '</div>';

            bbDialogMeetMe = bootbox.dialog({
                message: bbHtml,
                title: '<h4 class="box-heading">'+lbl_meetme_invite_member+'</h4>',
                //size: 'large',
                buttons: {
                    btnCancel : {
                        label: lbl_cancel,
                        className: "btn btn-default btn-outlined btn-square",
                        callback: function () {
                        }
                    },
                }
            });
        }
    });
}

$(document).on("click",".originate_meetme_invite",function() {
    var action = $(this).data("action");
    var roomNumber = $(this).data("meetme-id");
    var telToInvite = $("#cmk_meetme_number").val();
    var callerId = $("#cmk_meetme_numsortant").val();
    if (telToInvite == "") {
        //TODO SHOW ERR MSG
        return;
    }
    var postData = {
        room : roomNumber,
        ref_campagne: ref_campagne,
        ref_fichier: ref_fichier,
        num_contact: num_contact
    }

    postData['cmk_select_numsortant'] = callerId;
    postData['cmk_manualcall_number'] = telToInvite;
    postData['cmk_groupe_competence'] = cmk_groupe_comptence;
    switch(action) {
        case 'add' :
            $.ajax({
                type : "POST",
                url : base_url_ajax+"agent/meetme/inviteCallToMeetme",
                data : postData,
                success : function() {
                    fetchMeetMeInfo(roomNumber);
                    bbDialogMeetMe.modal("hide");
                }
            })
            break;
        case 'call' :
            $.ajax({
                type : "POST",
                url: "agent/CallMannuel",
                data: postData,
                success: function () {
                    bbDialogMeetMe.modal("hide");
                }
            });
            break;
    }
})

function fetchMeetMeInfo(roomNumber) {
    $.ajax({
        type : "POST",
        url : base_url_ajax+"agent/meetme/listMeetmeMembers",
        data : {
            room : roomNumber
        },
        dataType : "JSON",
        global : false,
        success : function(response) {
            var html = "";
            $.each(response,function(k,v) {
                html += "<tr>";
                html += "<td>"+v.CallerIDNum+"</td>";
                html += "<td>"+(v.Admin == "Yes" ? "<i class='fa fa-crown'></i>" : "")+"<i class='fa fa-fw "+(v.Muted != "No" ? "fa-microphone-slash font-red" : "fa-microphone font-green")+"'></i></td>";
                html += "<td>"+moment(v.time).fromNow(true)+"</td>";
                html += "<td>"+makeMemberActions(v.Conference,v.UserNumber)+"</td>";
                html += "</tr>";
            });
            $(".meetme-list-"+roomNumber).html(html);
            $(".meetme-list-"+roomNumber+" .meetme-member-action").tooltip();
        }
    })
}

function makeMemberActions(roomNumber,member) {
var actions  = '<i class="fa fa-fw fa-microphone icon-clickable meetme-member-action" data-action="m" data-room="'+roomNumber+'" data-member="'+member+'" title="'+lbl_meetme_member_unmute+'"></i> ';
    actions += '<i class="fa fa-fw fa-microphone-slash icon-clickable meetme-member-action" data-action="M" data-room="'+roomNumber+'" data-member="'+member+'" title="'+lbl_meetme_member_mute+'"></i> ';
    actions += '<i class="fa fa-fw fa-volume-down icon-clickable meetme-member-action" data-action="t" data-room="'+roomNumber+'" data-member="'+member+'" title="'+lbl_meetme_member_volume_down+'"></i> ';
    actions += '<i class="fa fa-fw fa-volume-up icon-clickable meetme-member-action" data-action="T" data-room="'+roomNumber+'" data-member="'+member+'" title="'+lbl_meetme_member_volume_up+'"></i> ';
    actions += '<i class="fa fa-fw fa-sign-out icon-clickable meetme-member-action" data-action="k" data-room="'+roomNumber+'" data-member="'+member+'" title="'+lbl_meetme_member_kick+'"></i> ';

    return actions;
}

/*$("#modal-meetme").on("show.bs.modal shown.bs.modal", function(e) {
    // Remove overlay and enable scrolling of body
    $("body").removeClass("modal-open").find(".modal-backdrop").remove();
});*/

/*var meetMeInterval;
$("#modal-meetme").on("shown.bs.modal",function() {
    meetMeInterval = setInterval(function() { fetchMeetMeInfo($("#modal-meetme .nav-tabs li.active a").data("meetme-number")) },3000);
})

$("#modal-meetme").on("hide.bs.modal",function() {
    clearInterval(meetMeInterval);
})*/
