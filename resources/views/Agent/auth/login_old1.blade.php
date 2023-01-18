 @extends('layouts.login')
@section('Title')
    Login
@endsection
@section('content')


 <div class="container-login100">
        <div class="wrap-login100 p-t-50 p-b-90 p-l-50 p-r-50">
        	@if(session()->has('success'))
            <div class="alert alert-success text-center" id="msg">
            {{ session()->get('success') }}
            </div>
	        @elseif(session()->has('error'))
	                    <div class="alert alert-danger text-center" id="msg">
	                    {{ session()->get('error') }}
	                    </div>
	        @endif
	        <form class="login100-form flex-sb flex-w" id="" method="POST" action="{{ route('login.custom') }}">
            	@csrf
                <span class="login100-form-title">
                    <a href="" target="_blank">
                        <i class="fas fa-user"></i>
                    </a>
                </span>
                <div class="wrap-input100 m-b-16">
                    <input class="input100" type="text" name="user" placeholder="Username">
                     <span class="focus-input100"></span>
                     @if ($errors->has('user'))
                        <span class="text-danger">{{ $errors->first('user') }}</span>
                    @endif
                </div>
              
                <div class="wrap-input100 m-b-16">
                    <input class="input100" name="pass" type="password" placeholder="Password">
                    <span class="focus-input100"></span>
                    @if ($errors->has('pass'))
                        <span class="text-danger">{{ $errors->first('pass') }}</span>
                    @endif
                    
                </div>
                <div class="wrap-input100 m-b-16">
                	<select class="form-control input100" name="campaign" required>
                    <option selected value=""> -- Choisir la compagne --</option>
                    @isset($campaigns)
                    @foreach($campaigns as $camp)
                        <option value="{{$camp->campaign_id}}">{{$camp->campaign_id.' - '.$camp->campaign_name}}</option>
                    @endforeach
                    @endisset
                </select>
                    <span class="focus-input100"></span>
                </div>
              
                <div class="container-login100-form-btn m-t-17">
                    <div class="w-full beforeNone text-center">
                        <input type="submit" class="nv-login-submit login100-form-btn" name="submit">
                    </div>
                </div>
            </form>
        </div>
    </div> 
    @endsection