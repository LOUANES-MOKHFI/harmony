var stats = "";

var historique_prospect = "";
var historique_menu ="";
var info_fichier = "";
var commentaire = "";
var softphone = "";
var chat = "";
var rappel_ext = "";
var rappel_launch_auto = "";
var voip_quality = "";
var emission_back = "";
var reception_back = "";
var creation_fiche_vierge_auto = "";
var raccourci_mail =  "";
var attached_piece = "";
var sales= "";
var splitrecording = "";
var timeline_prospect = "";
//var google_account_calendar = "";
$('.send_mail').hide();
$('.send_fax').hide();
$('.send_sms').hide();
$('.sep_multi_canal').hide();
$('.splitrecording').hide();
function loadinterface(data_returns) {
    //$('li#tablistsales').addClass('hidden');

    $.each(data_returns.data, function (key, value) {

        historique_menu = value.historique_menu.toString();
        historique_prospect = value.historique_prospect.toString();
        info_fichier = value.info_fichier.toString();
        commentaire = value.commentaire.toString();
        softphone = value.softphone.toString();
        rappel_ext = value.rappel_ext.toString();
        rappel_launch_auto = value.rappel_launch_auto.toString();
        voip_quality = value.voip_quality.toString();
        emission_back = value.emission_back.toString();
        reception_back = value.reception_back.toString();
        creation_fiche_vierge_auto = value.creation_fiche_vierge_auto.toString();
        chat = value.chat.toString();
        raccourci_mail = value.raccourci_mail.toString();
        attached_piece = value.attached_piece.toString();
        sales = value.sales.toString();
        splitrecording = value.splitrecording.toString();
        allowtransfer = value.allowtransfer.toString();
        timeline_prospect = value.timeline_prospect.toString();
        //google_account_calendar = value.google_account;
    });

    if (allowtransfer == 1)
        $(".GetTransfert.in_prospect_btn").show();
    else
        $(".GetTransfert.in_prospect_btn").hide();
    if (historique_menu == 1)
        $('#historique_menu').attr('checked', true);
    if (historique_prospect == 1)
        $('#li_historique_prospect').removeClass('hidden');
    else
        $('#li_historique_prospect').addClass('hidden');
    if (timeline_prospect == 1) {
        $('#li_timeline_prospect').removeClass('hidden');
    } else {
        $('#li_timeline_prospect').addClass('hidden');
    }

    if (commentaire == 1)
        $('#module_commentaire,#module_commentaire_dupli').removeClass('hidden');
    else
        $('#module_commentaire,#module_commentaire_dupli').addClass('hidden');

    $('#rappel_ext').val(rappel_ext);
    if (rappel_launch_auto == 1)
        $('#rappel_launch_auto').attr('checked', true);
    if (voip_quality == 1)
        $('#voip_quality').attr('checked', true);
    if (is_reception) {
        if (reception_back == "1") {
            $('.retour_menu_principale').show();
        } else {
            $('.retour_menu_principale').hide();
        }
    } else {
        if (emission_back == "1") {
            $('.retour_menu_principale').show();
        } else {
            $('.retour_menu_principale').hide();
        }
    }

    if (creation_fiche_vierge_auto == 1)
        $('#creation_fiche_vierge_auto').attr('checked', true);

    if (softphone == 1) {
        $('#li_appel_manuel').removeClass('hidden');
        $('#cmk_originate_manuel_shortcut').removeClass('hidden');
    } else {
        $('#li_appel_manuel').addClass('hidden');
        $('#cmk_originate_manuel_shortcut').addClass('hidden');
    }

    if (info_fichier == "1") {
        name_campagne = (name_campagne == undefined) ? '' : '@' +name_campagne;
        $('#info_fichier').html(' : '+name_fichier + name_campagne )
    } else {
        $('#info_fichier').html('')
    }

    $('#info_fichier').prepend(num_contact);

    if (chat == "1") {
        $('#li_livechat').removeClass('hidden')
    } else {
        $('#li_livechat').addClass('hidden')
    }

    if (sales == 1) {
        $('li#tablistsales').removeClass('hidden')
    } else {
        $('#tablistsales').addClass('hidden')
    }
    if(raccourci_mail=="1"){
        $('.send_mail').show();
        if(attached_piece=="1"){
            $('.bloc_attached').show();
        }else{
            $('.bloc_attached').hide();
        }
    }else{
        $('.send_mail').hide();
        
    }
    if(splitrecording=="1" && status_call==1){
        $('.splitrecording').show();
    }else{
        $('.splitrecording').hide();
    }
    
}
