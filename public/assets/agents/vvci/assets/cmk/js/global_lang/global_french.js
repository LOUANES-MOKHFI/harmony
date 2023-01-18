var URL_LANG_DATATABLES = base_url_cmk+'/dataTablesLang/dataTables.french.lang';
var global_lang = "fr";

var LANG_VALIDATOR ="fr";
var LANG_MOMENT ="fr";
moment.locale(LANG_MOMENT);


var datarangpicker_ranges = {
		 'Aujourd\'hui': [moment(), moment()],
	     'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	     '7 derniers jours': [moment().subtract(6, 'days'), moment()],
	     '30 derniers jours': [moment().subtract(29, 'days'), moment()],
	     'Mois en cours': [moment().startOf('month'), moment().endOf('month')],
	     'Mois dernier': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
};
var datarangpicker_locale = {
	    cancelLabel : 'Annuler',
	    applyLabel : 'Valider',
	    fromLabel : 'De',
	    toLabel : 'A',
	    customRangeLabel : 'Période',
			format : 'D MMM, YYYY',
	    //daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	    //monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	    //monthNames:  ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
	};


	var datarangpicker_locale_stats_pred = {
		    cancelLabel : 'Annuler',
		    applyLabel : 'Valider',
		    fromLabel : 'De',
		    toLabel : 'A',
		    customRangeLabel : 'Période',
				format : 'DD/MM/YYYY HH:mm',
		    //daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		    //monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		    //monthNames:  ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
		};
var daterange_format = "D MMM, YYYY";

var glb_daterangepicker_config=  {
    	timePicker : true,
	    timePicker12Hour : false,
	    opens : 'right',
	    showDropdowns: true,
	    showWeekNumbers: true,
	    locale: datarangpicker_locale,
		ranges: datarangpicker_ranges ,
	    startDate: moment(),
	    endDate: moment()
    };


///////////////////////////////////// skander ////////////////////////////////////////
var lbl_select_lines_to_delete = "Veuillez selectionner les lignes à supprimer";
var lbl_confirm_deletes = "Etes vous sur de vouloir effacer ces elements?";
var lbl_confirm_delete = "Etes vous sur de vouloir effacer cet element?";

var lbl_select_lines_to_edit = "Veuillez selectionner les lignes à modifier";
var lbl_confirm_edits = "Etes vous sur de vouloir modifier ces elements?";
var lbl_confirm_edit = "Etes vous sur de vouloir modifier cet element?";

var lbl_btn_add = "Ajouter";
var lbl_btn_modify = "Modifier";
var lbl_btn_enable = "Activer";
var lbl_btn_disable = "Désactiver";
var lbl_btn_download = "Télécharger";
var lbl_no_available_data = "Pas de données disponible"; // No available data";

var lbl_camp_files = "Campagnes/Fichiers";

var lbl_all ="Tous";
var lbl_clear ="Aucun";

var lbl_from =" Du ";
var lbl_to =" Au ";
var lbl_call ="appel(s)";
var lbl_timeslot ="Time Slot";

var lbl_skill_group_agents = "Groupe d'agents / Agents";

var lbl_percentage = "pourcentage";
var lbl_modify = "Modifier";
var lbl_delete = "Supprimer";
var	lbl_params_saved_successfully ='Paramètres modifiés avec succès';
var	lbl_agendas ='Agendas';
var	lbl_commercials ='Commerciaux';
var lbl_placeholder_camp_fichier = "Campagne/Fichier";

var lbl_system_qualifs = 'Qualifications système';

//////////////////////HAMMA/////////////////////////
var lbl_no_grid = 'Aucune grille, cliquer pour ajouter';
var lbl_incorrect_groupname = 'Nom de fichier incorrect';

var label_daterange_today = 'Aujourd\'hui';
var label_daterange_yesterday = 'Hier';
var label_daterange_last7d = '7 derniers jours';
var label_daterange_currweek = 'Semaine en cours';
var label_daterange_last30d = '30 derniers jours';
var label_daterange_currmonth = 'Mois en cours';
var label_daterange_lastmonth = 'Mois dernier';
var label_daterange_from = 'Du';
var label_daterange_to = 'Au';
var label_daterange_cancel = 'Annuler';
var label_daterange_apply = 'Valider';
var label_daterange_customrange = 'Période';


///////////////////////////////////////////
var lbl_button_columns = "Colonnes à afficher";


var lbl_button_play_enreg = "Lire l'enregistrement";

var ct_timeline_mail_in = 'Mail reçu';
var ct_timeline_mail_out = 'Mail envoyé';
var ct_timeline_mail_subject_label = 'Objet';

var ct_timeline_call_in = 'Appel reçu';
var ct_timeline_call_out = 'Appel émis';

var ct_timeline_fax_in = 'Fax reçu';
var ct_timeline_fax_out = 'Fax envoyé';
var ct_timeline_sent_to = 'Envoyé au';
var ct_timeline_sent_to_bis = 'Envoyé a';

