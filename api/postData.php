<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['tanggal'])) {
    switch ($_POST['tipe_produk']) {
        case "FLUTE":
            $tipe_produk = 'fl';
            break;
        case "CLARINET":
            $tipe_produk = 'cl';
            break;
        case "ALTO SAX":
            $tipe_produk = 'as';
            break;
        case "TENOR SAX":
            $tipe_produk = 'ts';
            break;
        case "PIANICA":
            $tipe_produk = 'pn';
            break;
        case "VENOVA":
            $tipe_produk = 'vn';
            break;
        default:
            $tipe_produk = 'rc';
            break;
    }

    $query = $db->query("SELECT * FROM perolehan WHERE tanggal = '{$_POST['tanggal']}' and tipe_produk = '{$tipe_produk}'");
    $rows = array();

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }
        $data['status'] = 'ok';
        $data['result'] = $rows;
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    //returns data as JSON format
    echo json_encode($data);
}
