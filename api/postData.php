<?php
include "conn.php";
include "inc/chromePhp.php";

// ChromePhp::log($_POST['tanggal']);

if (!empty($_POST['tanggal'])) {
    $query = $db->query("SELECT * FROM perolehan WHERE tanggal = '{$_POST['tanggal']}' AND tipe_produk = 'fl' OR tipe_produk = 'cl' OR tipe_produk = 'as' OR tipe_produk = 'ts'");
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
