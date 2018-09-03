<?php
include "conn.php";
include "inc/chromePhp.php";

if (!empty($_POST['type'])) {
    $dt = $_POST['type'];
    $rows = array();

    if ($dt === "FL") {
        $query = $db->query("SELECT tanggal, persentase_fl, persentase_cl, persentase_as, persentase_ts FROM perolehan WHERE tanggal = '2018-08-30'");
    } else {
        $query = $db->query("SELECT tanggal, persentase_pn, persentase_rc, persentase_vn FROM perolehan WHERE tanggal = '2018-08-30'");
    }

    if ($query->num_rows > 0) {
        while ($r = mysqli_fetch_assoc($query)) {
            $rows[] = $r;
        }

        $data['status'] = 'ok';
        $data['result'] = $rows;
        $data['result'][0]['data_type'] = $_POST['type'];
    } else {
        $data['status'] = 'err';
        $data['result'] = '';
    }

    echo json_encode($data);
}
