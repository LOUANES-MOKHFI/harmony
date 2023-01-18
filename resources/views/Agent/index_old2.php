@extends('master')
@section('css')
<link rel="stylesheet" href="{{asset('assets/agents/index.css')}}">

<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet">
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/core@4.3.1/main.min.css'/>
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/daygrid@4.3.0/main.min.css' />
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/timegrid@4.3.0/main.min.css' />
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.css">
<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link rel="stylesheet" href="{{asset('assets/agents/metro-all.min.css')}}">
<style type="text/css">
    td.sorting_desc_disabled {
    cursor: pointer;
    position: relative;
    padding-right: 20px;
    }
    .container .card {
      max-width: 1100px;
      height: 6000px;
      background-color: white;
      margin: 0 auto;
    }
    .content {
      margin: 0px auto;
      text-align: left;
      color: #666;
      font-size: 13px;
      line-height: 20px;
      position: relative;
      height: 1000px;
      box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
      display: block;
      padding: 0.5rem;
      z-index: -2;
    }
    /* style 1 */
    .sidebar.top {
        left: 0;
        right: 0;
        top: -1000000px;
        background: #fff;
        display: none;
    }

    .sidebars>.sidebar {
        box-shadow: 5px 0 5px rgba(0, 0, 0, 0.64);
        position: fixed;
        z-index: 9999;
    }
    /* style 2 */
    #all-time{
        font-family: 'Jazz LET';
        font-size: 45px;
        margin: 10px auto;
        width: 305px;
        text-align: left;
        padding: 0px;
        animation: flux 2s linear infinite;
        -moz-animation: flux 0.9s linear infinite;
        -webkit-animation: flux 0.9s linear infinite;
        -o-animation: flux 0.9s linear infinite;
        }

    @keyframes flux {
    0%,
    100% {
        text-shadow: 0 0 1vw #1041FF, 0 0 0vw #1041FF, 0 0 0vw #1041FF, 0 0 0vw #1041FF, 0 0 .4vw #8BFDFE, .5vw .5vw .9vw #147280;
        color: #28D7FE;
    }
    50% {
        text-shadow: 0 0 .5vw #082180, 0 0 1.5vw #082180, 0 0 5vw #082180, 0 0 5vw #082180, 0 0 .2vw #082180, .5vw .5vw .9vw #0A3940;
        color: #146C80;
    }
    }

    #extra-min {
        margin-left: 1%;
    }
    /* style 3 */
    .col { float: left; width: 20%; min-width: 100px; text-align: center }
    .clear { clear: both; }

</style>
@endsection
@section('title')
ACCUEIL
@endsection
@section('content')


           
<!-- BEGIN QUICK SIDEBAR -->
<aside class="app-sidebar">
    <div class="app-sidebar__logo">
     <a class="header-brand" href="index">
     <img src="{{ asset('assets/images/brand/aa.png')}}" class="header-brand-img desktop-lgo" alt="">
           <img src="{{ asset('assets/images/brand/aa.png')}}" class="header-brand-img dark-logo" alt="">
           <img src="{{ asset('assets/images/brand/aa.png')}}" class="header-brand-img mobile-logo" alt="">
          <img src="{{ asset('assets/images/brand/aa.png')}}" class="header-brand-img darkmobile-logo" alt="">
     </a>
   </div>
<a href="javascript:;" class="page-quick-sidebar-toggler">
    <i class="icon-bubbles"></i>
</a>
<div class="app-sidebar3">
  <div class="main-menu">
        <div class="app-sidebar__user">
            <div class="dropdown user-pro-body text-center">
                <div class="user-pic">
                  <img src="{{ asset('images/agent.jpg')}}" alt="user-img" class="avatar-xxl rounded-circle mb-1">
                 </div>

                <!-- BEGIN PROFILE SIDEBAR -->
    
                    <!-- PORTLET MAIN -->
               
                        <!-- SIDEBAR USERPIC -->
                      

                        <!-- END SIDEBAR USERPIC -->
                        <!-- SIDEBAR USER TITLE -->
                        <div class="profile-usertitle">
                            <div class="profile-usertitle-name"> {{Session::get('user')}} </div>
                            <div class="profile-usertitle-job">
                                <p><i class="icon-earphones-alt"></i> Poste : {{Session::get('phone_login')}}</p>
                                <p><i class="icon-user-following"></i> Compagne : {{Session::get('campaign')}}</p>
                                <div style="margin-left: 50px;" id="timePAUSED"></div> 

                            </div>
                            <input type="hidden" name="agent_status" id="agent_status" value="">
                            <input type="hidden" id="etat_agent">

                        </div>
                        <!-- END SIDEBAR USER TITLE -->
                        <!-- SIDEBAR BUTTONS -->
                        <div class="profile-userbuttons">
                            <button type="button" data-value="PAUSED"
                                    class="btn btn-circle green-haze btn-sm  agentStatusButton">Démarrer la production
                            </button>
                        </div>
            </div>
      </div>    
   </div>
</div>
                            
                            <div class="timePAUSEDDiv">
                                
                            </div>
                                  
                        </div>
                        <!-- END SIDEBAR BUTTONS -->
                        <!-- SIDEBAR MENU -->
                        <div class="profile-usermenu">
                            
                        </div>
                        <!-- END MENU -->
                    </div>
                    <div class="portlet light bordered">
                        <div>
                            <h4 class="profile-desc-title">Pauses</h4>
                            @if($pauses != "")
                            @isset($pauses)
                            @foreach($pauses as $pause)
                            <div class="margin-top-20 profile-desc-link">
                                <a class="pause_codes log_action" data-log-action="request_pause" data-value="{{$pause->pause_code}}" data-label-pause="{{$pause->pause_code}}" > <i
                                            class="fa fa-pause"></i>
                                    {{$pause->pause_code_name}} <span class="label label-info hidden {{$pause->pause_code}}"  data-idpause="4"  data-keyconfirm="">En attente </span> </a>
                            </div>
                            @endforeach
                            @endisset
                            @endif
                        </div>
                    </div>

                </div>

                <!-- END BEGIN PROFILE SIDEBAR -->
                <!-- BEGIN PROFILE CONTENT -->
                        <div class="page-header d-xl-flex d-block">
                            <div class="page-leftheader">
                                <div class="page-title">Agent<span class="font-weight-normal text-muted ms-2">Dashboard</span></div>
                            </div>
                            <div class="page-rightheader ms-md-auto">
                                <div class="d-flex align-items-end flex-wrap my-auto end-content breadcrumb-end">
                                    <div class="btn-list">
                                        <button  class="btn btn-light" data-bs-toggle="tooltip" data-bs-placement="top" title="E-mail"> <i class="feather feather-mail"></i> </button>
                                        <button  class="btn btn-light" data-bs-placement="top" data-bs-toggle="tooltip" title="Contact"> <i class="feather feather-phone-call"></i> </button>
                                        <button  class="btn btn-primary" data-bs-placement="top" data-bs-toggle="tooltip" title="Info"> <i class="feather feather-info"></i> </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                                    <div class="row">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 sortable">
                                      <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="mt-0 text-start">
                                                      <div class="number">
                                                        <span data-counter="" data-value=""><span id="nbrArgumente"></span></span>
                                                    </div>
                                                 <span class="font-weight-semibold">Non Argumenté</span>
                                                    <h3 class="mb-0 mt-1 text-primary mb-2">124</h3>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="icon1 bg-danger my-auto  float-endicon1 bg-danger my-auto  float-end"> <i class="las la-building"></i> </div>
                                            </div>
                                              <span class="more" href="javascript:;">
                                                <span id="prctArgumente"></span>
                                        </div>
                                    </div>
                                </div>
                    </div>
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 sortable">
                                     <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="mt-0 text-start">
                                                      <div class="number">
                                                        <span data-counter="" data-value=""><span id="nbrArgumente"></span></span>
                                                    </div>
                                                 <span class="font-weight-semibold">Non Argumenté</span>
                                                    <h3 class="mb-0 mt-1 text-primary mb-2">124</h3>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="icon1 bg-danger my-auto  float-endicon1 bg-danger my-auto  float-end"> <i class="las la-building"></i> </div>
                                            </div>
                                              <span class="more" href="javascript:;">
                                                <span id="prctArgumente"></span>
                                        </div>
                                    </div>
                                </div>
                    </div>
 <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 sortable">
                             <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="mt-0 text-start">
                                                      <div class="number">
                                                        <span data-counter="" data-value=""><span id="nbrArgumente"></span></span>
                                                    </div>
                                                 <span class="font-weight-semibold">Non Argumenté</span>
                                                    <h3 class="mb-0 mt-1 text-primary mb-2">124</h3>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="icon1 bg-danger my-auto  float-endicon1 bg-danger my-auto  float-end"> <i class="las la-building"></i> </div>
                                            </div>
                                              <span class="more" href="javascript:;">
                                                <span id="prctArgumente"></span>
                                        </div>
                                    </div>
                                </div>
 </div>

