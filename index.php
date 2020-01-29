<html> 
<head> 
<meta charset="UTF-8"/> 
<title>TypeO</title> 
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
<link href="./t.css?<?php echo rand(1,100000);?>" rel="stylesheet">
</head> 
<body> 
<textarea id='p'></textarea>
<div class='n' id='n'></div>
</body> 
<?php
$r=$_GET['r'];/*text link*/
function grc($length){
   $str = null;
   $strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
   $max = strlen($strPol)-1;
   for($i=0;$i<$length;$i++){
    $str.=$strPol[rand(0,$max)];
   }
   return $str;
} 
$id=grc(8);
if(empty($r)){
	header('Location: ?r='.$id);/*开了伪静态改这个！*/
}else{
	echo '<script>var id=\''.$r.'\';</script>';
}
?>
<script src='./t.js?<?php echo rand(1,100000);?>'></script>
</html> 
