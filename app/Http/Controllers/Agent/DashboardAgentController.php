<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Session;
use GuzzleHttp\Client;
USE DB;
class DashboardAgentController extends Controller
{

     //private $server = 'https://call3.callbk.tk';
    //private $SERVER = 'https://call1.harmoniecrm.com';
    private $SERVER = 'https://call3.harmoniecrm.com';
    private $userAdmin = '6666';
    private $passAdmin = '0551797726';
    ///////////
    public function getCallLogs(){
        $data = [];
        try {
            
            $calllogs = DB::table('vicidial_log')->where('vicidial_log.campaign_id',Session::get('campaign'))
            ->join('vicidial_list','vicidial_log.lead_id','=','vicidial_list.lead_id')
            ->where('vicidial_list.user',Session::get('user'))
            ->select('vicidial_list.first_name','vicidial_list.last_name','vicidial_list.status','vicidial_log.call_date','vicidial_log.phone_number','vicidial_log.term_reason','vicidial_log.campaign_id','vicidial_list.lead_id')->orderBy('vicidial_log.call_date','DESC')->distinct()->limit(150)->get();

            $status = 200;

            $info['status'] = $status;
            $info['calllogs'] = $calllogs;
            return response()->json($info);
        } catch (Exception $e) {
            $data['status'] = 500;
            return response()->json($data);
        }
        
    }
    public function getLastCallLogs(){
        try {
            $calllogs = DB::table('vicidial_list')
                        //->where('campaign_id',Session::get('campaign'))
                        ->where('user',Session::get('user'))
                        ->limit(1)->orderBy('modify_date','DESC')->get();
            
            $status = 200;
            $info['status'] = $status;
            $info['calllogs'] = $calllogs;
            return response()->json($info);
        } catch (Exception $e) {
            $data['status'] = 500;
            return response()->json($data);
        }
    }
    public function getLenghtSec($lead_id){
        $data = [];
        $record = DB::table('recording_log')->where('lead_id',$lead_id)
                                            ->where('user',Session::get('user'))->orderBy('recording_id','DESC')->first();
        if(!$record){
            $data['status'] = 500;
            return response()->json($data);
        }
        $data['status'] = 200;
        $data['length_in_sec'] = $record->length_in_sec;
        return response()->json($data);
    }
    
    public function index(){
        $data = [];       
       //// envoyer une requete a l'api pour obtenir le status de l'agent
        $user = Session::get('user');
        $agents = DB::table('vicidial_live_agents')->where('user',$user)->get();
        if($agents->count()>1){
            $this->logout();
            $data['etat'] = 500;
            $data['msg'] = "Vous n'etes pas connecter correctement, veuillez ressayer stp !!";
            return redirect()->route('agent.login')->with(['error'=>$data['msg']]);
        }
        $agent = DB::table('vicidial_live_agents')->where('user',$user)->first();
        
        if(!$agent){
           
            
            return redirect()->route('agent.login');
        }else{
            if(!empty(Session::get('user'))){ //// verifier si la session contient des données
                $data['user'] = Session::get('user');
                $data['campaign'] = Session::get('campaign');
                $data['server_ip'] = Session::get('server_ip');
                $data['conf_exten'] = Session::get('conf_exten');
                $data['extension'] = Session::get('extension');
                $data['session_name'] = Session::get('session_name');
                $data['protocol'] = Session::get('protocol');
                $data['full_name'] = Session::get('full_name');
                $data['etat'] = Session::get('etat');
                $data['msg'] = Session::get('msg');
                 //// envoyer une requete a l'api pour obtenir le status de l'agent
                $data['etatAgent'] = $agent->status;
                /////get list of campaigns status
                $camp_statuses = DB::table('vicidial_campaign_statuses')->select('status','status_name')->distinct()->where('selectable','Y')->where('campaign_id',Session::get('campaign'))->orderBy('status','ASC')->get();
                if(count($camp_statuses) <1){
                    $data['camp_statuses'] = ['z'];
                }else{
                    $data['camp_statuses'] = $camp_statuses;
                }
                //dd($data['camp_statuses']);
                $data['statuses'] = DB::table('vicidial_statuses')->select('status','status_name')->distinct()->where('selectable','Y')->orderBy('status','ASC')->get();
                ////// call logs


                ///// get all pauses code
                $pauses = DB::table('vicidial_pause_codes')->where('campaign_id',Session::get('campaign'))->get();
                if(count($pauses)>0){
                    $data['pauses'] = $pauses;
                }else{
                    $data['pauses'] = '';  
                }

                // if($contents->etat == 200){
                    /// si l'etat == 200, envoyer une requete a l'api agent pour obtenir l'url de webphone
                    $http = new \GuzzleHttp\Client();
                    $responseWebPhone = $http->get($this->SERVER.'/agc/api.php?source=call3&user='.$this->userAdmin.'&pass='.$this->passAdmin.'&agent_user='.Session::get('user').'&function=webphone_url&value=DISPLAY');
                    
                    $data['WebPhonEurl'] = $responseWebPhone->getBody()->getcontents(); /// webphone url (viciphone)
                    ///// envoyer une requete a l'api pour connecter au webphone
                    //$responseCallAgent = $http->get($this->SERVER.'/agc/api.php?source=call3&user='.$this->userAdmin.'&pass='.$this->passAdmin.'&agent_user='.Session::get('user').'&function=call_agent&value=CALL');
                    //dd($responseCallAgent->getBody()->getContents());
                    
                   
                
                //dd($data);
            }else{
                return redirect()->route('agent.login');
            }
        }
        ///// envoyer une requete pour récuperer les rappele (callback) de l'agent et les afficher sur le calendrier
        $liveagent = DB::table('vicidial_live_agents')->where('user',Session::get('user'))->where('server_ip',Session::get('server_ip'))->first();
        if(!empty($liveagent)){
            $data['callbacks'] = DB::table('vicidial_callbacks')->where('vicidial_callbacks.user',Session::get('user'))->where('vicidial_callbacks.campaign_id',Session::get('campaign'))->where('vicidial_callbacks.lead_status','CBHOLD')
            ->join('vicidial_list','vicidial_callbacks.lead_id','=','vicidial_list.lead_id')
            ->select('vicidial_list.*','vicidial_callbacks.callback_id','vicidial_callbacks.callback_time')
             ->get();            
        }else{
            $data['callbacks'] ='';
            
        }
        //dd($data);
        //dd(Session::all());
        return view('Agent.index',$data);
    }

