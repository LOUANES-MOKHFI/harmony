 @extends('login')
@section('title')
    Login
@endsection
@section('content')

<div class="container-login100">
        <div class="wrap-login100 p-t-50 p-b-90 p-l-50 p-r-50">
            @if(session()->has('success'))
                <div class="alert alert-success text-center" id="msg" >
                {{ session()->get('success') }}
                </div>
            @elseif(session()->has('error'))
                <div class="alert alert-danger text-center" id="msg">
                {{ session()->get('error') }}
                </div>
            @endif
            <form class="login100-form flex-sb flex-w" method="POST" action="{{ route('login.custom') }}">
                <span class="login100-form-title">
                    <a href="" target="_blank">
                        <i class="fas fa-user"></i>
                    </a>
                </span>
                <div class="wrap-input100 m-b-16">
                    <input class="input100" type="text" placeholder="Agent" name="user" required>
                    <span class="focus-input100"></span>
                    @if($errors->has('user'))
                        <span class="text-danger">{{ $errors->first('user') }}</span>
                    @endif
                </div>
                <div class="wrap-input100 m-b-16">
                    <input class="input100"  type="password" placeholder="Mot de passe" name="pass">
                    <span class="focus-input100"></span>
                    @if ($errors->has('pass'))
                        <span class="text-danger">{{ $errors->first('pass') }}</span>
                    @endif
                </div>
                <div class="wrap-input100 m-b-16 text-center">
                    <select class="form-control login100-form-btn text-center" name="campaign" required>
                        <option selected value=""> -- Choisir la compagne --</option>
                        @isset($campaigns)
                        @foreach($campaigns as $camp)
                            <option value="{{$camp->campaign_id}}">{{$camp->campaign_id.' - '.$camp->campaign_name}}</option>
                        @endforeach
                        @endisset
                    </select>
                </div>
                <div class="wrap-input100 m-b-16">
                    <input type="submit" class="nv-login-submit login100-form-btn" name="submit">
                </div>
                <img class="fit-picture"
                src="{{asset('images/aa.png')}}"
                alt="HarmonieCrm">

                
            </form>
        </div>
    </div>
@endsection



