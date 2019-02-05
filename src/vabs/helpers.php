<?php

function set_replacement($matches) {
	$value = $matches[1];
	return get_replacement($value);
}

function get_replacement($value) {

	require(PLUGINPATH . '/config.php');
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