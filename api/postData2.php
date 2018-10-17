<?php
include "conn.php";
include "inc/chromePhp.php";

// ChromePhp::log($_POST['tanggal']);

if (isset($_POST['data_date'])) {
    $sql = "SELECT 
                tipe_produk,
                sum(IF(actual - plan > 0, actual - plan, 0)) AS diff_plus,
                sum(IF(actual - plan < 0, actual - plan, 0)) AS diff_minus
            FROM
                perolehan
            WHERE
                tanggal = '{$_POST['data_date']}'
            group by tipe_produk";

    $query = $db->query($sql);
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
