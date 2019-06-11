<?php

class VabsBooking
{
	protected $options;

	public function __construct()
	{
		include(PLUGINPATH . 'src/vabs/language/options.php');
		$this->options = $languages;

		add_shortcode('vabs_booking', array( $this, 'init' ));
	}


	/**
	 * @param $atts
	 * @return string
	 */
	public function init($atts)
	{
		return '<div class="vabs-api-form" data-form="' . $atts['form'] . '" data-type="' . $atts['type'] . '" data-query="' . $atts['query'] . '" data-lang="' . $atts['lang'] . '"></div>';

	}

}