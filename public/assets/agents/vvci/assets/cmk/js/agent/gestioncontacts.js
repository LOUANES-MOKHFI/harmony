//var durees = "<optgroup label='DurÃ©es'><option value='dmpa'>DurÃ©e de post-appel</option><option value='dmprod'>DurÃ©e de production</option><option value='dmatt'>DurÃ©e d'attente</option><option value='dmc'>DurÃ©e de conversation</option></optgroup>";
var defaultOption = "<option value=''></option>";
var currentChamps = defaultOption;
var currentInputs = [];
var restrections = [];
var fiches = [];
var fichesOff = [];
var Confmail = [];
var Conffax = [];
var Confsms = [];
var counter = 1;
var table;
var qualifTree = false;
var formInputCounter = 1;
var lastSelectedCamp = '';
var tableM;
var lastModelUsed;
var cmk_search_last_search_grps = [];
var multiple_model = false;
var one_model = false;
function resetFormInputs() {
	var html = '<h3>Champs formulaire</h3>';
	html += '<div class="row">';
	html += '<div id="formSearch_div1" class="col-md-4 formSearch_div">';
	html += '<div class="form-group">';
	html += '<select name="selectInputs[]" id="selectInput1" class="form-control input-sm selectInputs">';
	html += '</select>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$("#formInputs").html(html);
	formInputCounter = 1;
}
function fetch_models_script(groups) {
	$("#modelsDD").empty();
	$(".export_menu").each(function (k, v) {
		$(v).children("ul").remove();
		$(v).children("a").removeClass("trigger right-caret left-caret");
	});
	currentInputs = [];
	var html = '';
	var html2 = '';
	$.ajax({
		type: 'post',
		url: base_url_ajax + 'gestioncontacts/gestioncontacts/getModels',
		data: { groups: groups.toString() },
		success: function (response) {
			response = $.parseJSON(response);
			if (response.length > 0 && response[0].id) {
				html2 += "<ul class='dropdown-menu sub-menu'><li><a data-modelid='-1' class='export_sublink' href='#'>Aucun modÃ¨le</a></li>";

			}
			$.each(response, function (k, val) {
				if (val.id) {
					html += '<li><a href="#">' + val.libelle + '</a></li>';
					html2 += '<li><a data-modelid="' + val.id + '" class="export_sublink" href="#">' + val.libelle + '</a></li>';
				}
			});
			if (response.length > 0 && response[0].id) {
				html2 += "</ul>";
				$(".export_menu").each(function (k, v) {
					$(v).children("a").addClass("trigger right-caret").removeClass("export_link");
					$(v).append(html2);
				});
			}
			$("#modelsDD").html(html);
		}
	});

	currentInputs = [];
	formInputCounter = 1;
	$.ajax({
		type: 'post',
		url: base_url_ajax + 'gestioncontacts/gestioncontacts/getFormElements',
		data: { groups: groups.toString() },
		success: function (response) {
			var html = '<option value="-1"></option>';
			response = $.parseJSON(response);
			$.each(response, function (k, val) {
				html += '<option value="' + val.id + '" data-formid="' + val.formid + '" data-elemtype="' + val.type + '" data-elemmulti="' + val.multi + '">' + val.label + '</option>'
			});
			currentInputs = html;
			$(".selectInputs").html(html);
		}
	});
}

function filter_qualifs(type) {
	if (!qualifTree) return false;
	if (type == '0') {
		$('#qualifTree').jstree(true).clear_search();
		return false;
	}
	$('#qualifTree').jstree(true).search(type, false, true);
}

function actionButton(row) {
	var html = '<div class="ct_DT_action demo-btn">';
	html += '<div class="btn-group"><button data-toggle="tooltip" data-original-title="Editer" class="doAction btn btn-xs btn-blue" href="#" data-action="edit_details" data-group="' + row[1] + '" data-nom="' + row[4] + '" data-tel1="' + row[5] + '" data-contact="' + row[1] + "||" + row[16] + "||" + row[3] + '"><i class="fa fa-fw fa-info"></i></button></div>';
	html += '<div class="btn-group"><button data-toggle="tooltip" data-original-title="Enregistrements" class="doAction btn btn-xs btn-grey" href="#" data-action="void" data-group="' + row[1] + '" data-nom="' + row[4] + '" data-tel1="' + row[5] + '" data-contact="' + row[1] + "||" + row[16] + "||" + row[3] + '"><i class="fa fa-fw fa-headphones"></i></button></div>';
	html += '<div class="btn-group"><button data-toggle="tooltip" data-original-title="Scripteur" class="doAction btn btn-xs btn-red" href="#" data-action="void" data-group="' + row[1] + '" data-nom="' + row[4] + '" data-tel1="' + row[5] + '" data-contact="' + row[1] + "||" + row[16] + "||" + row[3] + '"><i class="fa fa-fw fa-edit"></i></button></div>';
	html += '<div class="btn-group"><button data-toggle="tooltip" data-original-title="Ticket" class="doAction btn btn-xs btn-green" href="#" data-action="void" data-group="' + row[1] + '" data-nom="' + row[4] + '" data-tel1="' + row[5] + '" data-contact="' + row[1] + "||" + row[16] + "||" + row[3] + '"><i class="fa fa-fw fa-file-text-o"></i></button1></div>';
	html += '<div class="btn-group">';
	html += '</div>';
	return html;
}

var Xhr;

