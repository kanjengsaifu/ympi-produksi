// Function for rendering main chart
var renderMainChart = function(data) {
    // hide buttons
    $('#btn-close, #btn-ws').addClass('d-none');

    // Un-hide chart #2 container
    $('#chart-2').removeClass('d-none');

    // Chart #1
    $('#chart-container-1').insertFusionCharts({
        type: 'mscolumn3d',
        width: 1024,
        height: 300,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "labelDisplay": "Auto",
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1"
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Surplus",
                    "data": data.surplus
                },
                {
                    "seriesname": "Minus",
                    "data": data.minus
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                var finalData = {}
                $.ajax({
                    type: 'POST',
                    url: 'api/postData.php',
                    dataType: "json",
                    data: {
                        id: dataObj.dataIndex + 1
                    },
                    success: function(res) {
                        var response = res.result;

                        // Populate datas
                        finalData.tanggal = response.tanggal;
                        finalData.categories = [{
                            "label": "FL"
                        }, {
                            "label": "CL"
                        }, {
                            "label": "AS"
                        }, {
                            "label": "TS"
                        }];

                        finalData.surplus = [{
                            "value": response.fl_plus
                        }, {
                            "value": response.cl_plus
                        }, {
                            "value": response.as_plus
                        }, {
                            "value": response.ts_plus
                        }];

                        finalData.minus = [{
                            "value": "-" + response.fl_minus
                        }, {
                            "value": "-" + response.cl_minus
                        }, {
                            "value": "-" + response.as_minus
                        }, {
                            "value": "-" + response.ts_minus
                        }];

                        // Render the Extended Chart
                        renderExtChart(finalData);
                    }
                })
            }
        }
    });

    // Chart #2
    $('#chart-container-2').insertFusionCharts({
        type: 'mscolumn3d',
        width: 1024,
        height: 300,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1"
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Surplus",
                    "data": data.surplus_2
                },
                {
                    "seriesname": "Minus",
                    "data": data.minus_2
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                var finalData = {}
                $.ajax({
                    type: 'POST',
                    url: 'api/postData.php',
                    dataType: "json",
                    data: {
                        id: dataObj.dataIndex + 1
                    },
                    success: function(res) {
                        var response = res.result;

                        // Populate datas
                        finalData.tanggal = response.tanggal;
                        finalData.categories = [{
                            "label": "PN"
                        }, {
                            "label": "RC"
                        }, {
                            "label": "VN"
                        }];

                        finalData.surplus = [{
                            "value": response.pn_plus
                        }, {
                            "value": response.rc_plus
                        }, {
                            "value": response.vn_plus
                        }];

                        finalData.minus = [{
                            "value": response.pn_minus
                        }, {
                            "value": response.rc_minus
                        }, {
                            "value": response.vn_minus
                        }];

                        // Render the Extended Chart
                        renderExtChart(finalData);
                    }
                })
            }
        }
    });
}

