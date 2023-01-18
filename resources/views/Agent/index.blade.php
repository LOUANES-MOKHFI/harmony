@extends('layouts.base-agent')
@section('title')
Agent
@endsection
@section('css')
<link rel="stylesheet" href="{{asset('css/index.css')}}"> 
<link rel="stylesheet" href="{{asset('css/flipTimer.css')}}">
<link rel="stylesheet" href="{{asset('css/demo.css')}}">
<link rel="stylesheet" href="{{asset('assets/agents/index.css')}}">

<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet">
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/core@4.3.1/main.min.css'/>
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/daygrid@4.3.0/main.min.css' />
<link rel='stylesheet' href='https://unpkg.com/@fullcalendar/timegrid@4.3.0/main.min.css' />
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.css">
<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.1/css/dataTables.bootstrap5.min.css">

<style type="text/css">

.calendar-wide {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    width: 560px;
}
.calendar {
    display: block;
    position: relative;
    width: 280px;
    border: 1px solid #dfdfdf;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
    background-color: #fff;
}
.calendar-wide .calendar-header {
    width: 180px;
}
.calendar-wide .calendar-header {
    left: 0;
}
.calendar-wide .calendar-footer, .calendar-wide .calendar-header {
    position: absolute;
    top: 0;
    height: 100%;
    min-height: 100%;
}
.calendar-header {
    padding: 1rem;
    background-color: #004d6f;
    color: #fff;
    -webkit-user-select: none;
    user-select: none;
}
.calendar-content, .calendar-footer, .calendar-header {
    position: relative;
    display: block;
    background-color: #fff;
    color: #1d1d1d;
}
.calendar-header .header-year {
    font-size: .75rem;
    line-height: 1;
}
.calendar-header .header-day {
    font-size: 1.325rem;
}
.calendar-wide .calendar-content {
    margin: 0 96px 0 0px;
}
.calendar-content {
    padding: 1px;
    width: 278px;
}
.calendar-content, .calendar-footer, .calendar-header {
    position: relative;
    display: block;
    background-color: #fff;
    color: #1d1d1d;
}
.calendar .calendar-content .calendar-toolbar {
    border-bottom: 1px solid #dfdfdf;
}
.calendar-content .calendar-toolbar {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.5rem 0;
    width: 100%;
}
.calendar-content .calendar-toolbar, .calendar-content .days-wrapper {
    display: -webkit-box;
    display: flex;
    position: relative;
}
.calendar-content .calendar-toolbar .next-month, .calendar-content .calendar-toolbar .next-year, .calendar-content .calendar-toolbar .next-year-group, .calendar-content .calendar-toolbar .prev-month, .calendar-content .calendar-toolbar .prev-year, .calendar-content .calendar-toolbar .prev-year-group {
    padding: 0.5rem 0;
    cursor: pointer;
    text-align: center;
    width: 30px;
    display: block;
    position: relative;
    flex-shrink: 0;
}
.default-icon-chevron-left {
    background-image: url(data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22768%22%20height%3D%22768%22%20viewBox%3D%220%200%20768%20768%22%3E%0A%3Cpath%20fill%3D%22%23000%22%20d%3D%22M493.28%20237.28l-45.28-45.28-192%20192%20192%20192%2045.28-45.28-146.72-146.72z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E%0A);
}
[class*=default-icon] {
    display: block;
    height: 16px;
    width: 16px;
    border: none!important;
    background-size: cover;
    background-color: transparent;
    opacity: .5;
    -webkit-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
    margin: auto;
}
.calendar-content .calendar-toolbar .curr-month, .calendar-content .calendar-toolbar .curr-year {
    padding: 0.5rem 0;
    width: 100%;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
}
.calendar-content .calendar-toolbar .next-month, .calendar-content .calendar-toolbar .next-year, .calendar-content .calendar-toolbar .next-year-group, .calendar-content .calendar-toolbar .prev-month, .calendar-content .calendar-toolbar .prev-year, .calendar-content .calendar-toolbar .prev-year-group {
    padding: 0.5rem 0;
    cursor: pointer;
    text-align: center;
    width: 30px;
    display: block;
    position: relative;
    flex-shrink: 0;
}
.default-icon-chevron-right {
    background-image: url(data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22768%22%20height%3D%22768%22%20viewBox%3D%220%200%20768%20768%22%3E%0A%3Cpath%20fill%3D%22%23000%22%20d%3D%22M320%20192l-45.28%2045.28%20146.72%20146.72-146.72%20146.72%2045.28%2045.28%20192-192z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E%0A);
}
.calendar-content .days, .calendar-content .week-days {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    grid-gap: 0;
}
.calendar-content .day, .calendar-content .week-day, .calendar-content .week-number {
    height: 39px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
    margin: 0;
}
.calendar-content .week-day {
    border-bottom: 1px solid #dfdfdf;
}
.calendar-content .week-day, .calendar-content .week-number {
    font-weight: 700;
    background-color: #f8f8f8;
}
.calendar-content .day, .calendar-content .week-day, .calendar-content .week-number {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
}
.calendar-content .days, .calendar-content .week-days {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    grid-gap: 0;
}
.calendar .days .day, .calendar .months .month, .calendar .years .year {
    border: 1px solid #f8f8f8;
}
.calendar .day, .calendar .month, .calendar .year {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transition: -webkit-transform .3s ease;
    transition: -webkit-transform .3s ease;
    transition: transform .3s ease;
    transition: transform .3s ease,-webkit-transform .3s ease;
}
.calendar-content .day {
    border: 1px solid transparent;
}
.calendar-content .outside {
    color: #bebebe;
    font-size: 12px;
}
.calendar-content .day, .calendar-content .week-day, .calendar-content .week-number {
    height: 39px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    -webkit-user-select: none;
    user-select: none;
    margin: 0;
}
.calendar-content .day, .calendar-content .week-day, .calendar-content .week-number {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
}
.calendar .calendar-time {
    display: block;
    padding: 5px 10px 10px;
    border-top: 1px solid #dfdfdf;
    background: #f8f8f8;
}
.calendar .calendar-time .calendar-time__inner {
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}
.calendar .calendar-time .calendar-time__inner-row {
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
}
.calendar .calendar-time .calendar-time__inner-cell {
    display: block;
    width: 50%;
}
.calendar .calendar-time .calendar-time__inner {
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
}
.spinner {
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;
    padding: 0;
    cursor: text;
    position: relative;
    height: 36px;
    line-height: 36px;
}
.color-picker, .file, .input, .metro-input, .select, .spinner, .tag-input, .textarea {
    position: relative;
    border: 1px #d9d9d9 solid;
    color: #1d1d1d;
    width: 100%;
    font-size: 16px;
    height: 36px;
    line-height: 36px;
    background: #fff none;
    background-clip: padding-box;
    min-width: 0;
}
.spinner {
    width: 40px;
    height: 40px;
    background: var(--primary-bg-color);
    margin: 100px auto;
    -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
}
.spinner {
    width: 40px;
    height: 40px;
    background: var(--primary-bg-color);
    margin: 100px auto;
    -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
}
.calendar .calendar-time .calendar-time__inner input {
    text-align: center;
}
.spinner.buttons-right input {
    -webkit-box-ordinal-group: 2;
    order: 1;
    text-align: left;
}
.spinner input {
    -webkit-box-ordinal-group: 3;
    order: 2;
}
.spinner input {
    border: none!important;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    line-height: 36px;
    font-size: 16px;
    padding: 0 4px;
    text-align: center;
}
.color-picker input, .file input, .input input, .metro-input input, .select input, .spinner input, .tag-input input, .textarea input {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    outline: 0;
    width: 100%;
    min-width: 0;
}
.spinner.buttons-right .spinner-button-plus {
    -webkit-box-ordinal-group: 4;
    order: 3;
}
.spinner .spinner-button-plus {
    -webkit-box-ordinal-group: 4;
    order: 3;
}
.spinner .button {
    width: 34px;
    min-width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-weight: 700;
    background-color: #f8f8f8;
    padding: 0;
}
[type=reset], [type=submit], button, html [type=button] {
    -webkit-appearance: button;
}
.default-icon-plus {
    background-image: url(data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%3E%0A%3Cpath%20fill%3D%22%23000%22%20d%3D%22M496%20192h-176v-176c0-8.836-7.164-16-16-16h-96c-8.836%200-16%207.164-16%2016v176h-176c-8.836%200-16%207.164-16%2016v96c0%208.836%207.164%2016%2016%2016h176v176c0%208.836%207.164%2016%2016%2016h96c8.836%200%2016-7.164%2016-16v-176h176c8.836%200%2016-7.164%2016-16v-96c0-8.836-7.164-16-16-16z%22%3E%3C%2Fpath%3E%0A%3C%2Fsvg%3E%0A);
}
.calendar .calendar-time .calendar-time__inner .minutes {
    margin-left: 2px;
}




