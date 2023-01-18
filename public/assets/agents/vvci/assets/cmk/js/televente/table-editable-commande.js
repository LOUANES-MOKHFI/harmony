jQuery(document).ready(function () {

//    TableEditable.init();
});

var TableEditable = function () {
    var handleTable = function () {
        var IdLigne = 0;

        function restoreRowTv(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }
            oTable.fnDraw();
        }

        //function pour la modification avec la boutton "ajout"
        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[3].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[3] + '">';
            jqTds[4].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[4] + '">';
            jqTds[6].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[6] + '">';
            jqTds[7].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[7] + '">';
            jqTds[10].innerHTML = '<a class="edit btn default btn-xs red" href="">Enregistrer</a>';
            jqTds[11].innerHTML = '<a class="cancel btn default btn-xs black" href="">Annuler</a>';

            //affectation de la clÃ© primaire
            IdLigne = jqTds[0].innerHTML;
        }

        //function de la gestion avec la checkbox
        function saveCheckBoxRow(oTable, nRow, IdLigne) {
            console.log(nRow,IdLigne);
            if ($('#selArt' + IdLigne).is(':checked')) {
                oTable.fnUpdate(1, nRow, 4, false);
                oTable.fnUpdate('<a class="edit btn default btn-xs blue" href=""><i class="fa fa-edit"></i>Modifier</a>', nRow, 10, false);
                oTable.fnUpdate('<a class="delete" href=""></a>', nRow, 11, false);
                oTable.fnUpdate('<input style="border: none; background: none; display: inline-block; zoom: 1; height: 19px; width: 19px;" class="checkboxCRM" type="checkbox" checked id="selArt' + IdLigne + '" name="selArt' + IdLigne + '" value="' + IdLigne + '">', nRow, 12, false);
            } else {
                oTable.fnUpdate(0, nRow, 4, false);
                oTable.fnUpdate('<a class="edit btn default btn-xs green" href=""><i class="fa fa-plus"></i>Ajouter</a>', nRow, 10, false);
                oTable.fnUpdate('<a class="delete" href=""></a>', nRow, 11, false);
                oTable.fnUpdate('<input style="border: none; background: none; display: inline-block; zoom: 1; height: 19px; width: 19px;" class="checkboxCRM" type="checkbox" id="selArt' + IdLigne + '" name="selArt' + IdLigne + '" value="' + IdLigne + '">', nRow, 12, false);
            }
            oTable.fnDraw();
            calcul(oTable);
        }

        //function de l'enregistrement de la ligne
        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 3, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 4, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 6, false);
            oTable.fnUpdate(jqInputs[3].value, nRow, 7, false);

            if (jqInputs[1].value > 0) {
                oTable.fnUpdate('<a class="edit btn default btn-xs blue" href=""><i class="fa fa-edit"></i>Modifier</a>', nRow, 10, false);
                oTable.fnUpdate('<a class="delete" href=""></a>', nRow, 11, false);
                oTable.fnUpdate('<input style="border: none; background: none; display: inline-block; zoom: 1; height: 19px; width: 19px;" class="checkboxCRM" type="checkbox" checked id="selArt' + IdLigne + '" name="selArt' + IdLigne + '" value="' + IdLigne + '">', nRow, 12, false);
            } else {
                oTable.fnUpdate('<a class="edit btn default btn-xs green" href=""><i class="fa fa-plus"></i>Ajouter</a>', nRow, 10, false);
                oTable.fnUpdate('<a class="delete" href=""></a>', nRow, 11, false);
                oTable.fnUpdate('<input style="border: none; background: none; display: inline-block; zoom: 1; height: 19px; width: 19px;" class="checkboxCRM" type="checkbox" id="selArt' + IdLigne + '" name="selArt' + IdLigne + '" value="' + IdLigne + '">', nRow, 12, false);
            }
            oTable.fnDraw();
            calcul(oTable);
        }
        $(document).off("change","#CMK_S_FRAIS_PORT");

        $(document).on("change","#CMK_S_FRAIS_PORT",function() {
            calcul(oTable);
        })
        //function de la calcul des tva, ht, ttc
        function calcul(oTable) {
            var baseHorsTaxe = 0;
            var totalRemise = 0;
            var totalTVA = 0;
            var totalTTC = 0;
            var donnees = {
                NumeroCommande: "",
                CodeArticle: "",
                LibelleArticle: "",
                Quantite: "",
                Prix: "",
                TauxRemise: "",
                TauxTVA: "",
                Description: ""
            };
            //effacer les donnÃ©es prÃ©cdents
            setArrayDonneesDetail();

            //parcourir de la tableau et faire le calcul
            for (var iter = 0; iter < oTable.fnGetData().length; iter++) {
                if (parseFloat(oTable.fnGetData()[iter][4]) != 0) {
                    var ybaseHorsTaxe = (parseFloat(oTable.fnGetData()[iter][4]) * parseFloat(oTable.fnGetData()[iter][5])).toPrecision(5);
                    var ytotalRemise = ((parseFloat(ybaseHorsTaxe) * parseFloat(oTable.fnGetData()[iter][7])) / 100).toPrecision(5);
                    var ytotalTVA = (((parseFloat(ybaseHorsTaxe) - parseFloat(ytotalRemise)) * parseFloat(oTable.fnGetData()[iter][6])) / 100).toPrecision(5);
                    var ytotalTTC = (parseFloat(ybaseHorsTaxe) - parseFloat(ytotalRemise) + parseFloat(ytotalTVA));

                    baseHorsTaxe = parseFloat(baseHorsTaxe) + parseFloat(ybaseHorsTaxe);
                    totalRemise = parseFloat(totalRemise) + parseFloat(ytotalRemise);
                    totalTVA = parseFloat(totalTVA) + parseFloat(ytotalTVA);
                    totalTTC = parseFloat(totalTTC) + parseFloat(ytotalTTC);
                    var aData = oTable.fnGetData()[iter];
                    donnees = {
                        NumeroCommande: $('#CMKS_num_commande').val(),
                        CodeArticle: aData[13],
                        LibelleArticle: aData[1],
                        Reference: aData[2],
                        Quantite: aData[4],
                        Prix: aData[5],
                        TauxRemise: aData[7],
                        TauxTVA: aData[6],
                        Description: aData[9]
                    };
                    getTableau(donnees);
                }
            }
            var yFraisPort = $("#CMK_S_FRAIS_PORT").attr('checked') ? 13.2 : 0;
            baseHorsTaxe = parseFloat(baseHorsTaxe + yFraisPort);
            totalTVA = parseFloat(totalTVA + (yFraisPort*0.19));
            $('#basehtRes').html(baseHorsTaxe.toFixed(3));
            $('#totalremiseRes').html(totalRemise.toFixed(3));
            $('#totalTVARes').html(totalTVA.toFixed(3));
            $('#totalTTCRes').html((totalTTC + (yFraisPort*1.19)).toFixed(3));
        }


        function cancelEditRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
            oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
            oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
            oTable.fnUpdate(jqInputs[5].value, nRow, 5, false);
            oTable.fnUpdate(jqInputs[6].value, nRow, 6, false);
            oTable.fnUpdate(jqInputs[7].value, nRow, 7, false);
            oTable.fnUpdate('<a class="edit" href="">Modifier</a>', nRow, 8, false);
            oTable.fnDraw();
        }

        var table = $('#sample_editable_1');

        var oTable = table.dataTable({

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],

            // set the initial value
            "pageLength": -1,

            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
            },
            "columnDefs": [{ // set default column settings
                'orderable': true,
                'targets': [0]
            }, {
                "visible" : false,
                "targets" : 13
            }],
            "order": [
                [0, "asc"]
            ], // set first column as a default sort by asc
            "fnDrawCallback": function(oSettings) {
                $('table input[type="checkbox"]').uniform();
               $('table input[type="checkbox"]').addClass('checkboxCRM');
            }
        });

        var tableWrapper = $("#sample_editable_1_wrapper");

        tableWrapper.find(".dataTables_length select").select2({
            showSearchInput: true //hide search box with special css class
        }); // initialize select2 dropdown

        var nEditing = null;
        var nNew = false;

        $('#sample_editable_1_new').click(function (e) {
            e.preventDefault();

            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    saveRow(oTable, nEditing); // save
                    $(nEditing).find("td:first").html("Untitled");
                    nEditing = null;
                    nNew = false;

                } else {
                    oTable.fnDeleteRow(nEditing); // cancel
                    nEditing = null;
                    nNew = false;

                    return;
                }
            }

            var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;
        });

        //En cas d'ajout de boutton supprimer
        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {

            }
        });



        //evenement de click sur checkbox1
        table.on('click', '.checker', function (e) {
            var nRow = $(this).parents('tr')[0];
            var yid = $(this).parent().siblings(":first").text();

            if ($('#selArt' + yid).is(':checked')) {
                $('#qte' + yid).html(1)
            } else {
                $('#qte' + yid).html(0)
            }
            IdLigne = yid;
            saveCheckBoxRow(oTable, nRow, IdLigne);
        });

        //evenement de click annuler
        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                restoreRowTv(oTable, nEditing);
                nEditing = null;
            }
        });

        //evenement de click ajout
        $("#sample_editable_1").on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRowTv(oTable, nEditing);
                editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "Enregistrer") {
                /* Editing this row and want to save it */
                saveRow(oTable, nEditing);
                nEditing = null;
                //alert("Updated! Do not forget to do some ajax to sync with backend :)");
            } else {
                /* No edit in progress - let's start one */
                editRow(oTable, nRow);
                nEditing = nRow;
            }
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            handleTable();
        }

    };

}();