var ct_timeline_sms_in = 'SMS reçu';
var ct_timeline_sms_out = 'SMS envoyé';

var ct_timline_attachment = 'Fichier joint';

var ct_timeline_msg_in = 'Message reçu';
var ct_timeline_msg_out = 'Message envoyé';

var chat_label_chat_with = 'Chat avec';

var lbl_media_stream_denied = 'Le webphone n\'arrive pas à trouver un équipement audio dans cet ordinateur';
var lbl_incoming_call_from = 'Appel reçu de ';
var lbl_webphone_in_call = 'Appel en cours';
var lbl_wp_terminating_call = 'Entrain de raccrocher l\'appel';


//highcharts context menu
var lbl_highcharts_menu_downloadCSV = "Télécharger CSV";
var lbl_highcharts_menu_downloadJPEG = "Télécharger image JPEG";
var lbl_highcharts_menu_downloadPDF = "Télécharger document PDF";
var lbl_highcharts_menu_downloadPNG = "Télécharger image PNG";
var lbl_highcharts_menu_downloadSVG = "Télécharger image SVG";
var lbl_highcharts_menu_downloadXLS = "Télécharger XLS";
var lbl_highcharts_menu_showDT = "Afficher le tableau";
var lbl_highcharts_menu_printChart = "Imprimer";




var lbl_bootbox_pause_message = 'Voulez vous confirmer la demande de sortir en pause';
var lbl_bootbox_btn_send_request = 'Envoyer la demande';
var lbl_bootbox_btn_send_request_accepted = 'Votre demande de pause est accepté';
var lbl_bootbox_btn_send_request_rejected = 'Votre demande de pause est rejeté';
var lbl_pause_acepter = 'Accepté';
var lbl_pause_wait = 'En attente';

var msg_operator = "l'operateur ";
var lbl_poste = "poste";
var lbl_request_exist_pause = "demande à sortir en pause";
var msg_no_responsbale_connect = 'Aucun résponsable connecté, veuillez réessayer ultérieurement!';

var lbl_request_assistance = "demande une assistance";

var lbl_prendre_encharge_btn = 'Prendre en charge';
var lbl_the_supervisor = 'le superviseur ';
var txt_msg_prise_en_charge = ' à pris en charge l\'opérateur ';
var txt_msg_vous_prend_en_charge = ' vous prends en charge ';

var txt_msg_prise_en_charge_refus = ' à refusé la prise en charge de l\'opérateur ';
var txt_msg_vous_prend_en_charge_refus = ' refuse de vous prendre en charge ';

var lbl_prendre_encharge_btn_refus = "Refuser";
var lbl_pause_acepter_btn = 'Accepter';
var lbl_pause_reject_btn = 'Rejeter';
var lbl_copy = 'Copier';
var lbl_print = 'Imprimer';


var lbl_model_basedeconnaissance_libelle = "Libellé";
var lbl_model_basedeconnaissance_question = "Titre";
var lbl_model_basedeconnaissance_reponse = "Contenu";
var lbl_model_basedeconnaissance_themes = "Themes";
var lbl_model_basedeconnaissance_mots_cles = "Mots clés";
var lbl_model_basedeconnaissance_etat = "Etat";
var lbl_model_basedeconnaissance_etat_actif = "Actif";
var lbl_model_basedeconnaissance_etat_noactif = "Non Actif";
var lbl_model_basedeconnaissance_actions = "Actions";

var lbl_model_basedeconnaissance_delete_message = "Voulez vous supprimer";
var lbl_model_basedeconnaissance_delete_title = "Suppression";

var lbl_model_basedeconnaissance_libelle_required = 'Veuillez saisir libellé';
var lbl_model_basedeconnaissance_question_required = 'Veuillez saisir titre';
var lbl_model_basedeconnaissance_themes_required = 'Veuillez saisir thèmes';
var lbl_model_basedeconnaissance_reponse_required = 'Veuillez saisir contenu';
var lbl_model_basedeconnaissance_mots_cles_required = 'Veuillez saisir mots clés';
var lbl_fichier_global = 'Fichier';
var lbl_campagne_global = 'Campagne';

var lbl_msg_warning_histo_agent_grpcomp = "Veuillez choisir au moins un agent";
var lbl_msg_warning_histo_type = "Veuillez choisir un type";

var lbl_yes= "OUI";
var lbl_no= "NON";


var	lbl_operation_success ='Operation terminé avec succès';


var dataTablesLang = {
    "sProcessing":     "Traitement en cours...",
    "sSearch":         "Rechercher&nbsp;:",
    "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
    "sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
    "sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
    "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
    "sInfoPostFix":    "",
    "sLoadingRecords": "Chargement en cours...",
    "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
    "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
    "oPaginate": {
        "sFirst":      "Premier",
        "sPrevious":   "Pr&eacute;c&eacute;dent",
        "sNext":       "Suivant",
        "sLast":       "Dernier"
    },
    "oAria": {
        "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
        "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
    }
};

