<?php

class VabsPlugin
{
	protected $dependencies;
	protected $adminpage;
	protected $bookingshortcode;

	public function __construct()
	{
		$this->dependencies = new Dependencies();
		$this->adminpage = new AdminPage();
		$this->bookingshortcode = new VabsBooking();
	}

}