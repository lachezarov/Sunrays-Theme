<?php 

require_once('SafetyNet.php');

$server_root = realpath(dirname(__FILE__) . '/../..');

$tree = array();

$tree_location = $server_root . '/sunrays-theme/tree.json';

function crawl($start) {
	global $server_root;
	global $tree;

	$subs = array_filter(glob($start . '/*'), 'is_dir');

	$subs = array_values($subs);

	if( count($subs) ) {
		foreach( $subs as $sub ) {
			$current_path = str_replace($server_root . '/', '', $sub);
			$current_path_name = end(explode('/', $current_path));
			
			if( !isIgnoredPath($current_path_name) ) {
				$tree[] = '/' . strtolower($current_path);

				crawl($sub);
			}
		}
	}
}

$now = time();

if( file_exists($tree_location) ) {

	if( filemtime($tree_location) < $now - (60 * 60) || isset($_GET['reload']) && $_GET['reload'] === 'true' ) {
		crawl($server_root);

		$tree_json = json_encode($tree);

		$tree_file = fopen($server_root . '/sunrays-theme/tree.json', 'w');

		fwrite($tree_file, $tree_json);

		fclose($tree_file);

	} else {
		$tree_json = file_get_contents($tree_location);
	}
	
} else {
	crawl($server_root);

	$tree_json = json_encode($tree);

	$tree_file = fopen($server_root . '/sunrays-theme/tree.json', 'w');

	fwrite($tree_file, $tree_json);

	fclose($tree_file);
}

echo $tree_json;
