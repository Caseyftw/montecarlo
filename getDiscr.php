<?php
ini_set ("display_errors", "1");
error_reporting(E_ALL);

$text = file_get_contents('discrepancies.txt', false);

$discr = json_encode($text);
echo $discr;
?>