.calendar-content .today {
    background-color: rgba(96,169,23,.5);
    color: #fff;
    font-weight: 700;
}
.selected {
    -webkit-box-shadow: 0 0 0 4px #5ebdec!important;
    box-shadow: 0 0 0 4px #5ebdec!important;
}
.button {
  float: left;
  margin: 0 5px 0 0;
  width: 300px;
  height: 40px;
  position: relative;
}

.button label,
.button input {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.button input[type="radio"] {
  opacity: 0.011;
  z-index: 100;
}

.button input[type="radio"]:checked + label {
  background: #20b8be;
  border-radius: 4px;
}

.button label {
  cursor: pointer;
  z-index: 90;
  line-height: 1.8em;
}

table.dataTable thead .sorting:after,
table.dataTable thead .sorting:before,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_asc:before,
table.dataTable thead .sorting_asc_disabled:after,
table.dataTable thead .sorting_asc_disabled:before,
table.dataTable thead .sorting_desc:after,
table.dataTable thead .sorting_desc:before,
table.dataTable thead .sorting_desc_disabled:after,
table.dataTable thead .sorting_desc_disabled:before {
  bottom: .5em;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  border-bottom: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
</style>
@endsection

@section('agent') 

 
         <!-- APP-CONTENT -->
          
					<!-- PAGE HEADER -->
                        
<div class="dashboard_agent">	
    <div class="page-header d-xl-flex d-block dashboard_agent">
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
	    <div class="col-xl-12 col-lg-12 col-md-12">
			<div class="card">
				<div class="card-header border-bottom-0">
					<h3 class="card-title">List des contacts</h3>
				</div>
				<div class="card-body">
					<div class="card-pay">
						<ul class="tabs-menu nav">
							<li class=""><a href="#tab20" class="active" data-bs-toggle="tab"><i class="fa fa-list"></i> Journal D'appel</a></li>
							<li><a href="#tab21" data-bs-toggle="tab" class=""><i class="fa fa-calendar"></i> Rappels</a></li>
							<li><a href="#tab22" data-bs-toggle="tab" class=""><i class="fa fa-phone-square"></i> Appel Manual </a></li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane active show" id="tab20">
                                <div class="col-md-12 text-center" id="loader" style="display:none">
                                    <div class="loader text-center"></div>
                                </div>
								<div class="bg-danger-transparent-2 text-danger px-4 py-2 br-3 mb-4 result" role="alert"></div>
                                    <p class="text-danger" style="font-size:15px;font-weight: bold;">Dérnier Appel</p>
                                    <table id="" class="table table-striped" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th width="10">ID</th>
                                                <th width="100">Date de qualif</th>
                                                <th width="5">sec</th>
                                                <th width="20">Qualification</th>
                                                <th width="50">Télèphone</th>
                                                <th width="50">Nom/Prénom</th>
                                                <th style="width: 70px;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="LastCallLogs">
                                        </tbody>
                                    </table>
                                    <p class="text-danger" style="font-size:15px;font-weight: bold;">Journal d'appels</p>
    								<table id="" class="table table-striped" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th width="10">ID</th>
                                                <th width="100">Date/heure</th>
                                                <th width="5">sec</th>
                                                <th width="20">Qualification</th>
                                                <th width="50">Télèphone</th>
                                                <th width="50">Nom/Prénom</th>
                                                <th width="50">Compagne</th>
                                                
                                                <th width="30">Hangup</th>
                                                <th style="width: 70px;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="AllCallLogs">
                                            @isset($calllogs)
                                            @foreach($calllogs as $key => $log)
                                            
                                                <tr style="padding:2px">
                                                    <td width="10">{{$key+1}}</td>
                                                    <td width="100">{{$log->call_date}}</td>
                                                    <td width="10">{{DB::table('recording_log')->where('lead_id',$log->lead_id)->first() == '' ? '/' : DB::table('recording_log')->where('lead_id',$log->lead_id)->first()->length_in_sec}}</td>
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
						    </div>
							<div class="tab-pane" id="tab21">
								
							    <div id="calendar"></div>
					        </div>
                            <div class="tab-pane" id="tab22">
                                

                                <div class="container row">
                                    <div class="col-md-2"><input type="number" value="33" readonly class="form-control"></div>
                                    <div class="col-md-6"><input type="number" name="phone_number" placeholder="Num Télèphone" class="form-control" id="writePhoneNumber"></div>
                                    <div class="col-md-4">
                                        <button class="btn btn-success ManualDialPhone" onclick="" ><i class="fa fa-phone"></i> Appeler</button>
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
<div class="bloc_attente" style="display:none;margin-top:40px">
    <div class="container-login100">
        <div class="wrap">
            <div class="wrap-login100 p-t-50 p-b-90 p-l-50 p-r-50">
                <h2 class="attente_ppp">En Attente d'un appel..</h2>
                <br> 
                <button class="btn btn-default btn-outlined btn-square back-to-menu agentStatusButton"> retour</button>   
                    <div id="timeREADY">
                    </div> 
            </div>                
        </div>            
        <div>
            <img class="fit-picture"
                src="{{asset('images/15.png')}}"
                alt="Grapefruit slice atop a pile of other slices">
        </div>
                    
    </div>
</div>
<div class="row bloc_incall" style="display:none">
    <div class="" >
        <div class="card box-widget widget-user">
            <div class="card-body text-center">
                <div class="card-header  border-0">
                    <div id="timeINCALL"></div>

                </div>
                <div class="row" >
                    <div id="ReClass" style="display: none;">
                        <div class="row justify-content-center justify-text-center">
                            <div class="col-md-4 col-sm-6 col-lg-4" style="padding-left:100px">
                                  <button class="btn btn-info" onclick="requalifier()"><i class="fa fa-check"></i> Requalifier la fiche</button>
                            </div>
                            <div class="col-md-4 col-sm-6 col-lg-4" style="padding-left:100px">
                                  <button class="btn btn-warning" onclick="retour()"><i class="fa fa-arrow-left"></i> Retour </button>
                            </div>
                            <div class="col-md-4 col-sm-6 col-lg-4 "  id="manDial">

                            </div>
                        </div> 
                    </div> 
                    <div id="class" style="display: none;">
                        <div class="row justify-content-center justify-text-center">
                            <!-- <div class="col-md-4 col-sm-6 col-lg-4" style="padding-left:100px">
                                <div class="">
                                  <a class="btn btn-outline-danger"  onclick="hangupQualif()">Raccrocher-qual</a>
                                </div>
                            </div> -->
                            <div class="col-md-4 col-sm-6 col-lg-4" style="padding-left:100px">
                                <div class="">
                                  <a class="btn btn-outline-secondary" onclick="hangup()">Raccrocher</a>
                                </div>
                            </div>
                        </div> 
                    </div>    
                </div>
            </div>
            <div id="content_ecran_conf" style="padding: 10px;">
                <!-- Modal de qualification de la fiche (appel) -->
                <div class="col-xl-12 col-md-12 col-lg-12 dispo" style="display:none">   
                    <form id="Update_dispo">
                       @csrf
                        <input type="hidden" name="uniqueid" id="uniqueid">
                        <input type="hidden" name="list_id" id="list_id">
                        <input type="hidden" name="called_count" id="called_count">
                        <input type="hidden" name="lead_id" id="lead_id1">
                        <div class="col-xl-12 col-md-12 col-lg-12">
                            <div class="card box-widget widget-user">
                              <div class="card-body text-center">
                                
                                @isset($statuses)   
                                <div class="card-header  border-0">
                                    <div class="row">
                                    @foreach($statuses as $key => $status) 
                                    <div class="col-md-4 col-sm-6 col-lg-4">
                                        <div class="button">
                                          <input type="radio"  class="sub_qualif" data-value="{{$status->status}}" name="sub_qualif" value="{{$status->status}}"/>
                                          <label class="btn btn-default" for="{{$status->status_name}}">{{$status->status_name}}</label>
                                        </div>
                                    </div>
                                    @endforeach
                                    </div> 
                                </div> 
                                @endisset 
                                <div class="col-md-12">
                                    <div class="row" style="display:none" id="divCalendar">
                                        <div class="form-group col-md-8 col-sm-8 col-lg-8 col-xs-8">
                                            <div data-role="calendar" id="calendar"  data-wide-point="sm" data-buttons="false" data-on-day-click="myFunctionDate"></div>
                                        
                                            <input type="hidden" name="date" id="date" class="form-control">
                                        </div>
                                        <div class="form-group col-md-4 col-sm-4 col-lg-4 col-xs-4">
                                            <label for="Hour">Heure :</label>
                                            <input type="time" name="hour" id="hour" class="form-control">
                                        </div>
                                        <div class="form-group col-md-8 col-sm-8 col-lg-8 col-xs-8">
                                            <label for="comment">Commentaire :</label>
                                            <input name="comments" id="comments" class="form-control">
                                        </div>
                                        <div class="form-group col-md-4 col-sm-4 col-lg-4 col-xs-4">
                                            <input type="checkbox" name="CallBackOnlyMe" id="CallBackOnlyMe">  MY CALLBACK ONLY
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 container">
                                    <div class="text-canter">
                                        <input type="checkbox" name="agent_status" id="agent_status" value="1">  Met en pause apres la qualificiation
                                    </div>
                                </div>
                                <div class="row col-md-12 container">
                                    <button type="submit" class="btn btn-success"><i class="fa fa-save"></i> Valider</button>
                                </div>
                              </div>
                            </div>
                        </div>
                        
                   </form>       
                </div>
                <input type="hidden" name="agent_status" id="agent_status" value="">
                <input type="hidden" value="" id="etat_agent">
                <input type="hidden" value="" id="agentchannel">
                <input type="hidden" id="channel" value=''>
                <input type="hidden" id="lead_id" value=''>
                <input type="hidden" name="uniqueid" id="uniqueid1">
                <div class="panel-body tabs-menu-body hremp-tabs1 p-0">
                    <div class="tab-content">
                        <div class="tab-pane active" id="tab5" >
                        <form id="RegisternewInfoContact" method="post">
                                @csrf
                            <div class="card-body">
                                <div class="form-group ">
                                    <div class="row">

                                        <div class="col-md-2">
                                            <label class="form-label mb-0 mt-2">NOM</label>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <input type="text" class="form-control mb-md-0 mb-5"  placeholder="" id="first_name" name="first_name">
                                                    <span class="text-muted"></span>
                                                </div>
                                                
                                                <div class="col-md-2">
                                                <label class="form-label mb-0 mt-2" >Prénom </label>
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control"id="last_name" name="last_name"  placeholder="" >
                                            </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="form-group ">
                                    <div class="row">

                                        <div class="col-md-2">
                                            <label class="form-label mb-0 mt-2">
                                            Adresse1</label>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <input type="text" class="form-control mb-md-0 mb-5"  placeholder="" id="adr1" name="adr1">
                                                    <span class="text-muted"></span>
                                                </div>
                                                
                                                <div class="col-md-2">
                                                <label class="form-label mb-0 mt-2" >Code postal</label>
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control"  placeholder=""id="postal_code" name="postal_code">
                                            </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="form-group ">
                                    <div class="row">

                                        <div class="col-md-2">
                                            <label class="form-label mb-0 mt-2">Ville</label>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <input type="text" class="form-control mb-md-0 mb-5"  placeholder="" id="city" name="city" >
                                                    <span class="text-muted"></span>
                                                </div>
                                                
                                                <div class="col-md-2">
                                                <label class="form-label mb-0 mt-2" >Alt. Téléphoner</label>
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control"  placeholder="" id="alt_phone" name="alt_phone">
                                            </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="form-group ">
                                    <div class="row">

                                        <div class="col-md-2">
                                            <label class="form-label mb-0 mt-2">Num fixe</label>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <input type="text" class="form-control mb-md-0 mb-5"  placeholder="" id="phone_number" name="phone_number">
                                                    <span class="text-muted"></span>
                                                </div>
                                                
                                                <div class="col-md-2">
                                                <label class="form-label mb-0 mt-2" >E-mail</label>
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" class="form-control"  placeholder=""id="email" name="email">
                                            </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="form-group ">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <label class="form-label mb-0 mt-2">Commentaire</label>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-10">
                                                    <input type="text" class="form-control mb-md-0 mb-5"  placeholder="" id="commentaire" name="commentaire">
                                                    <span class="text-muted"></span>
                                                </div>
                                                
                                                <div class="col-md-2">
                                                
                                            </div>
                                            
                                            </div>

                                        </div>
                                    </div>
                                    <input type="hidden" name="phone_code" id="phone_code" >
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-success" type="submit"><i class="fa fa-save"></i>  Valider</button>
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
<!-- END ROW -->
   <!-- Modal for bad connecte -->
<div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabelPause" aria-hidden="true" id="delogguer">
    <div class="modal-dialog modal-dialog-centered text-center">
        <div class="modal-content tx-size-sm">
            <div class="modal-body text-center p-4">
                
                <i class="fe fe-x-circle fs-80 text-danger lh-1 mb-5 d-inline-block"></i>
                <h4 class="text-danger">Erreur: Votre phone n'est pas activer !</h4>
                <p class="mg-b-20 mg-x-20">S'il te plait veuillez deconnecter et connecter de nouveau.</p>
                <a href="{{route('logout')}}" class="btn btn-danger pd-x-25">Déconnecter</a>
            </div>
        </div>
    </div>
</div>

<!-- <audio id="audioNotify" src="{{asset('audio_notification.wav')}}" type="audio/wav" autoplay="true"> -->
     
</audio> 
<!-- affichage de webphone -->
<div class="row" style="display:none">
    <div class="col-md-8" >
        <iframe src="{{$WebPhonEurl}}"  id="webphone" name="webphone" width="460px" height="500px" allow="microphone *; speakers *;"> </iframe>
    </div>
    <div class="col-md-4">
        <button class="btn btn-success" id="webphone1"> WebPhone</button>
    </div>
</div>
</div>
@endsection
@section('script')

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{asset('assets/agents/metro.min.js')}}"></script>
<script src="https://unpkg.com/@fullcalendar/core@4.3.1/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/interaction@4.3.0/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/daygrid@4.3.0/main.min.js"></script>
<script src="https://unpkg.com/@fullcalendar/timegrid@4.3.0/main.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js"></script>


<script type="text/javascript" src="https://cdn.datatables.net/1.13.1/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.13.1/js/dataTables.bootstrap5.min.js"></script>
<script type="text/javascript">
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
                    }else if(response.etat == 500){
                        
                        clearInterval(channel);
                        //$("#delogguer").modal({backdrop: 'static', keyboard: false}, 'show');
                        $('#delogguer').show();
                    }

                },
            });
        },5000);
    })
