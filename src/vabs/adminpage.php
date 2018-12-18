<?php

class AdminPage
{
	public $config;
	public $options;

	public function __construct()
	{
		include(PLUGINPATH . 'config.php');
		$this->config = $config;

		include(PLUGINPATH . 'src/vabs/language/options.php');
		$this->languages = $languages;
	}

	public function create()
	{
		add_action( 'admin_menu', array($this, 'add_admin_pages') );
	}


	public function add_admin_pages()
	{
		add_menu_page('vabs plugin', 'VABS', 'manage_options', 'vabs_api_plugin', array($this, 'admin_index'), '', 110);
		add_submenu_page('vabs_api_plugin', 'Shortcode', 'Shortcode', 'manage_options', 'vabs_generator', array($this, 'admin_generator'));
		add_submenu_page('vabs_api_plugin', 'Language', 'Language', 'manage_options', 'vabs_language', array($this, 'admin_language'));
	}


	public function admin_index()
	{
		include(PLUGINPATH . 'src/vabs/templates/index.php');
	}


	public function admin_generator()
	{
		include(PLUGINPATH . 'src/vabs/templates/generator.php');
	}


	public function admin_language()
	{
		include(PLUGINPATH . 'src/vabs/templates/language.php');
	}
}