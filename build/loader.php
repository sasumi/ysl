<?php
set_time_limit(5);
define('APP_PATH', strtr(dirname(dirname(__FILE__)), '\\','/').'/');
define('SOURCE_PATH', APP_PATH.'source/');

foreach($_GET as $k=>$get){
	$_GET[$k] = trim($get);
}

//get all source js file list
$filelist = get_file_list(SOURCE_PATH, 'js');
$modulelist = array();
$all_output = '';
foreach($filelist as $file){
	list($k) = explode('.',basename($file));
	$modulelist[$k] = $file;
	$all_output .= file_get_contents($file).";\r\n";
}
die($all_output);

$specmodulelist = array();
$f = $_GET['f'] ? explode(',',$_GET['f']) : null;
if(!$f){
	$specmodulelist = $modulelist;
} else {
	foreach($f as $item){
		$specmodulelist[$item] = $modulelist[$item];
	}
}
$output_str = load_js($specmodulelist, $modulelist);

//TODO BUG
function load_js($specmodulelist, $modulelist){
	$output = '';
	foreach($specmodulelist as $key=>$file){
		$tmp = file_get_contents($file);
		$newmodulelist = array();
		$output .= $tmp;
		preg_match_all('/@include\s*(\w*?).js/ies', $tmp, $matches);
		if(!empty($matches[1])){
			foreach($matches[1] as $k){
				if(!$specmodulelist[$k]){
					$newmodulelist[$k] = $modulelist[$k];
				}
			}
			$output .= load_js($newmodulelist, $modulelist);
		}
	}
}

/**
 * get file list by recuresion
 * @param string $path
 * @param string $ext
 * @return array
 */
function get_file_list($path, $ext){
	$filelist = glob($path.'*');
	$morefiles = array();
	$resultfiles = array();
	foreach($filelist as $file){
		$_ext = array_pop(explode('.', $file));
		if(is_dir($file)){
			$morefiles = @array_merge($morefiles, get_file_list($file.'/*', $ext));
		} else if(strcasecmp($_ext, $ext) == 0) {
			array_push($resultfiles, $file);
		}
	}
	$ret = @array_merge($morefiles, $resultfiles);
	array_multisort($ret, SORT_ASC);
	return $ret;
}