</script>

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
        },3000);
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
                                    //start();
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
                                    ChangeToIncall(); 
                                }
                            },
                        });
                    }
                }  
            },1000);
    });

    /*function start(){
        ChangeToIncallIntervale = setInterval(ChangeToIncall, 1000);
    }*/

    // Function to stop setInterval call
    /*var stopVar = false;
    function stop(){
        stopVar = true;
        clearInterval(ChangeToIncallIntervale);
    }*/
    ////change agent stat to incall and get contact information for the live call
    //const ChangeToIncallIntervale = setInterval(ChangeToIncall, 1000);

    function ChangeToIncall()
    {
        phone = document.getElementById('phone_number').value;
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
                        //stop();
                        $(".dashboard_panel").removeClass('darkBackground');
                        $('.bloc_incall').css('display','block');
                        $('.bloc_attente').css('display','none');
                        $('.dashboard_agent').css('display','none'); 
                        $('#class').css('display','block'); 
                        $('#racc').css('display','block'); 
                        $('#ReClass').css('display','none');
                        $('#timeINCALL').css('display','block'); 
                        //stop();
                        document.getElementById('first_name').value = response.first_name;
                        document.getElementById('last_name').value = response.last_name;
                        document.getElementById('adr1').value = response.address1;
                        document.getElementById('city').value = response.city;
                        document.getElementById('postal_code').value = response.postal_code;
                        document.getElementById('phone_number').value = response.phone_number;
                        document.getElementById('alt_phone').value = response.alt_phone;
                        document.getElementById('email').value = response.email;
                        document.getElementById('commentaire').value = response.comments;
                        //stop();

                        document.getElementById('agentchannel').value = response.agentchannel;
                        document.getElementById('uniqueid').value = response.uniqueid;
                        document.getElementById('list_id').value = response.list_id;
                        document.getElementById('lead_id').value = response.lead_id;
                        document.getElementById('lead_id1').value = response.lead_id;
                        document.getElementById('called_count').value = response.called_count;
                        /////////
                        document.getElementById('phone_code').value = '33';
                        //stop();
                        
                        /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${response.phone_number}</span> / <span><i class="text-success fa fa-fax"></i>${response.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${response.adr4_libelle_voie}</span> / ${response.contact_cp} / ${response.contact_ville} / ${response.adr1_civilite_abrv} / ${response.contact_nom} / ${response.contact_prenom}`);*/
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
                                            //document.getElementById("timePAUSED").innerHTML = afficher;
                                            //document.getElementById("timePAUSEDAgent").innerHTML = afficher;
                                            
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
                                            //document.getElementById("timeINCALL1").innerHTML = afficher;
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
            phone_number = document.getElementById('phone_number').value;
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
                        $('.dispo').css('display','block'); 
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
            phone_number = document.getElementById('phone_number').value;
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
                        $('.dispo').css('display','block');          
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
                    //start();
                    ChangeToIncall();
                    lead = response.lead;
                    uniqueid = response.uniqueid1;
                    channel = response.channel;
                    agentchannel = response.agentchannel;
                    $(".dashboard_panel").removeClass('darkBackground');
                    $('.bloc_incall').css('display','block');
                    $('.bloc_attente').css('display','none');
                    $('.dashboard_agent').css('display','none');
                    $('#class').css('display','block'); 
                    $('#ReClass').css('display','none');                   
                    document.getElementById('agentchannel').value = agentchannel;
                    document.getElementById('channel').value = channel;
                    document.getElementById('first_name').value = lead.first_name;
                    document.getElementById('last_name').value = lead.last_name;
                    document.getElementById('adr1').value = lead.address1;
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
                    /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.phone_number}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom}`);*/
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
                    $('#manDial').append(`<button class="btn btn-success" onclick=ManualDial(${lead.phone_number})><i class="fa fa-phone"></i> Appeler</button>`); /// add url to button send
                    $('.send_msg').attr('href', 'send_msg_contact/'+lead.lead_id);
                    $(".dashboard_panel").removeClass('darkBackground');
                    $('#ReClass').css('display','block');
                    $('#class').css('display','none');
                    $('#timeINCALL').css('display','none');
                    $('#racc').css('display','none');
                    $('.bloc_incall').css('display','block');
                    $('.bloc_attente').css('display','none');
                    $('.dashboard_agent').css('display','none');                   
                    //$('.dispo').css('display','block'); 
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
                    /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.phone_number}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom}`);*/
                    
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
        $('.dispo').css('display','block'); 
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
    /*const getCallbackLive = setInterval(getLiveCallBack, 40000);
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
                    $('.callback_info').append(`
                        <a class="dropdown-item border-bottom" onclick=getContactInfo(${lead.lead_id}) >
                            <div class="d-flex align-items-center">
                                <div class="d-flex">
                                    <div class="ps-3 text-wrap text-break">
                                        <h6 class="mb-1"><span>${lead.first_name}</span> <span>${lead.last_name}</span></h6>
                                        <p class="fs-13 mb-1">${lead.phone_code} ${lead.phone_number}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                        `); /// add url to button send
                    let sound = document.getElementById("audioNotify");
                    sound.play();
                    //document.getElementById("play").addEventListener("click", sound);
                    clearInterval(getCallbackLive);
                }
                else{ 
                    document.getElementById('callback_notification').innerHTML = 0;
                    $('.callback_info').html(``); /// add url to button send 
                }
            },
        });
    }*/
 
    $(document).ready(function(){
        $.ajax({
            url: 'get_call_logs',
            type: 'post',
            success:function(response){
                console.log(response);
                status = response.status;
                calllogs = response.calllogs;
                $("#AllCallLogs").empty();
                calllogs.forEach(shoCallLogs);
            },
            complete: function(){
                $('#loader').hide();
                $('.result').show();
            }
        })
    })
    function shoCallLogs(element, index, array) {
        $('#AllCallLogs').append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.call_date}</td>
                <td class="sec${element.lead_id}">`+ GetSecLength(element.lead_id) +`</td>
                <td>${element.status}</td>
                <td>${element.phone_number}</td>
                <td>${element.first_name}  ${element.last_name}</td>
                <td>${element.campaign_id}</td>
                <td>${element.term_reason}</td>
                <td>
                    <button onclick="ManualDial(${element.phone_number})" data-phone="${element.phone_number}" class="btn btn-sm btn-success "><i class="fa fa-phone"></i></button>
                    <button onclick="getContactInfo(${element.lead_id})" data-phone="${element.phone_number}" class="btn btn-sm btn-info "><i class="fa fa-eye"></i></button>
                </td>    
            </tr>
        `);        
    }
    function GetSecLength(lead_id) {
        $.ajax({
            url: 'get_lenght_sec/'+lead_id,
            type: 'get',
            success:function(response){
                status = response.status;
                if(status = 200){
                   $(".sec"+lead_id).html(response.length_in_sec);
                }else{
                   $(".sec"+lead_id).html('/');
                }
            }
        })
    }
    $(document).ready(function(){
        $.ajax({
            url: 'get_last_call_logs',
            type: 'post',
            success:function(response){
                console.log(response);
                status = response.status;
                calllogs = response.calllogs;
                $("#LastCallLogs").empty();
                calllogs.forEach(showlastCallLogs);
            },
            complete: function(){
                $('#loader').hide();
                $('.result').show();
            }
        })
    });

    function showlastCallLogs(element, index, array) {
        $('#LastCallLogs').append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.modify_date}</td>
                <td class="sec${element.lead_id}">`+ GetSecLength(element.lead_id) +`</td>
                <td>${element.status}</td>
                <td>${element.phone_number}</td>
                <td>${element.first_name}  ${element.last_name}</td>
               
                <td>
                    <button onclick="ManualDial(${element.phone_number})" data-phone="${element.phone_number}" class="btn btn-sm btn-success "><i class="fa fa-phone"></i></button>
                    <button onclick="getContactInfo(${element.lead_id})" data-phone="${element.phone_number}" class="btn btn-sm btn-info "><i class="fa fa-eye"></i></button>
                </td>    
            </tr>
        `);        
    }
    $('#Update_dispo').on('submit',function(e){
        $("#LastCallLogs").empty();
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
                    
                   /////////
                    document.getElementById('phone_code').value = '';          
                    $(".agentStatusButton").attr("data-value",response.etatAgent);                                
                    $(".agentStatusButton").html(response.etatAgent);
                    document.getElementById('etat_agent').value = response.etatAgent;
                    $('.bloc_incall').css('display','none');
                    $('.bloc_attente').css('display','none');
                    $('.dashboard_agent').css('display','block');
                    $('.dashboard_agent').css('display','block');
                    $('.time1').css('display','none');
                    $('.dispo').css('display','none');
                    $("input[type='radio'][class='sub_qualif']:checked").prop('checked', false);
                    $("input[type='checkbox'][name='agent_status']:checked").prop('checked', false);
                        
                    $.ajax({
                        url: 'get_last_call_logs',
                        type: 'post',
                        success:function(response){
                            console.log(response);
                            status = response.status;
                            calllogs = response.calllogs;
                            $("#LastCallLogs").empty();
                            calllogs.forEach(showlastCallLogs);
                        },
                        complete: function(){
                            $('#loader').hide();
                            $('.result').show();
                        }
                    });

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

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: msg + ' ' +response.dispo_choice,
                        showConfirmButton: true,
                        timer: 500
                    });

                   
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

    $("#writePhoneNumber").on('keyup',function(){
        //alert(this.value);
        $(".ManualDialPhone").attr('onclick','ManualDial('+this.value+')');
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
                                document.getElementById('adr1').value = lead.address1;
                                document.getElementById('city').value = lead.city;
                                document.getElementById('postal_code').value = lead.postal_code;
                                document.getElementById('phone_number').value = lead.phone_number;
                                document.getElementById('alt_phone').value = lead.alt_phone;
                                document.getElementById('email').value = lead.email;
                                document.getElementById('commentaire').value = lead.comments;
                               
                                document.getElementById('list_id').value = lead.list_id;
                                document.getElementById('lead_id').value = lead.lead_id;
                                document.getElementById('lead_id1').value = lead.lead_id;
                                document.getElementById('called_count').value = lead.called_count;
                                /////////
                                document.getElementById('phone_code').value = '33';
                                /*$("#info-ctc-name").html(`<span><i class="text-success fa fa-phone"></i>${lead.phone_number}</span> / <span><i class="text-success fa fa-fax"></i>${lead.contact_tel}</span> / <span><i class="text-success fa fa-map"></i>${lead.adr4_libelle_voie}</span> / ${lead.contact_cp} / ${lead.contact_ville} / ${lead.adr1_civilite_abrv} / ${lead.contact_nom} / ${lead.contact_prenom} <span class="bg-red" style="color:white"> RAPPEL</span>`);*/
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