<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 sortable">
                                     <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-8">
                                                <div class="mt-0 text-start">
                                                      <div class="number">
                                                        <span data-counter="" data-value=""><span id="nbrArgumente"></span></span>
                                                    </div>
                                                 <span class="font-weight-semibold">Non Argumenté</span>
                                                    <h3 class="mb-0 mt-1 text-primary mb-2">124</h3>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="icon1 bg-danger my-auto  float-endicon1 bg-danger my-auto  float-end"> <i class="las la-building"></i> </div>
                                            </div>
                                              <span class="more" href="javascript:;">
                                                <span id="prctArgumente"></span>
                                        </div>
                                    </div>
                                </div>
                    </div>
                    <div class="row">
                            <div class="card">
                                    <div class="card-header border-bottom-0">
                                        <h3 class="card-title">Contact Prospect</h3>
                                    </div>
                                   <div class="card">
                                    <div class="card-header border-bottom-0">
                                        <h3 class="card-title">Contact Prospect</h3>
                                    </div>
                                    <div class="card-body">
                                        <div class="card-pay">
                                            <ul class="tabs-menu nav">
                                                <li class=""><a href="#tab20" class="active" data-bs-toggle="tab"><i class="fa fa-credit-card"></i> Historique</a></li>
                                                <li><a href="#tab21" data-bs-toggle="tab" class=""><i class="fa fa-paypal"></i> Rappel</a></li>
                                                <li><a href="#tab22" data-bs-toggle="tab" class=""><i class="fa fa-university"></i> appel manuel</a></li>
                                                
                                            </ul>
                                                    <div class="tab-content">
                                                        <div class="tab-pane active show" id="tab20">
                                                            <div class="bg-danger-transparent-2 text-danger px-4 py-2 br-3 mb-4" role="alert"></div>
                                                        <table id="example" class="table table-striped" style="width:100%">
                                                            <thead>
                                                                <tr>
                                                                    <th width="10">ID</th>
                                                                    <th width="100">Date/heure</th>
                                                                    <th width="10">sec</th>
                                                                    <th>Qualification</th>
                                                                    <th>Télèphone</th>
                                                                    <th>Nom/Prénom</th>
                                                                    <th width="50">Compagne</th>
                                                                    
                                                                    <th width="50">Hangup</th>
                                                                    <th style="width: 70px;">Actions</th>
                                                                </tr>
                                                             </thead>
                                                             <tbody>
                                                                @isset($calllogs)
                                                                @foreach($calllogs as $key => $log)
                                                                
                                                                    <tr style="padding:2px">
                                                                        <td width="10">{{$key+1}}</td>
                                                                        <td width="100">{{$log->call_date}}</td>
                                                                        <td width="10">{{$log->length_in_sec}}</td>
                                                                        <td>{{$log->status}}</td>
                                                                        <td>{{$log->phone_number}}</td>
                                                                        <td>{{$log->first_name.' '.$log->last_name}}</td>
                                                                        <td width="50">{{$log->campaign_id}}</td>
                                                                       
                                                                        <td width="50">{{$log->term_reason}}</td>
                                                                        <td>
                                                                            <button onclick="ManualDial('{{$log->phone_number}}')" data-phone="{{$log->phone_number}}" class="btn btn-sm btn-success "><i class="fa fa-phone"></i></button>
                                                                            <button onclick="getContactInfo('{{$log->lead_id}}')" data-phone="{{$log->phone_number}}" class="btn btn-sm btn-info "><i class="fa fa-eye"></i></button>
                                                                            <!-- <a href="{{route('get_lead_info',$log->lead_id)}}" class="btn btn-sm btn-info"><i class="fa fa-eye"></i></a> -->
                                                                        </td>

                                                                    </tr>
                                                                @endforeach
                                                                @endisset
                                                             </tbody>
                                                        </table>
                                                            <a  href="javascript:void(0);" class="btn  btn-lg btn-primary">Confirm</a>
                                                    </div>
                                                    <div class="tab-pane" id="tab21">
                                                            
                                                        <div id="calendar"></div>
                                                    </div>
                                                        <div class="tab-pane" id="tab22">
                                                        <a  href="javascript:void(0);" class="btn btn-primary"><i class="fa fa-paypal"></i></a>
                                                    
                                                
                                                </div>
                                                
                                          
                                        </div>
                                    </div>
                           </div>
                    </div>

 <div class="container-login100">
      <div class="wrap">
        <div class="wrap-login100 p-t-50 p-b-90 p-l-50 p-r-50">
                        <h2 class="attente_ppp">En Attente d'un appel..</h2>
                        <br> 
                        <button class="btn btn-default btn-outlined btn-square back-to-menu agentStatusButton"> retour</button>
                        <main>
                         <article>
                         
                          <div class="flipTimer" id="timeREADY">
                            <div class="hours"></div>
                            <div class="minutes"></div>
                            <div class="seconds"></div>
                          </div> 
                        </article>
                     </main>
                    </div>
                   
                     
        </div>
                 
                        <div>
                        <img class="fit-picture"
                            src="{{asset('images/15.png')}}"
                            alt="Grapefruit slice atop a pile of other slices">
                       </div>
                   
      </div>
 </div> 

              
                <!-- Bloc incall  recever un appele et afficher les donnees de prospect dans les champs -->
                <div class="col-md-12 bloc_incall" id="production_tabs" style="display:none;" >
                    <div class="portlet light">
                        <!-- <div class="portlet-title">
                            <div class="caption">
                                
                                <span>Informations sur le contact</span><br><br>
                                <a class="fa fa-user with-tooltip info-ctc info-ctc-open" data-action="toggle" data-side="top" data-original-title="Cliquer ici pour modifier les informations du contact"></a><span id="info-ctc-name"></span>
                            </div>
                            <button  class="btn btn-circle btn-sm btn-icon-only splitrecording SplitRecordAct" type="button"
                                    style="position: fixed; z-index: 10000022; left: 0; top:65%">
                                <i class="fa fa-cut"></i>
                            </button>
                            <div class="tools font-blue uppercase" id="info_fichier"></div>
                        </div> -->
                        <div class="portlet-body">
                            <!-- style 1 -->

                            <div id="content_ecran_conf" style="padding: 10px;">
                                <input type="hidden" name="agent_status" id="agent_status" value="">
                                <input type="hidden" value="{{$etatAgent}}" id="etat_agent">
                                <input type="hidden" value="" id="agentchannel">
                                <div class="row">
                                    <!-- button pour raccrocher et qualifier a la foi -->
                                    <div class="col-md-4">
                                        <button class="btn btn-danger" id="class" onclick="hangupQualif()">Raccrocher et Qualifier</button>
                                    </div>
                                    <!-- button pour raccrocher l'appel et rendre l'agent en état DISPO -->
                                    <div class="col-md-3">
                                        <button class="btn btn-danger" id="racc" onclick="hangup()">Raccrocher</button>
                                    </div>
                                </div>
                                
                                <input type="hidden" id="channel" value=''>
                                <input type="hidden" id="lead_id" value=''>
                                <input type="hidden" name="uniqueid" id="uniqueid1">
                                <div class="form-group" dir="ltr" data-prop="field_expert" data-numfield="2858">
                                    <span data-class="traduction-2-2858">
                                        <p style="text-align: center;">
                                            <span style="font-size:24px;">
                                                <span style="color:#FF0000;">
                                                    <strong>
                                                        <span style="background-color:#D3D3D3;">!!! ATTENTION !!!&nbsp;</span>
                                                    </strong>
                                                </span>
                                            </span>
                                        </p>

                                        <p style="text-align: center;">
                                            <span style="font-size:24px;"><span style="color:#000000;"><strong>
                                                <span style="background-color:#ff3333;">PRENDRE CONGE SI PROSPECT DONNE A L'AMBASSADEUR UNADEV&nbsp;<input id="date_chargement" name="hidden_date_chargement" type="hidden" value="20220919"></span></strong></span>
                                            </span>
                                        </p>

                                        <p id="limite" style="text-align: center;font-size:24px;">SVP DATE LIMITE RAPPEL PERSO: Sun Oct 09 2022 01:00:00 GMT+0100 (UTC+01:00)</p>
                                        <div id="timeINCALL"></div>
                                        <p id="tempCall" style="color: green;">
                                            <!-- <span id="extra-min">0</span><span id="min">4</span> <span>:</span> <span id="extra-sec" style="display: none;">0</span><span id="tempCall">57</span> -->
                                        </p>
                                            <!-- Style 2 -->
                                    </span>
                                    <!-- Bloc pour afficher l'affihe d'un prospect, requalifier une fiche ou fiare un appel manual -->
                                    <div class="row" id="ReClass" style="display:none">
                                        <div class="col-md-4">
                                            <button class="btn btn-info" onclick="requalifier()"><i class="fa fa-check"></i> Requalifier la fiche</button>
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-warning" onclick="retour()"><i class="fa fa-arrow-left"></i> Retour</button>
                                        </div>
                                        <div class="col-md-4" id="manDial">
                                           
                                        </div>
                                    </div>
                                </div>
                                <!-- afficher les anciens info de prospect et possibilite de modifier les données  -->
                                <form id="RegisternewInfoContact" method="post">
                                    @csrf
                                    <div class="form-group" dir="ltr" data-prop="field_button" data-numfield="798"></div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="2">
                                        <span data-class="traduction-2-2">
                                            <!-- style 3 -->
                                            <div class="col left">
                                                Ancien Don<input class="form-control" disabled="" id="" maxlength="3" name="Ancien_Don" type="text">
                                            </div>
                                            <div class="col mid">
                                                Ancien PA<input class="form-control" disabled="" id="" maxlength="3" name="Ancien_PA" type="text">
                                            </div>
                                            <div class="col right">
                                                Ancienne Fréquence<input class="form-control" disabled="" id="" maxlength="3" name="Ancienne_Frequence" type="text">
                                            </div>
                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="9">
                                        <span data-class="traduction-2-9">
                                            <div class="col left">
                                                <br>
                                                Date Don<input class="form-control" disabled="" maxlength="3" name="Date_Don" type="text" id="">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                ID client<input class="form-control" disabled="" maxlength="3" name="ID_client" type="text" id="">
                                            </div>

                                            <div class="col right">
                                                <br>
                                                Modulo Client<input class="form-control" maxlength="3" disabled="" name="Modulo_Client" type="text" id="">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <!-- bloc specil call2 pour voir les informations enrgistées dans l'appel de call1  -->
                                    <div class="form-group" dir="ltr" id="call2" style="display:none">
                                        <span data-class="traduction-2-414">
                                            <h4>
                                                <cmkdefault>
                                                    <strong>
                                                        <span style="color:#0000FF;">Qualification</span> : <span id="contact_qualif"></span>
                                                    </strong>
                                                </cmkdefault>
                                            </h4>

                                        </span> 
                                        <span data-class="traduction-2-414">
                                            <h4>
                                                <cmkdefault>
                                                    <strong>
                                                        <span style="color:#0000FF;">Accord Montant</span> : <span id="accord_montant"></span>
                                                    </strong>
                                                </cmkdefault>
                                            </h4>

                                        </span> 
                                        <span data-class="traduction-2-414">
                                            <h4>
                                                <cmkdefault>
                                                    <strong>
                                                        <span style="color:#0000FF;">Pa montant</span> : <span id="pa_montant"></span>
                                                    </strong>
                                                </cmkdefault>
                                            </h4>

                                        </span> 
                                        <span data-class="traduction-2-414">
                                            <h4>
                                                <cmkdefault>
                                                    <strong>
                                                        <span style="color:#0000FF;">Pa frequence</span> : <span id="pa_frequence"></span>
                                                    </strong>
                                                </cmkdefault>
                                            </h4>

                                        </span> 
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="414">
                                        <span data-class="traduction-2-414"><h4>
                                        <cmkdefault><strong><span style="color:#0000FF;">ID TOTAL</span> : <span id="id_total"></span></strong></cmkdefault></h4>

                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            
                                            <div class="col left">
                                                    <br>
                                                    CIVILITE<input class="form-control new_x" readonly="" id="civilite" name="civilite" type="text" value="MME">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_CIVILITE
                                                <select class="form-control" id="new_civilite" name="new_civilite">
                                                    <option value="M"> M</option>
                                                    <option value="MLLE"> MLLE</option>
                                                    <option value="MME"> MME</option>
                                                    <option value="M MME"> M MME</option>
                                                </select>
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            
                                            <div class="col left">
                                                    <br>
                                                    NOM<input class="form-control" id="contact_nom" readonly="" name="contact_nom" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_NOM<input class="form-control" id="new_contact_nom" name="new_contact_nom" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                           
                                            <div class="col left">
                                                    <br>
                                                    PRENOM<input class="form-control" id="contact_prenom" readonly="" name="contact_prenom" type="text" value="">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_PRENOM<input class="form-control" id="new_contact_prenom" name="new_contact_prenom" type="text" value="">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            
                                            <div class="col left">
                                                    <br>
                                                    RAISON SOCIALE<input class="form-control" id="raison_sociale" readonly="" name="raison_sociale" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_RAISON SOCIALE<input class="form-control" id="new_raison_sociale" name="new_raison_sociale" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    PROFESSIONNEL<input class="form-control" id="professionnel" readonly="" name="professionnel  " type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_PROFESSIONNEL<input class="form-control" id="new_professionnel" name="new_professionnel " type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    ADR2<input class="form-control" id="adr2" readonly="" name="adr2" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_ADR2<input class="form-control" id="new_adr2" name="new_adr2" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                           <div class="col left">
                                                <br>
                                                ADR3<input class="form-control" id="adr3" readonly="" name="adr3" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_ADR3<input class="form-control" id="new_adr3" name="new_adr3" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    ADR4 LIBELLE VOIE<input class="form-control" id="adr4_libelle_voie" readonly="" name="adr4_libelle_voie" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_ADR4 LIBELLE VOIE<input class="form-control" id="new_adr4_libelle_voie" name="new_adr4_libelle_voie" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    ADR5<input class="form-control" id="adr5" readonly="" name="adr5" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_ADR5<input class="form-control" id="new_adr5" name="new_adr5" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    CONTACT CP<input class="form-control" id="contact_cp" readonly="" name="contact_cp" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_CONTACT CP<input class="form-control" id="new_contact_cp" name="new_contact_cp" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    CONTACT VILLE<input class="form-control" id="contact_ville" readonly="" name="contact_ville" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_CONTACT VILLE<input class="form-control" id="new_contact_ville" name="new_contact_ville" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    CONTACT TEL<input class="form-control" id="contact_tel" readonly="" name="contact_tel" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_CONTACT TEL<input class="form-control" id="new_contact_tel" name="new_contact_tel" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    TEL1<input class="form-control" id="tel1" readonly="" name="tel1" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_TEL1<input class="form-control" id="new_tel1" name="new_tel1" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_description" data-numfield="12">
                                        <span data-class="traduction-2-12">
                                            <div class="col left">
                                                    <br>
                                                    CONTACT EMAIL<input class="form-control" id="contact_email" readonly="" name="contact_email" type="text">
                                            </div>

                                            <div class="col mid">
                                                <br>
                                                new_CONTACT EMAIL<input class="form-control" id="new_contact_email" name="new_contact_email" type="text">
                                            </div>

                                            <div class="col right">
                                            </div>

                                            <div class="clear">
                                            </div>
                                        </span>
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>Type Accord</label>
                                                    <select class="form-control" id="type_accord" name="type_accord">
                                                        <option value="" selected>-- choisir le type d'accord --</option>
                                                        <option value="Don avec montant">Don avec montant</option>
                                                        <option value="PA">PA</option>
                                                        <option value="Don en ligne">Don en ligne</option>
                                                        <option value="PA en ligne">PA en ligne</option>
                                                        <option value="Promesse Don en ligne">Promesse Don en ligne</option>
                                                        <option value="Promesse Pa en ligne">Promesse Pa en ligne</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>Envoi Courrier </label>
                                                    <select class="form-control" id="envoi_courrier" name="envoi_courrier">
                                                        <option value="" selected>-- choisir le type d'envoi --</option>
                                                        <option value="Avec Courrier">Avec courrier</option>
                                                        <option value="Sans courrier">Sans courrier</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>Cas Particulier </label>
                                                    <select class="form-control" id="cas_particulier" name="cas_particulier">
                                                        <option value="" selected>-- choisir le cas particulier --</option>
                                                        <option value="a arrete son pa">a arrete son pa</option>
                                                        <option value="ambassadeur UNADEV">ambassadeur UNADEV</option>
                                                        <option value="ne veut plus recevoir de courriers">ne veut plus recevoir de courriers</option>
                                                        <option value="ne veut plus recevoir appels de cette association">ne veut plus recevoir appels de cette association</option>
                                                        <option value="risque fort de plainte">risque fort de plainte</option>
                                                        <option value="personne mineure">personne mineure</option>
                                                        <option value="Bonne personne mais pas ancien donateur">Bonne personne mais pas ancien donateur</option>
                                                        <option value="deja en pa">deja en pa</option>
                                                        <option value="sous tutelle">sous tutelle</option>
                                                        <option value="Mécontent association">Mécontent association</option>
                                                        <option value="Ressort de l'Etat">Ressort de l'Etat</option>
                                                        <option value="Opposé aux PA">Opposé aux PA</option>
                                                        <option value="Refus conjoint">Refus conjoint</option>
                                                        <option value="Trop sollicité asso/entreprises">Trop sollicité asso/entreprises</option>
                                                        <option value="Donne 1 fois par an ou fin année">Donne 1 fois par an ou fin année</option>
                                                        <option value="Refus suite Coronavirus">Refus suite Coronavirus</option>
                                                        <option value="recu fiscal">recu fiscal</option>
                                                        <option value="Cash investigations">Cash investigations</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row" id="montant_donDiv" style="display:none">
                                        
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>MONTANT DON</label>
                                                <input type="number" min="0" name="" id="montant_don" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Déduction</label>
                                                <input type="text" readonly name="" id="deduction" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Final</label>
                                                <input type="text" readonly name="" id="montantfinal" class="form-control">
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>PA MONTANT</label>
                                                <input type="number" min="0" name="" id="montant_pa" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Déduction</label>
                                                <input type="text" readonly name="" id="deductionUn" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Final</label>
                                                <input type="text" readonly name="" id="montantfinalUn" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Frequence PA</label>
                                                <select class="form-control" name="frequence_pa" id="frequence_pa">
                                                    <option value="">-- Veuillez choisir la frequence PA--</option>
                                                    <option value="mensuel">Mensuel</option>
                                                    <option value="bimestriel">Bimestriel</option>
                                                    <option value="trimestriel">Trimestriel</option>
                                                    <option value="semestriel">Semestriel</option>
                                                    <option value="annuel">Annuel</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="form-group" dir="ltr" data-prop="field_textarea" data-numfield="33">
                                        <label class="control-label">
                                            <b data-class="traduction-2-33">Commentaire</b>
                                        </label>
                                        <textarea data-elid="33" name="commentaire" id="commentaire" rows="5" cols="6" class="form-control">
                                        </textarea>
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-info" type="submit">VALIDER</button>
                                    </div>
                                </form>
                                <!-- Envoyer un message dans le cas de don ou indices don --> 
                                <div class="form-group" dir="ltr" data-prop="field_button" data-numfield="188">
                                    <a href="" target="_blank" class="btn blue btn-lg send_msg">Envoyer un Message</a>
                                </div>
                                <!-- Modal de qualification de la fiche (appel) -->
                                <div id="myModal2" class="modal " tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h3 id="myModalLabel"></h3>
                                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                    </div>
                                                    <div class="modal-body container">
                                                        <div class="row">
                                                            <form id="Update_dispo">
                                                                @csrf

                                                                <!-- des champs obligatoir pour qualifier une fiche + la qualification -->
                                                                <input type="hidden" name="uniqueid" id="uniqueid">
                                                                <input type="hidden" name="list_id" id="list_id">
                                                                <input type="hidden" name="called_count" id="called_count">
                                                                <input type="hidden" name="lead_id" id="lead_id1">
                                                                <!-- affichage de chronometre (temp d'appel) -->
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <div id="timeINCALL1"></div>
                                                                    </div>
                                                                </div>
                                                                <!-- les Qualif principales non selectable-->
                                                                <div class="row container text-canter">
                                                                    @isset($statuses)
                                                                        @foreach($statuses as $key => $status)
                                                                            <?php $abrv = mb_substr($status->status, 0, 2) ?>
                                                                            <?php $abrv3 = mb_substr($status->status, 0, 3) ?>
                                                                            <?php $listStatuslength = strlen($status->status) ?>
                                                                            @if(Session::get('campaign') == 2000202)
                                                                                @if($abrv == "DR" && $listStatuslength == 4)
                                                                                    <div class="col-md-4">
                                                                                        <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                    </div>
                                                                                @elseif($abrv == "DE" && $listStatuslength == 3)
                                                                                    <div class="col-md-4">
                                                                                        <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                    </div>
                                                                                @elseif($abrv == "VR" && $listStatuslength == 2)
                                                                                    <div class="col-md-4">
                                                                                        <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                    </div>
                                                                                @endif
                                                                            @endif
                                                                            
                                                                            @if($abrv == "DM" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>
                                                                            @elseif($abrv == "DL" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div> 
                                                                            @elseif($abrv3 == "FNM" && $listStatuslength ==3)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>
                                                                            
                                                                            @elseif($abrv == "HC" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>
                                                                            @elseif($abrv == "PA" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>
                                                                            @elseif($abrv == "PL" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>
                                                                            @elseif($abrv == "RA" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div> 
                                                                            @elseif($abrv == "RR" && $listStatuslength == 2)
                                                                                <div class="col-md-4">
                                                                                    <input type="radio" class="qualif" data-value="{{$status->status}}" name="qualif">
                                                                                    <label> {{$status->status_name}}</label>
                                                                                </div>

                                                                            @endif
                                                                                
                                                                        @endforeach
                                                                    @endisset
                                                                    <div class="col-md-4">
                                                                        <input type="radio" class="qualif" data-value="qualifAutre" name="qualif">
                                                                        <label> Autres Qualificiations</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="radio" class="sub_qualif" data-value="CALLBK" name="sub_qualif" value="CALLBK">
                                                                        <label> RAPPEL </label>
                                                                    </div>
                                                                </div>
                                                                <!-- le sous qualif  selectable -->
                                                                <div class="row">
                                                                    <div class="col-md-12 text-center">
                                                                        <ul class="list-group list-group-flush">
                                                                        @isset($statuses)
                                                                            @foreach($statuses as $key => $status)
                                                                                <?php $abrv = mb_substr($status->status, 0, 2) ?>
                                                                                <?php $abrv3 = mb_substr($status->status, 0, 3) ?>
                                                                                <?php $abrv4 = mb_substr($status->status, 0, 4) ?>
                                                                                <?php $listStatuslength = strlen($status->status) ?>
                                                                            @if(Session::get('campaign') == 2000202)
                                                                                @if($abrv4 == "DRCF" && $listStatuslength > 4)
                                                                                    <li class="list-group-item sub_qualif{{$abrv4}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv3 == "DES" && $listStatuslength > 3)
                                                                                    <li class="list-group-item sub_qualif{{$abrv3}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "VR" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @endif
                                                                            @endif

                                                                                @if($abrv == "DM" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "DL" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label> 
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv3 == "FNM" && $listStatuslength > 3)
                                                                                    <li class="list-group-item sub_qualif{{$abrv3}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>

                                                                                @elseif($abrv == "HC" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "PA" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "PL" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "RA" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label> 
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($abrv == "RR" && $listStatuslength > 2)
                                                                                    <li class="list-group-item sub_qualif{{$abrv}} allsub_qualif" style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @elseif($status->status == "DOUBL" || $status->status == "IND" || $status->status == "INDOLD" || $status->status == "RP" || $status->status == "REL" || $status->status == "REP" || $status->status == "MPAREL" || $status->status == "RCH")
                                                                                    <li class="list-group-item sub_qualifAutre allsub_qualif"  style="display: none;">
                                                                                        <div class="card-body">
                                                                                        <input type="radio" class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}">
                                                                                        <label> {{$status->status_name}}</label>
                                                                                        </div>
                                                                                    </li>
                                                                                @endif

                                                                            @endforeach
                                                                        @endisset
                                                                                
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-12 container">
                                                                    <div class="text-canter">
                                                                        <input type="checkbox" name="agent_status" id="agent_status" value="1">  Met en pause apres la qualificiation
                                                                    </div>
                                                                </div>
                                                                <!-- bloc de calendrier (si la quallif = callback) -->
                                                                <div class="row form-group" style="display:none" id="divCalendar">
                                                                    
                                                                    <div class="form-group col-md-12">
                                                                        <div data-role="calendar" id="calendar"  data-wide-point="sm" data-buttons="false" data-on-day-click="myFunctionDate"></div>
                                                                    
                                                                        <input type="hidden" name="date" id="date" class="form-control">
                                                                    </div>
                                                                    <div class="form-group col-md-4 col-sm-4 col-lg-4">
                                                                        <label for="Hour">Heure :</label>
                                                                        <input type="time" name="hour" id="hour" class="form-control">
                                                                    </div>
                                                                    <div class="form-group col-md-4 col-sm-4 col-lg-4">
                                                                        <input type="checkbox" name="CallBackOnlyMe" id="CallBackOnlyMe">  MY CALLBACK ONLY
                                                                    </div>
                                                                    <div class="form-group col-md-12">
                                                                        <label for="comment">Comment :</label>
                                                                        <input name="comments" id="comments" class="form-control">
                                                                    </div>
                                                                </div>
                                                                <div class="row form-group">

                                                                    <div class="text-center">
                                                                        <button class="btn btn-success" type="submit"><i class="fa fa-save"></i>Valider</button>
                                                                    </div>
                                                                </div>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- modal pour afficher les type de pauses (dej,caf,form) -->
            @include('Agent.includes.modals.pause')
            <!-- Modal En Attente d'un appel -->
            
        </div>
        
    </div>
</div>
<audio id="audioNotify" src="{{asset('audio_notification.wav')}}" type="audio/wav" autoplay="true">
     
</audio> 
<!-- affichage de webphone -->
<div class="row">
    <div class="col-md-8" style="display:none">
        <iframe src="{{$WebPhonEurl}}"  id="webphone" name="webphone" width="460px" height="500px" allow="microphone *; speakers *;"> </iframe>
    </div>
    <div class="col-md-4">
        <button class="btn btn-success" id="webphone1"> WebPhone</button>
    </div>
    <!-- session id -->
    <!-- <div class="col-md-3">
        <p>Session Id : {{Session::get('conf_exten')}}</p>
    </div> -->
</div>
<!-- affiche les channels active pour un agent -->
<!-- <div class="row">
    <div class="col-md-12">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Channel</th>
                    <th>Hangup</th>
                    <th>Volum</th>
                </tr>
            </thead>
            <tbody id="channelLive">
                
            </tbody>
        </table>
    </div>
</div> -->
 

<main class="login-form" style="display:none">
    <div class="cotainer">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card">
                    @if($etat == 200)
                        <div class="alert alert-success text-center">
                            {{$msg}}
                        </div>
                    @elseif($etat == 401)
                        <div class="alert alert-danger text-center">
                            {{$msg}}
                        </div>
                    @endif
                    USER : {{$user}}
                    PASS : {{$user}}


                    <div>
                        <input type="text" name="agent_status" id="agent_status" value="">
                        <input type="text" value="{{$etatAgent}}" id="etat_agent">
                        <input name="phone_code" type="text" class="form-control" id="phone_code" />
                        <button class="btn btn-success" data-value="PAUSED" id="agentStatusButton">Démarrer la production</button>
                        <div id="temppaused"></div>
                        <!--a href="{{route('change_status',$etatAgent)}}" class="btn @if($etatAgent == 'PAUSED') btn-success @else($etatAgent == 'READY') btn-primary @endif">
                            @if($etatAgent == 'PAUSED') Démarrer la production @else($etatAgent == 'READY') Vous etes ACTIVE @endif
                        </a-->
                        <a href="{{route('logout')}}" class="btn btn-info">Logout</a>

                        <button class="btn btn-danger" onclick="hangup()">Hangup</button>
                        <input type="text" id="channel" value=''>
                        <input type="text" id="lead_id" value=''>

                    </div>


                </div>
            </div>
        </div>
        
        
    </div>
</main>
<script src="{{asset('assets/admin/js/jquery-2.1.1.min.js')}}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{asset('assets/agents/metro.min.js')}}"></script>
<script src="https://unpkg.com/@fullcalendar/core@4.3.1/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/interaction@4.3.0/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/daygrid@4.3.0/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/timegrid@4.3.0/main.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js"></script>

<!-- <script type="text/javascript">
    //////////// get All chanel For user connected
    $(document).ready(function(){
        
        channel = setInterval(function(){

            $.ajax({
                url: 'get_channel_live',
                type: "get",
                success:function(response)
                {   
                    
                    channelslive = response.channels;
                    if(response.etat == 200){
                        $('#channelLive').empty();
                        channelslive.forEach(element =>
                                {       
                                        var l = element.channel;
                                        firstlettre = l.slice(0, 5);
                                        console.log(firstlettre);
                                        if(firstlettre == "Local"){
                                            var ll = 'recording';
                                        }else{
                                            var ll = 'HANGUP';
                                        }                          
                                        $('#channelLive').append(`
                                            <tr>
                                                <td>1</td>
                                                <td>${element.channel}</td>
                                                <td>${ll}</td>
                                                <td></td>
                                            </tr>
                                        `); 
                                    
                                });
                        //clearInterval(channel);
                    }

                },
            });
        },3000);
    })
</script> -->

<script type="text/javascript">
    //// change pause code  
    $('.pause_codes').click(function(){
        var pause_code = $(this).attr("data-value");
        //alert(pause_code);
        $.ajax({
            url: 'change_pause_code/'+pause_code,   /// send status in request
            type: "get",
            success:function(response)
            {   
                status = response.etat;
                pauseCode = response.pause_code;
                 if(status == 200){
                    //$("#PauseModal").modal("show");
                    if(pauseCode == "DEJ"){
                        $('#imgForm').css('display','none');
                        $('#imgBrief').css('display','none');
                        $('#imgCaf').css('display','none');
                        $('#imgDej').css('display','block');
                    }else if(pauseCode == 'CAF'){
                        $('#imgForm').css('display','none');
                        $('#imgBrief').css('display','none');
                        $('#imgDej').css('display','none');
                        $('#imgCaf').css('display','block');
                    }
                    else if(pauseCode == 'BRIEF'){
                        $('#imgForm').css('display','none');
                        $('#imgDej').css('display','none');
                        $('#imgCaf').css('display','none');
                        $('#imgBrief').css('display','block');
                    }
                    else if(pauseCode == 'FORM'){
                        $('#imgDej').css('display','none');
                        $('#imgCaf').css('display','none');
                        $('#imgBrief').css('display','none');
                        $('#imgForm').css('display','block');
                    }
                    $("#PauseModal").modal({backdrop: 'static', keyboard: false}, 'show');
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'erreur de systéme, veuillez contacter le support',
                        showConfirmButton: true,
                        timer: 5000
                    });
                }
            },
        });
    });
</script>
<script>
    function myFunctionDate(sel, day, el){
        document.getElementById('date').value = sel;
    }
    /*$('#play').click(function(){
        let sound = document.getElementById("audioNotify");
        sound.play();
    });*/

    ////change status (start production (READY) , stop production (PAUSED)) quand en click sur button 
    /// demmarer la production ou retour au menu principale
    $(".agentStatusButton").click(function(){
        status = $(".agentStatusButton").attr("data-value"); // get user live status
        if(status == 'QUEUE' || status == 'INCALL'){
            status = 'READY';
        }
            $.ajax({
                url: 'change_status/'+status,   /// send status in request
                type: "get",
                success:function(response)
                {
                    if(response.etat == 200){
                        $(".agentStatusButton").attr("data-value",response.etatAgent);                                
                        document.getElementById('etat_agent').value = response.etatAgent;
                        if(response.etatAgent == 'PAUSED'){
                           
                            $(".dashboard_panel").removeClass('darkBackground');
                            $('.bloc_attente').css('display','none');
                            $('.dashboard_agent').css('display','block');
                            $(".agentStatusButton").empty();
                            $(".agentStatusButton").html('Démarrer la production');
                        }
                        if(response.etatAgent == 'READY'){
                            $("#PauseModal").modal("hide");
                            $(".dashboard_panel").addClass('darkBackground');
                            $('.dashboard_agent').css('display','none');
                            $('.bloc_attente').css('display','block');
                            $(".agentStatusButton").empty();
                            $(".agentStatusButton").append(`<i
                            class="fa fa-arrow-circle-o-left"></i> Retour au menu Principal `);
                        }
                    }
                },
            });
    });

    ///// lancer le viciphone

    $("#webphone1").click(function(){        
        $.ajax({
            url: 'activate_webphone',
            type: "get",
            success:function(response)
            {   
                toastr.options = {
                      "progressBar": true,
                      "positionClass": "toast-top-right",
                      "timeOut": "4000",
                      "extendedTimeOut": "1000",
                      "showEasing": "swing",
                      "hideEasing": "linear",
                      "showMethod": "fadeIn",
                      "hideMethod": "fadeOut"
                    }
                if(response.etat == 200){
                    toastr.success('webphone is activated');
                }else{
                    toastr.error('webphone Not Activated');
                }
            },
        });
    });
    ////// webphone wille be activated after 6 sec
    $(document).ready(function(){
        incall = setInterval(function(){
            $.ajax({
                url: 'activate_webphone',
                type: "get",
                success:function(response)
                {   
                    if(response.etat == 200){toastr.success('webphone is activated'); clearInterval(incall); }
                    else{ toastr.error('webphone Not Activated'); }
                },
            });
        },6000);
    });
     ///// get channel and leadId for the live call (CONTACT CALL)
    $(document).ready(function(){
        getchannel = setInterval(function(){  
            var etat = $("#etat_agent").val();
            if(etat == 'READY'){
                chan = document.getElementById('channel').value;
                if(chan == null || chan == ''){
                        $.ajax({
                            url: 'get_channel/',
                            type: "GET",
                            success:function(response)
                            {
                                status = response.etat;
                                msg = response.msg;
                                if(status == 200){
                                    //console.log(response);                                    
                                    start();
                                    lead_id = response.lead_id;
                                    channel = response.channel;
                                    document.getElementById('channel').value = channel;
                                    //channel.setAttribute('value', channel);
                                    document.getElementById('lead_id').value = lead_id;
                                    $('.send_msg').attr('href', 'send_msg_contact/'+lead_id); /// add url to button send message or email to contact
                                    $(".dashboard_panel").removeClass('darkBackground');
                                    $('.bloc_incall').css('display','block');
                                    $('.bloc_attente').css('display','none');
                                    $('.dashboard_agent').css('display','none'); 
                                    $('#class').css('display','block'); 
                                    $('#racc').css('display','block'); 
                                    $('#ReClass').css('display','none');
                                    $('#timeINCALL').css('display','block'); 
                                }
                            },
                        });
                    }
                }  
            },1000);
    });

    function start(){
        ChangeToIncallIntervale = setInterval(ChangeToIncall, 1000);
    }

    // Function to stop setInterval call
    function stop(){
        clearInterval(ChangeToIncallIntervale);
    }
    ////change agent stat to incall and get contact information for the live call
    //const ChangeToIncallIntervale = setInterval(ChangeToIncall, 1000);

    function ChangeToIncall()
    {
        phone = document.getElementById('tel1').value;
        if(phone == null || phone == ''){}
        else{
        }
        chan = document.getElementById('channel').value;

        if(chan == null || chan == ''){
        }else{    
            $.ajax({
                url: 'change_to_incall/',
                type: "GET",
                success:function(response)
                {
                    status = response.etat;
                    msg = response.msg;
                    if(status == 200){ 
                        stop();
                        $(".dashboard_panel").removeClass('darkBackground');
                        $('.bloc_incall').css('display','block');
                        $('.bloc_attente').css('display','none');
                        $('.dashboard_agent').css('display','none'); 
                        $('#class').css('display','block'); 
                        $('#racc').css('display','block'); 
                        $('#ReClass').css('display','none');
                        $('#timeINCALL').css('display','block'); 
                        
                        document.getElementById('first_name').value = response.first_name;
                        document.getElementById('last_name').value = response.last_name;
                        document.getElementById('adr1').value = response.address1;
                        document.getElementById('city').value = response.city;
                        document.getElementById('postal_code').value = response.postal_code;
                        document.getElementById('phone_number').value = response.phone_number;
                        document.getElementById('alt_phone').value = response.alt_phone;
                        document.getElementById('email').value = response.email;
                        document.getElementById('commentaire').value = response.comments;

                        document.getElementById('agentchannel').value = response.agentchannel;
                        document.getElementById('uniqueid').value = response.uniqueid;
                        document.getElementById('list_id').value = response.list_id;
                        document.getElementById('lead_id').value = response.lead_id;
                        document.getElementById('lead_id1').value = response.lead_id;
                        document.getElementById('called_count').value = response.called_count;
                        /////////
                        document.getElementById('phone_code').value = '33';
                        /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${response.tel1}</span> / <span><i class="text-success fa fa-fax"></i>${response.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${response.adr4_libelle_voie}</span> / ${response.contact_cp} / ${response.contact_ville} / ${response.adr1_civilite_abrv} / ${response.contact_nom} / ${response.contact_prenom}`);*/
                    }
                },
            });
        
        }
    }
    ///// get Status and start chrono if status == INCALL
    $(document).ready(function(){
        const getStatus = setInterval(function(){ 
            
            lead_id = document.getElementById('lead_id').value;
            if(lead_id == '' || lead_id == null){
                $.ajax({
                    url: 'get_status/',
                    type: "GET",
                    success:function(response)
                    {
                        status = response.etat;                    
                        etatAgent = response.etatAgent;                    
                        if(status == 200){
                            $.ajax({
                                url: 'get_time_agent/',
                                type: "GET",
                                success:function(response)
                                {
                                    if(response.etat == 200){
                                        time = response.time;
                                        if(time < 3600){ 
                                        heures = 0; 
                                        
                                        if(time < 60){minutes = 0;} 
                                        else{minutes = Math.floor(time / 60);} 
                                        
                                        secondes = Math.floor(time % 60); 
                                        } 
                                        else{ 
                                        heures = Math.floor(time / 3600); 
                                        secondes = Math.floor(time % 3600); 
                                        minutes = Math.floor(secondes / 60); 
                                        } 
                                        
                                        secondes2 = Math.floor(secondes % 60); 
                                        if(heures<10){
                                            heures = '0' + heures;
                                        }
                                        if(minutes<10){
                                            minutes = '0' + minutes;
                                        }
                                        if(secondes2<10){
                                            secondes2 = '0' + secondes2;
                                        }
                                        afficher = heures + ":" + minutes + ":" + secondes2 ;
                                        if(etatAgent == 'PAUSED'){
                                            document.getElementById("timePAUSED").innerHTML = afficher;
                                            document.getElementById("timePAUSEDAgent").innerHTML = afficher;
                                            
                                        }
                                        if(etatAgent == 'READY'){

                                            document.getElementById("timeREADY").innerHTML = afficher;
                                        }
                                        
                                    }
                                }
                            }); 
                        }
                    },
                });
            }
            else{
                $.ajax({
                    url: 'get_status/',
                    type: "GET",
                    success:function(response)
                    {
                        status = response.etat;                    
                        if(status == 200){
                            if(response.etatAgent == 'INCALL'){
                                $.ajax({
                                    url: 'refresh_incall/',
                                    type: "GET",
                                    success:function(response)
                                    {},
                                }); 
                                $("time").css('display','none');
                                $.ajax({
                                    url: 'get_time_incall/'+lead_id,
                                    type: "GET",
                                    success:function(response)
                                    {
                                        if(response.etat == 200){
                                            time = response.time;
                                            if(time < 3600){ 
                                            heures = 0; 
                                            
                                            if(time < 60){minutes = 0;} 
                                            else{minutes = Math.floor(time / 60);} 
                                            secondes = Math.floor(time % 60); 
                                            } 
                                            else{ 
                                            heures = Math.floor(time / 3600); 
                                            secondes = Math.floor(time % 3600); 
                                            minutes = Math.floor(secondes / 60); 
                                            } 
                                            secondes2 = Math.floor(secondes % 60); 
                                            if(heures<10){
                                                heures = '0' + heures;
                                            }
                                            if(minutes<10){
                                                minutes = '0' + minutes;
                                            }
                                            if(secondes2<10){
                                                secondes2 = '0' + secondes2;
                                            }
                                            afficher = heures + ":" + minutes + ":" + secondes2 ;
                                            document.getElementById("timeINCALL").innerHTML = afficher;
                                            document.getElementById("timeINCALL1").innerHTML = afficher;
                                        }
                                    }
                                });
                                
                            }
                            

                        }
                    },
                }); 
            } 
        },1000);
    });
    ///// hangup a live call and chanel
    function hangupQualif() {
        $("#myModal2").modal("hide");
        $("#divCalendar").css('display','none');
        $('.sub_qualifDM').css('display','none');
        $('.sub_qualifDL').css('display','none');
        $('.sub_qualifFNM').css('display','none');
        $('.sub_qualifHC').css('display','none');
        $('.sub_qualifPA').css('display','none');
        $('.sub_qualifPL').css('display','none');
        $('.sub_qualifRA').css('display','none');
        $('.sub_qualifRR').css('display','none');
        $('#divCalendar').css('display','none');
        $('.sub_qualifAutre').css('display','none');
        $("input[type='radio'][class='qualif']:checked").prop('checked', false);
        $("input[type='radio'][class='sub_qualif']:checked").prop('checked', false);

        document.getElementById('date').value = '';
        document.getElementById('hour').value = '';
        document.getElementById('CallBackOnlyMe').value = '';
        document.getElementById('comments').value = '';
    
        //e.preventDefault();
        channel = document.getElementById('channel').value;
        agentchannel = document.getElementById('agentchannel').value;
        if(channel == null || channel == ''){
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Aucun appel en cours',
                showConfirmButton: true,
                timer: 5000
            });
        }
        else{
            called_count = document.getElementById('called_count').value;
            uniqueid = document.getElementById('uniqueid').value;
            lead_id = document.getElementById('lead_id1').value;
            list_id = document.getElementById('list_id').value;
            phone_number = document.getElementById('tel1').value;
            phone_code = document.getElementById('phone_code').value;
            $.ajax({
                url: 'hangup/',
                data: {
                    called_count:called_count,
                    uniqueid:uniqueid,
                    lead_id:lead_id,
                    list_id:list_id,
                    phone_number:phone_number,
                    phone_code:phone_code,
                    channel:channel,
                    agentchannel:agentchannel
                },
                type: "get",
                success:function(response)
                {
                    $("#myModal2").modal("show");
                    if(response.etat == 200){
                        statuses = response.statuses;
                        document.getElementById('first_name').value = '';
                        document.getElementById('last_name').value = '';
                        document.getElementById('adr1').value = '';
                        document.getElementById('city').value = '';
                        document.getElementById('postal_code').value = '';
                        document.getElementById('phone_number').value = '';
                        document.getElementById('alt_phone').value = '';
                        document.getElementById('email').value = '';
                        document.getElementById('commentaire').value = '';
                    }
                },
            });
        }  
    }
    function hangup() {
        $("#myModal2").modal("hide");
        //e.preventDefault();
        channel = document.getElementById('channel').value;
        agentchannel = document.getElementById('agentchannel').value;
        //// si channel ne s'affiche pas (aucun appel) on affiche un alert 
        if(channel == null || channel == ''){
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Aucun appel en cours',
                showConfirmButton: true,
                timer: 5000
            });
        }
        else{
            called_count = document.getElementById('called_count').value;
            uniqueid = document.getElementById('uniqueid').value;
            uniqueid1 = document.getElementById('uniqueid1').value;
            lead_id = document.getElementById('lead_id1').value;
            list_id = document.getElementById('list_id').value;
            phone_number = document.getElementById('tel1').value;
            phone_code = document.getElementById('phone_code').value;
            $.ajax({
                url: 'hangup/',
                data: {
                    called_count:called_count,
                    uniqueid:uniqueid,
                    uniqueid1:uniqueid1,
                    lead_id:lead_id,
                    list_id:list_id,
                    phone_number:phone_number,
                    phone_code:phone_code,
                    channel:channel,
                    agentchannel:agentchannel
                },
                type: "get",
                success:function(response)
                {
                    if(response.etat == 200){
                        statuses = response.statuses;          
                    }
                },
            });
        }  
    }

    ///// afficher le div pour ajouter les montants des don ou pa
    $('#envoi_courrier').change(function() {
        if(this.value != null || this.value != ''){
            $('#montant_donDiv').css('display','block');
        }else{
            $('#montant_donDiv').css('display','none');
        }
    });
    ///// lancer un appel manuel 
    function ManualDial(phoneNumber){
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
        document.getElementById('adr1').value = '';
        document.getElementById('city').value = '';
        document.getElementById('postal_code').value = '';
        document.getElementById('phone_number').value = '';
        document.getElementById('alt_phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('commentaire').value = '';

        document.getElementById('list_id').value = '';
        document.getElementById('lead_id').value = '';
        document.getElementById('lead_id1').value = '';
        document.getElementById('called_count').value = '';
        document.getElementById('uniqueid1').value = '';
        $('#montant_donDiv').css('display','none');
        $.ajax({
            url: 'manual_dial',
            type: "get",
            data:{
                    "_token":"{{csrf_token()}}",
                    phone_number:phoneNumber,
                },
            success:function(response)
            {   
                
                status = response.etat;
                msg = response.msg;

                if(status == 200){
                    start();
                    lead = response.lead;
                    uniqueid = response.uniqueid;
                    channel = response.channel;
                    agentchannel = response.agentchannel;
                    $(".dashboard_panel").removeClass('darkBackground');
                    $('.bloc_incall').css('display','block');
                    $('.bloc_attente').css('display','none');
                    $('.dashboard_agent').css('display','none');                   
                    document.getElementById('agentchannel').value = agentchannel;
                    document.getElementById('channel').value = channel;
                    document.getElementById('first_name').value = lead.first_name;
                    document.getElementById('last_name').value = lead.last_name;
                    document.getElementById('adr1').value = lead.adr1;
                    document.getElementById('city').value = lead.city;
                    document.getElementById('postal_code').value = lead.postal_code;
                    document.getElementById('phone_number').value = lead.phone_number;
                    document.getElementById('alt_phone').value = lead.alt_phone;
                    document.getElementById('email').value = lead.email;
                    document.getElementById('commentaire').value = lead.comments;
                    ////// new 
                    document.getElementById('uniqueid1').value = uniqueid;
                    document.getElementById('list_id').value = lead.list_id;
                    document.getElementById('lead_id').value = lead.lead_id;
                    document.getElementById('lead_id1').value = lead.lead_id;
                    document.getElementById('called_count').value = lead.called_count;
                    /////////
                    document.getElementById('phone_code').value = '33';
                    /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.tel1}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom}`);*/
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: msg,
                        showConfirmButton: true,
                        timer: 500
                    });
                }
                    
                },
        });
    };
    function getContactInfo(lead_id){
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
        document.getElementById('adr1').value = '';
        document.getElementById('city').value = '';
        document.getElementById('postal_code').value = '';
        document.getElementById('phone_number').value = '';
        document.getElementById('alt_phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('commentaire').value = '';
        /////
        document.getElementById('list_id').value = '';
        document.getElementById('lead_id').value = '';
        document.getElementById('lead_id1').value = '';
        document.getElementById('called_count').value = '';

        $('#montant_donDiv').css('display','none');
        $.ajax({
            url: 'get_lead_info/'+lead_id,
            type: "get",
            data:{
                    "_token":"{{csrf_token()}}",
                },
            success:function(response)
            {   
                status = response.etat;
                msg = response.msg;
                console.log(response.lead);
                if(status == 200){
                    lead = response.lead;
                    $('#manDial').empty()
                    $('#manDial').append(`<button class="btn btn-success" onclick=ManualDial(${lead.contact_tel})><i class="fa fa-phone"></i> Appeler</button>`); /// add url to button send
                    $('.send_msg').attr('href', 'send_msg_contact/'+lead.lead_id);
                    $(".dashboard_panel").removeClass('darkBackground');
                    $('#ReClass').css('display','block');
                    $('#class').css('display','none');
                    $('#timeINCALL').css('display','none');
                    $('#racc').css('display','none');
                    $('.bloc_incall').css('display','block');
                    $('.bloc_attente').css('display','none');
                    $('.dashboard_agent').css('display','none');                   

                    document.getElementById('first_name').value = lead.first_name;
                    document.getElementById('last_name').value = lead.last_name;
                    document.getElementById('adr1').value = lead.address1;
                    document.getElementById('city').value = lead.city;
                    document.getElementById('postal_code').value = lead.postal_code;
                    document.getElementById('phone_number').value = lead.phone_number;
                    document.getElementById('alt_phone').value = lead.alt_phone;
                    document.getElementById('email').value = lead.email;
                    document.getElementById('commentaire').value = lead.comments;
                        /////
                    document.getElementById('list_id').value = lead.list_id;
                    document.getElementById('lead_id').value = lead.lead_id;
                    document.getElementById('lead_id1').value = lead.lead_id;
                    document.getElementById('called_count').value = lead.called_count;
                    /////////
                       
                    
                    document.getElementById('phone_code').value = '33';
                    /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.tel1}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom}`);*/
                    
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: msg,
                        showConfirmButton: true,
                        timer: 500
                    });
                }
                    
                },
        });
    };
    function retour(){
        $(".dashboard_panel").removeClass('darkBackground');
        $('.bloc_incall').css('display','none');
        $('.bloc_attente').css('display','none');
        $('.dashboard_agent').css('display','block');

    }
    function requalifier() {
        $("#myModal2").modal("show"); 
    }
    ///// change qualif for contact and save it
    $(document).on('click', '.qualif', function () {
        var value;
        value = $(this).attr('data-value');
        $(".allsub_qualif").css('display','none');
        $(".sub_qualif"+value).css('display','block');
        if(value == 'CALLBK'){$('#divCalendar').css('display','block');}else{$('#divCalendar').css('display','none');}
        if(value == 'qualifAutre'){$('.sub_qualifAutre').css('display','block');}else{$('.sub_qualifAutre').css('display','none');}
        //alert(value);
    });

    ///// une fonction pour afficher les sous qualif de chaque qualif
    $(document).on('click', '.sub_qualif', function () {
        var value;
        value = $(this).attr('data-value');
        if(value == 'CALLBK'){$('#divCalendar').css('display','block');}else{$('#divCalendar').css('display','none');}
    });
     ////// send a request every 40 sec to get notification for callback (rappel)
    const getCallbackLive = setInterval(getLiveCallBack, 40000);
    function getLiveCallBack(){
        $.ajax({
            url: 'get_live_callback',
            type: "get",
            success:function(response)
            {       
                lead = response.lead;
                //console.log(lead);
                if(response.etat == 200){
                    
                    document.getElementById('callback_notification').innerHTML = 1;
                    $('#callback_info').html(`
                        <li>
                            <a class="" onclick=getContactInfo(${lead.lead_id})>
                                <span class="text-info" style="font-size:15px">${lead.first_name}</span>
                                <span class="text-info" style="font-size:15px">${lead.last_name}</span><br>
                                <span class="text-danger">+${lead.phone_code} ${lead.phone_number}</span>
                            </a>
                        <li>`); /// add url to button send
                    let sound = document.getElementById("audioNotify");
                    sound.play();
                    //document.getElementById("play").addEventListener("click", sound);
                    clearInterval(getCallbackLive);
                }
                else{ 
                    document.getElementById('callback_notification').innerHTML = 0;
                    $('#callback_info').html(``); /// add url to button send 
                }
            },
        });
    }
 
    $('#Update_dispo').on('submit',function(e){
        e.preventDefault();
        var value;    
        value = $("input[type='radio'][class='sub_qualif']:checked").val();
        
        let uniqueid = $('#uniqueid').val();
        let uniqueid1 = $('#uniqueid1').val();
        let list_id = $('#list_id').val();
        let called_count = $('#called_count').val();
        let lead_id1 = $('#lead_id1').val();
        let agent_status = $('#agent_status:checked').val();
        let hour = $('#hour').val();
        let date = $('#date').val();
        let comments = $('#comments').val();
        let CallBackOnlyMe = $('#CallBackOnlyMe').val();        
        if(CallBackOnlyMe == 'on'){
            CallBackrecipient = 'USERONLY';            
        }else{
            CallBackrecipient = 'ANYONE';
        }        
        $.ajax({
            url: 'Update_dispo/',
            type: "get",
            data:{
                "_token":"{{csrf_token()}}",
                uniqueid:uniqueid,
                uniqueid1:uniqueid1,
                list_id:list_id,
                called_count:called_count,
                lead_id:lead_id1,
                agent_status:agent_status,
                dispo_choice:value,
                CallBackrecipient:CallBackrecipient,
                hour:hour,
                date:date,
                comments:comments,
            },
            success:function(response)
            {   
                $("#myModal2").modal("hide");
                status = response.etat;
                msg = response.msg;
                if(status == 200){
                    document.getElementById('channel').value = '';
                    document.getElementById('lead_id').value = '';
                    document.getElementById('uniqueid').value = '';
                    document.getElementById('lead_id1').value = '';
                    document.getElementById('list_id').value = '';
                    document.getElementById('first_name').value = '';
                    document.getElementById('last_name').value = '';
                    document.getElementById('adr1').value = '';
                    document.getElementById('city').value = '';
                    document.getElementById('postal_code').value = '';
                    document.getElementById('phone_number').value = '';
                    document.getElementById('alt_phone').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('commentaire').value = '';
                    document.getElementById('comments').value = '';

                   /////////
                    document.getElementById('phone_code').value = '';          
                    $(".agentStatusButton").attr("data-value",response.etatAgent);                                
                    $(".agentStatusButton").html(response.etatAgent);
                    document.getElementById('etat_agent').value = response.etatAgent;
                    $('.bloc_incall').css('display','none');
                    $('.time1').css('display','none');
                    
                    if(response.etatAgent == 'PAUSED'){
                        $(".dashboard_panel").removeClass('darkBackground');
                        $('.bloc_attente').css('display','none');
                        $('.dashboard_agent').css('display','block');
                        $(".agentStatusButton").empty();
                        $(".agentStatusButton").html('Démarrer la production');

                    }

                    if(response.etatAgent == 'READY'){
                        

                        $(".dashboard_panel").addClass('darkBackground');
                        $('.dashboard_agent').css('display','none');
                        $('.bloc_attente').css('display','block');
                        $(".agentStatusButton").empty();
                        $(".agentStatusButton").append(`<i
                        class="fa fa-arrow-circle-o-left"></i> Retour au menu Principal `);

                    }
                    //const ChangeToIncallIntervale = setInterval(ChangeToIncall, 1000);
                    //setInterval(ChangeToIncall, 1000);
                    //setInterval(getLiveCallBack, 40000);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: msg + ' ' +response.dispo_choice,
                        showConfirmButton: true,
                        timer: 500
                    });

                    ////// a refaiore la requete//////////////////
                    /*$.ajax({
                        url: 'get_live_statistic_agent/',
                        type: "GET",
                        success:function(response)
                        {    
                            if(response.etat == 200){
                            //// send request to controller to get live statistic agent CU, CU+, called_acount....
                                var prctArgumente = Math.round((response.qualifArg /response.fiches)*100,2);
                                var prctPositif = Math.round((response.qualifPos /response.fiches)*100,2);
                                //var prctArgumente = (response.qualifArg /response.fiches)*100;
                                document.getElementById("nbrArgumente").innerHTML = response.qualifArg;
                                document.getElementById("prctArgumente").innerHTML = prctArgumente;
                                document.getElementById("nbrPositif").innerHTML = response.qualifPos;
                                document.getElementById("prctPositif").innerHTML = prctPositif;
                                document.getElementById("nbrNoArgumente").innerHTML = response.nonArgumenter;
                                document.getElementById("nbrRDV").innerHTML = response.fiches;
                                document.getElementById("presenceTime").innerHTML = response.heure_presence;
                                document.getElementById("debriefTime").innerHTML = response.debrief;
                                document.getElementById("cafeTime").innerHTML = response.pause;
                                document.getElementById("prodTime").innerHTML = response.heure_prod;
                                document.getElementById("non_argumenter").innerHTML = response.nonArgumenter;
                                document.getElementById("argumenter").innerHTML = response.qualifArg;
                                document.getElementById("pourc_argumenter").innerHTML = prctArgumente;
                                document.getElementById("positive").innerHTML = response.qualifPos;
                                document.getElementById("pourc_positive").innerHTML = prctPositif;
                                document.getElementById("fiches").innerHTML = response.fiches;
                            }
                        },
                    });*/

                }else if(status == 401){
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: msg,
                        showConfirmButton: true,
                        timer: 1000
                    });
                }
                else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: msg,
                        showConfirmButton: true,
                        timer: 500
                    });
                }
                    
                },
        });
    });

    //// get Agent statictics
    $(document).ready(function(){
       /*setInterval(function(){
            $.ajax({
                url: 'get_live_statistic_agent/',
                type: "GET",
                success:function(response)
                {
                    
                    if(response.etat == 200){
                        var prctArgumente = Math.round((response.qualifArg /response.fiches)*100,2);
                        var prctPositif = Math.round((response.qualifPos /response.fiches)*100,2);
                        //var prctArgumente = (response.qualifArg /response.fiches)*100;
                        document.getElementById("nbrArgumente").innerHTML = response.qualifArg;
                        document.getElementById("prctArgumente").innerHTML = prctArgumente;
                        document.getElementById("nbrPositif").innerHTML = response.qualifPos;
                        document.getElementById("prctPositif").innerHTML = prctPositif;
                        document.getElementById("nbrNoArgumente").innerHTML = response.nonArgumenter;
                        document.getElementById("nbrRDV").innerHTML = response.fiches;
                        document.getElementById("presenceTime").innerHTML = response.heure_presence;
                        document.getElementById("debriefTime").innerHTML = response.debrief;
                        document.getElementById("cafeTime").innerHTML = response.pause;
                        document.getElementById("prodTime").innerHTML = response.heure_prod;
                        document.getElementById("non_argumenter").innerHTML = response.nonArgumenter;
                        document.getElementById("argumenter").innerHTML = response.qualifArg;
                        document.getElementById("pourc_argumenter").innerHTML = prctArgumente;
                        document.getElementById("positive").innerHTML = response.qualifPos;
                        document.getElementById("pourc_positive").innerHTML = prctPositif;
                        document.getElementById("fiches").innerHTML = response.fiches;

                    }
                },
            });
        },1000); */
    });

    ////Send new contact info
    $('#RegisternewInfoContact').on('submit',function(e){
        e.preventDefault();

        let first_name = $('#first_name').val();
        let last_name = $('#last_name').val();
        let adr1 = $('#adr1').val();
        let city = $('#city').val();
        let postal_code = $('#postal_code').val();
        let phone_number = $('#phone_number').val();
        let alt_phone = $('#alt_phone').val();
        let email = $('#email').val();
        let commentaire = $('#commentaire').val();
        let lead_id1 = $('#lead_id1').val();
        
        //// send contact info to controller
        $.ajax({
            url: 'register_new_contact_info/',
            type: "post",
            data:{
                    "_token":"{{csrf_token()}}",
                    first_name : first_name,
                    last_name : last_name,
                    adr1 : adr1,
                    city : city,
                    postal_code : postal_code,
                    phone_number : phone_number,
                    alt_phone : alt_phone,
                    email : email,
                    commentaire : commentaire,
                    lead_id : lead_id1,
        
                },
            success:function(response)
            {   
                /// return response
                status = response.etat;
                msg = response.msg;
                if(status == 200){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: msg,
                        showConfirmButton: true,
                        timer: 5000
                    });
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: msg,
                        showConfirmButton: true,
                        timer: 5000
                    });
                }
               
            },
        });
    });
</script>

<script>
        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: [ 'interaction', 'timeGrid' ],
                defaultView: 'timeGridWeek',
                selectable: true,
                customButtons: {
                    periode: {
                        text: 'TEMPO',
                        click: function() {
                            //
                        }
                    },
                },
                header: {
                    left: 'prev,next hours cp recup',
                    center: 'title',
                },
                droppable: true,
                eventLimit: true,
                locale: 'fr',
                weekNumbers: true,
                firstDay: 1,
                events : [
                    @foreach($callbacks as $callback)
                        {
                            id : '{{$callback->lead_id}}',
                            title : '{{$callback->first_name . ' ' . $callback->last_name}}',
                            start : '{{ \Carbon\Carbon::parse($callback->callback_time)->format('Y-m-d') . 'T'.\Carbon\Carbon::parse($callback->callback_time)->format('H:i') }}',
                            //url : '{{route('get_lead_info', $callback->lead_id)}}',
                            
                            color: '#BADA55',
                        },
                    @endforeach
                ],
                
                eventClick: function(info) {
                    document.getElementById('first_name').innerHTML = '';
                    document.getElementById('last_name').value = '';
                    document.getElementById('adr1').value = '';
                    document.getElementById('city').value = '';
                    document.getElementById('postal_code').value = '';
                    document.getElementById('phone_number').value = '';
                    document.getElementById('alt_phone').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('commentaire').value = '';
            
                    /////
                    document.getElementById('list_id').value = '';
                    document.getElementById('lead_id').value = '';
                    document.getElementById('lead_id1').value = '';
                    document.getElementById('called_count').value = '';
                    $('#montant_donDiv').css('display','none');
                    lead_id = info.event.id;
                    $.ajax({
                        url: 'get_lead_info/'+lead_id,
                        type: "get",
                        data:{
                                "_token":"{{csrf_token()}}",
                            },
                        success:function(response)
                        {   
                            status = response.etat;
                            msg = response.msg;
                            console.log(response.lead);
                            if(status == 200){
                                lead = response.lead;
                                $('#manDial').empty();
                                //$('#manDial').attr('onclick', ManualDial(lead.contact_tel)); /// add url to button send 
                                $('#manDial').append(`<button class="btn btn-success" onclick=ManualDial(${lead.contact_tel})><i class="fa fa-phone"></i> Appeler</button>`); /// add url to button send 
                                $('.send_msg').attr('href', 'send_msg_contact/'+lead.lead_id);
                                $(".dashboard_panel").removeClass('darkBackground');
                                $('#ReClass').css('display','block');
                                $('#class').css('display','none');
                                $('#timeINCALL').css('display','none');
                                $('#racc').css('display','none');
                                $('.bloc_incall').css('display','block');
                                $('.bloc_attente').css('display','none');
                                $('.dashboard_agent').css('display','none');                   
                                document.getElementById('first_name').innerHTML = lead.first_name;
                                document.getElementById('last_name').value = lead.last_name;
                                document.getElementById('adr1').value = lead.adr1;
                                document.getElementById('city').value = lead.city;
                                document.getElementById('postal_code').value = lead.postal_code;
                                document.getElementById('phone_number').value = lead.phone_number;
                                document.getElementById('alt_phone').value = lead.alt_phone;
                                document.getElementById('email').value = lead.email;
                                document.getElementById('commentaire').value = lead.commentaire;
                               
                                document.getElementById('list_id').value = lead.list_id;
                                document.getElementById('lead_id').value = lead.lead_id;
                                document.getElementById('lead_id1').value = lead.lead_id;
                                document.getElementById('called_count').value = lead.called_count;
                                /////////
                                document.getElementById('phone_code').value = '33';
                                /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.tel1}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom} <span class="bg-red" style="color:white"> RAPPEL</span>`);*/
                            }else{
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'erreur de systeme, veuillez contactez le support !',
                                    showConfirmButton: true,
                                    timer: 1500
                                });
                            }
                                
                            },
                    });
                },
                
                
        });
        
        calendar.render();
        $('.fc-today-button').text("Aujourd'hui");
        //Configuration de locale momentjs
        moment.locale('fr', {
            months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            monthsParseExact : true,
            weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            weekdaysParseExact : true,
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY HH:mm',
                LLLL : 'dddd D MMMM YYYY HH:mm'
            },
            calendar : {
                sameDay : '[Aujourd’hui à] LT',
                nextDay : '[Demain à] LT',
                nextWeek : 'dddd [à] LT',
                lastDay : '[Hier à] LT',
                lastWeek : 'dddd [dernier à] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'dans %s',
                past : 'il y a %s',
                s : 'quelques secondes',
                m : 'une minute',
                mm : '%d minutes',
                h : 'une heure',
                hh : '%d heures',
                d : 'un jour',
                dd : '%d jours',
                M : 'un mois',
                MM : '%d mois',
                y : 'un an',
                yy : '%d ans'
            },
            dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
            ordinal : function (number) {
                return number + (number === 1 ? 'er' : 'e');
            },
            meridiemParse : /PD|MD/,
            isPM : function (input) {
                return input.charAt(0) === 'M';
            },
            // In case the meridiem units are not separated around 12, then implement
            // this function (look at locale/id.js for an example).
            // meridiemHour : function (hour, meridiem) {
            //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
            // },
            meridiem : function (hours, minutes, isLower) {
                return hours < 12 ? 'PD' : 'MD';
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // Used to determine first week of the year.
            }
        });
        moment.locale("fr");
        var html = "<div><select id=\"select\">";
        for (let i = 0; i <= 3; i++) {
            var debut = moment().add(i, "w").startOf('isoWeek').format('D|MM|YYYY') + "-" + moment().add(i, "w").endOf('isoWeek').format('D|MM|YYYY');
            html = html.concat("<option value=\""+debut+"\">"+debut+"</option>")
        }
        html = html.concat('</div>');
        var datetime = moment().add(0, "w").startOf('isoWeek').format('YYYY-MM-D');
        $('.date').val(datetime + 'T08:00');
        $('.date_end').val(datetime + 'T12:30');
        $('.fc-periode-button').html(html);
        $('#submit').click(function() {
            var form = $('#addEmployee');
            $.ajax({
                method: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                dataType: "json"
            })
            .done(function(data) {
                location.reload();
            })
            .fail(function(data) {
                console.log(data);
            });
        });
        
    });
</script>
<script>
$(document).ready(function () {
    $('#example').DataTable();
});
</script>
@endsection
