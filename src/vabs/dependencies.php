<?php

class Dependencies
{
	protected $options;

	public function __construct()
	{
		require_once PLUGINPATH . 'src/vabs/language/options.php';
		$this->options = $languages;
	}


	public function load()
	{
		$this->init();
	}

	protected function init()
	{
		add_action( 'admin_enqueue_scripts', array($this, 'enqueue_admin') );
		add_action( 'wp_enqueue_scripts', array($this, 'enqueue') );
	}

	public function enqueue_admin()
	{
		wp_enqueue_style('vabsadminstyle', plugins_url( '../../assets/css/vabs_admin.css', __FILE__ ));
		wp_enqueue_script('vabsadmincript', plugins_url( '../../assets/js/vabs_admin.js', __FILE__ ), '', '', true);
		wp_localize_script('vabsadmincript', 'vabs_ajax_obj', array( 'url' => plugins_url( '../../ajax/ajax_', __FILE__ ) ));
	}


	public function enqueue()
	{
		wp_enqueue_style('vabsformstyle', plugins_url( '../../assets/css/vabs_form.css', __FILE__ ));
		wp_enqueue_script('vabsformscript', plugins_url( '../../assets/js/vabs_form.js', __FILE__ ), '', '', true);

		wp_localize_script('vabsformscript', 'vabs_obj', array(
				'ajax_url' => plugins_url( '../../ajax/ajax_', __FILE__ ),
				'lang' => json_encode($this->options)
		));
	}
}