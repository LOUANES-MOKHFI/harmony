var ydonnees = [];
var yData = [];
var oTableAddonsCmk = "";
var fncallbackSodexo = "";

function show_addons_externe(table_name,param,query,dadd,dedit,ddelete){



    if(dadd=="1"){
        $('.add_row_addons').show();
    }else {
        $('.add_row_addons').hide();

    }
    var params_querys = param.split('___');
    var vals_querys = query.split('___');

    $('.liste_cmk_addons').attr('data-name',table_name);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: base_url_ajax + 'listexterne/listexterne/getcolname',
        data: {
            table: table_name,
        },
        success: function (field_name) {
            datasss = field_name.columns;
            console.log(datasss.length);

            var obj = {};
            $.each(params_querys, function(index, value) {

                valeur_query = vals_querys[index];

                obj[value] = valeur_query;
            });
            obj['table'] = table_name;

            if(modesc=='prod'){
                obj['num_user'] = user ;
                obj['ref_campagne'] = ref_campagne  ;
                obj['name_fichier'] = name_fichier  ;
                obj['num_contact'] = num_contact;

            }
            console.log(obj,'OBJAAAAAA');
            if (oTableAddonsCmk != "") {
                //oTableAddonsCmk.destroy();
                $('.liste_cmk_addons[data-name="'+table_name+'"]').empty();
                //oTableAddonsCmk.clear().draw();
            }


            oTableAddonsCmk = $('.liste_cmk_addons[data-name="'+table_name+'"]').dataTable({
                responsive: false,
                'ordering': true,
                'destroy' : true,
                'searching': true,
                'serverSide': true,
                'pageLength': 1000,
                'lengthMenu': [[100, 500, 1000, 5000, 10000], [100, 500, "1 000", "5 000", "10 000"]],
                'scrollY': 200,
                "scrollX": true,
                'ajax': {
                    url: base_url_ajax + 'listexterne/listexterne/getDonnees',

                    "type": "POST",
                    data: obj,
                },
                'columns': field_name.columns,
                "columnDefs": [{
                    "targets": datasss.length - 1,
                    "render": function(data, type, full, meta) {
                        return actionButtonDetail(full,table_name,dedit,ddelete);
                    },
                }]

            });


            var p = $('.liste_cmk_addons[data-name="'+table_name+'"]');
            var offset = p.offset();

            $('html,body').animate({
                scrollTop: offset.top
            }, 'slow');



        }

    });




}


function actionButtonDetail(row,table_name,dedit,ddelete){
    var html = "";
    html += (ddelete=="1") ? '<a data-toggle="tooltip" data-placement="top" data-original-title="Supprimer" data-id="'+row.cmk_id+'" data-table="'+table_name+'"  class="btn red btn-xs process_delete_addons"><i class="fa fa-trash"></i></a>' : ''
    html += (dedit=="1") ? '<a data-toggle="tooltip" data-placement="top" data-original-title="Modifier" data-id="'+row.cmk_id+'" data-table="'+table_name+'"  class="btn yellow btn-xs process_edit_addons"><i class="fa fa-pencil"></i></a>' : ''
    return html;
}





var nEditing = null;
var nNew = false;



$(document).on('click', '.cancel', function(e) {
    e.preventDefault();
    if (nNew) {
        oTableAddonsCmk.fnDeleteRow(nEditing);
        nEditing = null;
        nNew = false;
    } else {
        restoreRow(oTableAddonsCmk, nEditing);
        nEditing = null;
    }
});

$(document).on('click', '.process_edit_addons', function(e) {
    e.preventDefault();

    tableExterne = $(this).data('table');

    var nRow = $(this).parents('tr')[0];
    if (nEditing !== null && nEditing != nRow) {
        restoreRow(oTableAddonsCmk, nEditing);
        editRow(oTableAddonsCmk, nRow,tableExterne);
        nEditing = nRow;
    } else if (nEditing == nRow ) {
        saveRow(oTableAddonsCmk, nEditing,tableExterne);
        yIdLigne = $(this).parent().siblings(":first").text();
        nEditing = null;
    } else {
        editRow(oTableAddonsCmk, nRow,tableExterne);
        nEditing = nRow;
    }
});

$(document).on('click', '.process_delete_addons', function(e) {
    e.preventDefault();

    tableExterne = $(this).data('table');

    if (confirm("Voulez-vous vraiment supprimer cette ligne ?") == false) {
        return;
    }

    var nRow = $(this).parents('tr')[0];
    oTableAddonsCmk.fnDeleteRow(nRow);
    var yid = $(this).parent().siblings(":first").text();
    jQuery.ajax({
        type: 'POST',
        url: base_url_ajax + 'listexterne/listexterne/deleteRow',
        data: {
            idcmk: yid,
            table : tableExterne
        },
        dataType: "json",
        success: function(data) {

            oTableAddonsCmk.fnDraw();
        },
        error: function() {
            alert("Erreur lors de la suppression");
        }
    });
});