    ///// fonction qui permet d'activer un code pause
    public function ChangePauseCode($pause_code){

        $user = Session::get('user');
        $pass = Session::get('pass');
        $phone_login = Session::get('phone_login');
        $phone_pass = Session::get('phone_pass');
        $campaign = Session::get('campaign');
        $server_ip = Session::get('server_ip');
        $conf_exten = Session::get('conf_exten');
        $extension = Session::get('extension');
        $session_name = Session::get('session_name');
        $protocol = Session::get('protocol');
        $agent_log_id = Session::get('agent_log_id');
        $pause_code = $pause_code;

        $userLogged = DB::table('vicidial_users')->where('user',$user)->where('active','Y')->first();
        $VU_user_group = $userLogged->user_group;
        $http = new \GuzzleHttp\Client();
        $response = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'server_ip' => $server_ip,
                'session_name' => $session_name,
                'user' => $user,
                'pass' => $pass,
                'MgrApr_user' => $user,
                'MgrApr_pass'      => $pass,
                'status'           => $pause_code,
                'campaign'        => $campaign,
                'agent_log_id'    => $agent_log_id,
                'user_group'        => $VU_user_group,
                'format'       => 'text',
                'ACTION'       => 'PauseCodeMgrApr'
            ],
        ]);

        $phone = DB::table('phones')->where('login',$phone_login)->where('pass',$phone_pass)->where('active','Y')->first();
        $phone_ip = $phone->phone_ip;
        $enable_sipsak_messages = $phone->enable_sipsak_messages;
        $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first();
        //$dial_method = $campaignInfo->dial_method;
        $starting_dial_level  = $campaignInfo->auto_dial_level;
        $response2 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'server_ip' => $server_ip,
                'session_name' => $session_name,
                'user' => $user,
                'pass' => $pass,
                'MgrApr_user' => $user,
                'MgrApr_pass'      => $pass,
                'status'           => $pause_code,
                'campaign'        => $campaign,
                'agent_log_id'    => $agent_log_id,
                'user_group'        => $VU_user_group,
                'extension'  => $extension,
                'protocol'  => $protocol,
                'phone_ip'  => $phone_ip,
                'enable_sipsak_messages'  => $enable_sipsak_messages,
                'stage'  => '1',
                'campaign_cid'  => '',
                'auto_dial_level'  => $starting_dial_level,
                'MDnextCID'  => '',
                'format'       => 'text',
                'ACTION'       => 'PauseCodeSubmit'
            ],
        ]);
        $content = $response2->getBody()->getcontents();
        $contents = json_decode($content);
        $data['contents'] = $response2->getBody()->getContents();
        $data['pause_code'] = $pause_code;
        if(str_contains($data['contents'],'Pause Code '.$data['pause_code'].' has been recorded')){
            $data['etat'] = 200;
            $data['pause_code'] = $contents->pause_code;
            return response()->json($data);
        }
        else{
            $data['etat'] = 500;
            return response()->json($data);
        }
    }
    //// fonction qui récuperer la liste des channel live pour un agent 
    public function getChannelLive(){

        $channels = DB::table('live_sip_channels')->where('server_ip',Session::get('server_ip'))->where('extension',Session::get('conf_exten'))->get();

        $data = [];
        if($channels->count()<1){
            $data['etat'] = 500;
            return response()->json($data);
        }else{
            $data['etat'] = 200;
            $data['channels'] = $channels;
            return response()->json($data);
        }
           
    }
    //// fonction qui activer le webphone apres 5 sec de l'actualisation de la page ou lors de clique sur button webphone
    public function activateWebphone(){

        $http = new \GuzzleHttp\Client();
        $responseWebPhone = $http->post($this->SERVER.'/agc/api.php?source=call3&user='.$this->userAdmin.'&pass='.$this->passAdmin.'&agent_user='.Session::get('user').'&function=call_agent&value=CALL');
        $content = $responseWebPhone->getBody()->getcontents();
        if(str_contains($content,"SUCCESS: call_agent function sent - ".Session::get('user'))){
            $data['etat'] = 200;
        }else{
            $data['etat'] = 500;
        }
        return response()->json($data);
    }
    //// fonction qui récuperer le status de l'agent
    public function getAgentStatus(){
        $agent = DB::table('vicidial_live_agents')->where('user',Session::get('user'))->first();
        if($agent){
            $data['etatAgent'] = $agent->status;
            $data['etat'] = 200;
            $data['msg'] = "success, Vous etes connectee";
            return response()->json($data);
        }else{
            $data['etat'] = 500;
            $data['etatAgent'] = 'error';
            $data['msg']  = "Erreur, Vous n'etes pas connectee";
            return response()->json($data);
        }
       
        return response()->json($data);
    }

    /// fonction logout///////
    public function logout(){
  
        $user = Session::get('user');
        $pass = Session::get('pass');
        $phone_login = Session::get('phone_login');
        $phone_pass = Session::get('phone_pass');
        $campaign = Session::get('campaign');
        $server_ip = Session::get('server_ip');
        $conf_exten = Session::get('conf_exten');
        $extension = Session::get('extension');
        $session_name = Session::get('session_name');
        $protocol = Session::get('protocol');
        $agent_log_id = Session::get('agent_log_id');
            
        //dd($pass);
        $phone = DB::table('phones')->where('login',$phone_login)->where('pass',$phone_pass)->where('active','Y')->first();

        $phone_ip = $phone->phone_ip;
        $ext_context = $phone->ext_context;
        $enable_sipsak_messages = $phone->enable_sipsak_messages;
        $LogouTKicKAlL          = '1';
        $no_delete_sessions     = '1';
        $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first();
        $dial_method = $campaignInfo->dial_method;
        $http = new \GuzzleHttp\Client(); 
        $response = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'server_ip' => $server_ip,
                'session_name' => $session_name,
                'user' => $user,
                'pass' => $pass,
                'campaign' => $campaign,
                'conf_exten' => $conf_exten,
                'extension'=> $extension,
                'protocol'      => $protocol,
                'agent_log_id'      => $agent_log_id,
                'enable_sipsak_messages' => $enable_sipsak_messages,
                'no_delete_sessions'      => $no_delete_sessions,
                'phone_ip'      => $phone_ip,
                'LogouTKicKAlL'      => $LogouTKicKAlL,
                'ext_context'      => $ext_context,
                'qm_extension'     => $extension,
                'stage'      => 'NORMAL',
                'pause_trigger'    => 'PAUSE',
                'dial_method'      => $dial_method,
                'pause_max_url_trigger'  => '',
                'format'      => 'text',
                'ACTION'        => 'userLOGout',
            ],
        ]);

        //dd($response->getBody()->getcontents());
        if(str_contains($response->getBody()->getcontents(),'Agent '.$user.' is now in status PAUSED')){
            Session::forget('user');
            Session::forget('campaign');
            Session::forget('phone_pass');
            Session::forget('pass');
            Session::forget('session_name');
            Session::forget('server_ip');
            Session::forget('phone_login');
            Session::forget('agent_log_id');
            Session::forget('conf_exten');
            Session::forget('extension');
            Session::forget('protocol');
            return redirect()->route('agent.login');
        }else{
            $data['msg']  = "Erreur des parametres";
            $data['etat'] = 500;
            return redirect()->route('agent.login');
        }     
    }

    //// fonction qui change le status de l'agent
    public function ChangeStatus($etatAgent){
  
        $value = '';
        if($etatAgent == 'PAUSED'){
            $VDRP_stage = 'READY';
            $temp_auto = 1;
            $temp_auto_code = 'NXDIAL';
            $VDRP_stage = 'READY';
            $AutoDialReady = 1;
			$AutoDialWaiting = 1;
            $VDRP_stage_seconds = 0;
            $ACTION = 'VDADready';
            $safe_pause_counter = 0;
        }elseif($etatAgent == 'READY'){
            $VDRP_stage = 'PAUSED';
            $temp_auto = 1;
            $temp_auto_code = 'RQUEUE';
            $VDRP_stage = 'PAUSED';
			$AutoDialReady = 0;
			$AutoDialWaiting = 0;
			$pause_code_counter = 0;
            $ACTION = 'VDADpause';
        }else{
            $VDRP_stage = '';
            $temp_auto = '';
            $temp_auto_code = '';
            $VDRP_stage = '';
            $AutoDialReady = '';
			$AutoDialWaiting = '';
            $VDRP_stage_seconds = '';
            $safe_pause_counter = '';
        }
        $stage = $VDRP_stage;
        $comments = '';//$request->comments;
        $VDRP_stage = $VDRP_stage;
        $AutoDialReady = $AutoDialReady;
        $AutoDialWaiting = $AutoDialWaiting;
        $session_name = Session::get('session_name');
        $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',Session::get('campaign'))->first();
        $dial_method = $campaignInfo->dial_method;
        $qm_extension = Session::get('extension');
        $auto_dial_level = $campaignInfo->auto_dial_level;
        if($VDRP_stage == 'PAUSED'){
            $agent_log = '';
        }else{
            $agent_log = 'NEW_ID'; 
        }
        $http = new \GuzzleHttp\Client(); 
        $response = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'user' => Session::get('user'),
                'pass' => Session::get('pass'),
                'server_ip' => Session::get('server_ip'),
                'agent_log' => $agent_log,
                'stage' => $stage,
                'agent_log_id' => Session::get('agent_log_id'),
                'session_name' => Session::get('session_name'),
                'dial_method' => $dial_method,
                'comments' => $comments,
                'campaign' => Session::get('campaign'),
                'wrapup'   => 'WRAPUP',
                'VDRP_stage' => $VDRP_stage,
                'AutoDialReady' => $AutoDialReady,
                'AutoDialWaiting' => $AutoDialWaiting,
                'auto_dial_level' => $auto_dial_level,
                'qm_extension' => $qm_extension,
                'ACTION'     => $ACTION,
            ],
        ]);

        $content = $response->getBody()->getcontents();
        //dd($content);

        if(str_contains($content,'READY')){
            $data['etatAgent'] = 'READY'; 
        }elseif(str_contains($content,'Agent '.Session::get('user').' is now in status PAUSED')){
            $data['etatAgent'] = 'PAUSED';
            Session::forget('agent_log_id');
            $j_encoded = json_encode($content);
            //dd($j_encoded,$content);
            //$content = explode(':',$j_encoded);
            //dd($content);
            $content = explode('\n',$j_encoded);
            
            
            $content = explode('\n',$content[2]);
            
            $data['agent_log_id'] = $content[0];
            Session::put('agent_log_id', $data['agent_log_id']);
        }elseif(str_contains($content,'PAUSED')){
            $data['etatAgent'] = 'PAUSED';
            Session::forget('agent_log_id');
            $content = explode(':',$content);
            $content = explode('\n',$content[1]);
            $data['agent_log_id'] = $content[1];
            Session::put('agent_log_id', $data['agent_log_id']);
            

        }else{
            $data['etatAgent'] = $etatAgent;
        }
        //dd(Session::all());
        $data['etat'] = 200;
        return response()->json($data);
    }
    //// fonction qui récuperer les information d'un fiche a partir de lead_id
    public function get_contact_informations()
    {

        if(!empty(Session::get('user'))){
            $user = Session::get('user');
            $http = new \GuzzleHttp\Client();
            $response = $http->post($this->SERVER2.'/vicidial/non_agent_api.php?source=call3&user='.$this->userAdmin.'&pass='.$this->passAdmin.'&function=agent_status&agent_user='.$user.'&stage=csv&header=YES');
            $content = $response->getBody()->getContents();            
            $j_encoded = json_encode(utf8_encode($content));
            $content_encoded = explode('"',$j_encoded);
            try {
                $content_encoded = explode('\n',$content_encoded[1]);
                $content_encoded = explode(',',$content_encoded[1]);
                $lead_id = $content_encoded[2];
                return response()->json($lead_id);
                if($lead_id != 0){
                    $http = new \GuzzleHttp\Client();
                    $response = $http->post($this->SERVER2.'/vicidial/non_agent_api.php?source=call3&user='.$this->userAdmin.'&pass='.$this->passAdmin.'&function=lead_all_info&lead_id='.$lead_id.'&header=YES&custom_fields=Y');
                    //$contentType = $response->getHeaders()['content-type'][0];
                    $content = $response->getBody()->getContents();
                  
                    $contact = [];
                    $j_encoded = json_encode(utf8_encode($content));
                    $content_encoded = explode('"',$j_encoded);
                    $content_encoded = explode('\n',$content_encoded[1]);
                    //dd($content_encoded[1]);
                    $content_encoded = explode('|',$content_encoded[1]);
                    $contact['status'] = $content_encoded[0];
                    $contact['user'] = $content_encoded[1];
                    $contact['vendor_lead_code'] = $content_encoded[2];
                    $contact['source_id'] = $content_encoded[3];
                    $contact['list_id'] = $content_encoded[4];
                    $contact['gmt_offset_now'] = $content_encoded[5];
                    $contact['phone_code'] = $content_encoded[6];
                    $contact['phone_number'] = $content_encoded[7];
                    $contact['title'] = $content_encoded[8];
                    $contact['first_name'] = $content_encoded[9];
                    $contact['middle_initial'] = $content_encoded[10];
                    $contact['last_name'] = $content_encoded[11];
                    $contact['address1'] = $content_encoded[12];
                    $contact['address2'] = $content_encoded[13];
                    $contact['address3'] = $content_encoded[14];
                    $contact['city'] = $content_encoded[15];
                    $contact['state'] = $content_encoded[16];
                    $contact['province'] = $content_encoded[17];
                    $contact['postal_code'] = $content_encoded[18];
                    $contact['country_code'] = $content_encoded[19];
                    $contact['gender'] = $content_encoded[20];
                    $contact['date_of_birth'] = $content_encoded[21];
                    $contact['alt_phone'] = $content_encoded[22];
                    $contact['email'] = $content_encoded[23];
                    $contact['security_phrase'] = $content_encoded[24];
                    $contact['comments'] = $content_encoded[25];
                    $contact['called_count'] = $content_encoded[26];
                    $contact['last_local_call_time'] = $content_encoded[27];
                    $contact['rank'] = $content_encoded[28];
                    $contact['owner'] = $content_encoded[29];
                    $contact['entry_list_id'] = $content_encoded[30];
                    $contact['lead_id'] = $content_encoded[31];
                    $contact['etat'] = 200;
                    return response()->json($contact);
                }else{
                    $contact['etat'] = 403;
                    $contact['msg'] = "L'agent est en pause";
                    return response()->json($contact);
                }



            } catch (\Throwable $th) {
                $contact['etat'] = 403;
                $contact['msg'] = "L'agent n'est pas connecter";
                return response()->json($contact);
            }
        }else{
            $contact['msg'] = 'Aucun session existe';
            $contact['etat'] = 401;
            return response()->json($contact);
        }       
    }
    //// fonction qui refresh le random_id in vicidial_live_agent chaque 1 second
    public function refreshIncall(){
        if(!empty(Session::get('user'))){
            $random = (rand(1000000, 9999999) + 10000000);
            $liveagent = DB::table('vicidial_live_agents')->where('user',Session::get('user'))->where('server_ip',Session::get('server_ip'))->update([
                    'random_id'=>$random
                ]);
            $data['etat'] = 200; 
            return response()->json($data);
        }
    }
    //// fonction qui récuperer channel de l'appel pour un agent
    public function getChannel(){
        
        if(!empty(Session::get('user'))){
            $user = Session::get('user');
            $server_ip = Session::get('server_ip');

            $random = (rand(1000000, 9999999) + 10000000);
            $liveagent = DB::table('vicidial_live_agents')->where('user',$user)->where('server_ip',$server_ip)->update([
                    'random_id'=>$random
                ]);
            $liveagent = DB::table('vicidial_live_agents')->where('user',$user)->where('server_ip',$server_ip)->first();
            if($liveagent->lead_id > 0){
                $data['msg'] = 'lead affecter';
                $data['etat'] = 200; 
                $data['channel'] = $liveagent->channel;
                $data['lead_id'] = $liveagent->lead_id;
                return response()->json($data);

            }else{
                $data['msg'] = 'aucun lead affecter';
                $data['etat'] = 201;
                $data['channel'] = '';
                $data['lead_id'] = 0;

                return response()->json($data);
            }
        }
    }
    //// change status to incall for agent
    public function ChangeIncall(Request $request){
        if(!empty(Session::get('user'))){
            $user = Session::get('user');
            $pass = Session::get('pass');
            $phone_login = Session::get('phone_login');
            $phone_pass = Session::get('phone_pass');
            $agent_log_id = Session::get('agent_log_id');
            $campaign = Session::get('campaign');
            $session_name = Session::get('session_name');
            $conf_exten = Session::get('conf_exten');
            $extension = Session::get('extension');
            $server_ip = Session::get('server_ip');
            $orig_pass = Session::get('pass');
                        
            $userLogged = DB::table('vicidial_users')->where('user',$user)->where('active','Y')->first();
            $LOGemail = $userLogged->email != '' ? $userLogged->email : '';
            $agent_email = $LOGemail;
            $conf_exten = $request->conf_exten;
            $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first();
            $camp_script = $campaignInfo->campaign_script != '' ? $campaignInfo->campaign_script.'' : '';
            $in_script = '';//$request->CalL_ScripT_id;
            $customer_server_ip = '';//$request->lastcustserverip;
            $exten = $request->extension;
            $original_phone_login = $request->phone_login;
            $VDRP_stage = '';
            $previous_agent_log_id = $request->agent_log_id;
            $action = 'VDADcheckINCOMING';
            $http = new \GuzzleHttp\Client(); 
            $response1 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
                'form_params' => [
                    'server_ip'         => $server_ip,
                    'session_name'      => $session_name,
                    'user'              => $user,
                    'pass'              => $pass,
                    'orig_pass'         => $orig_pass,
                    'campaign'          => $campaign,
                    'ACTION'            => $action,
                    'agent_log_id'      => $agent_log_id,
                    'phone_login'       => $phone_login,
                    'agent_email'       => $LOGemail,
                    'conf_exten'        => $conf_exten,
                    'camp_script'       => $camp_script,
                    'in_script'         => $in_script,
                    'customer_server_ip'=> $customer_server_ip,
                    'exten'             => $exten,
                    'original_phone_login'=> $original_phone_login,
                    'phone_pass'        => $phone_pass,
                    'VDRP_stage'        => $VDRP_stage,
                    'previous_agent_log_id'=> $previous_agent_log_id
                ],
            ]);
            $liveagent = DB::table('vicidial_live_agents')->where('user',$user)->where('server_ip',$server_ip)->first();

            if($response1->getStatusCode() == 200 && $liveagent->lead_id>0){
                
                $list = DB::table('vicidial_list')->where('lead_id',$liveagent->lead_id)->first();
                $phone = DB::table('phones')->where('login', $phone_login)
                                        ->where('pass', $phone_pass)
                                        ->where('active','Y')->first();
                                       
                $ext_context = $phone->ext_context;
                $conf_silent_prefix = '5';
                $channelrec = "Local/".$conf_silent_prefix.$conf_exten.'@'.$ext_context;
                
                $LiveSipChannel = DB::table('live_sip_channels')->where('server_ip',$server_ip)->where('extension',$conf_exten)->where('channel','LIKE','SIP/'.$user.'%')->first();
                //return $liveagent->channel;
                $data['agentchannel'] = $channelrec = "Local/".$conf_silent_prefix.$conf_exten.'@'.$ext_context;
                //$liveagent->channel;
                $data['uniqueid'] = $liveagent->uniqueid;

                $data['list_id'] = $list->list_id;
                $data['called_count'] = $list->called_count;
                $data['lead_id'] = $list->lead_id;
                $data['first_name'] = $list->first_name;
                $data['last_name'] = $list->last_name;
                $data['address1'] = $list->address1;
                //$data['gender'] = $list->gender;
                $data['postal_code'] = $list->postal_code;
                $data['city'] = $list->city;
                $data['phone_number'] = $list->phone_number;
                $data['alt_phone'] = $list->alt_phone;
                $data['email'] = $list->email;
                $data['comments'] = $list->comments;

                $data['etat'] = 200;
                $data['msg'] = 'success';
                return response()->json($data);
                
            }else{
                $data['etat'] = 401;
                $data['msg']  = "Erreur de serveur, on a pas pu récuperer la fiche de client"; 
                return response()->json($data);
            }
                

        }
    }
    /////// recuperer le temps d'appel de  l'agent (status == Incall)
    public function getTimeIncall($lead_id){
        $user = Session::get('user');
        $lead_id = $lead_id;
        $live_agent = DB::table('vicidial_live_agents')->where('user',$user)->where('lead_id',$lead_id)->first();
        $last_call = $live_agent->last_state_change;
        $date2 = date("H:i:s", strtotime($last_call));

        $timezone  = +1;
        $now =  gmdate("H:i:s", time() + 3600*($timezone+date("I")));
        $lastcall = explode(':',$date2);
        $timeInSec = ($lastcall[0]*3600)+($lastcall[1]*60)+$lastcall[2];

        $nowTime = explode(':',$now);
        $nowInSec = ($nowTime[0]*3600)+($nowTime[1]*60)+$nowTime[2];
        $diff = $nowInSec - $timeInSec;
        $data = [];
        $data['time'] = $diff;
        $data['etatAgent'] = $live_agent->status;
        $data['etat'] = 200;
        return response()->json($data);
    }
    /////// recuperer le chrono de l'agent (n'import quel status)
    public function getTimeAgent(){
        $user = Session::get('user');
        $live_agent = DB::table('vicidial_live_agents')->where('user',$user)->first();
        $last_call = $live_agent->last_state_change;
        $date2 = date("H:i:s", strtotime($last_call));
        
        $timezone  = +1;
        $now =  gmdate("H:i:s", time() + 3600*($timezone+date("I")));
        $lastcall = explode(':',$date2);
        $timeInSec = ($lastcall[0]*3600)+($lastcall[1]*60)+$lastcall[2];

        $nowTime = explode(':',$now);
        $nowInSec = ($nowTime[0]*3600)+($nowTime[1]*60)+$nowTime[2];
        $diff = $nowInSec - $timeInSec;
        $data = [];
        $data['time'] = $diff;
        $data['etatAgent'] = $live_agent->status;
        $data['etat'] = 200;
        return response()->json($data);
    }
    //// fonction qui couper l'appel par l'agent (hangup)
    public function hangup(Request $request){
        //dd(Session::get('user'));
        if(!empty(Session::get('user'))){            
            $data = [];
            $username = Session::get('user');
            $pass = Session::get('pass');
            $server_ip = Session::get('server_ip');
            $lead_id = $request->lead_id;
            $list_id = $request->list_id;
            $agent_log_id = Session::get('agent_log_id');
            $campaign = Session::get('campaign');
            $session_name = Session::get('session_name');
            $session_id = Session::get('conf_exten');
            $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first();
            $camp_script = $campaignInfo->campaign_script != '' ? $campaignInfo->campaign_script.'' : '';
            $dial_method = $campaignInfo->dial_method;
            $qm_extension = Session::get('extension');
            $auto_dial_level = $campaignInfo->auto_dial_level;
            $user_abb = $username.$username.$username.$username;
            $user_abb = preg_replace("/^\./i","",$user_abb);
            $epoch_sec = date("U");
            $channel = $request->channel;
            //dd($channel);
            $queryCID = 'HLvdcW'.$epoch_sec.$user_abb;
            $phone_login  = Session::get('phone_login');
            $phone_pass = Session::get('phone_pass');
            $customer_server_ip = '';
            $exten = $request->extension;
            $userLogged = DB::table('vicidial_users')->where('user',$username)->where('active','Y')->first();
            $LOGemail = $userLogged->email != '' ? $userLogged->email : '';
            $in_script = '';
            $phone = DB::table('phones')->where('login',$phone_login)
                                    ->where('pass',$phone_pass)
                                    ->where('active','Y')->first();
            $taskMDstage = 'end';
            $conf_silent_prefix = '5';
            $ext_context = $phone->ext_context;
            $recording_exten = $phone->recording_exten;
            $VDstop_rec_after_each_call = $phone->VDstop_rec_after_each_call;
            $protocol = $phone->protocol;
            $LasTCID = '';
            $inOUT = 'OUT';
            $dialed_label = '';
            $agentchannel = $request->agentchannel;
            $conf_dialed = 0;
            $leaving_threeway = 0;
            $hangup_all_non_reserved= '1';
            $blind_transfer = 0;
            $nodeletevdac = '';
            $alt_num_status = 1;
            $leave_3way_start_recording_triggerCALL = 1;
            $leave_3way_start_recording_filename = '';
            $channelrec = "Local/".$conf_silent_prefix.$session_id.'@'.$ext_context;
            $called_count = $request->called_count; 
            $uniqueid = $request->uniqueid;
            $uniqueid1 = $request->uniqueid1;
            $phone_number = $request->phone_number;
            $phone_code = $request->phone_code;
           // dd($agentchannel);
            $http1 = new \GuzzleHttp\Client(); 
            $response1 = $http1->post($this->SERVER.'/agc/manager_send.php', [
                'form_params' => [
                    'user' => $username,
                    'pass' => $pass,
                    'server_ip' => $server_ip,
                    'queryCID' => $queryCID,
                    'session_name' => $session_name,
                    'log_campaign' => $campaign,
                    'qm_extension' => $qm_extension,
                    'channel'      => $channel,
                    'format'       =>'text',
                    'ACTION'       => 'Hangup'
                ],
            ]);

            $LiveSipChannel = DB::table('live_sip_channels')->where('server_ip',$server_ip)->where('extension',$session_id)->where('channel','LIKE','SIP/'.$username.'%')->first();
            //dd($LiveSipChannel);
            $http2 = new \GuzzleHttp\Client(); 
            $response2 = $http2->post($this->SERVER.'/agc/vdc_db_query.php', [
                'form_params' => [
                    'server_ip' => $server_ip,
                    'session_name' => $session_name,
                    'stage'        => $taskMDstage,
                    'uniqueid'     => $uniqueid == 0 ? $uniqueid1 : $uniqueid,
                    'user' => $username,
                    'pass' => $pass,
                    'campaign'    => $campaign,
                    'lead_id'     => $lead_id,
                    'list_id'     => $list_id,
                    'length_in_sec'=> 0,
                    'phone_code'   => $phone_code,
                    'phone_number' => $phone_number,
                    'exten'        => $recording_exten,
                    'channel'      => $LiveSipChannel->channel,/////////
                    'start_epoch'  => 0,
                    'auto_dial_level'=> $auto_dial_level,
                    'VDstop_rec_after_each_call'=> $VDstop_rec_after_each_call,
                    'conf_silent_prefix'=> $conf_silent_prefix,
                    'protocol'   => $protocol,
                    'extension'  => $exten,
                    'ext_context'=> $ext_context,
                    'conf_exten' => $session_id,
                    'user_abb'   => $user_abb,
                    'agent_log_id' => $agent_log_id,
                    'MDnextCID' => $LasTCID,
                    'inOUT' => $inOUT,
                    'alt_dial' => $dialed_label,
                    'DB'       => 0,
                    'agentchannel' => $LiveSipChannel->channel,///////
                    'conf_dialed' => $conf_dialed,
                    'leaving_threeway' => $leaving_threeway,
                    'hangup_all_non_reserved' => $hangup_all_non_reserved,
                    'blind_transfer' => $blind_transfer,
                    'dial_method' => $dial_method,
                    'nodeletevdac' => $nodeletevdac,
                    'alt_num_status' => $alt_num_status,
                    'qm_extension' => $qm_extension,
                    'called_count' => $called_count,
                    'leave_3way_start_recording_trigger' => $leave_3way_start_recording_triggerCALL,
                    'leave_3way_start_recording_filename' => $leave_3way_start_recording_filename,
                    'channelrec' => $channelrec,
                    'format'       =>'text',
                    'ACTION'       => 'manDiaLlogCaLL'
                ],
            ]);
            //dd($response2->getBody()->getContents());
            $recording = DB::table('recording_log')->select('user','start_epoch','filename')->where('user',$username)->orderBy('start_epoch','DESC')->first();
            $channelrec1 = "Local/".$conf_silent_prefix.$session_id."@".$ext_context;

            $response = $http1->post($this->SERVER.'/agc/manager_send.php', [
                'form_params' => [
                    'user' => $username,
                    'pass' => $pass,
                    'server_ip' => $server_ip,
                    'queryCID' => $queryCID,
                    'session_name' => $session_name,
                    'channel'      => $channelrec1,
                    'filename'     => $recording->filename,
                    'lead_id'     => $lead_id,
                    'ext_priority'=> '1',
                    'FROMvdc'     => 'Y',
                    'FROMapi'     => '1',
                    'uniqueid'     => $uniqueid,
                    'ext_context'      => $ext_context,
                    'exten'        => $recording_exten,//$conf_silent_prefix.$session_id,
                    'format'       =>'text',
                    'ACTION'       => 'StopMonitor'
                ],
            ]);
            //dd($response1->getBody()->getContents());   
            $data['contents'] = $response1->getBody()->getContents();

            if(str_contains($data['contents'],'Hangup command sent for Channel')){
                $data['etat'] = 200;
                $data['statuses'] = DB::table('vicidial_campaign_statuses')->select('status','status_name')->distinct()->where('selectable','Y')->orderBy('status','ASC')->get();
            }
            $data['msg'] = 'Hangup with success';
            return response()->json($data);
        }
    }

    //// fonction qui modifier le status de la fiche (Qualification)
    public function UpdateDispo(Request $request)
    {      
        //dd(Session::get('campaign'));
       if(!$request->dispo_choice ||  $request->dispo_choice == null){
            $data['etat'] = 401;
            $data['msg'] = 'stp, veuillez qualifiez votre fiche !!';
            return response()->json($data);
       }
        $dispo_choice = '';
        if($request->dispo_choice == "CALLBK"){
            $dispo_choice1 = "CBHOLD";
        }else{
            $dispo_choice1 = $request->dispo_choice;
        }

        $comments = $request->comments ? $request->comments : '';
        $CallBackrecipient = $request->CallBackrecipient ? $request->CallBackrecipient : '';
        $CallBackLeadStatus = $dispo_choice1;
        //dd($dispo_choice);
        $CallBackDatETimE = $request->date.' '.$request->hour.':00';
        $username = Session::get('user');
        $pass = Session::get('pass');
        $server_ip = Session::get('server_ip');
        $stage = Session::get('campaign');
        $agent_log_id =Session::get('agent_log_id');
        $campaign = Session::get('campaign');
        $session_name = Session::get('session_name');
        $session_id = Session::get('conf_exten');
        $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first();
        $camp_script = $campaignInfo->campaign_script != '' ? $campaignInfo->campaign_script.'' : '';
        $dial_method = $campaignInfo->dial_method;
        $auto_dial_level = $campaignInfo->auto_dial_level;
        $phone_login  = Session::get('phone_login');
        $phone_pass = Session::get('phone_pass');
        $customer_server_ip = '';
        $exten = Session::get('extension');
        $original_phone_login = Session::get('phone_login');
        $userLogged = DB::table('vicidial_users')->where('user',$username)->where('active','Y')->first();
        $LOGemail = $userLogged->email != '' ? $userLogged->email : '';
        $in_script = '';
        $lead_id = $request->lead_id; 
        $VU_user_group = $userLogged->user_group;
        $dispo_choice = $dispo_choice1; ////// choice qualif
        $list_id = $request->list_id;
        $CallBackDatETimE = $CallBackDatETimE == null ? '' : $CallBackDatETimE;
        //$CallBackrecipient = $CallBackrecipient;
        $use_internal_dnc = $campaignInfo->use_internal_dnc;
        $use_campaign_dnc = $campaignInfo->use_campaign_dnc;
        $LasTCID = '';
        $vtiger_callback_id = 0;
        $phone_number = $request->phone_number;
        $phone_code = $request->phone_code;
        $uniqueid = $request->uniqueid;
        $uniqueid1 = $request->uniqueid1;
        //$CallBackLeadStatus = $CallBackLeadStatus;
        $comments = $comments == null ? '' : $comments;
        $custom_field_names = '';
        $call_notes = '';
        $dispo_comments = '';
        $cbcomment_comments = '';
        $qm_dispo_code = '';
        $system_settings = DB::table('system_settings')->get()[0];
        $email_enabled = $system_settings->allow_emails;
        $recording = DB::table('routing_initiated_recordings')->select('recording_id','filename','launch_time')->where('user',$username)->where('processed',0)->orderBy('launch_time','DESC')->first();
        $VDDCU_recording_id = $recording->recording_id;
        $recording_filename = $recording->filename;
        $callback_gmt_offset = '';
        $callback_timezone = '';
        $customer_sec = '';
        $parked_hangup = '0';
        $MDnextCID = '';
        $called_count = $request->called_count;
        $http = new \GuzzleHttp\Client(); 
        $response3 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'server_ip' => $server_ip,
                'session_name' => $session_name,
                'user' => $username,
                'pass' => $pass,
                'orig_pass' => $pass,
                'lead_id'      => $lead_id,
                'stage'           => $lead_id,
                'phone_number'    => $phone_number, 
                'campaign'        => $campaign,
                'agent_log_id'    => $agent_log_id,
                'conf_exten'        => $session_id,
                'user_group'        => $VU_user_group,
                'ACTION'       => 'LeaDSearcHSelecTUpdatE'
            ],
        ]);
        $response2 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
            'form_params' => [
                'server_ip' => $server_ip,
                'session_name' => $session_name,
                'user' => $username,
                'pass' => $pass,
                'orig_pass' => $pass,
                'dispo_choice' => $dispo_choice,
                'lead_id'      => $lead_id,
                'campaign' => $campaign,
                'auto_dial_level' => $auto_dial_level,
                'agent_log_id'    => $agent_log_id,
                'CallBackDatETimE'=> $CallBackDatETimE,
                'list_id'         => $list_id,
                'recipient'       => $CallBackrecipient,
                'use_internal_dnc'=> $use_internal_dnc,
                'use_campaign_dnc'=> $use_campaign_dnc,
                'MDnextCID'       => $MDnextCID,
                'stage'           => 'end', 
                'vtiger_callback_id'=> $vtiger_callback_id,
                'phone_number'    => $phone_number,
                'phone_code'      => $phone_code, 
                'dial_method'     => $dial_method,
                'uniqueid'     => $uniqueid == 0 ? $uniqueid1 : $uniqueid , 
                'CallBackLeadStatus' => $CallBackLeadStatus,
                'comments'        => $comments,
                'custom_field_names'=> $custom_field_names,
                'call_notes'      => $call_notes,
                'dispo_comments'  => $dispo_comments,
                'cbcomment_comments'=> $cbcomment_comments,
                'qm_dispo_code'   => $qm_dispo_code,
                'email_enabled'   => $email_enabled,
                'recording_id'    => $VDDCU_recording_id,
                'recording_filename' => $recording_filename,
                'called_count'    => $called_count,
                'parked_hangup'   => $parked_hangup,
                'phone_login'     => $phone_login,///
                'agent_email'     => $LOGemail,
                'conf_exten'        => $session_id,
                'camp_script'       => $camp_script,
                'in_script'         => $in_script,
                'customer_server_ip'=> $customer_server_ip,
                'exten'             => $exten,
                'original_phone_login'=> $phone_login,
                'phone_pass'        => $phone_pass,
                'callback_gmt_offset' => $callback_gmt_offset,
                'callback_timezone'      => $callback_timezone,
                'customer_sec'=> $customer_sec,
                'call_server_ip' => '',
                'format'       =>'text',
                'ACTION'       => 'updateDISPO'
            ],
        ]);
        $content = $response2->getBody()->getContents();
            
        if($request->agent_status == 1){
            $agent_status = 'READY';
            $changeStatus = $this->ChangeStatus($agent_status);
        }else{
            $agent_status = 'PAUSED';
            $changeStatus = $this->ChangeStatus($agent_status);
        }
        $changeStatus = $changeStatus->getContent();
        $changeStatus = json_decode($changeStatus);
        
        if(str_contains($content,'Lead '.$lead_id.' has been changed to '.$dispo_choice.' Status') && $response2->getStatusCode() == 200){
            $data['etat'] = 200;
            $data['changeStatus'] = $changeStatus;
            $data['msg'] = "L'appel est qualifié avec succés";
            $data['dispo_choice'] = $dispo_choice;
            $data['etatAgent'] = $changeStatus->etatAgent;
            return response()->json($data);

        }else{
            $data['etat'] = 500;
            $data['msg'] = "erreur de systeme, veuillez actualisez la page !";
            $data['etatAgent'] = '';
            return response()->json($data);

        }
    }
    public function updateQualifContact(Request $request){

        $dispo_choice = '';
        if($request->qualif == "CALLBK"){
            $dispo_choice1 = "CBHOLD";
        }else{
            $dispo_choice1 = $request->sub_qualif;
        }
        //dd($dispo_choice1);
        $comments = $request->comments ? $request->comments : '';
        $CallBackrecipient = $request->CallBackrecipient ? $request->CallBackrecipient : '';
        $CallBackLeadStatus = $dispo_choice1;
        
        $CallBackDatETimE = $request->date.' '.$request->hour.':00'; 
        $timezone  = +1;
        $now =  gmdate("Y-m-d H:i", time() + 3600*($timezone+date("I")));

        $username = Session::get('user');
        $user = DB::table('vicidial_list')->where('user',$username)->first();
        $list_id = $request->list_id;
        $lead_id = $request->lead_id;
        $campaign = Session::get('campaign');
        $dispo_choice = $dispo_choice1;
        if($dispo_choice1 == 'CBHOLD'){
            $callback = DB::table('vicidial_callback')->insert([
                'lead_id' => $lead_id, 
                'list_id' => $list_id,
                'campaign_id' => $campaign,
                'status' =>  'LIVE',
                'entry_time' =>  $now,
                'callback_time' =>  $CallBackDatETimE,
                'user' =>  $username,
                'recipient' =>  $CallBackrecipient,
                'user_group'=> $user->user_group,
                'lead_status'=> $CallBackLeadStatus,
                'customer_time'=> $CallBackDatETimE,
                'comments' =>  $comments,
            ]);
        }
        $list = DB::table('vicidial_list')->where('lead_id',$lead_id)->where('list_id',$list_id)->where('user',$username)
            ->update([
                'status' => $dispo_choice,
            ]);
        $list = DB::table('vicidial_log')->where('lead_id',$lead_id)->where('list_id',$list_id)->where('user',$username)->where('campaign_id',$campaign)
            ->update([
                'status' => $dispo_choice,
            ]);

        $data = [];
        $data['etat'] = 200;
        $data['msg'] = 'La Fiche a était requalifiée avec succes';
        return redirect()->back()->with(['success'=>$data]);
        
    }
    //// fonction qui récuperer les information d'un fiche a partir de lead_id
    public function getLeadInfo($lead_id){
        if($lead_id && $lead_id>0){
            $data = [];
            $user = Session::get('user');
            $lead_id = $lead_id;
            //dd($user);
            $campaign = Session::get('campaign');
            $liveagent = DB::table('vicidial_live_agents')->where('user',$user)->first();
            if(!empty($liveagent)){
                $list = DB::table('vicidial_list')->where('user',$user)
                                                  ->where('lead_id',$lead_id)->first();
                //dd($list);
                if(!$list){
                    $data['lead'] ='';
                    $data['etat'] = 500;
                    return response()->json($data);
                }else{
                    $list_id = $list->list_id;
                    $vicidial_log = DB::table('vicidial_log')->select('uniqueid')->where('lead_id',$lead_id)->where('list_id',$list_id)->first();

                    $data['lead'] =$list;
                    $data['uniqueid'] = $vicidial_log->uniqueid;
                    $data['etat'] = 200;
                    $data['campaign'] = Session::get('campaign');
                    return response()->json($data);
                }
            }else{
                $data['lead'] ='aucun prospect avec ce lead';
                $data['etat'] = 500;
                return response()->json($data);
            }  

        }
    }
    

    ////modification des informations pour une fiche et inserer les nouvelles informations 
    public function RegisternewInfoContact(Request $request){

        $data = [];
        $lead_id = $request->lead_id;
        $list = DB::table('vicidial_list')->where('lead_id',$lead_id)
                                              ->first();
        if(!empty($list)){
            $list = DB::table('vicidial_list')->where('lead_id',$lead_id)->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number,
                'alt_phone' => $request->alt_phone,
                'address1' => $request->adr1,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'alt_phone' => $request->alt_phone,
                'email' => $request->email,
                'comments' => $request->commentaire,
            ]);
            $data['etat'] = 200;
            $data['msg'] = "les informations de contact sont modifiées avec succès";
            return response()->json($data);
        }else{
            $data['etat'] = 500;
            $data['msg'] = "erreur de systeme ! les informations de contact ne sont pas enregistrer ";
            return response()->json($data);
        }

    }
    public function RegisternewInfoContactPost(Request $request){

        $data = [];
        $lead_id = $request->lead_id;
        $list = DB::table('vicidial_list')->where('lead_id',$lead_id)
                                              ->first();
        if(!empty($list)){
            $list = DB::table('vicidial_list')->where('lead_id',$lead_id)->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number,
                'alt_phone' => $request->alt_phone,
                'address1' => $request->address1,
                'gender' => $request->gender,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'email' => $request->email,
            ]);
            $data['etat'] = 200;
            $data['msg'] = "les informations de contact sont modifiées avec succès";
            return redirect()->back()->with(['success'=>$data['msg']]);
        }else{
            $data['etat'] = 500;
            $data['msg'] = "erreur de systeme ! les informations de contact ne sont pas enregistrer ";
            return redirect()->back()->with(['error'=>$data['msg']]);
        }
    }

    

    ///// recupere les lives statistiques de l'agent 
    public function getLiveStatisticAgent(){
        if(!empty(Session::get('user'))){
            $http = new \GuzzleHttp\Client(); 
            $response = $http->post($this->SERVER.'/harmony/index.php/get_live_statistic_agent', [
                'form_params' => [
                    'user' => Session::get('user'),
                    'server_ip' => Session::get('server_ip'),
                    'campaign' => Session::get('campaign'),
                ],
            ]);
            $data = [];
            $content = $response->getBody()->getcontents();
            $content = json_decode($content);
            //dd($content);
            return response()->json($content);

        }
    }

    public function ManualDial(Request $request){ 
        $user = Session::get('user');
        $phone_number = $request->phone_number;
        $phone_code = '33';
        $server_ip = Session::get('server_ip'); ///sesssion
        $session_name = Session::get('session_name'); ///sesssion
        $conf_exten = Session::get('conf_exten'); ///sesssion
        $user = Session::get('user'); ///sesssion
        $pass = Session::get('pass'); ///sesssion
        $phone_login = Session::get('phone_login'); ///sesssion
        $phone_pass = Session::get('phone_pass'); ///sesssion
        $campaign = Session::get('campaign'); //// session
        $phone_code = $phone_code; //// view
        
        $liveagent = DB::table('vicidial_live_agents')->where('user',$user)->first();
        if(!empty($liveagent)){

            $list = DB::table('vicidial_list')->where('phone_number',$phone_number)->orWhere('alt_phone',$phone_number)->first();
           // dd($list);
            if(!$list){
                $data['msg'] =  "Ce Numéro de télèphone n'existe pas dans nos enregistrement, veuillez verifier le numéro svp !!";
                return response()->json($data);
            }
            $vicidial_log = DB::table('vicidial_log')->select('uniqueid')->where('lead_id',$list->lead_id)->where('list_id',$list->list_id)->first();
            //dd($vicidial_log);
            $list_id = $list->list_id;
            $called_count = $list->called_count;
            $data['lead'] = $list;
            //$data['uniqueid'] = $vicidial_log->uniqueid;
            $data['etat'] = 200;            
            $lead_id = $data['lead']->lead_id;///
            $phone = DB::table('phones')->where('login',$phone_login)
                                        ->where('pass',$phone_pass)
                                        ->where('active','Y')->first();
            $recording_exten = $phone->recording_exten;
            $outbound_cid = $phone->outbound_cid;
            $ext_context = $phone->ext_context;
            $protocol = $phone->protocol;
            $VDstop_rec_after_each_call = $phone->VDstop_rec_after_each_call;
            $campaignInfo = DB::table('vicidial_campaigns')->where('campaign_id',$campaign)->first(); 
            $dial_timeout = $campaignInfo->manual_dial_timeout;
            $manual_dial_prefix = $campaignInfo->manual_dial_prefix;
            $omit_phone_code = $campaignInfo->omit_phone_code;
            $dial_method = $campaignInfo->dial_method;
            $campaign_rec_filename = $campaignInfo->campaign_rec_filename;
            $prefix_choice = '';
            if(strlen($prefix_choice)>0){ $call_prefix = $prefix_choice; }else{ $call_prefix = $manual_dial_prefix; } 
            $dial_prefix = $call_prefix;
            $call_cid = $outbound_cid; 
            $campaign_cid = $call_cid; 
            $omit_phone_code = $request->omit_phone_code; 
            $usegroupalias = 1;
            $active_group_alias = ''; 
            $account = $active_group_alias; 
            $agent_dialed_number = $request->phone_number; /// view
            $dialed_label = 'MANUAL';
            $agent_dialed_type = $dialed_label; 
            $dial_method = $dial_method; 
            $agent_log_id = $request->agent_log_id; /// view
            $security = $data['lead']->security_phrase;  /// view
            $qm_extension = $request->extension;
            $LastCallCID='';
            $old_CID = $LastCallCID; 
            $cid_lock = 1; 
            $temp_rir = 'Y';
            $routing_initiated_recording = $temp_rir; 
            $exten = $recording_exten; 
            $recording_filename = $campaign_rec_filename; 
            //$channel = $request->channelrec;
            $conf_silent_prefix = '5';
            $channel = "Local/".$conf_silent_prefix.$conf_exten."@".$ext_context; 
            $vendor_lead_code = $data['lead']->vendor_lead_code;  /// view
            $state = $data['lead']->state; /// view 
            $postal_code = $data['lead']->postal_code;  /// view
            $ACTION = 'manDiaLonly';

            $http = new \GuzzleHttp\Client(); 
            $response2 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
                'form_params' => [
                    'server_ip' => $server_ip, 
                    'session_name' => $session_name, 
                    'conf_exten' => $conf_exten, 
                    'user' => $user, 
                    'pass' => $pass, 
                    'lead_id' => $lead_id, ////
                    'phone_number' => $phone_number, 
                    'phone_code' => $phone_code, 
                    'campaign' => $campaign, 
                    'ext_context' => $ext_context, 
                    'dial_timeout' => $dial_timeout, 
                    'dial_prefix' => $dial_prefix, 
                    'campaign_cid' => $campaign_cid, 
                    'omit_phone_code' => $omit_phone_code, 
                    'usegroupalias' => $usegroupalias, 
                    'account' => $account, 
                    'agent_dialed_number' => $agent_dialed_number, 
                    'agent_dialed_type' => $agent_dialed_type, 
                    'dial_method' => $dial_method, 
                    'agent_log_id' => $agent_log_id, 
                    'security' => $security,
                    'qm_extension' => $qm_extension, 
                    'old_CID' => $old_CID, 
                    'cid_lock' => $cid_lock, 
                    'routing_initiated_recording' => $routing_initiated_recording, 
                    'exten' => $exten, 
                    'recording_filename' => $recording_filename, 
                    'channel' => $channel, 
                    'vendor_lead_code' => $vendor_lead_code, 
                    'phone_login' => $phone_login, 
                    'state' => $state, 
                    'postal_code' => $postal_code, 
                    'ACTION' => $ACTION,
                ],
            ]);

            $LiveSipChannel = DB::table('live_sip_channels')->where('server_ip',$server_ip)->where('extension',$conf_exten)->where('channel','LIKE',$channel)->first();
            $auto_dial_level = $campaignInfo->auto_dial_level;
            $inOUT = 'OUT';
            $hangup_all_non_reserved = 1;
            $blind_transfer = 0;
            $user_abb = $user.$user.$user.$user;
            $user_abb = preg_replace("/^\./i","",$user_abb);
            $conf_dialed = 0;
            $nodeletevdac = '';
            $alt_num_status = 1;
            $leave_3way_start_recording_trigger = 1;
            $leave_3way_start_recording_filename = '';
            
            $data['liveagent1'] = DB::table('vicidial_live_agents')->where('user',$user)->first();
            $data['caller_id'] = $data['liveagent1']->callerid;
            sleep(1);
            
            $data['call_log'] = DB::table('call_log')->select('uniqueid')->where('caller_code',$data['caller_id'])->first();
            //dd($data['call_log']);
            $data['uniqueid1'] = $data['call_log']->uniqueid;
            $response3 = $http->post($this->SERVER.'/agc/vdc_db_query.php', [
                'form_params' => [
                    'stage' => 'start',
                    'server_ip' => $server_ip, 
                    'session_name' => $session_name, 
                    'conf_exten' => $conf_exten, 
                    'user' => $user, 
                    'pass' => $pass, 
                    'lead_id' => $lead_id, ////
                    'list_id' => $data['lead']->list_id, ////
                    'uniqueid' => $data['call_log']->uniqueid,
                    'length_in_sec' => 0,
                    'phone_number' => $phone_number, 
                    'phone_code' => $phone_code, 
                    'campaign' => $campaign, 
                    'start_epoch'=> 0,
                    'auto_dial_level'=> $auto_dial_level,
                    'VDstop_rec_after_each_call'=> $VDstop_rec_after_each_call,
                    'conf_silent_prefix'=> $conf_silent_prefix,
                    'protocol'=> $protocol,
                    'extension'=> $qm_extension,
                    'inOUT'=> $inOUT,
                    'DB' => 0,
                    'alt_dial'=> $dialed_label,
                    'hangup_all_non_reserved'=> $hangup_all_non_reserved,
                    'blind_transfer'=> $blind_transfer,
                    'called_count'  => $data['lead']->called_count,
                    'ext_context' => $ext_context,
                    'user_abb'    => $user_abb, 
                    'agentchannel'    => $channel, 
                    'conf_dialed'    => $conf_dialed, 
                    'nodeletevdac'    => $nodeletevdac, 
                    'alt_num_status'    => $alt_num_status, 
                    'leave_3way_start_recording_trigger'    => $leave_3way_start_recording_trigger, 
                    'leave_3way_start_recording_filename'    => $leave_3way_start_recording_filename, 
                    'dial_timeout' => $dial_timeout, 
                    'dial_prefix' => $dial_prefix, 
                    'campaign_cid' => $campaign_cid, 
                    'omit_phone_code' => $omit_phone_code, 
                    'usegroupalias' => $usegroupalias, 
                    'account' => $account, 
                    'agent_dialed_number' => $agent_dialed_number, 
                    'agent_dialed_type' => $agent_dialed_type, 
                    'dial_method' => $dial_method, 
                    'agent_log_id' => $agent_log_id, 
                    'security' => $security,
                    'qm_extension' => $qm_extension, 
                    'old_CID' => $old_CID, 
                    'cid_lock' => $cid_lock, 
                    'routing_initiated_recording' => $routing_initiated_recording, 
                    'exten' => $exten, 
                    'recording_filename' => $recording_filename, 
                    'channel' => $channel, 
                    'vendor_lead_code' => $vendor_lead_code, 
                    'phone_login' => $phone_login, 
                    'state' => $state, 
                    'postal_code' => $postal_code, 
                    'ACTION' => 'manDiaLlogCaLL',
                ],
            ]);

           
            $LiveSipChannel = DB::table('live_sip_channels')->where('server_ip',$server_ip)->where('extension',$conf_exten)->where('channel','LIKE','SIP/'.$user.'%')->first();
            $data['agentchannel'] = $channel;
            $data['channel'] = $channel;
            //$data['contents'] = $response2->getBody()->getContents();
            $data['etat'] = 200;
            //$data['res'] = $response3->getBody()->getcontents();
            
            $data['msg'] =  'lead exist';
            $data['live_agent'] = $data['liveagent1'];
            return response()->json($data);
           
        }else{
            $data['etat'] = 500;
            $data['msg'] = "Vous n'etes pas connectée, s'il vous plait reconnecter avant de faire un appel";
            return response()->json($data);
        }
    }

    public function getLiveCallback(){
        $data = [];
        $data['callbacks'] = DB::table('vicidial_callbacks')->where('vicidial_callbacks.user',Session::get('user'))->where('vicidial_callbacks.campaign_id',Session::get('campaign'))->where('vicidial_callbacks.lead_status','CBHOLD')
            ->join('vicidial_list','vicidial_callbacks.lead_id','=','vicidial_list.lead_id')
            ->select('vicidial_list.*','vicidial_callbacks.callback_id','vicidial_callbacks.callback_time')
             ->get(); 
        //dd($content);
        $data['etat'] = 200;
        return response()->json($data);
    }

}