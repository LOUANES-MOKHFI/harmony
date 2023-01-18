var source_basedeconnaissance = $("#entry-template-basedeconnaissance").html();
var template_content_basedeconnaissance = Handlebars.compile(source_basedeconnaissance);
var query_search_basedeconnaissance = "";



$('.show_basedeconnaissance_result').click(function(){
	loadbasedeconnaissance();
});


$( "#query_search_basedeconnaissance" ).keypress(function (e) {
	if (e.which == 13) {
		loadbasedeconnaissance();
		return false;    //<---- Add this line
	}
});

function loadbasedeconnaissance(){
	$('.basedeconnaissance-container').html('');
	query_search_basedeconnaissance  = $('#query_search_basedeconnaissance').val();
	query_search_basedeconnaissance = (query_search_basedeconnaissance) ? query_search_basedeconnaissance : -1;
	$.ajax({
		type : "POST",
		url : "agent/Getbasedeconnaissance/"+query_search_basedeconnaissance,
		dataType : "json",
		global : false,
		async : false,
		success : function(data_return) {
			//console.log('Get basedeconnaissance data '+data_return)









			//if(data_return=="0" || data_return.length==0 || bdcon_read==0){
			if(bdcon_read==0){
				$('#li_basedeconnaissance').addClass('hidden');

			}else{
				$('#li_basedeconnaissance').removeClass('hidden');

				$.each(data_return, function(index, value) {
					var html = template_content_basedeconnaissance(value);
					$('.basedeconnaissance-container').append(html);
				});
			}


			if(bdcon_add==1)
				$('.process_bdcon_add').removeClass('hidden');
			else
				$('.process_bdcon_add').addClass('hidden');


			if(bdcon_edit==1)
				$('.process_bdcon_edit').removeClass('hidden');
			else
				$('.process_bdcon_edit').addClass('hidden');

			if(bdcon_delete=="1")
				$('.delete_bdcon').removeClass('hidden');
			else
				$('.delete_bdcon').addClass('hidden');

		}
	});


	if(query_search_basedeconnaissance!=-1) {
		var dataAgent = {
			logAction: "recherche_base_connaissance",
			logBC_query: query_search_basedeconnaissance,
		};
		agentLogAction(dataAgent);
	}
}



$(document).on('click','.delete_bdcon',function() {
	var id = $(this).data('id');

	bootbox
		.dialog({
			message: '<p>'+lbl_model_basedeconnaissance_delete_message+'</p>',
			title: '<h4 class="box-heading">'+lbl_model_basedeconnaissance_delete_title+'</h4>',
			buttons: {
				main: {
					label: label_daterange_cancel,
					className: "btn btn-default btn-outlined btn-square",
					callback: function() {

					}
				},
				success: {
					label: label_daterange_apply,
					className: "btn blue",
					callback: function() {

						$.ajax({
							type : 'post',
							url : base_url_ajax+'basedeconnaissance/basedeconnaissance/process',
							data : {
								id : id,
								oper : 'delete'
							},
							success : function(response) {
								loadbasedeconnaissance();
							}
						});


					}
				}
			}
		});

	return false;

});


$(document).on('click','.process_bdcon_add',function() {
	$('.process_bdcon').data('oper','add');
	$('.process_bdcon').data('id','');

	resetForm_bdcon($('#Formbasedeconnaissance'));
	$('#ModalFormbasedeconnaissance').modal('show');



});
$(document).on('click','.process_bdcon_edit',function() {
	$('.process_bdcon').data('oper','edit');


	var id = $(this).data('id');
	$('.process_bdcon').data('id',id);

	$.ajax({
		url : base_url_ajax+'basedeconnaissance/basedeconnaissance/listing',
		data: {
			id : id
		},
		type: "post",
		dataType: "json",
		complete: function (response) {
			json  = JSON.parse(response.responseText);
			populateForm_bdcon($('#Formbasedeconnaissance'),json.data[0])
			CKEDITOR.instances['reponse_bdcon'].setData(json.data[0].reponse);
		}
	});

	$('#ModalFormbasedeconnaissance').modal('show');

});



