function getNotifications() {
    $.ajax({
        type : 'GET',
        global : false,
        url : base_url_ajax+'agent/agent/getUnreadNotifications',
        dataType : 'JSON',
        success : function(response) {
            $('.cmk-notifications-list').empty();
            $.each(response,function(k,v) {
                var notificationHTML = '<li data-num_contact="'+v.num_contact+'" data-ref_fichier="'+v.ref_fichier+'" data-ref_campagne="'+v.campagne+'" data-name_fichier="'+v.groupName+'" data-type-prod="notifications" class="cmk-notification '+(v.num_contact != 0 ? 'cmk-notification-with-contact call_contact' : '')+'">';
                    notificationHTML += '<div class="col1">';
                    notificationHTML += '<div class="cont">';
                    notificationHTML += '<div class="cont-col1">';
                    notificationHTML += '<div class="label label-sm label-info">';
                    notificationHTML += '<i class="icon-bubble"></i>';
                    notificationHTML += '</div>';
                    notificationHTML += '</div>';
                    notificationHTML += '<div class="cont-col2">';
                    notificationHTML += '<div class="desc">';
                    notificationHTML += (translateNotifications[v.title] ? translateNotifications[v.title] : v.title)+' ';
                    notificationHTML += v.content;
                    notificationHTML += '</div>';
                    notificationHTML += '</div>';
                    notificationHTML += '</div>';
                    notificationHTML += '</div>';
                    notificationHTML += '<div class="col2">';
                    notificationHTML += '<div class="date">'+moment(v.date).format('DD/MM/YYYY HH:mm')+'</div>';
                    notificationHTML += '</div>';
                    notificationHTML += '</li>';
                    $('.cmk-notifications-list').append(notificationHTML);
            });

            var cmknotifcounter = response.length;
            if (cmknotifcounter > 0) $('.cmk-notifications-badge').removeClass("hidden").text(cmknotifcounter);
            else $('.cmk-notifications-badge').addClass("hidden").text('');

            window.localStorage.setItem("cmknotifcounter",cmknotifcounter);
            var cmkchatcounter = parseInt(window.localStorage.getItem("cmkchatcounter") ||Â 0);
            if (cmkchatcounter + cmknotifcounter > 0) {
                $("body").removeClass($.cookie('animations'));
                $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><span class="badge badge-danger animated infinite bounce chat-badge">'+(cmkchatcounter +cmknotifcounter)+'</span>');
                $.cookie('animations', 'bounce');
            } else {
                $("body").removeClass($.cookie('animations'));
                $('.quick-sidebar-toggler').html('<span class="sr-only">Toggle Quick Sidebar</span><i class="icon-logout"></i>');
            }
        }
    })
}

function showNotificationPopup(notification) {
    var notificationContent = (notification.icon ? '<i class="'+notification.icon+'"></i> ' : '')+'<strong>'+(translateNotifications[notification.title] ? translateNotifications[notification.title] : notification.title)+'</strong><br>'+notification.content;
    var notyOptions = {
        type: 'information',
        layout: 'bottomRight',
        theme: 'mint',
        text: notificationContent,
        progressBar: true,
        closeWith: ['click'],
        timeout : 3000,
        closable : true,
        buttons: [
        ]
    };
    var newNoty;

    if (notification.num_contact != "0") {
        notyOptions.buttons.push(
            Noty.button("Afficher le contact", 'btn green btn-xs', function () {
                $(".bootbox").modal("hide");
                $('#modal-add-event').modal('hide');
                $('#modal-rappel-calendar').modal('hide');
                $('#modal-gestioncontacts').modal('hide');
                ref_campagne = notification.ref_campagne;
                ref_fichier = notification.ref_fichier;
                num_contact = notification.num_contact;
                name_fichier = notification.groupName;
                is_rappel_auto = 0;
                s_is_recept=0;
                is_rappel = 0;
                is_rappel_auto = 0;
                type_global_prod = 'notifications'
                click_from = $(this).data('clickfrom');
                $('.bloc_man_prod').addClass('hidden');
                $('button.valider_man_prod').data('action','valider_quick_qualif');
                $('.not_bloc_man_prod').removeClass('hidden');
                $('.default_prod').removeClass('hidden');
                GetListmSortatnt();
                newNoty.close();
                var postData = $(this).data();
                $.ajax({
                    type : 'POST',
                    global : false,
                    url : base_url_ajax+'agent/agent/setNotificationViewed',
                    data : {
                        'ref_fichier' : ref_fichier,
                        'num_contact' : num_contact
                    },
                    success : function() {
                        getNotifications();
                    }
                })
                SuccessPlay();
            })
        );
    }
    newNoty = new Noty(notyOptions).show();
}

$(document).ready(function() {
    getNotifications();
})

$(document).on("click",".cmk-notification-with-contact",function() {
    var postData = $(this).data();
    $.ajax({
        type : 'POST',
        global : false,
        url : base_url_ajax+'agent/agent/setNotificationViewed',
        data : postData,
        success : function() {
            getNotifications();
        }
    })

})