function restoreRow(oTableAddonsCmk, nRow) {
    oTableAddonsCmk.fnDraw();
}


function saveRow(oTableAddonsCmk, nRow,tableExterne) {
    //alert('SaveRow')
    var aData = oTableAddonsCmk.fnGetData(nRow);

    var jqInputs = $('input', nRow);
    jQuery.ajax({
        type: 'POST',
        url: base_url_ajax + 'listexterne/listexterne/show_fields',
        data :{
            table : tableExterne
        },
        dataType: 'json',
        success: function(dataColumn) {
            var y = 2;
            var donnees = {};
            //alert('updateDonnees')

            $.each(dataColumn, function( i, item ) {

                y++;
                oTableAddonsCmk.fnUpdate(jqInputs[i].value, nRow, i + 2, false);
                y++;
                var obj = {};
                obj[item.field] = jqInputs[i].value;
                obj['table'] = tableExterne;
                obj['cmk_id'] = yIdLigne;
                jQuery.ajax({
                    type: 'POST',
                    url: base_url_ajax + 'listexterne/listexterne/updateDonnees',
                    data: obj,
                    dataType: "json",
                    beforeSend: function() {
                        console.log(obj);
                    },
                    success: function(data) {
                        console.log(data);
                    },
                    error: function() {
                        console.log("bad");
                    }
                });

            });





            //oTableAddonsCmk.fnUpdate('<a href="javascript:;" class="edit btn default btn-xs blue"><i class="fa fa-edit">', nRow, y, false);
            //oTableAddonsCmk.fnUpdate('<a class=" delete btn default btn-xs black" href=""><i class="fa fa-trash-o">  ', nRow, y + 1, false);
            oTableAddonsCmk.fnDraw();
        },
        error: function() {
            console.log("erreur");
        }
    });

}

var yIdLigne = "";

function editRow(oTableAddonsCmk, nRow,tableExterne) {

    //alert('editRow')

    var aData = oTableAddonsCmk.fnGetData(nRow);
    console.log(aData);
    var jqTds = $('>td', nRow);

    jQuery.ajax({
        type: 'POST',
        url: base_url_ajax + 'listexterne/listexterne/show_fields',
        data :{
            table : tableExterne
        },
        dataType: 'json',
        success: function(dataColumn) {


            var y = 0;


            $.each(dataColumn, function( i, value ) {
                jqTds[i + 1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[value.field] + '">';
                y++;

            });



            jqTds[y+1].innerHTML = '<button class="process_edit_addons btn default btn-xs green" data-table="'+tableExterne+'" >Enregistrer</button><button class="cancel btn default btn-xs">Annuler</button>';
        },
        error: function() {
            console.log("erreur");
        }
    });
}


$(document).on("click", '.add_row_addons', function(e) {
    var tableExterne = $(this).data('table');
    $('#ajoutLigne_cmk_addons').attr('data-table',tableExterne);
    e.preventDefault();
    $('#ajout_cmk_addons').modal('show');
    $(".parametre").html('');
    $('div.parametre').empty();
    jQuery.ajax({
        type: 'POST',
        url: base_url_ajax + 'listexterne/listexterne/show_fields',
        data :{
            table : tableExterne
        },
        dataType: 'json',
        success: function(dataColumn) {

            var y = 0;

            $('div.parametre').html('');
            $.each(dataColumn, function( i, value ) {
                $('div.parametre').append('<div class="form-group"><label>'+value.field+'</label><input type="text" name="'+value.field+'" class="form-control input-small" value=""></div>')
                y++;

            });

            return false;
        },
        error: function() {
            console.log("erreur de chargement");
        }
    });
});

$(document).on('click', '#ajoutLigne_cmk_addons', function(e) {
    tableExterne = $(this).data('table');

    var donnees = {};
    var yDonneesAfficher = [];
    jQuery.ajax({
        type: 'POST',
        url: base_url_ajax + 'listexterne/listexterne/insertDonnees',
        data: $('#cmk_addons_form').serialize()+'&table='+tableExterne,
        dataType: "json",
        success: function(data) {
            console.log(data[0]);
            oTableAddonsCmk.fnDraw();
            $('#ajout_cmk_addons').modal('hide');

        },
        error: function() {
            console.log("bad");
        }
    });



});