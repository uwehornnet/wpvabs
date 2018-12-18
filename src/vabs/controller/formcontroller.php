<?php

$route = $_SERVER['HTTP_REFERER'];

$data = array(
		'api_token' => $_POST['api_token'] ? $_POST['api_token'] : null,
		'client_id' => $_POST['client_id'] ? $_POST['client_id'] : null
);

$file = realpath(dirname(__FILE__)) . '/../../../config.php';

file_put_contents($file, '<?php $config = ' . var_export($data, true) . ';');

header("Location:" . $route, true, 302);

