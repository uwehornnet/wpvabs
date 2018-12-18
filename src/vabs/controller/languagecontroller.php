<?php

include(realpath(dirname(__FILE__)) . '/../language/options.php');

if(array_key_exists($_POST['lang_name'], $languages)) {
	foreach($_POST as $key => $value) {
		if($key != 'lang_name') {
			$languages[$_POST['lang_name']][$key] = $value;
		}
	}
}else{
	$languages[$_POST['lang_name']] = [];
	foreach($_POST as $key => $value) {
		if($key != 'lang_name') {
			$languages[$_POST['lang_name']][$key] = $value;
		}
	}
}


$route = $_SERVER['HTTP_REFERER'];

$file = realpath(dirname(__FILE__)) . '/../language/options.php';

file_put_contents($file, '<?php $languages = ' . var_export($languages, true) . ';');

header("Location:" . $route, true, 302);