var lbl_previous = "Précédent";
var lbl_next = "Suivant";


var lb_msg_error_old_pwd = 'Mot de passe vide! Veuillez saisir l\'ancien mot de passe';
var lb_msg_error_old_pwd_incorect = 'Veuillez saisir l\'ancien mot de passe correctement';
var lb_msg_error_change_pwd = 'Mot de passe vide! Veuillez saisir le nouveau mot de passe';
var lb_msg_error_change_pwd_retype = 'Mot de passe vide! Veuillez re-saisir le nouveau mot de passe';
var lb_msg_info_change_pwd = "Le Mot de passe n'a pas chang&eacute;. Merci de choisir un nouveau mot de passe";
var lb_msg_error_verif_new_pwd = "Pas de correspondance. Veuillez vérifier le nouveau mot de passe saisi et le re-saisir.";

var lbl_delete_title = "Suppression";
var lbl_var_delete_confirm_var = "Voulez vous supprimer cette variable";
var lbl_var_delete_confirm_template = "Voulez vous supprimer ce template";

var lbl_cancel="Annuler";
var lbl_ok="OK";
var lbl_validate="Valider";

var lbl_stats_on="Stats sur ";

var	lbl_action_done_successfully ='Action effectuée avec succès';


var lbl_adblocker_alert = "Bloqueur d'annonce détecté. Veuillez le désactiver sur ce domaine.";

var lbl_variable_predefinie = 'Variable Prédéfinie';
var lbl_champs_contact = 'Champs Contact';
var lbl_champs_ecran = 'Champs Ecran';


var lbl_tour_prev = "Précédent";
var lbl_tour_next = "Suivant";
var lbl_tour_end = "Terminer";

var lbl_export = "Exporter";
var lbl_bookmark_page = "Ajouter au favoris";


var deselectAllText = "Tout déselectionner";
var selectAllText = "Tout sélectionner";
var noneSelectedText = "Aucun sélectionné";


var lbl_start_contextual_help = "Activer l'aide contextuelle";
var lbl_stop_contextual_help = "Arrêter l'aide contextuelle";
var lbl_start_tour = "Faire un Tour";

var lbl_msg_operation_failed = "Une erreur s'est produite lors de cette opération";


var lbl_msg_error_config_plive = 'Vous ne pouvez pas ajouter le même module dans une configuration';


var msg_webphone_unable_to_connnect = 'Impossible de se connecter au module VoIP, veuillez contacter votre administrateur système / réseau!';
var msg_webphone_attempt_5 = 'Module VoIP injoignable, tentative de reconnexion: tentative ';


var msg_statuer_appel = "Veuillez statuer l'appel";
var lbl_request_assistance_sip = " présente un souci : son webphone est déconnecté";
var msg_notif_contact_restant = "Attention, vous n'avez plus assez de contacts dans un ou plusieurs fichiers!";
var msg_notif_contact_restant_window = "Attention, vous n'avez plus assez de contacts dans un ou plusieurs fichiers!";


var lbl_var_delete_confirm_rules = "Voulez vous supprimer cette règle";


var json_lbl_wan_notif = {
	'lbl_warning_contact_restant' : "Vous n'avez plus assez de contacts",
	'lbl_warning_tx_inj' : "Vous avez un taux d'injoignabilité très élevé (>80%)",
	'lbl_warning_tx_decroche' : "Vous avez un taux de décrochés inférieur a 10%",
	'lbl_warning_fx_number' : "Vous avez un taux de faux numéros supérieur à 5%",
};

var lbl_bug_reported_successfully = "Bug rapporté avec succés";

var lbl_prendre_encharge_btn_close_all = "Tout fermer";

var lbl_daterange_day = "Journée";
var lbl_daterange_1_week = "1 Semaine";
var lbl_daterange_1_month = "1 Mois";
var lbl_daterange_3_months = "3 Mois";
var lbl_daterange_6_months = "6 Mois";
var lbl_daterange_1_year = "1 An";
var lbl_daterange_1_century = "1 Siècle";
var lb_veuillez_selectionner_au_moin_un_fichier ="Veuillez sélectionner au moins un fichier";

var lb_manager ="Responsable";



var lbl_save_btn = "Enregistrer";
var lbl_warning_list_ip_addresse = "Veuiller remplir la liste des adresse ip";

var warning_solde_alerte = 'Veuillez alimenter votre compte %trunk% pour pouvoir passer des appels';


var lbl_warning_msg_link_mc = "Aucun lien n'est défini";

var cancel_bootbox = "Annuler";
var validate_bootbox = "Valider";
var lbl_modal_deletion = 'Suppression'


//Modal Confirm

var regleblacklist_message_bootbox_confrim = "Êtes-vous sûr de vouloir continuer?";
var lbl_modal_confirm= 'Confirmation'

var lbl_action = "Action";