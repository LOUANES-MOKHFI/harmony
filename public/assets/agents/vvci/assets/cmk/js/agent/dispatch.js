$.fn.dataTableExt.sErrMode = 'throw';
$(document).ready(function() {
    var inboxDT = $("#dispatchDT").DataTable({
        ajax : {
            global : false,
            type : 'POST',
            url : base_url_ajax+'agent/inbox/getNonDispatched',
            data : { 'campagnes' : $("#list_campagne").val().split(',') }
        },
        columnDefs : [
            {
                render : function(data,type,row) {
                    var html  = '<div class="btn-group">';
                    html += '<button class="btn btn-xs blue show_mail" data-campagne="'+row[9]+'" data-type="'+row[0]+'" data-id="'+row[6]+'" data-inbound="'+row[8]+'" data-toggle="tooltip" data-original-title="Afficher"><i class="fa fa-eye"></i></button>';
                    html += '<button class="btn btn-xs green dispatch_mail" data-campagne="'+row[9]+'" data-type="'+row[0]+'" data-id="'+row[6]+'" data-inbound="'+row[8]+'" data-toggle="tooltip" data-original-title="Dispatcher"><i class="fa fa-arrows-h"></i></button>';
                    html += '<button class="btn btn-xs red trash_mail" data-campagne="'+row[9]+'" data-type="'+row[0]+'" data-id="'+row[6]+'" data-inbound="'+row[8]+'" data-toggle="tooltip" data-original-title="Corbeille"><i class="fa fa-trash"></i></button>';
                    html += '</div>';
                    return html;
                },
                targets : 5
            },
            {
                render : function(data,type,row) {
                    if (type == 'display' || type == 'filter') {
                        if (data == '3') {
                            return '<img src="'+base_url_ajax+'assets/cmk/images/sms.png" width="20" height="20" /> <strong>SMS</strong>';
                        } else if (data == '2') {
                            return data;
                        } else if (data == '1') {
                            return '<img src="'+base_url_ajax+'assets/cmk/images/envelope.png"  width="20" height="20" /> <strong>MAIL</strong> '+(row[10] != '' ? '('+row[10]+')' : '');
                        } else {
                            return data;
                        }
                    }
                    return data;
                },
                targets : 0
            },
            {
                visible : false,
                targets : [6,7,8,9,10,11]
            }
        ],
        order : [[1,'desc']],
        "rowCallback": function( row, data, index ) {
            if (data[7] == 0) $(row).addClass("bold");
            $(row).css('cursor','pointer');
        },
        drawCallback : function() {
            $("#dispatchDT [data-toggle='tooltip']").tooltip();
        }
    });
    if (parseInt(nbInbox) > 0) {
        setInterval(function () {
            inboxDT.ajax.reload(null, false);
        }, 15000);
    } else {
        $("a[data-target='#modal-dispatch']").hide();
    }

    $("#dispatchDT").on("click",".trash_mail",function() {
        var id = $(this).data('id');
        var inbound = $(this).data('inbound');
        var itemtype = $(this).data('type');
        bootbox.confirm("ÃŠtes-vous sÃ»rs?", function(result) {
            if (result) {
                $.ajax({
                    global :false,
                    type : 'POST',
                    url : base_url_ajax+'agent/inbox/trashinbound',
                    data : { id : inbound },
                    success : function(response) {
                        inboxDT.ajax.reload();
                    }
                })
            }
        });
    });

    $("#dispatchDT").on("click",".show_mail,tbody tr",function(e) {
        if ($(e.target).hasClass('dispatch_mail') || $(e.target).hasClass('fa-arrows-h') || $(e.target).hasClass('trash_mail') || $(e.target).hasClass('fa-trash')) return false;
        if ($(e.target).hasClass('show_mail')) var clickTarget = $(this);
        else var clickTarget = $(this).find(".show_mail");


        var id = clickTarget.data('id');
        var inbound = clickTarget.data('inbound');
        var itemtype = clickTarget.data('type');
        var mail_campagne = clickTarget.data('campagne');

        if (itemtype == '1') {
            $("#mail_dispatch").data('id', id);
            $("#mail_trash").data('id', id);
            $("#mail_trash").data('inbound', inbound);
            $("#mail_dispatch").data('campagne',mail_campagne);
            $("#mail_dispatch").show();
            $("#mail_trash").show();
            $("#mail_save").hide();
            $("#mail_reply").hide();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getMail',
                data: {id: id, 'source': 'dispatch', 'inbound': inbound},
                success: function (response) {
                    $("#mail_date").text(response.mail.DATE_RECEIVED);
                    $("#mail_from_mail").text(response.mail.FROM_NAME);
                    $("#mail_to").text(response.mail.TO + ' ' + response.mail.CC);
                    $("#mail_subject").text(lbl_mail_object + ' ' + response.mail.SUBJECT);
                    $("#mail_reply_div").hide();

                    var html = '';
                    $.each(response.attach, function (k, v) {
                        response.mail.BODY = response.mail.BODY.split('cid:'+v.CID).join(v.PATH.replace(fcpath,base_url_ajax));
                        html += '<div class="margin-bottom-25">';
                        html += '<div>';
                        html += '<strong><a target="_blank" href="'+v.PATH.replace(fcpath,base_url_ajax)+'">' + v.FILENAME + '</a></strong>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $("#mail_attach").html(html);
                    $("#mail_body").html(response.mail.BODY.split("\n").join("<br />"));
                    inboxDT.ajax.reload(null,false);
                    $("#modal-view").modal("show");
                }
            })
        } else if (itemtype == '3' ) {
            $("#sms_dispatch").data('id', id);
            $("#sms_dispatch").show();
            $("#sms_trash").data('id', id);
            $("#sms_trash").data('inbound', inbound);
            $("#sms_trash").show();
            $("#sms_save").hide();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getSms',
                data: {id: id, 'source': 'dispatch', 'inbound': inbound},
                success: function (response) {
                    $("#sms_date").text(response.date_received);
                    $("#sms_from").text(response.from);
                    $("#sms_body").html(response.message);
                    inboxDT.ajax.reload(null,false);
                    $("#modal-view-sms").modal("show");
                }
            })

        }
    });

    $("#ctgroupjob").select2();

    $("#dispatchDT").on("click",".dispatch_mail",function() {
        var id = $(this).data('id');
        var campJob = $(this).data('campagne');
        $("#item_type").val('MAIL_INBOUND');
        $("#item_id").val(id);
        $("#bindjob_id").val('');
        $("#bind_campagne").val($(this).data('campagne'));
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
    });

    var custom = new Bloodhound({
        datumTokenizer: function(d) {
            return d.tokens;
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: base_url_ajax + 'agent/inbox/findJob?item=%QUERY',
            wildcard: '%QUERY'
        }
    });

    custom.initialize();
    $('#findjob')
        .typeahead(
            null, {
                name: 'datypeahead_search_module',
                displayKey: 'description_module',
                hint: true,
                highlight: true,
                limit: 600,
                source: custom.ttAdapter(),
                templates: {
                    suggestion: Handlebars
                        .compile([

                            '<div class="media">',
                            '<div class="media-body">',
                            '<h4 class="media-heading">{{reference}}</h4>',
                            '<h5><i class="fa fa-user"></i> {{nom}} <i class="fa fa-phone"></i> {{tel1}}</h5>',
                            '</div>', '</div>',

                        ].join(''))
                }
            });

    $('#findjob').bind(
        'typeahead:selected',
        function(ev, suggestion) {
            $("#findjob").typeahead('val',suggestion.reference);
            $("#bindjob_id").val(suggestion.id);
            $("#labelJob").parent().show();
            $("#labelJob").html('<strong>Job sÃ©lectionnÃ© : </strong>'+suggestion.reference+'<br><strong>Date d\'ouverture :</strong> '+moment(suggestion.created).format('DD/MM/YYYY HH:mm')+'<br><i class="fa fa-user"></i> '+suggestion.nom+' <i class="fa fa-phone"></i> '+suggestion.tel1)
        });


    //RECHERCHE CONTACT JOB
    var customct = new Bloodhound({
        datumTokenizer: function(d) {
            return d.tokens;
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: base_url_ajax + 'agent/inbox/findCtJob?item=%QUERY',
            wildcard: '%QUERY'
        }
    });

    custom.initialize();
    $('#findctjob')
        .typeahead(
            null, {
                name: 'datypeahead_search_module',
                displayKey: 'description_module',
                hint: true,
                highlight: true,
                limit: 600,
                source: customct.ttAdapter(),
                templates: {
                    suggestion: Handlebars
                        .compile([

                            '<div class="media">',
                            '<div class="media-body">',
                            '<h4 class="media-heading"><i class="fa fa-user"></i> {{nom}}</h4>',
                            '<h5><i class="fa fa-folder"></i> {{CMK_NOM_FICHIER}} <i class="fa fa-phone"></i> {{tel1}}</h5>',
                            '</div>', '</div>',

                        ].join(''))
                }
            });

    $('#findctjob').bind(
        'typeahead:selected',
        function(ev, suggestion) {
            $("#findctjob").typeahead('val',suggestion.nom);
            $("#bindcampnum").val(suggestion.CMK_NUM_CAMPAGNE);
            $("#bindgroupnum").val(suggestion.CMK_NUM_GROUPE);
            $("#bindctnum").val(suggestion.num_contact);
            $("#labelCtJob").parent().show();
            $("#labelCtJob").html('<strong>Contact sÃ©lectionnÃ© : </strong><br><i class="fa fa-folder"></i> '+suggestion.CMK_NOM_FICHIER+'<br><i class="fa fa-user"></i> '+suggestion.nom+' <i class="fa fa-phone"></i> '+suggestion.tel1)
        });

    $("#assignMailBtn").click(function() {
        if (!$("#create_job").attr("checked") && $("#bindjob_id").val() == '') {
            bootbox.alert("Veuillez sÃ©lectionner une tÃ¢che");
            return false;
        }
        var form_data = $("#assignmailform").serializeArray();
        $.ajax({
            type : 'POST',
            url : base_url_ajax+'agent/inbox/assigneItemToJob',
            data : form_data,
            success : function() {
                //inboxDT.ajax.reload();
                $("#modal-assign").modal("hide");
                $("#modal-view").modal("hide");
            }
        })
    })

    $("#create_job").change(function() {
        if ($(this).attr("checked")) {
            $("#jobDiv").slideUp(function() {
                $("#newJobDiv").slideDown();
            });
        } else {
            $("#newJobDiv").slideUp(function() {
                $("#jobDiv").slideDown();
            });
        }
    })

    $("#create_contact_job").change(function() {
        if ($(this).attr("checked")) {
            $("#findContactDiv").slideUp(function() {
                $("#newContactDiv").slideDown();
            });
        } else {
            $("#findContactDiv").slideDown(function() {
                $("#newContactDiv").slideUp();
            });
        }
    })
});