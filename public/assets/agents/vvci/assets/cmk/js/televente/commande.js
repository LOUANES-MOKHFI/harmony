/**
 * Created by Marwen on 11/06/2016.
 */
var arrayDonneesDetail = [];

function saveCommande() {
    if (arrayDonneesDetail.length != 0) {

        var baseht = parseFloat($('#basehtRes').contents().text());
        var tremise = parseFloat($('#totalremiseRes').contents().text());
        var totalHorsTaxe = parseFloat(baseht - tremise);
        var ttva = parseFloat($('#totalTVARes').contents().text());
        var tttc = parseFloat($('#totalTTCRes').contents().text());

        jQuery.ajax({
            type: 'POST',
            url: 'nouvellecommande/sauvguardeCommande',
            data: {
                numeroCommande: arrayDonneesDetail[0]["NumeroCommande"],
                codeClient: num_contact,
                refFichier : ref_fichier,
                baseHorsTaxe: baseht,
                totalRemise: tremise,
                totalHorsTaxe: totalHorsTaxe,
                totalTVA: ttva,
                totalTTC: tttc,
                note: "",
                codeUtilisateur: user,
                raisonSociale: name_contact
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                console.log("ok save commande");
            },
            error: function () {
                console.log("bad save commande");
            }
        });
        saveCommandeDetail();
    }

}

function saveCommandeDetail() {
    var yNumeroCommande = arrayDonneesDetail[0]["NumeroCommande"];

    jQuery.ajax({
        type: 'POST',
        url: 'nouvellecommande/sauvguardeCommandeDetail',
        data: { details : arrayDonneesDetail },
        success: function (data) {
            console.log(data);
            console.log("ok save commande detail");
            if (data == 'trueSaveCommandeDetail') {
                var totHT = 0;
                var portHT = 13.2;
                $.each(arrayDonneesDetail,function(k,v) {
                    var input = $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "CMK_S_REF_"+(k+1)).val(v.Reference);
                    $('#target').append($(input));
                    input = $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "CMK_S_LABEL_"+(k+1)).val(v.LibelleArticle);
                    $('#target').append($(input));
                    input = $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "CMK_S_QTE_"+(k+1)).val(v.Quantite);
                    $('#target').append($(input));
                    input = $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "CMK_S_PRIX_HT_"+(k+1)).val(parseFloat(v.Prix) - (parseFloat(v.Prix) * parseFloat(v.TauxRemise) / 100));
                    $('#target').append($(input));
                    input = $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "CMK_S_MONTANT_HT_"+(k+1)).val((parseFloat(v.Prix) - (parseFloat(v.Prix) * parseFloat(v.TauxRemise) / 100)) * v.Quantite);
                    $('#target').append($(input));

                    totHT += (parseFloat(v.Prix) - (parseFloat(v.Prix) * parseFloat(v.TauxRemise) / 100)) * v.Quantite;

                });
                var totTtc = parseFloat((totHT + portHT)*1.19);
                totTtc = totTtc.toFixed(3);

                var input = $("<input>")
                    .attr("type", "hidden")
                    .attr("name", "CMK_S_TOTAL_HT").val(parseFloat(totHT).toFixed(3));
                $('#target').append($(input));

                var input = $("<input>")
                    .attr("type", "hidden")
                    .attr("name", "CMK_S_TOTAL_TTC").val(totTtc);
                $('#target').append($(input));

                var input = $("<input>")
                    .attr("type", "hidden")
                    .attr("name", "CMK_S_PORT_HT").val(parseFloat(portHT).toFixed(3));
                $('#target').append($(input));
            }
        },
        error: function () {
            console.log("bad save commande detail");
        }
    });

    setTimeout(function(){
        verif(yNumeroCommande);
    }, 1000);

    return;

    for (i = 0; i < arrayDonneesDetail.length; i++) {
        console.log('arrayDonneesDetail',arrayDonneesDetail[i]);
        jQuery.ajax({
            type: 'POST',
            url: 'nouvellecommande/sauvguardeCommandeDetail',
            data: {
                numeroCommande: arrayDonneesDetail[i]["NumeroCommande"],
                codeArticle: arrayDonneesDetail[i]["CodeArticle"],
                libelleArticle: arrayDonneesDetail[i]["LibelleArticle"],
                quantite: arrayDonneesDetail[i]["Quantite"],
                prix: arrayDonneesDetail[i]["Prix"],
                tauxRemise: arrayDonneesDetail[i]["TauxRemise"],
                tauxTVA: arrayDonneesDetail[i]["TauxTVA"],
                description: arrayDonneesDetail[i]["Description"]
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                console.log("ok save commande detail");
            },
            error: function () {
                console.log("bad save commande detail");
            }
        });
    }
    setTimeout(function(){
        verif(yNumeroCommande);
    }, 1000);

}

function getTableau(data) {
    arrayDonneesDetail.push(data);
}

function setArrayDonneesDetail() {
    arrayDonneesDetail = [];
}

function verif(numCommande) {
    jQuery.ajax({
        type: 'POST',
        url: 'nouvellecommande/verificationSauvguarde',
        data: {
            numeroCommande: numCommande
        },
        dataType: "json",
        success: function (data) {
            console.log("--" + data + "---");
            if (data == true) {
               // window.location.reload();
            }
            else if (data == false) {
                if (confirm("Une erreur s'est produite lors de l'enregistrement d'une commande.\n" +
                        "Voulez-vous vraiment supprimer cette commande ?") == false) {
                    return;
                }
                jQuery.ajax({
                    type: 'POST',
                    url: 'listecommande/supprimerCommande',
                    data: {
                        numeroCommande: numCommande
                    },
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        console.log("ok suppression commande");
                       // window.location.reload();
                    },
                    error: function () {
                        alert("Un problÃ¨me s'est produit lors de la suppression");
                        console.log("bad suppression commande");
                    }
                });
            }
        },
        error: function () {
            console.log("problÃ¨me de verification.");
        }
    });

}

function saveAndShowCommande() {
    console.log(arrayDonneesDetail[0]["NumeroCommande"]);
    //window.open("ListeCommande/indexRapportRapide?numCommande=" + arrayDonneesDetail[0]["NumeroCommande"]);
    console.log("hey");
}


