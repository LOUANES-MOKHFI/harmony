var activeChat;
function triggerDispatchChat (data) {
    $(document).trigger('chat-dispatch',data);
}

function triggerTimelineContact (data) {
    $(document).trigger('chat-timeline',data);
}

$(document).on("chat-timeline",function(e,data) {
    var id = data.talkId;
    $.ajax({
        type : 'post',
        url : base_url_ajax+'chatagent/configlivechat/getTimelineTalk',
        data : { talk_id : id },
        dataType : 'json',
        success : function(response) {
            $("#chatTimeLineItemsContainer").html(contact_timeline(response.timeline,response.enreg_path));
            $("#chatTimeLineItemsContainer .jp-jplayer").each(function(k,v) {
                var filename = $(this).data('filename');
                var fileduration = $(this).data('fileduration');
                var selector = $(this).data('selector');
                if (filename == '') return false;
                $(this).jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            title: "",
                            mp3: response.enreg_path+filename,
                            duration : parseInt(fileduration)
                        });
                    },
                    swfPath: "../../dist/jplayer",
                    cssSelectorAncestor: selector,
                    supplied: "mp3",
                    wmode: "window",
                    globalVolume: true,
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true
                });
            });
            $("#modal-live-chat-timeline").modal("show");
        }
    })
});

$(document).on("chat-dispatch",function(e,data) {
    var id = data.talkId;
    var campJob = 0;
    $("#item_type").val('LIVE_CHAT');
    $("#item_id").val(id+'___'+activeChat);
    $("#bindjob_id").val('');
    $("#bind_campagne").val('');
    $("#findjob").typeahead('val','');
    $("#labelJob").parent().hide();
    $("#labelCtJob").parent().hide();
    $("#create_job").attr("checked",false).trigger("change");
    $("#create_contact_job").attr("checked",false).trigger("change");
    $.uniform.update();
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
})


$(function() {
    $("#modal-live-chat").on('show.bs.modal',function() {
        //$("#chat-admin-iframe").attr("src",$("#chat-admin-iframe").attr("src"));
        $("#chat-admin-iframe").attr("src",window.sessionStorage.getItem('cmk_chat_url'));
    });

    $("#modal-live-chat .chatPowerOff").click(function() {
        $("#modal-live-chat").modal("hide");
        $("#chat-admin-iframe").attr("src",'');
    });


    var $content, $modal, $apnData, $modalCon;

    $content = $(".min");



    $(".modalMinimize").on("click", function() {

        $modalCon = $(this).closest(".mymodal").attr("id");

        $apnData = $(this).closest(".mymodal");

        $modal = "#" + $modalCon;

        $(".modal-backdrop").addClass("display-none");

        $($modal).toggleClass("min");

        if ($($modal).hasClass("min")) {
            $(".minmaxCon").append($apnData);
            $(this).addClass('maximize');
            $(this).find("i").toggleClass('fa-minus').toggleClass('fa-clone');

        } else {
            $(".container").append($apnData);
            $(this).removeClass('maximize');
            $(this).find("i").toggleClass('fa-clone').toggleClass('fa-minus');

        };

    });

    $("button[data-dismiss='modal']").click(function() {

        $(this).closest(".mymodal").removeClass("min");

        $(".container").removeClass($apnData);

        $(this).next('.modalMinimize').find("i").removeClass('fa fa-clone').addClass('fa fa-minus');

    });
	
	LoadConfigs();


});


// function LoadConfigs() {
// 	var dd = 0;
// 	ref_campagne = (ref_campagne==-1) ? '' : ref_campagne;
// 	$('#li_livechat').hide();
// 	var tableConfig = $('#TableConfigs').dataTable({
// 		"aoColumnDefs": [{
// 			'bSortable': false,
// 			'aTargets': [0]
// 		}],
// 		"bDestroy": true,
// 		"width" : "100%",
// 		"aaSorting": [ [1,'asc'], [2,'asc'] ],
//
// 		"sAjaxSource": base_url_ajax +"agent/agent/GetListLivechat?ref_grp=" + cmk_grp_com,
// 		"bProcessing": true,
//
// 		"fnServerParams": function(aoData) {
//
// 		},
// 		"fnServerData": function(sSource, aoData, fnCallback) {
// 			$.getJSON(sSource, aoData, function(json) {
// 				fnCallback(json);
//
// 			});
// 		},
// 		"fnDrawCallback": function(data) {
// 			console.log(data.aoData);
// 			dd = data.aoData;
// 			if ( ! dd.length ) {
// 				//alert( 'Empty table' );
// 				$('#li_livechat_menu').hide();
//
// 			}else{
// 				$('#li_livechat_menu').show();
//
// 			}
//
// 			$("[data-toggle='tooltip']").tooltip();
// 		},
//
// 	});
//
//
//
// }

function LoadConfigs() {
    var dd = 0;
    $.ajax({
    	type : 'post',
		dataType : 'json',
        url : base_url_ajax +"agent/agent/GetListLivechat?ref_grp=" + cmk_grp_com,
		success : function(response) {
    		if (response.result && response.result == '1') {
    			$('#li_livechat_menu').show();
    			window.sessionStorage.setItem('cmk_chat_url',base_url_ajax+"livechat/php/app.php?admin&d="+response.d);
                //$("#chat-admin-iframe").attr("src",);
                activeChat = response.reflc;
            }
    		else $('#li_livechat_menu').hide();
		}
	})



}




function showLiveChat (id) {
	


	$.ajax({
		type : "POST",
		url : "agent/showLiveChat",
		data : "livechatid=" + id,
		success : function(data_html) {
			
			$("#livechatcontent").html(data_html);
			
			/*$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/jquery.ui.touch-punch.min.js");
			$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/jquery.nicescroll.js");
			$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/widget-pager.js");
			$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/application.js");
			$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/admin_login.js");
			$.getScript(base_url_cmk + "/vendors/flat-visual-chat/assets/js/admin.js");*/
			/*'../vendors/flat-visual-chat/assets/js/bootstrap-select',
			'../vendors/flat-visual-chat/assets/js/flatui-checkbox',
			'../vendors/flat-visual-chat/assets/js/flatui-radio',
			'../vendors/flat-visual-chat/assets/js/jquery.tagsinput',
			'../vendors/flat-visual-chat/assets/js/jquery.placeholder',
			'../vendors/flat-visual-chat/assets/js/jquery.nicescroll',
			'../vendors/flat-visual-chat/assets/js/jquery.tablesorter.min',
			'../vendors/flat-visual-chat/assets/js/jquery.tablesorter.widgets.min',
			'../vendors/flat-visual-chat/assets/js/widget-pager',
			'../vendors/flat-visual-chat/assets/js/colpick',
			'../vendors/flat-visual-chat/assets/js/jquery.fileupload',
			'../vendors/flat-visual-chat/assets/js/application',
			'../vendors/flat-visual-chat/assets/js/admin_login',
			'../vendors/flat-visual-chat/assets/js/admin'*/
			

		}

	});

	
}