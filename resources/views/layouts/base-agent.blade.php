
<!doctype html>
<html lang="en" dir="ltr">
    <head>

        <!-- META DATA -->
        <meta charset="UTF-8">
        <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=0'>
        <meta content="DayOne - It is one of the Major Dashboard Template which includes - HR, Employee and Job Dashboard. This template has multipurpose HTML template and also deals with Task, Project, Client and Support System Dashboard." name="description">
        <meta content="Spruko Technologies Private Limited" name="author">
        <meta name="keywords" content="admin dashboard, admin dashboard template, admin template, bootstrap 5 django, django, django bootstrap admin, django template, django bootstrap template, django admin, django admin dashboard, django admin dashboard template, django admin panel, django admin template, django dashboard, dashboard template">
    
        <link rel="icon" href="{{asset('images/aa.png')}}" type="image/x-icon"/>


 
        <link rel="stylesheet" href="{{asset('css/index.css')}}"> 
        <link href="{{asset('css/pause/demo.css')}}"rel="stylesheet"/>
        <link href="{{asset('css/pause/flipTimer.css')}}"rel="stylesheet"/>
        
        <link href="{{asset('assets/css/style.css')}}" rel="stylesheet" />
        <link href="{{asset('assets/css/plugins.css')}}" rel="stylesheet" />
 
         <!--- ANIMATE CSS -->
        <link href="{{asset('assets/css/animated.css')}}" rel="stylesheet" />
 
         <!--- ICONS CSS -->
        <link href="{{asset('assets/css/icons.css')}}" rel="stylesheet" />
        <title>Harmonie - @yield('title')</title>
        
        @include('layouts.styles')
       
        <link href="{{asset('assets/switcher/css/switcher.css')}}" rel="stylesheet"/>
        <link href="{{asset('assets/switcher/demo.css')}}"rel="stylesheet"/>  

        @yield('css')  
    </head>

    <body class="ltr app sidebar-mini">

        <!-- SWITCHER -->
        @include('layouts.switcher')
        <!-- SWITCHER END-->

        <!-- GLOBAL-LOADER -->
		<!--div id="global-loader">
			<img src="{{asset('assets/images/svgs/loader.svg')}}" alt="loader">
		</div-->
		<!-- GLOBAL-LOADER END -->

        <!-- PAGE -->
		<div class="page">
			<div class="page-main">

                <!-- APP-HEADER -->
              
                <!-- APP-HEADER END-->
                 
                @include('layouts.app-header')

                <!-- APP-SIDEBAR -->
               
                 
                @include('layouts.app-sidebaragent')

                <!-- APP-SIDEBAR END-->

                <!-- APP-CONTENT -->
                <div class="app-content main-content">
                    
                    <div class="side-app main-container">      
                           
                            @yield('agent')

                       
                   </div> 
                    <!-- APP-CONTENT END -->
               </div>
            <!-- PAGE-MAIN END -->
          </div>
            <!-- CHANGE PASSWORD MODAL -->
            
            @include('layouts.modal')
  

            <!-- CHANGE PASSWORD MODAL END-->

            <!-- RIGHT-SIDEBAR -->
            
            @include('layouts.right-sidebar')

            <!-- RIGHT-SIDEBAR END-->

            <!-- FOOTER -->
            
            @include('layouts.footer')

            <!-- FOOTER END-->

        </div>
        <!-- PAGE END -->

        <!-- SCRIPTS -->
        
            @include('layouts.scripts')
        <!-- INTERNAL INDEX JS -->
            <script src="{{asset('assets/js/custom1.js')}}"></script>

            <!-- SWITCHER JS -->
            <script src="{{asset('assets/switcher/js/switcher.js')}}"></script>
            <script src="{{asset('js/jquery.flipTimer.js')}}"></script>
            @yield('script')  
    </body>

</html>