// Render extended chart Fn
var renderExtChart = function(data) {
    // un-hide buttons
    $('#btn-close, #btn-ws').removeClass('d-none');

    // hide chart #2 container
    $('#chart-2').addClass('d-none');

    // hide chart #1 title and marquee
    $('#title-chart-1, .marquee').addClass('d-none');

    // save respected value on a hidden fields
    $('#hidden-date').val(moment(data.tanggal).utc().format('YYYY-MM-DD'));
    $('#hidden-type').val(data.categories[0].label);

    // main action
    $('#chart-container-1').insertFusionCharts({
        type: 'mscolumn3d',
        width: 1024,
        height: 600,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Perolehan Produksi",
                "subCaption": "Tanggal " + moment(data.tanggal).utc().format('DD MMMM YY'),
                // "xAxisName": "Produk",
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1"
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Surplus",
                    "data": data.surplus
                },
                {
                    "seriesname": "Minus",
                    "data": data.minus
                }
            ]
        },
        "events": {
            "dataPlotClick": function(eventObj, dataObj) {
                if (dataObj.categoryLabel == 'FL' || dataObj.categoryLabel == 'CL' || dataObj.categoryLabel == 'AS' || dataObj.categoryLabel == 'TS') {
                    // Call table data API
                    $.ajax({
                        type: 'POST',
                        url: 'api/postDetail.php',
                        dataType: "json",
                        data: {
                            id: dataObj.dataIndex + 1,
                            data_type: dataObj.categoryLabel,
                            data_date: $('#hidden-date').val()
                        },
                        success: function(res) {
                            $('#modal-title').html('Data Kesesuaian: ' + dataObj.categoryLabel);
                            $("#table-tgl").html(moment($('#hidden-date').val()).format('DD MMMM YYYY'));

                            // clear the table
                            $("#table-data").html('');

                            if (res.status == 'ok') {
                                var vQty = 0;
                                $.each(res.result, function(key, value) {
                                    $("#table-data").append("<tr><td>" + value.gmc + "</td><td>" + value.desc + "</td><td>" + value.qty + "</td>/tr");
                                    vQty += parseInt(value.qty);
                                })
                                // append the Qty total
                                $('#table-total').html(vQty);

                                // Show the MODAL
                                $('#modal').modal('show');
                            } else {
                                $('#modal-error').modal('show');
                            }
                        }
                    })
                }
            }
        }
    });
}

// Render WEEKLY SHIPMENT chart Fn
var renderWsChart = function(data) {
    // hide WS button
    $('#btn-ws').addClass('d-none');

    // main action
    $('#chart-container-1').insertFusionCharts({
        type: 'mscolumn3d',
        width: 1024,
        height: 600,
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "Produksi Mingguan",
                "subCaption": "Minggu ke-35",
                "xAxisName": "Produk",
                "yAxisName": "Perolehan",
                "theme": "fusion",
                "plotFillAlpha": "80",
                "divLineIsDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "showValues": "1"
            },
            "categories": [{
                "category": data.categories
            }],
            "dataset": [{
                    "seriesname": "Surplus",
                    "data": data.surplus
                },
                {
                    "seriesname": "Minus",
                    "data": data.minus
                }
            ]
        }
    });
}

// Call API for Main Chart Fn
var initiateData = function() {
    // reset components this.state
    $('.marquee, #title-chart-1').removeClass('d-none');

    $.ajax({
        type: 'GET',
        url: 'api/getData.php',
        dataType: "json",
        success: function(response) {
            var finalData = {},
                dataCategories = [],
                dataSurplus = [],
                dataMinus = [],
                dataSurplus2 = [],
                dataMinus2 = [];

            // summarize data
            if (response.status == 'ok') {
                var rawData = response.result;
                rawData.forEach(function(data) {
                    var dataTgl = {
                        "label": moment(data.tanggal).utc().format('DD MMM YY')
                    }
                    dataCategories.push(dataTgl);

                    var dtPlus = {
                        "value": parseInt(data.fl_plus) + parseInt(data.cl_plus) + parseInt(data.as_plus) + parseInt(data.ts_plus)
                    }
                    dataSurplus.push(dtPlus);

                    var dtMinus = {
                        "value": "-" + (parseInt(data.fl_minus) + parseInt(data.cl_minus) + parseInt(data.as_minus) + parseInt(data.ts_minus))
                    }
                    dataMinus.push(dtMinus);

                    var dtPlus2 = {
                        "value": parseInt(data.pn_plus) + parseInt(data.rc_plus) + parseInt(data.vn_plus)
                    }
                    dataSurplus2.push(dtPlus2);

                    var dtMinus2 = {
                        "value": parseInt(data.pn_minus) + parseInt(data.rc_minus) + parseInt(data.vn_minus)
                    }
                    dataMinus2.push(dtMinus2);
                })
            }

            // populating data
            finalData = {
                "categories": dataCategories,
                "surplus": dataSurplus,
                "minus": dataMinus,
                "surplus_2": dataSurplus2,
                "minus_2": dataMinus2
            };

            // Render main chart
            renderMainChart(finalData);
        }
    });
}

// Render marquee Fn
var renderMarquee = function() {
    $('.marquee').marquee({
        duration: 15000,
        gap: 50,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true
    });
}