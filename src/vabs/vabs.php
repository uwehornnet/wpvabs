<?php

class VabsPlugin
{
	protected $dependencies;
	protected $adminpage;

	public function __construct()
	{
		$this->dependencies = new Dependencies();
		$this->adminpage = new AdminPage();
	}

}