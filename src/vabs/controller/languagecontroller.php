<?php

$route = $_SERVER['HTTP_REFERER'];

include(realpath(dirname(__FILE__)) . '/../language/options.php');

function set_replacement($matches) {
	$value = $matches[1];
	return get_replacement($value);
}

function get_replacement($value) {

	$arr = explode(' ', $value);
	$name = preg_match('/"([^"]+)"/', $arr[1], $m);
	$name = $m[1];
	$link = $config[$arr[0]];
	$value = '<a href="' . $link . '" target="_blank">' . $name . '</a>';

	return $value;
}

function replacePlaceholder($string) {

	if(!\strpos($string, '[')){
		return $string;
	}

	$string = preg_replace_callback("/\[([^\]]*)\]/", "set_replacement", $string);

	return $string;
}


if(isset($_GET['method']) && $_GET['method'] === 'delete'){

	if(array_key_exists($_GET['key'], $languages)){
		unset($languages[$_GET['key']]);
	}

	$file = realpath(dirname(__FILE__)) . '/../language/options.php';

	if(file_put_contents($file, '<?php $languages = ' . var_export($languages, true) . ';') > 0){
		header("Location:" . $route, true, 302);
		return;
	}
}


if(array_key_exists($_POST['lang_name'], $languages)) {
	foreach($_POST as $key => $value) {
		if($key != 'lang_name') {
			$languages[$_POST['lang_name']][$key] = replacePlaceholder($value);
		}
	}
}else{
	$languages[$_POST['lang_name']] = [];
	foreach($_POST as $key => $value) {
		if($key != 'lang_name') {
			$languages[$_POST['lang_name']][$key] = replacePlaceholder($value);
		}
	}
}


$file = realpath(dirname(__FILE__)) . '/../language/options.php';

if(file_put_contents($file, '<?php $languages = ' . var_export($languages, true) . ';') > 0){
	header("Location:" . $route, true, 302);
	return;
}