$(document).on('click','.process_bdcon',function() {


	var id = $(this).data('id');
	var oper = $(this).data('oper');
	var reponse_bdcon = CKEDITOR.instances['reponse_bdcon'].getData();


	if($('#libelle_bdcon').val()==""){
		show_msg_log(lbl_model_basedeconnaissance_libelle_required,'warning')
		return false;
	}
	if($('#question_bdcon').val()==""){
		show_msg_log(lbl_model_basedeconnaissance_question_required,'warning')
		return false;
	}

	if($('#theme_bdcons').val()==""){
		show_msg_log(lbl_model_basedeconnaissance_themes_required,'warning')
		return false;
	}


	if(reponse_bdcon==""){
		show_msg_log(lbl_model_basedeconnaissance_reponse_required,'warning')
		return false;
	}
	if($('#mots_cles_bdcon').val()==""){
		show_msg_log(lbl_model_basedeconnaissance_mots_cles_required,'warning')
		return false;
	}

	porcess_bdcon(id,oper)



});




function porcess_bdcon(id,oper){
	var reponse_bdcon = CKEDITOR.instances['reponse_bdcon'].getData();
	$.ajax({
		url : base_url_ajax+'basedeconnaissance/basedeconnaissance/process',
		data: {
			id : id,
			oper : oper,
			libelle : $('#libelle_bdcon').val(),
			question : $('#question_bdcon').val(),
			reponse : reponse_bdcon,
			themes : $('#themes_bdcon').val(),
			mots_cles : $('#mots_cles_bdcon').val(),
			etat : 1
		},
		type: "post",
		complete: function (response) {
			$('#ModalFormbasedeconnaissance').modal('hide')
			loadbasedeconnaissance();

		}
	});
}





function populateForm_bdcon($form, data) {
	$.each(data, function(key, value) {

		var $ctrl = $form.find('[name=' + key + '_bdcon]');
		if ($ctrl.is('select')) {

			$('option', $ctrl).each(function() {
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


function resetForm_bdcon($form) {

	$form.find('input:text, input:password, input:file, select, textarea').val(
		'');

	$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	$('input,textarea').removeClass('edited');
	CKEDITOR.instances['reponse_bdcon'].setData('')
	$.uniform.update();

}



var reponse_obj = CKEDITOR.replace('reponse_bdcon', {
	removeDialogTabs : 'image:Upload',
	disableAutoInline : true,
	fillEmptyBlocks : false,
	ignoreEmptyParagraph : true,
	htmlEncodeOutput : true,
	entities : false,
	allowedContent : true,
	extraPlugins: 'cmkdefault,cmkinputecran,cmkdefine',
	baseFloatZIndex : 9999999,
	toolbarGroups : [ {
		name : 'clipboard',
		groups : [ 'clipboard', 'undo' ]
	}, {
		name : 'editing',
		groups : [ 'find', 'selection' ]
	}, {
		name : 'links'
	}, {
		name : 'insert'
	}, {
		name : 'document',
		groups : [ 'mode' ]
	}, '/', {
		name : 'basicstyles',
		groups : [ 'basicstyles', 'cleanup' ]
	}, {
		name : 'paragraph',
		groups : [ 'list', 'indent' ]
	}, '/', {
		name : 'styles',
		groups : [ 'Styles', 'Format', 'Font', 'FontSize', 'forms' ]
	}, {
		name : 'colors'
	} ],
	removePlugins : 'iframe,flash,print,preview,save'
// removeButtons: 'Anchor,Font,Strike,Subscript,Superscript'
});
if(reponse_obj!=null){

	reponse_obj.on('instanceReady', function(ev) {
		// Output self-closing tags the HTML4 way, like <br>.
		this.dataProcessor.writer.selfClosingEnd = '>';

		// Use line breaks for block elements, tables, and lists.
		var dtd = CKEDITOR.dtd;
		for ( var e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block,
			dtd.$listItem, dtd.$tableContent)) {
			this.dataProcessor.writer.setRules(e, {
				indent : true,
				breakBeforeOpen : true,
				breakAfterOpen : true,
				breakBeforeClose : true,
				breakAfterClose : true
			});
		}

		ev.editor.on('paste', function(evt) {
			evt.data.dataValue = evt.data.dataValue.replace(/&nbsp;/g, '');
			evt.data.dataValue = evt.data.dataValue.replace(/<p><\/p>/g, '');
			console.log(evt.data.dataValue);
		}, null, null, 9);
		// Start in source mode.

	});
}