<style type="text/css">
	.btn-circle.btn-xl {
	    width: 50px;
	    height: 50px;
	    padding: 13px 14px;
	    border-radius: 60px;
	    font-size: 15px;
	    margin-left: 50px;
	}
</style>
<div class="app-header header sticky" >
	<div class="container-fluid main-container" id="headerhor">
		<div class="d-flex">
			<a class="header-brand" href="#">
				<img src="{{asset('images/aa.png')}}">
			</a>
			<div class="app-sidebar__toggle" data-bs-toggle="sidebar">
				<a class="open-toggle"  href="javascript:void(0);">
					<i class="feather feather-menu"></i>
				</a>
				<a class="close-toggle"  href="javascript:void(0);">
					<i class="feather feather-x"></i>
				</a>
			</div>
			<!-- <div class="mt-0">
				<form class="form-inline">
					<div class="search-element">
						<input type="search" class="form-control header-search" placeholder="Search…" aria-label="Search" tabindex="1">
						<button class="btn btn-primary-color" >
							<i class="feather feather-search"></i>
						</button>
					</div>
				</form>
			</div> --><!-- SEARCH -->
			   <!-- <a href="javascript:void(0);"  class="btn btn-danger btn-circle btn-xl"id="racc" onclick="hangup()">
			   	<i class="si si-call-end" data-bs-toggle="tooltip" title="" data-bs-original-title="si-call-end" aria-label="si-call-end"></i></a> -->
			<div class="d-flex order-lg-2 my-auto ms-auto">
				<button class="navbar-toggler nav-link icon navresponsive-toggler vertical-icon ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent-4" aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
					<i class="fe fe-more-vertical header-icons navbar-toggler-icon"></i>
				</button>
				<div class="mb-0 navbar navbar-expand-lg navbar-nav-right responsive-navbar navbar-dark p-0">
					<div class="collapse navbar-collapse" id="navbarSupportedContent-4">
						<div class="d-flex ms-auto">
							<a class="nav-link  icon p-0 nav-link-lg d-lg-none navsearch"  href="javascript:void(0);" data-bs-toggle="search">
								<i class="feather feather-search search-icon header-icon"></i>
							</a>
							<div class="dropdown  d-flex">
								<a class="nav-link icon theme-layout nav-link-bg layout-setting">
									<span class="dark-layout"><i class="fe fe-moon"></i></span>
									<span class="light-layout"><i class="fe fe-sun"></i></span>
								</a>
							</div>
							<!-- <div class="dropdown header-fullscreen">
								<a class="nav-link icon full-screen-link">
									<i class="feather feather-maximize fullscreen-button fullscreen header-icons"></i>
									<i class="feather feather-minimize fullscreen-button exit-fullscreen header-icons"></i>
								</a>
							</div> -->
							<!-- <div class="dropdown header-message">
								<a class="nav-link icon" data-bs-toggle="dropdown">
									<i class="feather feather-bell header-icon"></i>
									<span class="badge badge-success side-badge" id="callback_notification">0</span>
								</a>
								<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow  animated">
									<div class="header-dropdown-list message-menu callback_info" id="message-menu">
										<a class="dropdown-item border-bottom" href="chat">
											
										</a>
										
									</div>
									<div class=" text-center p-2">
										<a href="chat" class="">See All Messages</a>
									</div>
								</div>
							</div> -->

							<!-- <div class="dropdown header-notify">
								<a class="nav-link icon" data-bs-toggle="sidebar-right" data-bs-target=".sidebar-right">
									<i class="feather feather-bell header-icon"></i>
									<span class="bg-dot" id="callback_notification"></span>
								</a>
							</div> -->
							<a class="dropdown-item d-flex" href="{{route('logout')}}">
								<i class="feather feather-power me-3 fs-16 my-auto"></i>
								<div class="mt-1">Sign Out</div>
							</a>
							<div class="dropdown profile-dropdown">
								<a  href="javascript:void(0);" class="nav-link pe-1 ps-0 leading-none" data-bs-toggle="dropdown">
									<span>
										
									</span>
								</a>
								<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow animated">
									<div class="p-3 text-center border-bottom">
										<a href="profile-1" class="text-center user pb-0 font-weight-bold">John Thomson</a>
										<p class="text-center user-semi-title">App Developer</p>
									</div>
									<a class="dropdown-item d-flex" href="profile-1">
										<i class="feather feather-user me-3 fs-16 my-auto"></i>
										<div class="mt-1">Profile</div>
									</a>
									<a class="dropdown-item d-flex" href="edit-profile">
										<i class="feather feather-settings me-3 fs-16 my-auto"></i>
										<div class="mt-1">Settings</div>
									</a>
									<a class="dropdown-item d-flex" href="chat">
										<i class="feather feather-mail me-3 fs-16 my-auto"></i>
										<div class="mt-1">Messages</div>
									</a>
									<a class="dropdown-item d-flex"  href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#changepasswordnmodal">
										<i class="feather feather-edit-2 me-3 fs-16 my-auto"></i>
										<div class="mt-1">Change Password</div>
									</a>
									<a class="dropdown-item d-flex" href="login-1">
										<i class="feather feather-power me-3 fs-16 my-auto"></i>
										<div class="mt-1">Sign Out</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="d-flex header-setting-icon">
					<a class="nav-link icon demo-icon"    href="javascript:void(0);">
						<i class="feather feather-settings  fe-spin"></i>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>


