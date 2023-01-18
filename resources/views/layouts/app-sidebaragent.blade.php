
<div class="sticky">
    <aside class="app-sidebar">
        <div class="app-sidebar__logo">
            <a class="header-brand" href="index">
                <img src="{{ asset('images/aa.png')}}" class="header-brand-img desktop-lgo" alt="">
                <img src="{{ asset('images/aa.png')}}" class="header-brand-img dark-logo" alt="">
                <img src="{{ asset('images/aa.png')}}" class="header-brand-img mobile-logo" alt="">
                <img src="{{ asset('images/aa.png')}}" class="header-brand-img darkmobile-logo" alt="">
            </a>
        </div>
        <div class="app-sidebar3">
            <div class="main-menu">
                <div class="app-sidebar__user dashboard_agent dashboard_agent">
                    <div class="dropdown user-pro-body text-center">
                        <div class="user-pic">
                            <img src="{{ asset('images/agent.jpg')}}" alt="user-img" class="avatar-xxl rounded-circle mb-1">
                         </div>
                        <div class="profile-usertitle">
                            <div class="profile-usertitle-name"> {{Session::get('user')}} </div>
                            <div class="profile-usertitle-job">
                                <p><i class="icon-earphones-alt"></i> Poste : {{Session::get('phone_login')}}</p>
                                <p><i class="icon-user-following"></i> Compagne : {{Session::get('campaign')}}</p>
                                <!-- <div style="margin-left: 50px;" id="timePAUSED"></div>  -->

                            </div>
                            <input type="hidden" name="agent_status" id="agent_status" value="">
                            <input type="hidden" value="{{$etatAgent}}" id="etat_agent">
                            

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

        		
        		<div class="slide-right" id="slide-right">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"/></svg>
                </div>
        														
        		<div class="Annoucement_card">
                    <div class="text-center">
                        <div>
                            <h5 class="title mt-0 mb-1 ms-2 font-weight-bold tx-12">Agent view</h5> 
        		            <div class="bg-layer py-4"> 
                                <img src="{{asset('css/images/brand/announcement-1.png')}}" class="py-3 text-center mx-auto" alt="img"> 
                            </div>
        		        </div> 
        		    </div> 
                    <a href="form2" style="background: #35C6F4"class="btn btn-block btn-primary my-4 fs-12">Transfert Conf</a>
        		   <a style="background: #161C96"class="btn  btn-sm mb-1">Agent view</a>
                </div>
            </div>
        </div>
    	<a href="form2" class="btn btn-outline-success">formulaire</a>
    </aside>
</div>
