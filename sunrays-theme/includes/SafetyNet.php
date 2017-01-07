<?php 
/*
 * Sunrays Theme v0.9 (http://lachezarov.com)
 * Licensed under the MIT license
 */

$config = file_get_contents(realpath(dirname(__FILE__) . '/..') . '/config.json');
$config = json_decode($config, true);

$ignore = $config['search']['ignore'];

function safePath($path = '/') {
	return '/' . ltrim($path, '/.');
}

function isIgnoredPath($path = '/') {
	global $ignore;
	$path_pieces = explode('/', $path);
	$final_dir = end($path_pieces);

	return in_array($final_dir, $ignore);
}