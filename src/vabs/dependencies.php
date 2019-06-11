<?php

class Dependencies
{
	protected $options;

	public function __construct()
	{
		require_once PLUGINPATH . 'src/vabs/language/options.php';
		$this->options = $languages;

		add_action( 'admin_enqueue_scripts', array($this, 'enqueue_admin') );
		add_action( 'wp_enqueue_scripts', array($this, 'enqueue') );

	}


	public function enqueue_admin()
	{
		wp_enqueue_style('vabsadminstyle', plugins_url( 'wpvabs/assets/css/vabs_admin.css'));
		wp_enqueue_script('vabsadmincript', plugins_url( 'wpvabs/assets/js/vabs_admin.js'), '', '', true);
		wp_localize_script('vabsadmincript', 'vabs_ajax_obj', array( 'url' => plugins_url( 'wpvabs/ajax/ajax_') ));
	}


	public function enqueue()
	{
		wp_enqueue_style('vabsformstyle', plugins_url( 'wpvabs/assets/css/vabs_form.css'));
		wp_enqueue_script('vabsformscript', plugins_url( 'wpvabs/assets/js/vabs_form.js'), '', '', true);

		wp_localize_script('vabsformscript', 'vabs_obj', array(
				'ajax_url' => plugins_url( 'wpvabs/ajax/ajax_'),
				'lang' => json_encode($this->options)
		));
	}
}