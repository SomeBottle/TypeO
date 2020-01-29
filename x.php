<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
date_default_timezone_set("Asia/Shanghai");
header('Content-type:text/json;charset=utf-8');
$p = $_POST['t'];
$id = $_POST['i'];
$iflock = $_POST['l'];
$lccode = $_POST['code'];
$act = $_GET['a'];
$path = './ts/' . md5($id) . '.php';
if ($act == 'up') {
    if (!empty($id) && strlen($id) == 8) {
        if (strlen($p) >= 100000) {
            echo 'limit';
            exit();
        }
        if (!is_dir('./ts')) {
            mkdir('./ts');
        }
        $ct = array();
        if (!file_exists($path)) {
            $ct['unix'] = time();
            $ct['content'] = base64_encode($p);
            $ct['lock'] = 'false';
            file_put_contents($path, '<?php $ct=' . var_export($ct, true) . ';?>');
            echo 'success';
        } else {
            require $path;
            if ($ct['lock'] !== 'true' || $lccode == $ct['operation']) {
                if ($iflock == 'true') {
                    $ct['lock'] = 'true';
                    $ct['operation'] = $lccode;
                    file_put_contents($path, '<?php $ct=' . var_export($ct, true) . ';?>');
                    echo 'lock';
                    exit();
                } else if ($iflock == 'false') {
                    $ct['lock'] = 'false';
                    $ct['operation'] = $lccode;
                }
                if ($ct['lock'] !== 'true') {
                    $ct['unix'] = time();
                    $ct['content'] = base64_encode($p);
                    file_put_contents($path, '<?php $ct=' . var_export($ct, true) . ';?>');
                    echo 'success';
                } else {
                    echo 'lock';
                }
            } else if ($ct['lock'] == 'true' && $lccode !== $ct['operation'] && !empty($lccode)) {
                echo 'failunlock';
            } else {
                echo 'lock';
            }
        }
    } else {
        echo 'fail';
    }
} else if ($act == 'gt') {
    if (file_exists($path)) {
        require $path;
        echo base64_decode($ct['content']);
    } else {
        echo 'new';
    }
}
?>