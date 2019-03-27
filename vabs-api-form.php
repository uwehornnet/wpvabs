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

require 'plugin-update-checker/plugin-update-checker.php';
$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
		'https://github.com/uwehornnet/wpvabs/',
		__FILE__,
		'wp-vabs'
);

//Optional: If you're using a private repository, specify the access token like this:
//$myUpdateChecker->setAuthentication('your-token-here');

//Optional: Set the branch that contains the stable release.
$myUpdateChecker->setBranch('master');

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


