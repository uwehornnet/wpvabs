<?php

$route = $_SERVER['HTTP_REFERER'];

include(realpath(dirname(__FILE__)) . '/../language/options.php');

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




$file = realpath(dirname(__FILE__)) . '/../language/options.php';

if(file_put_contents($file, '<?php $languages = ' . var_export($languages, true) . ';') > 0){
	header("Location:" . $route, true, 302);
	return;
}