function renderDt(post_data) {
	//$("#pageloader3").find('.spinner').show();
	$("#resultModelPortlet").hide();
	$('#pleaseWaitDialog').modal('show');

	Xhr = $.ajax({
		type: 'POST',
		//async : false,
		url: base_url_ajax + 'gestioncontacts/gestioncontacts/search',
		data: post_data,
		beforeSend: function () {
			$('#pleaseWaitDialog').modal('show');
			$('#progress').show();
		},
		complete: function () {
			$('#progress').hide();

			$('#pleaseWaitDialog').modal('hide')
		},
		success: function (response) {
			response = $.parseJSON(response);
			console.log(response);
			//if (!$("#resultPortlet").is(':visible')) $("#resultPortlet").slideDown('slow');
			$("#resultPortlet").show();
			if (!table) {
				table = $('#ct_DT').DataTable({
					// "width":"50%",
					"data": response.data,
					// "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],
					// "order": [[1,'asc'],[3, 'asc']],
					"columns": [
						{
							"title": tableheader_actions,
							"render": function (data, type, row) {
								var actBtn = '<a class="fa fa-phone-square call_contact log_action" style="cursor:pointer;color:green;" data-toggle="tooltip" data-original-title="' + tableheader_call_title + '" data-makecall="1" data-tel="' + row['tel1'] + '" title="' + tableheader_call_title +
									'" data-ref_campagne="' + row['num_campagne'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['num_contact'] +
									'" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] +
									'" data-log-action="appeler_contact"' + '" data-log-ref_fichier="' + row['num_fichier'] + '" data-log-ref_campagne="' + row['num_campagne'] + '" data-log-num_contact="' + row['num_contact'] +
									'"></a>';
								actBtn += ' <a class="fa fa-plus-square call_contact log_action" style="cursor:pointer;color:blue;" data-toggle="tooltip" data-original-title="' + tableheader_view_title + '" data-makecall="0" title="' + tableheader_view_title +
									'" data-ref_campagne="' + row['num_campagne'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['num_contact'] +
									'" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] +
									'" data-log-action="afficher_contact"' + '" data-log-ref_fichier="' + row['num_fichier'] + '" data-log-ref_campagne="' + row['num_campagne'] + '" data-log-num_contact="' + row['num_contact'] +
									'"></a>';
								actBtn += GenerateQualifGroupe(row, false);
								if (duplictc == '1') {
									actBtn += ' <a class="fa fa-external-link-square copy_contact" data-toggle="tooltip" data-original-title="' + tableheader_dupp_title + '" style="cursor:pointer;color:purple;"   title="' + tableheader_dupp_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '"></a>';
								}
								return actBtn;
							}
						},
						//	{"data" : "fichier" , "title" : tableheader_group },
						//	{"data" : "agent_nom" , "title" : tableheader_agent },
						//	{"data" : "num_contact" , "title" : tableheader_num},
						{ "data": "nom", "title": tableheader_name },
						//	{"data" : "tel1" , "title" : tableheader_tel1,
						//		"render" : function(data,type,row){
						//			return row['tel1']+' <a class="fa fa-phone-square appel_manuel_search" data-tel="'+row['tel1']+'" title="Appeler le Contact" data-idfield="cmk_input_info_tel1" style="cursor:pointer;color:green;" data-ref_campagne="'+row['num_campagne']+'" data-num_contact="'+row['num_contact']+'" data-ref_fichier="'+row['num_fichier']+'" data-name_fichier="'+row['fichier']+'"></a>'
						//		}
						//	},
						//	{"data" : "tel2" , "title" : tableheader_tel2},
						//	{"data" : "tel3" , "title" : tableheader_tel3},
						//	{"data" : "fax1" , "title" : tableheader_fax1},
						//	{"data" : "fax2" , "title" : tableheader_fax2},
						//	{"data" : "ct_qualif" , "title" : tableheader_qualif},
						//	{"data" : "last_date_fin" , "title" : tableheader_procdate},
						//	{"data" : "last_date_rappel" , "title" : tableheader_recalldate},
						//	{
						//		"title" : tableheader_dupp ,
						//		"render" : function(data,type,row) {
						//			return '<a class="fa fa-copy copy_contact" title="'+tableheader_dupp_title+'" data-ref_campagne="'+row['num_campagne']+'" data-num_contact="'+row['num_contact']+'" data-ref_fichier="'+row['num_fichier']+'" data-name_fichier="'+row['fichier']+
						//				//'" data-log-action="dupliquer_contact"'+'" data-log-ref_fichier="'+row['num_fichier']+'" data-log-ref_campagne="'+row['num_campagne']+'" data-log-num_contact="'+row['num_contact']+
						//				'"></a>';
						//		},
						//		"visible" : (duplictc == '1')
						//	},
						//	{
						//		"title" : 'Qualifier' ,
						//		"render" : function(data,type,row) {
						//			return GenerateQualifGroupe(row);
						//		},
						//		"visible" : false
						//	},
					],
					"columnDefs": [
						//{ "visible" : false, "targets" : [10,13,14,15,16,17,18] },
					],
					drawCallback: function () {
						$("#ct_DT [data-toggle='tooltip']").tooltip();
					}
				});
			} else {
				table.clear().rows.add(response.data).columns.adjust().draw();
				//$("html, body").animate({ scrollTop: $('.form-actions').offset().top }, 2000);
			}
		},
		error: function (response) {
		}
	});
	//$("#pageloader3").find('.spinner').fadeOut();
}

function GenerateQualifGroupe(row, is_model) {


	if (is_model) var ret = ' <a class="fa fa-check-square act_qualify" style="cursor:pointer;color:red" data-toggle="tooltip" data-original-title="' + tableheader_quick_qualif_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '" type="button"></a>';
	else var ret = ' <a class="fa fa-check-square act_qualify" style="cursor:pointer;color:red" data-toggle="tooltip" data-original-title="' + tableheader_quick_qualif_title + '" data-ref_campagne="' + row['num_campagne'] + '" data-num_contact="' + row['num_contact'] + '" data-ref_fichier="' + row['num_fichier'] + '" data-name_fichier="' + row['fichier'] + '" type="button"></a>';
	return ret;
}


function LoadQualifCamp(camp) {
	$.ajax({
		url: base_url_ajax + "formbuilder/formbuilder/LoadQualifElement",
		async: false,
		type: "post", // 'get' or 'post', override for form's 'method'
		data: 'ref_campagne=' + ref_campagne
	})
}

$(document).on('click', '.abort_process', function () {
	Xhr.abort();
	$('#pleaseWaitDialog').modal('hide')
});

function addSearchInputOld(value, text) {
	var html = '<div class="col-md-3" data-inputname="' + value + '" style="display:none">';
	html += '<div class="form-group">';
	html += '<span style="float:right;color:red;cursor:pointer"><i class="fa fa-times" onClick="removeInput(\'' + value + '\')"></i></span>';
	html += '<label class="control-label" for="inputAddress1">' + text + '</label>';
	html += '<input type="text" class="input-sm form-control" placeholder="" id="search_' + value + '" name="search_' + value + '">';
	html += '</div>';
	html += '</div>';
	$(html).appendTo("#searchInputs");
	$("[data-inputname='" + value + "']").fadeIn();
}

function addSearchInput(value, text) {
	var html = '<div class="col-md-4" data-inputname="' + value + '" style="display:none">';
	html += '<div class="form-group">';
	html += '<span style="float:right;color:red;cursor:pointer"><i class="fa fa-times" onClick="removeInput(\'' + value + '\')"></i></span>';
	html += '<label class="control-label" for="inputAddress1">' + text + '</label>';
	html += '<input type="text" class="input-sm form-control" placeholder="" id="search_' + value + '" name="search_' + value + '">';
	html += '</div>';
	html += '</div>';
	$(html).appendTo("#searchInputs");
	$("[data-inputname='" + value + "']").fadeIn();
}

function removeInput(value) {
	var selectedVals = $(".selectChamps").multipleSelect("getSelects");
	selectedVals = jQuery.grep(selectedVals, function (val) {
		return val != value;
	});
	$(".selectChamps").multipleSelect("setSelects", selectedVals);
	$("[data-inputname='" + value + "']").fadeOut(function () {
		$(this).remove();
	});
}

function addChampsGroup(groups) {
	$.ajax({
		type: 'POST',
		url: base_url_ajax + 'gestioncontacts/gestioncontacts/filtreChamps',
		data: { 'groups': groups },
		success: function (response) {
			$(".selectChamps").html(response);
			$(".selectChamps").multipleSelect("refresh");
		}
	});
}

$(document).ready(function () {
	//	$('#gestioncontactsBody').slimScroll({
	//        height: '400px',
	//        width : '100%'
	//    });
	$("#modal-gestioncontacts").on('show.bs.modal', function () {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: base_url_ajax + 'gestioncontacts/gestioncontacts/fichiersAgent',
			success: function (response) {
				var htmlGrps = '';
				var liste = '';
				var ancienListe = '';
				$.each(response, function (camp, fichiers) {
					htmlGrps += '<optgroup label="' + camp + '">';

					$.each(fichiers, function (nFichier, fichier) {
						htmlGrps += '<option value="' + nFichier + '">' + fichier + '</option>';
						liste += ' ' + fichier;
						sessionStorage.setItem("variablefichier", liste);
					})

					htmlGrps += '</optgroup>';
				});
				$("#selectGroups").html(htmlGrps);
				$("#selectGroups").multipleSelect("refresh");
				$("#selectGroups").multipleSelect("setSelects", cmk_search_last_search_grps);
				$('#CMK_GO_SEARCH_DIV').show();
				$('#CMK_GO_SEARCH_MODEL_DIV').hide();

				var listefichier = sessionStorage.getItem("variablefichier");
				var ancienlistefichier = sessionStorage.getItem("ancienvariablefichier");
				//  verification des fichiers affactÃ© pour l agent ;
				if (cmk_search_last_search_grps.length == 0) $('#CMK_GO_SEARCH').attr('disabled', true);
				$('#CMK_GO_SEARCH_DIV_ONE_MODEL').hide();
				if (multiple_model === true) {
					$('#CMK_GO_SEARCH_DIV_ONE_MODEL').hide();
					$('#CMK_GO_SEARCH_DIV').hide();
					$('#CMK_GO_SEARCH_MODEL_DIV').show();
				}
				if (one_model === true) {
					$('#CMK_GO_SEARCH_DIV_ONE_MODEL').show();
					$('#CMK_GO_SEARCH_MODEL_DIV').hide();
					$('#CMK_GO_SEARCH_DIV').hide();

				}

				if (listefichier != ancienlistefichier) {
					$("#resultModelPortlet").hide();
					sessionStorage.setItem("ancienvariablefichier", sessionStorage.getItem("variablefichier"));
					$('#CMK_GO_SEARCH').attr('disabled', false)
				}



			}
		});
	});
	$("#modal-gestioncontacts").on('hidden.bs.modal', function () {
		$("#resultPortlet").hide();
		if (table) table.clear();
	});
	$("#contactForm")[0].reset();
	moment.lang('fr');

	$("#selectChamps1").select2({
		width: null
	});
	$("#rowLimit").select2({
		width: null
	});
	$("#selectQualifs").select2({
		width: null
	});
	$("#dateType").select2({
		width: null
	}).trigger("change");

	//$(".switch").bootstrapSwitch();
	$("#contactForm").find("select,input[type!='checkbox'][type!='radio']").val('');

	$("#dateType").change(function () {
		if ($(this).val() == '0') {
			$("#dateDiv").fadeOut();
		} else {
			$("#dateDiv").fadeIn();
		}
	});

	$(document).on("change", "[name='qualifType']", function () {
		filter_qualifs($(this).val());
	});
	$("#selectGroups").multipleSelect({
		filter: true,
		onClick: function (view) {
			$("#selectGroups").multipleSelect('getNotActive', 'singleclick');
		},
		onOptgroupClick: function (view) {

			if (view.checked) {
				$("#selectGroups").multipleSelect('getNotActive');
			} else {
				$("#selectGroups").multipleSelect('refresh');
			}

		},
		selectAll: false,
		onClose: function () {
			var selectedGroups = $("#selectGroups").multipleSelect('getSelects');
			var labels = [];
			$("#selectGroups").find("option:selected").each(function () {
				labels.push($(this).parent().attr("label"));
			});
			labels = $.unique(labels);
			$('#CMK_GO_SEARCH').attr('disabled', true);
			cmk_search_last_search_grps = selectedGroups;
			if (selectedGroups.length > 0) {
				$('#CMK_GO_SEARCH').attr('disabled', false);
				if (labels.length == 1) {
					$.ajax({
						global: false,
						type: 'post',
						url: base_url_ajax + 'gestioncontacts/gestioncontacts/getIndicatedModels',
						data: { groups: selectedGroups.toString() },
						success: function (response) {
							$('#CMK_GO_SEARCH_DIV').hide();
							$('#CMK_GO_SEARCH').attr('disabled', false);


							//$('#CMK_GO_SEARCH').remove();
							var html = '';
							var button = '';
							response = JSON.parse(response);
							//console.log(response);
							if (response.length == 1) {
								multiple_model = false;
								one_model = true;
								$('#CMK_GO_SEARCH_DIV_ONE_MODEL').show();
								$('#CMK_GO_SEARCH_MODEL_DIV').hide();
								button += '<button class="btn blue btn-sm search-agent-model" data-model="' + response[0]["libelle"] + '" data-ref="' + response[0]["id"] + '" type="button" id="CMK_GO_SEARCH_ONE_MODEL">';
								button += '<i class="fa fa-search"></i> ' + lbl_search + '</button>';
								$('#CMK_GO_SEARCH_DIV_ONE_MODEL').html(button);
							} else {
								multiple_model = true;
								one_model = false;

								$('#CMK_GO_SEARCH_DIV_ONE_MODEL').hide();
								$('#CMK_GO_SEARCH_MODEL_DIV').show();
								if (response.length > 0) {
									for (var i = 0; i < response.length; i++) {
										html += '<li><a href="#" class="search-agent-model" data-model="' + response[i]["libelle"] + '" data-ref="' + response[i]["id"] + '">' + lbl_model + ' ' + response[i]["libelle"] + '</a></li>';
									}
								} else {
									var lbl_not_affected = '<div class="note note-warning">' +
										'<h4 class="block"> ' + lbl_not_affected_search_model +
										'<p> ' + lbl_contact_admin + '. </p>' +
										'</div>';
									//html = '<li>'+lbl_not_affected+'</li>';
									html = lbl_not_affected;
								}
								$('#CMK_GO_SEARCH_UL').html(html);
							}
						}
					});

				} else {
					$('#CMK_GO_SEARCH_DIV').show();
					$('#CMK_GO_SEARCH_MODEL_DIV').hide();
					$('#CMK_GO_SEARCH_DIV_ONE_MODEL').hide();

				}

				$.ajax({
					type: 'POST',
					url: base_url_ajax + 'gestioncontacts/gestioncontacts/filtreChamps',
					data: { 'groups': selectedGroups.toString() },
					success: function (response) {
						$(".selectchamps").each(function (k, v) {
							$(v).select2('destroy');
						});
						$(".selectchamps").html(defaultOption + response);
						currentChamps = defaultOption + response;
						$(".selectchamps").each(function (k, v) {
							$(v).select2();
						});
					}
				});
				$("#qualifIcon").removeClass('fa-chevron-down').addClass('fa-spin fa-spinner');
				$.ajax({
					type: 'POST',
					url: base_url_ajax + 'gestioncontacts/gestioncontacts/getQualifGroups',
					data: { 'groups': selectedGroups },
					success: function (response) {
						if (!qualifTree) {
							qualifTree = $('#qualifTree').jstree({
								'plugins': ["checkbox", "search"], 'core': {
									"themes": {
										"name": "default",
										"dots": true,
										"icons": false
									},
									"checkbox": {
										"keep_selected_style": true
									},
									'data': $.parseJSON(response)
								},
								'search': {
									'show_only_matches': true,
									'': false,
									'search_callback': function (str, node) {
										//$("#qualifTree").jstree("uncheck_all");
										if (str == '1') {
											if (node.li_attr.type == '1') node.state.shown = 1;
											else node.state.shown = 0;
											return (node.li_attr.type == '1');
										} else if (str == '2') {
											if (node.li_attr.argumente == '1') node.state.shown = 1;
											else node.state.shown = 0;
											return (node.li_attr.argumente == '1')
										} else if (str == '0') {
											node.state.shown = 1;
											return true;
										}

									}
								}
							});
						} else {
							$('#qualifTree').jstree(true).settings.core.data = $.parseJSON(response);
							$('#qualifTree').jstree(true).refresh();

						}
					},
					complete: function () {
						$("#qualifIcon").removeClass('fa-spin fa-spinner').addClass('fa-chevron-down');
					}
				});
				return false;
			} else {
				$('#CMK_GO_SEARCH_DIV').show();
				$('#CMK_GO_SEARCH_MODEL_DIV').hide();
				$('#CMK_GO_SEARCH_ONE_MODEL').hide();
			}
		}
	});


	$("#uncheckAllBtn").click(function () {
		$('#CMK_GO_SEARCH').attr('disabled', true);

		$("#selectGroups").multipleSelect("uncheckAll");
		$("#selectGroups").multipleSelect('refresh');
	});

	$(document).on("click", ".rem_input_row", function () {
		var rowid = $(this).data('rowid');
		$("#search_row_" + rowid).fadeOut(function () {
			$("#search_row_" + rowid).remove();
		});
	});
	$("#qualifInput").click(function (e) {
		e.preventDefault();
		$(this).blur();
	});
	$("#dateTraitement").parent().daterangepicker(
		{
			timePicker: true,
			timePicker24Hour: true,
			opens: 'left',
			autoUpdateInput: false,
			locale: {
				cancelLabel: 'Annuler',
				applyLabel: 'Valider',
				fromLabel: 'De',
				toLabel: 'A',
				customRangeLabel: 'PÃ©riode',
				format: 'DD/MM/YYYY'
			},
			ranges: {
				'Aujourd\'hui': [moment(), moment()],
				'Hier': [moment().subtract(1, 'days').set('hours', 0).set('minutes', 0), moment().subtract(1, 'days').set('hours', 23).set('minutes', 59)],
				'7 derniers jours': [moment().subtract(6, 'days').set('hours', 0).set('minutes', 0), moment().set('hours', 23).set('minutes', 59)],
				'30 derniers jours': [moment().subtract(29, 'days').set('hours', 0).set('minutes', 0), moment().set('hours', 23).set('minutes', 59)],
				'Mois en cours': [moment().startOf('month').set('hours', 0).set('minutes', 0), moment().endOf('month').set('hours', 23).set('minutes', 59)],
				'Mois dernier': [moment().subtract(1, 'month').startOf('month').set('hours', 0).set('minutes', 0), moment().subtract(1, 'month').endOf('month').set('hours', 23).set('minutes', 59)]
			},
			startDate: moment().format('YYYY-MM-DD 00:00:00'),
			endDate: moment().format('YYYY-MM-DD 23:59:59'),
		},
		function (start, end) {
			$("#dateTraitement").val('From ' + start.format('DD MMMM YYYY') + " to " + end.format('DD MMMM YYYY'));
			$("[name='datetrait[start]']").val(start.format('YYYY-MM-DD HH:mm:00'));
			$("[name='datetrait[end]']").val(end.format('YYYY-MM-DD HH:mm:59'));
			$("#daterange-parent input[name='daterangepicker_start']").val(start.format("DD/MM/YYYY"));
			$("#daterange-parent input[name='daterangepicker_end']").val(end.format("DD/MM/YYYY"));
		}
	);

	$("#dateTraitement").val(label_daterange_from + ' ' + moment().format('DD MMMM YYYY') + ' ' + label_daterange_to + " " + moment().format('DD MMMM YYYY'));
	$("[name='datetrait[start]']").val(moment().format('YYYY-MM-DD 00:00:00'));
	$("[name='datetrait[end]']").val(moment().format('YYYY-MM-DD 23:59:59'));


	$('#dateTraitement').parent().data('daterangepicker').setStartDate(moment().set('hours', 0).set('minutes', 0));
	$('#dateTraitement').parent().data('daterangepicker').setEndDate(moment().set('hours', 23).set('minutes', 59));

	$("#searchRow").on("change", ".selectchamps", function (e) {
		if ($(e.target).parents(".search_div").parent().find('[name="operator[]"]').length > 0) {
			return false;
		}


		var valueSelected = $(this).val();

		//alert(valueSelected)

		counter++;
		var index = $(e.currentTarget).data("divindex");
		var html = "<div class='col-md-2'><div class='form-group'><select name='operator[]' id='operator" + counter + "' data-opindex='" + counter + "' class='input-sm form-control'><option value='equal'>=</option><option value='contains'>" + option_contains + "</option><option value='prefix'>" + option_begins + "</option><option value='suffix'>" + option_ends + "</option><option value='greater'>>=</option><option value='lesser'><=</option></select></div></div><div class='col-md-4'><div class='form-group'><input name='searchValue[]' data-valindex='" + counter + "' class='form-control' placeholder='" + searched_placeholder + "' type='text'></div></div><div class='col-md-2'><button class='btn btn-sm red rem_input_row' data-rowid='" + (counter - 1) + "' type='button'><i class='fa fa-times'></i></button></div>";
		//spÃ©cifique pour client univers algÃ©rie
		if (valueSelected == "search_Wilaya") {
			var html = "<div class='col-md-2'><div class='form-group'><select name='operator[]' id='operator" + counter + "' data-opindex='" + counter + "' class='input-sm form-control'><option value='equal'>=</option></select></div></div><div class='col-md-4'><div class='form-group'><input name='searchValue[]' data-valindex='" + counter + "' class='form-control' placeholder='" + searched_placeholder + "' list='WILAYA_" + counter + "' type='text'>";
			html += '<datalist id="WILAYA_' + counter + '">';
			html += "<option value='Adrar'>";
			html += "<option value='Chlef'>";
			html += "<option value='Laghouat'>";
			html += "<option value='Oum El Bouaghi'>";
			html += "<option value='Batna'>";
			html += "<option value='BÃ©jaÃ¯a'>";
			html += "<option value='Biskra'>";
			html += "<option value='BÃ©char'>";
			html += "<option value='Blida'>";
			html += "<option value='Bouira'>";
			html += "<option value='Tamanrasset'>";
			html += "<option value='TÃ©bessa'>";
			html += "<option value='Tlemcen'>";
			html += "<option value='Tiaret'>";
			html += "<option value='Tizi Ouzou'>";
			html += "<option value='Alger'>";
			html += "<option value='Djelfa'>";
			html += "<option value='Jijel'>";
			html += "<option value='SÃ©tif'>";
			html += "<option value='SaÃ¯da'>";
			html += "<option value='Skikda'>";
			html += "<option value='Sidi Bel AbbÃ¨s'>";
			html += "<option value='Annaba'>";
			html += "<option value='Guelma'>";
			html += "<option value='Constantine'>";
			html += "<option value='MÃ©dÃ©a'>";
			html += "<option value='Mostaganem'>";
			html += '<option value="M\'Sila">';
			html += "<option value='Mascara'>";
			html += "<option value='Ouargla'>";
			html += "<option value='Oran'>";
			html += "<option value='El Bayadh'>";
			html += "<option value='Illizi'>";
			html += "<option value='Bordj Bou Arreridj'>";
			html += "<option value='BoumerdÃ¨s'>";
			html += "<option value='El Tarf'>";
			html += "<option value='Tindouf'>";
			html += "<option value='Tissemsilt'>";
			html += "<option value='El Oued'>";
			html += "<option value='Khenchela'>";
			html += "<option value='Souk Ahras'>";
			html += "<option value='Tipaza'>";
			html += "<option value='Mila'>";
			html += "<option value='AÃ¯n Defla'>";
			html += "<option value='NaÃ¢ma'>";
			html += "<option value='AÃ¯n TÃ©mouchent'>";
			html += "<option value='GhardaÃ¯a'>";
			html += "<option value='Relizane'>";
			html += '<option value="El M\'Ghair">';
			html += "<option value='El Meniaa'>";
			html += "<option value='Ouled Djellal'>";
			html += "<option value='Bordj Baji Mokhtar'>";
			html += "<option value='BÃ©ni AbbÃ¨s'>";
			html += "<option value='Timimoun'>";
			html += "<option value='Touggourt'>";
			html += "<option value='Djanet'>";
			html += "<option value='In Salah'>";
			html += "<option value='In Guezzam'>";
			html += '</datalist>';
			html += "</div></div><div class='col-md-2'><button class='btn btn-sm red rem_input_row' data-rowid='" + (counter - 1) + "' type='button'><i class='fa fa-times'></i></button></div>";

		}


		$(html).appendTo($(e.target).parents('.search_div').parent()).hide().fadeIn();
		html = '<div class="row" id="search_row_' + counter + '">';
		html += '<div class="col-md-4 search_div" id="search_div' + counter + '" data-divindex="' + counter + '">';
		html += '<div class="form-group">';
		html += '<select class="form-control selectchamps" id="selectChamps' + counter + '" name="selectChamps[]">';
		html += currentChamps;
		html += '</select>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$(html).appendTo("#searchRow").hide().fadeIn();
		$("#operator" + counter).select2();
		$("#selectChamps" + counter).select2();
	});

	$("#CMK_GO_SEARCH").click(function (e) {
		var selectedGroups = $("#selectGroups").multipleSelect("getSelects");
		if (!selectedGroups.length) {
			toastr.error(alert_no_group_selected);
			return false;
		}
		$("#CMK_FORM_ACTION").val('display');
		$("#CMK_FORM_MODEL").val('-1');
		$('#hiddenInputs').empty();
		var post_data = $("#contactForm").serializeArray();
		if (qualifTree) {
			$.each($("#qualifTree").jstree("get_bottom_selected", true), function (k, val) {
				post_data.push({ name: "selectQualifs[" + val.li_attr.num_campagne + "][]", value: val.li_attr.num_qualif });
			});
		}
		renderDt(post_data);
	});


	$('#general_search_tabs').on('show.bs.tab', function (event) {
		var x_active_tab = $(event.target).attr('href');         // active tab
		if (x_active_tab == "#search_tab_1_1") {
			$('#uncheckAllBtn').click();
		}

	});


	$("#CMK_GO_SEARCH_SOFT").click(function (e) {
		var selectedGroups = $("#selectGroups").multipleSelect('checkAll');
		if (!selectedGroups.length) {
			toastr.error(alert_no_group_selected);
			return false;
		}
		$("#CMK_FORM_ACTION").val('display');
		$("#CMK_FORM_MODEL").val(-999);
		$('#hiddenInputs').empty();
		var form_post = $("#contactForm").serializeArray();

		post_data = form_post.filter(function (index, element) {
			return (index.value != "");
		});

		post_data.push({ name: "fieldsOp", value: "OR" });
		post_data.push({ name: "selectChamps[]", value: 'search_nom' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		//post_data.push({name : "selectChamps[]" , value : ''});

		post_data.push({ name: "selectChamps[]", value: 'search_tel1' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		post_data.push({ name: "selectChamps[]", value: 'search_tel2' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		post_data.push({ name: "selectChamps[]", value: 'search_tel3' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		post_data.push({ name: "selectChamps[]", value: 'search_fax1' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		post_data.push({ name: "selectChamps[]", value: 'search_fax2' });
		post_data.push({ name: "operator[]", value: 'contains' });
		post_data.push({ name: "searchValue[]", value: $('#soft_search').val() });
		//post_data.push({name : "selectChamps[]" , value : ''});
		renderDtmodele(post_data, '');
		//renderDt(post_data);
	});

	$("#CMK_GO_SEARCH_WITHOUT").on('click', function (e) {

		var selectedGroups = $("#selectGroups").multipleSelect("getSelects");
		if (!selectedGroups.length) {
			toastr.error(alert_no_group_selected);
			return false;
		}
		$("#CMK_FORM_ACTION").val('display');
		$("#CMK_FORM_MODEL").val('-1');
		$('#hiddenInputs').empty();
		var post_data = $("#contactForm").serializeArray();
		if (qualifTree) {
			$.each($("#qualifTree").jstree("get_bottom_selected", true), function (k, val) {
				post_data.push({ name: "selectQualifs[" + val.li_attr.num_campagne + "][]", value: val.li_attr.num_qualif });
			});
		}
		renderDt(post_data);
	});


	$(document).on('click', '.search-agent-model', function () {
		lastModelUsed = $(this);
		var id = $(this).data('ref');
		var model = $(this).data('model');
		doSerachWithModel(id, model);
	});



	$('.dropdown-tree').on('click', function (e) {
		e.stopPropagation();
	});

	$(".ct_action").click(function () {
		var selectContacts = $("input[name='selectCt[]']").serializeArray();
		var action = $(this).data('action');
		switch (action) {
			case 'disable':
				$("#modal-confirm .modal-body").html("<strong>" + selectContacts.length + "</strong> contact" + (selectContacts.length > 1 ? "s seront dÃ©sactivÃ©s" : " sera dÃ©sactivÃ©") + ". Souhaitez-vous continuer?");
				$("#btn-confirm").data('action', action);
				$("#modal-confirm").modal("show");
				break;

			case 'delete':
				$("#modal-confirm .modal-body").html("<strong>" + selectContacts.length + "</strong> contact" + (selectContacts.length > 1 ? "s seront supprimÃ©s" : " sera supprimÃ©") + ". Souhaitez-vous continuer?");
				$("#btn-confirm").data('action', action);
				$("#modal-confirm").modal("show");
				break;

			case 'qualify':
				if (!$("#selectQualifCt").is(":visible")) {
					$("body").removeClass($.cookie('animations'));
					$("#selectQualifCt").css("display", "inline").addClass("animated fadeIn");
					$.cookie('animations', 'fadeIn');
				} else {
					$("#selectQualifCt").removeClass("animated fadeIn");
					$("#selectQualifCt").fadeOut();
				}
				//$("#selectQualifCt").css("display","inline");
				break;

			case 'modify':
				var groupsMod = [];
				$("input[name='selectCt[]']:checked").each(function (k, v) {
					groupsMod.push($.split($(v).val(), '||')[1]);
				});
				groupsMod = $.unique(groupsMod);
				//console.log(groupsMod);
				if (groupsMod.length) {
					$.ajax({
						type: 'POST',
						url: base_url_ajax + 'gestioncontacts/gestioncontacts/filtreChamps/0',
						data: { 'groups': groupsMod.toString() },
						success: function (response) {
							$("#selectChampsMod").html(response);
							$("#selectChampsMod").multipleSelect('refresh');
						}
					});
				}
				$("#modal-modifyct").modal("show");
				break;
		}
	});
	$("#ct_DT").on("click", ".ct_DT_action .doAction", function (e) {
		e.preventDefault();
		var contact = $(this).data('contact');
		var nom = $(this).data('nom');
		var tel = $(this).data('tel1');
		var group = $(this).data('group');
		var action = $(this).data('action');
		window[action](contact, nom, tel, group);
	});

});



function doSerachWithModel(id, model) {
	var selectedGroups = $("#selectGroups").multipleSelect("getSelects");
	if (!selectedGroups.length) {
		toastr.error(alert_no_group_selected);
		return false;
	}
	$("#CMK_FORM_ACTION").val('display');
	$("#CMK_FORM_MODEL").val('-1');
	$('#hiddenInputs').empty();
	var post_data = $("#contactForm").serializeArray();

	for (var i in post_data) {
		if (post_data[i]['name'] == 'CMK_FORM_MODEL') {
			post_data[i]['value'] = id.toString();
		}
	}
	// post_data.push({name : "CMK_FORM_MODEL", value: id.toString()});
	if (qualifTree) {

		$.each($("#qualifTree").jstree("get_bottom_selected", true), function (k, val) {
			if ($("#qualifAll").attr("checked") || (!$("#qualifArg").attr("checked") && !$("#qualifPos").attr("checked")) || val.state.shown == '1')
				post_data.push({ name: "selectQualifs[" + val.li_attr.num_campagne + "][]", value: val.li_attr.num_qualif });
		});
	}
	renderDtmodele(post_data, model);
}

function renderDtmodele(post_data, model) {
	//$("#resultModelPortlet").show();
	$("#resultPortlet").hide();
	$('#pleaseWaitDialog').modal('show')
	$.ajax({
		type: 'POST',
		url: base_url_ajax + 'gestioncontacts/gestioncontacts/search',
		data: post_data,
        dataType : 'JSON',
		beforeSend: function () {
			$('#pleaseWaitDialog').modal('show');
			$('#progress').show();
		},
		complete: function () {
			$('#progress').hide();

			$('#pleaseWaitDialog').modal('hide')
		},
		success: function (response) {
			var colShow = response.modele;
			var champs = response.listChamps;
			var translation = response.translation;
			var alias = response.alias;
			$("#nbResultModele").text(response.countresult + contacts_found);
			$("#model_name").html(lbl_model + ": " + model);
			var columns = [];

			columns.push({
				"title": tableheader_actions,
				"render": function (data, type, row) {
					var actBtn = '<a class="fa fa-phone-square call_contact" style="cursor:pointer;color:green;" data-toggle="tooltip" data-original-title="' + tableheader_call_title + '" data-makecall="1" data-tel="' + row['CMK_CHAMPS_tel1'] + '" title="' + tableheader_call_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '"></a>';
					actBtn += ' <a class="fa fa-plus-square call_contact" style="cursor:pointer;color:blue;" data-toggle="tooltip" data-original-title="' + tableheader_view_title + '" data-makecall="0" title="' + tableheader_view_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '"></a>';
					actBtn += GenerateQualifGroupe(row, true);
					if (duplictc == '1') {
						actBtn += ' <a class="fa fa-external-link-square copy_contact" data-toggle="tooltip" data-original-title="' + tableheader_dupp_title + '" style="cursor:pointer;color:purple;"   title="' + tableheader_dupp_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '"></a>';
					}
					return actBtn;
				}
			})

			$.each(colShow, function (k, v) {


				v = v.replace('[]', '');
				if (v == 'CMK_S_FIELD_TENTATIVES' || v == 'CMK_S_FIELD_DUREES_ECRANS') return true;
				if (v == 'CMK_S_FIELD_INDICE_CONTACT') {
					columns.push({
						"data": function (row, type, set, meta) {
							return row["CMK_S_FIELD_INDICE_CONTACT"];
						},
						"title": (translation[v] ? translation[v] : (alias[v.replace("CMK_CHAMPS_", "")] ? alias[v.replace("CMK_CHAMPS_", "")] : v.replace("CMK_CHAMPS_", "")))
					});
				} else if (v == 'CMK_S_FIELD_DETAILS_TEL_FAX') {


					columns.push({
						"data": 'CMK_S_FIELD_QUALIF_TEL1',
						"title": 'CMK_S_FIELD_QUALIF_TEL1'
						/*
						 "render" : function(data,type,row) {
						 var actBtn  = '<a class="fa fa-phone-square call_contact" style="cursor:pointer;color:green;" data-toggle="tooltip" data-original-title="'+tableheader_call_title+'" data-makecall="1" data-tel="'+row['CMK_CHAMPS_tel1']+'" title="'+tableheader_call_title+'" data-ref_campagne="'+row['CMK_S_FIELD_NUMCAMPAGNE']+'" data-is_recept="'+is_reception+'" data-num_contact="'+row['CMK_S_FIELD_INDICE_CONTACT']+'" data-ref_fichier="'+row['CMK_S_FIELD_NUMFICHIER']+'" data-name_fichier="'+row['CMK_S_FIELD_NOMFICHIER']+'"></a>';
						 return row['CMK_CHAMPS_tel1'] + actBtn;
						 }
						 */
					})
					columns.push({
						"data": 'CMK_S_FIELD_DATE_QUALIF_TEL1',
						"title": 'CMK_S_FIELD_DATE_QUALIF_TEL1'
					})

					columns.push({
						"data": 'CMK_S_FIELD_QUALIF_TEL2',
						"title": 'CMK_S_FIELD_QUALIF_TEL2'
					})
					columns.push({
						"data": 'CMK_S_FIELD_DATE_QUALIF_TEL2',
						"title": 'CMK_S_FIELD_DATE_QUALIF_TEL2'
					})

					columns.push({
						"data": 'CMK_S_FIELD_QUALIF_TEL3',
						"title": 'CMK_S_FIELD_QUALIF_TEL3'
					})
					columns.push({
						"data": 'CMK_S_FIELD_DATE_QUALIF_TEL3',
						"title": 'CMK_S_FIELD_DATE_QUALIF_TEL3'
					})

					columns.push({
						"data": 'CMK_S_FIELD_QUALIF_FAX1',
						"title": 'CMK_S_FIELD_QUALIF_FAX1'
					})
					columns.push({
						"data": 'CMK_S_FIELD_DATE_QUALIF_FAX1',
						"title": 'CMK_S_FIELD_DATE_QUALIF_FAX1'
					})

					columns.push({
						"data": 'CMK_S_FIELD_QUALIF_FAX2',
						"title": 'CMK_S_FIELD_QUALIF_FAX2'
					})
					columns.push({
						"data": 'CMK_S_FIELD_DATE_QUALIF_FAX2',
						"title": 'CMK_S_FIELD_DATE_QUALIF_FAX2'
					})

				} else if (v == 'tel1') {
					columns.push({
						"title": (translation[v] ? translation[v] : (alias[v.replace("CMK_CHAMPS_", "")] ? alias[v.replace("CMK_CHAMPS_", "")] : v.replace("CMK_CHAMPS_", ""))),
						"render": function (data, type, row) {
							var actBtn = '<a class="fa fa-phone-square appel_manuel_search" style="cursor:pointer;color:green;" data-toggle="tooltip" data-original-title="' + tableheader_call_title + '" data-makecall="1" data-tel="' + row['CMK_CHAMPS_tel1'] + '" title="' + tableheader_call_title + '" data-ref_campagne="' + row['CMK_S_FIELD_NUMCAMPAGNE'] + '" data-is_recept="' + is_reception + '" data-num_contact="' + row['CMK_S_FIELD_INDICE_CONTACT'] + '" data-ref_fichier="' + row['CMK_S_FIELD_NUMFICHIER'] + '" data-name_fichier="' + row['CMK_S_FIELD_NOMFICHIER'] + '"></a>';
							return row.CMK_CHAMPS_tel1 + actBtn;
						}
					})

				} else {
					columns.push({
						"data": (champs.indexOf('CMK_CHAMPS_' + v) != -1 ? 'CMK_CHAMPS_' + v : v),
						"title": (translation[v] ? translation[v] : (alias[v.replace("CMK_CHAMPS_", "")] ? alias[v.replace("CMK_CHAMPS_", "")] : v.replace("CMK_CHAMPS_", "")))
					});
				}
			});
			if (!columns.length) columns = [{ "data": null, "title": no_result }];
            /*else {
                columns.push({
                    "data" : function(row, type, set, meta) {
                        return '<a class="btn btn-xs default " tabindex="0" role="button" data-toggle="popover" data-placement="left"><i class="fa fa-cogs"></i></a>';
                    },
                    "title" : "Actions"
                });
            }*/
			if (tableM) {
				tableM.destroy();
				$('#ct_model_DT').empty();
			}
			tableM = $('#ct_model_DT').DataTable({
				"data": response.rows,
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				"columns": columns,
				"columnDefs": [
					{
						"defaultContent": "",
						"targets": "_all"
					},
				],
				"createdRow": function (row, data, dataIndex) {
					$(row).children('td:last').children('a').attr("data-toggle", "popover");
					$(row).children('td:last').children('a').attr("data-trigger", "focus");
					$(row).children('td:last').children('a').attr("data-placement", "left");
					$(row).children('td:last').children('a').attr("data-container", "body");
					$(row).children('td:last').children('a').attr("data-content", actionButtonModel(data));
				},
				"drawCallback": function (settings) {
					$("#ct_model_DT button[data-toggle='tooltip'], #ct_model_DT a[data-toggle='tooltip']").tooltip();
					$("#ct_model_DT tr td a[data-toggle='popover']").popover({
						html: true,
						trigger: 'manual'
					});
				}
			});
			if (!$("#resultModelPortlet").is(":visible")) $("#resultModelPortlet").slideDown('slow');
			$("html, body").animate({ scrollTop: $('.form-actions').offset().top }, 2000);
		},
		error: function (response) {
		},
	});
}



function actionButtonModel(row) {
	var write_access_edit = restrections.write_access_edit;
	var write_access_recordings = restrections.write_access_recordings;
	var write_access_edit_script = restrections.write_access_edit_script;
	var write_access_ticket = restrections.write_access_ticket;
	var write_access_evaluate = restrections.write_access_evaluate;
	var html = '<div class="ct_DT_action demo-btn">';
	html += '<div class="btn-group" ' + write_access_edit + '><button data-toggle="tooltip" data-original-title="' + tooltip_edit + '" class="doAction btn btn-xs blue" href="#" data-action="edit_details" data-ref_campagne="' + row["num_campagne"] + '"  data-group="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-nom="' + row["CMK_CHAMPS_nom"] + '" data-tel1="' + row["CMK_CHAMPS_tel1"] + '" data-contact="' + row["CMK_S_FIELD_NOMFICHIER"] + "||" + row["CMK_S_FIELD_NUMFICHIER"] + "||" + row["CMK_S_FIELD_INDICE_CONTACT"] + '"><i class="fa fa-fw fa-info"></i></button></div>';
	//html += '<div class="btn-group" '+write_access_recordings+'><button data-toggle="tooltip" data-original-title="'+tooltip_recordings+'" class="doAction btn btn-xs grey" href="#" data-action="void" data-group="'+row["fichier"]+'" data-nom="'+row["nom"]+'" data-tel1="'+row["tel1"]+'" data-contact="'+row["fichier"]+"||"+row["num_fichier"]+"||"+row["num_contact"]+'"><i class="fa fa-fw fa-headphones"></i></button></div>';
	//Modifier Par Aziz
	html += '<div class="btn-group" ' + write_access_edit_script + '><button data-toggle="tooltip" data-original-title="' + tooltip_script + '" class="doActionScripteur btn btn-xs red" href="#" data-action="edit_scripteur" data-last_date_fin="' + row["last_date_fin"] + '" data-num_qualification="' + row['num_qualification'] + '" data-idgroup="' + row["CMK_S_FIELD_NUMFICHIER"] + '" data-campagne="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '" data-numuser="' + row['CMK_S_FIELD_INDICE_USER'] + '"  data-user="' + row["CMK_S_FIELD_INDICE_AGENT"] + '" data-group="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-nom="' + row["CMK_CHAMPS_nom"] + '" data-tel1="' + row["CMK_CHAMPS_tel1"] + '" data-num_contact="' + row["CMK_S_FIELD_INDICE_CONTACT"] + '"><i class="fa fa-fw fa-edit"></i></button></div>';
	//Fin Modif

	//START FICHES
	html += '<div class="btn-group"><button data-toggle="dropdown" data-original-title="' + tooltip_fiche + '" class="btn btn-xs green dropdown-toggle" href="#" data-action="void" data-group="' + row['CMK_S_FIELD_NOMFICHIER'] + '" data-nom="' + row['CMK_CHAMPS_nom'] + '" data-tel1="' + row['CMK_CHAMPS_tel1'] + '" data-contact="' + row['CMK_S_FIELD_NOMFICHIER'] + "||" + row['CMK_S_FIELD_NUMFICHIER'] + "||" + row['CMK_S_FIELD_INDICE_CONTACT'] + '"><i class="fa fa-fw fa-file-text-o"></i></button>';
	html += '<ul class="dropdown-menu pull-right" role="menu">';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-text-o"></i> HTML </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fiches[row["num_campagne"]], function (k, v) {
		html += '<li><a target="_blank" href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpfiche/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/html" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-pdf-o"></i> PDF </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fiches[row["num_campagne"]], function (k, v) {
		html += '<li><a href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpfiche/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/pdf" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-word-o"></i> WORD </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fiches[row["num_campagne"]], function (k, v) {
		html += '<li><a href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpfiche/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/word" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-edit"></i> ' + lbl_btn_modify + '</a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fiches[row["num_campagne"]], function (k, v) {
		html += '<li><a class="edit_fiche_rdv" data-num_qualification="' + row['CMK_S_FIELD_NUM_QUALIFICATION'] + '" data-num_agent="' + row['CMK_S_FIELD_INDICE_AGENT'] + '" data-last_date_fin="' + row["last_date_fin"] + '" data-idfiche="' + v.id + '" data-num_campagne="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '" data-num_fichier="' + row["CMK_S_FIELD_NUMFICHIER"] + '" data-fichier="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-num_contact="' + row["CMK_S_FIELD_INDICE_CONTACT"] + '" data-name_ficherdv="' + v.nom + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';


	html += '</ul></div>';



	html += '<div class="btn-group"><button data-toggle="dropdown" data-original-title="' + tooltip_ficheoff + '" class="btn btn-xs green dropdown-toggle" href="#" data-action="void" data-group="' + row['CMK_S_FIELD_NOMFICHIER'] + '" data-nom="' + row['CMK_champs_nom'] + '" data-tel1="' + row['CMK_champs_tel1'] + '" data-contact="' + row['CMK_S_FIELD_NOMFICHIER'] + "||" + row['CMK_S_FIELD_NUMFICHIER'] + "||" + row['CMK_S_FIELD_INDICE_CONTACT'] + '"><i class="fa fa-fw fa-windows"></i></button>';
	html += '<ul class="dropdown-menu pull-right" role="menu">';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-windows"></i> Office </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fichesOff[row["num_campagne"]], function (k, v) {
		html += '<li><a target="_blank" href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpficheoff/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/office" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-pdf-o"></i> PDF </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fichesOff[row["num_campagne"]], function (k, v) {
		html += '<li><a href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpficheoff/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/pdf" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';


	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-pdf-o"></i> MODEL PDF </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(fichesOff[row["num_campagne"]], function (k, v) {
		html += '<li><a href="' + base_url_ajax + 'gestioncontacts/gestioncontacts/dumpficheoff/' + v.id + '/' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '/' + row["CMK_S_FIELD_NUMFICHIER"] + '/' + row["CMK_S_FIELD_NOMFICHIER"] + '/' + row["CMK_S_FIELD_INDICE_CONTACT"] + '/modelpdf" data-ficheid="' + v.id + '">' + v.nom + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';


	html += '</ul></div>';

	//Debut Envoi Multicanal
	html += '<div class="btn-group"><button data-toggle="dropdown" data-original-title="Envoi Multicanal" class="btn btn-xs green dropdown-toggle" href="#" data-action="void" data-group="' + row['CMK_S_FIELD_NOMFICHIER'] + '" data-nom="' + row['CMK_champs_nom'] + '" data-tel1="' + row['CMK_champs_tel1'] + '" data-contact="' + row['CMK_S_FIELD_NOMFICHIER'] + "||" + row['CMK_S_FIELD_NUMFICHIER'] + "||" + row['CMK_S_FIELD_INDICE_CONTACT'] + '"><i class="fa fa-fw fa-send"></i></button>';
	html += '<ul class="dropdown-menu pull-right" role="menu">';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-windows"></i> Email </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(Confmail[row["num_campagne"]], function (k, v) {
		html += '<li><a class="send_mail" data-ref_mail="' + v.id + '" data-ref_campagne="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '" data-ref_fichier="' + row["CMK_S_FIELD_NUMFICHIER"] + '" data-name_fichier="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-num_contact="' + row["CMK_S_FIELD_INDICE_CONTACT"] + '" data-user="' + row['CMK_S_FIELD_INDICE_USER'] + '" data-date_fin="' + row["last_date_fin"] + '">' + v.libelle + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';

	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-pdf-o"></i> Sms </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(Confsms[row["num_campagne"]], function (k, v) {
		html += '<li><a class="send_sms" data-ref_sms="' + v.id + '" data-ref_campagne="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '" data-ref_fichier="' + row["CMK_S_FIELD_NUMFICHIER"] + '" data-name_fichier="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-num_contact="' + row["CMK_S_FIELD_INDICE_CONTACT"] + '" data-user="' + row['CMK_S_FIELD_INDICE_USER'] + '" data-date_fin="' + row["last_date_fin"] + '">' + v.libelle + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';


	html += '<li class="dropdown-submenu"><a href="javascript:;"><i class="fa fa-file-pdf-o"></i> Fax </a>';
	html += '<ul class="dropdown-menu" role="menu">'
	$.each(Conffax[row["num_campagne"]], function (k, v) {
		html += '<li><a class="send_fax" data-ref_fax="' + v.id + '" data-ref_campagne="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '" data-ref_fichier="' + row["CMK_S_FIELD_NUMFICHIER"] + '" data-name_fichier="' + row["CMK_S_FIELD_NOMFICHIER"] + '" data-num_contact="' + row["CMK_S_FIELD_INDICE_CONTACT"] + '" data-user="' + row['CMK_S_FIELD_INDICE_USER'] + '" data-date_fin="' + row["last_date_fin"] + '">' + v.libelle + '</a></li>';
	});
	html += '</ul>';
	html += '</li>';


	html += '</ul></div>';
	//Fin Envoi Multicanal

	//END FICHES
	if (row["num_agent"]) {
		html += '<div class="btn-group" ' + write_access_evaluate + '>';
		html += '<button data-original-title="' + tooltip_eval + '" class="btn btn-xs blue-chambray dropdown-toggle" data-toggle="dropdown" type="button">';
		html += '<i class="fa fa-fw fa-trophy"></i>';
		html += '</button>';
		html += '<ul class="dropdown-menu pull-right" role="menu">';
		if (grids.length > 0) {
			$.each(grids, function (k, v) {
				html += '<li>';
				html += '<a href="javascript:;" class="eval_link">' + v.titre + '</a>';
				html += '<form method="POST" action="' + base_url_ajax + 'evalgrids/evalgrids/fillgrid/' + v.num_grille + '/' + row["CMK_S_FIELD_INDICE_AGENT"] + '">';
				html += '<input type="hidden" name="num_obs_c" value="' + row["last_num_observation_contact"] + '">';
				html += '<input type="hidden" name="group" value="' + row["CMK_S_FIELD_NOMFICHIER"] + '">';
				html += '<input type="hidden" name="num_group" value="' + row["CMK_S_FIELD_NUMFICHIER"] + '">';
				html += '<input type="hidden" name="num_campagne" value="' + row["CMK_S_FIELD_NUMCAMPAGNE"] + '">';
				html += '</form>';
				html += '</li>';
			});
		} else {
			html += '<li>';
			html += '<a href="' + base_url_ajax + 'evalgrids/evalgrids/newgrid">' + lbl_no_grid + '</a>';
			html += '</li>';
		}
		html += '</ul></div>';
	}


	html += '</div>';
	return html;
}
