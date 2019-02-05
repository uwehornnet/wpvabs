<?php

/**
 * Plugin Name: API Connection to VABS
 * Description: Plugin to allow user to directly use the VABS API from a frontend form
 * Version: 1.0.0
 * Author: Uwe Horn
 * Author URI http://uwe-horn.net
 * License: GPLv2 or later
 * Text Domain: vabs-api-form
 */

defined('ABSPATH') or die('You can not access this file.');

define('PLUGINPATH', plugin_dir_path( __FILE__ ));

include_once('src/vabs/helpers.php');
include_once('src/vabs/dependencies.php');
include_once('src/vabs/adminpage.php');
include_once('src/vabs/shortcode/vabsbooking.php');
include_once('src/vabs/vabs.php');


function vabs_init_plugin()
{
	$plugin = new VabsPlugin();
	$plugin->init();
}

vabs_init_plugin();


