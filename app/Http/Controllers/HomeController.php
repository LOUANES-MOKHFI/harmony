<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use DB;
class HomeController extends Controller
{
    
     //private $server = 'https://call3.callbk.tk';
    //private $SERVER = 'https://call1.harmoniecrm.com';
    private $SERVER = 'https://call3.harmoniecrm.com';
    private $userAdmin = '6666';
    private $passAdmin = '0551797726';
    
    public function index(){
        $data = [];
        
        $campaigns = DB::table('vicidial_campaigns')->get();
        $data = [];
        if($campaigns){
            $data['etat'] = 200;
            $data['campaigns'] = $campaigns;
        }else{
            $data['etat'] = 500;
            $data['campaigns'] = [];
        }
            
        return view('Agent.auth.login',$data);
    }
    public function loginAdmin(){
        return view('Admin.auth.login');
    }
    public function loginAgent(){
        $campaigns = DB::table('vicidial_campaigns')->get();
        $data = [];
        if($campaigns){
            $data['etat'] = 200;
            $data['campaigns'] = $campaigns;
        }else{
            $data['etat'] = 500;
            $data['campaigns'] = [];
        }
            
        return view('Agent.auth.login',$data);
    }
}
