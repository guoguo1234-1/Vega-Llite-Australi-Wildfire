// Chart1 spec
const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 450,
    "background": "transparent",
	// Dropdown settings
    "params": [{
            "name": "vParam",
            "value": "brightness",
            "bind": {
                "input": "select",
                "name": "Data: ",
                "options": ["brightness", "frp"]
            }
        },
        {
            "name": "satelliteParam",
            "value": "All",
            "bind": {
                "input": "select",
                "name": "Satellite: ",
                "options": ["All", "Terra", "Aqua"]
            }
        },
        {
            "name": "daynightParam",
            "value": "All",
            "bind": {
                "input": "select",
                "name": "Day or Night: ",
                "options": ["All", "D", "N"]
            }
        },
        {
            "name": "dateParam",
            "value": "All",
            "bind": {
                "input": "select",
                "name": "Date: ",
                "options": ["All", "2019/1", "2019/2", "2019/3", "2019/4", "2019/5", "2019/6", "2019/7", "2019/8", "2019/9", "2019/10", "2019/11", "2019/12"]
            }
        }
    ],
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/fire_archive_M6_96619.csv"
    },
    "layer": [{
            "data": {
                "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/states.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "mark": {
                "type": "geoshape",
                "stroke": "white",
                "strokeWidth": 0.5
            },
            "encoding": {
                "color": {
                    "value": {
                        "signal": "daynightParam != 'N' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.8)'"
                    } //"rgba(0,0,0,0.3)"
                }
            }
        },
        {
            "transform": [{
                    "filter": "(satelliteParam=='All' | datum.satellite == satelliteParam) & (dateParam=='All' | datum.month==dateParam) & (daynightParam=='All' | datum.daynight==daynightParam)"
                },
                {
                    "calculate": "vParam == 'brightness' ? datum.brightness : datum.frp",
                    "as": "v"
                }
            ],
            "mark": {
                "type": "circle"
            },
            "encoding": {
                "latitude": {
                    "field": "latitude"
                },
                "longitude": {
                    "field": "longitude"
                },
                "size": {
                    "field": "confidence",
                    "type": "quantitative",
                    "title": "Fire confidence",
                    "scale": {
                        "range": [2, 50]
                    }
                },
                "color": {
                    "field": "v",
                    "type": "quantitative",
                    "title": {
                        "signal": "vParam == 'brightness' ? 'Fire brightness' : 'Fire frp'"
                    },
                    "scale": {
                        "scheme": { "signal": "daynightParam != 'N' ? 'Reds' : ['yellow', 'red']" }
                    },
                },
                "tooltip": [{
                        "field": "latitude",
                        "title": "Latitude"
                    },
                    {
                        "field": "longitude",
                        "title": "Longitude"
                    },
                    {
                        "field": "acq_date",
                        "title": "Date"
                    },
                    {
                        "field": "satellite",
                        "title": "Satellite"
                    },
                    {
                        "field": "daynight",
                        "title": "Daynight"
                    },
                    {
                        "field": "brightness",
                        "title": "Brightness"
                    },
                    {
                        "field": "frp",
                        "title": "Frp"
                    }
                ]
            }
        }
    ]
}

// Chart2 spec
const spec1 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 450,
    "background": "transparent",
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/Historical_Wildfires.csv"
    },
    "params": [{
        "name": "monthParam",
        "value": "All",
        "bind": {
            "input": "select",
            "name": "Month: ",
            "options": ['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
    }],
    "layer": [{
            "data": {
                "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/states.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "mark": {
                "type": "geoshape",
                "stroke": "white",
                "strokeWidth": 0.5
            },
            "encoding": {
                "color": {
                    "value": "rgba(0,0,0,0.6)"
                }
            }
        },
        {
            "transform": [{
                    "filter": "datum.Year == 2019",
                },
                {
                    "lookup": "id",
                    "from": {
                        "data": {
                            "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/states.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "key": "id"
                    },
                    "as": "geo"
                },
                {
                    "aggregate": [{
                        "op": "sum",
                        "field": "Count",
                        "as": "Count0"
                    }],
                    "groupby": ["Month", "STATE_NAME", "geo"]
                },
                {
                    "filter": "(datum.Month == monthParam | monthParam == 'All')",
                }
            ],
            "projection": {
                "type": "mercator"
            },
            "mark": {
                "type": "geoshape",
                "stroke": "#ffffff",
                "strokeWidth": 0.5
            },
            "encoding": {
                "shape": {
                    "field": "geo",
                    "type": "geojson"
                },
                "color": {
                    "field": "Count0",
                    "type": "quantitative",
                    "scale": {
                        "scheme": "Reds"
                    },
                    "legend": {
                        "title": "Fires count",
                        "orient": "right",
                        "direction": "vertical",
                    }
                },
                "tooltip": [{
                        "field": "Month",
                        "type": "ordinal",
                        "title": "Month"
                    },
                    {
                        "field": "STATE_NAME",
                        "type": "ordinal",
                        "title": "State"
                    },
                    {
                        "field": "Count0",
                        "type": "quantitative",
                        "aggregate": "sum",
                        "title": "Fires count"
                    }
                ]
            }
        }
    ]
}

// Chart3 spec
const spec2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 450,
    "background": "transparent",
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/fire_archive_M6_96619.csv"
    },
    "params": [{
        "name": "satelliteParam",
        "value": "All",
        "bind": {
            "input": "select",
            "name": "Satellite: ",
            "options": ["All", "Terra", "Aqua"]
        }
    }],
	// Data filter and aggregate
    "transform": [{
            "filter": "satelliteParam=='All' | datum.satellite == satelliteParam"
        },
        {
            "aggregate": [{
                "op": "count",
                "field": "daynight",
                "as": "Count0"
            }, {
                "op": "mean",
                "field": "frp",
                "as": "Count1"
            }],
            "groupby": ["month", "daynight"]
        }

    ],
	// Implement bar charts and line charts on the same graph through multiple layer nesting.
    "layer": [{
            "layer": [{
                    "params": [{
                        "name": "industry1",
                        "select": {
                            "type": "point",
                            "fields": ["daynight"]
                        },
                        "bind": "legend"
                    }],
                    "mark": "bar",
                    "encoding": {
                        "x": {
                            "timeUnit": "month",
                            "field": "month",
                            "type": "ordinal",
                            "title": "Month"
                        },
                        "y": {
                            "field": "Count0",
                            "type": "quantitative",
                            "title": "Fires count"
                        },
                        "color": {
                            "field": "daynight",
                            // "type": "ordinal",
                            "title": "Day or Night",
                            "scale": {
                                "scheme": "Reds"
                            }
                        },
                        "opacity": {
                            "condition": {
                                "param": "industry1",
                                "value": 1
                            },
                            "value": 0.2
                        },
                        "tooltip": [{
                                "timeUnit": "month",
                                "field": "month",
                                "type": "ordinal",
                                "title": "Month"
                            },
                            {
                                "field": "Count0",
                                "type": "quantitative",
                                "title": "Fires count",
                            },
                            {
                                "field": "daynight",
                                "type": "ordinal",
                                "title": "Day or Night",
                                "scale": {
                                    "range": ["orange", "#FF3E0A"]
                                },
                            }
                        ]
                    }
                },
                {
                    "mark": {
                        "type": "text",
                        "align": "center",
                        "baseline": "bottom",
                        // "dy": 4
                    },
                    "encoding": {
                        "x": {
                            "timeUnit": "month",
                            "field": "month",
                            "type": "ordinal",
                            "title": "Month"
                        },
                        "y": {
                            "field": "Count0",
                            "aggregate": "sum",
                            "type": "quantitative",
                            "aggregate": "sum",
                            "title": "Fires count"
                        },
                        "text": {
                            "field": "Count0",
                            "aggregate": "sum",
                            "type": "quantitative",
                            "title": "Fires count"
                        }
                    }
                },
                {
                    "mark": {
                        "type": "text",
                        "align": "center",
                        "baseline": "top",
                        // "dy": 4
                    },
                    "encoding": {
                        "x": {
                            "timeUnit": "month",
                            "field": "month",
                            "type": "ordinal",
                            "title": "Month"
                        },
                        "y": {
                            "field": "Count0",
                            "type": "quantitative",
                            "aggregate": "sum",
                            "title": "Fires count"
                        },
                        "text": {
                            "field": "Count0",
                            "type": "quantitative",
                            "title": "Fires count"
                        }
                    }
                }
            ]
        },
        {
            "layer": [{
                    "params": [{
                        "name": "industry2",
                        "select": {
                            "type": "point",
                            "fields": ["daynight"]
                        },
                        "bind": "legend"
                    }],
                    "mark": {
                        "type": "line",
                        "point": true
                    },
                    "encoding": {
                        "x": {
                            "timeUnit": "month",
                            "field": "month",
                            "type": "ordinal",
                            "title": "Month"
                        },
                        "y": {
                            "field": "Count1",
                            "type": "quantitative",
                            "title": "Fire mean frp"
                        },
                        "stroke": {
                            "field": "daynight",
                            "type": "ordinal",
                            "title": "Day or Night",
                            "scale": {
                                "range": ["orange", "#FF3E0A"]
                            },
                        },
                        "strokeOpacity": {
                            "condition": {
                                "param": "industry2",
                                "value": 1
                            },
                            "value": 0.2
                        },
                        "tooltip": [{
                                "timeUnit": "month",
                                "field": "month",
                                "type": "ordinal",
                                "title": "Month"
                            },
                            {
                                "field": "Count1",
                                "type": "quantitative",
                                "title": "Fire mean frp",
                                "format": ".2f"
                            },
                            {
                                "field": "daynight",
                                "type": "ordinal",
                                "title": "Day or Night",
                                "scale": {
                                    "range": ["orange", "#FF3E0A"]
                                },
                            }
                        ]
                    }
                },
                {
                    "mark": {
                        "type": "text",
                        "align": "left",
                        "baseline": "middle",
                        "dx": 15
                    },
                    "encoding": {
                        "x": {
                            "timeUnit": "month",
                            "field": "month",
                            "type": "ordinal",
                            "title": "Month"
                        },
                        "y": {
                            "field": "Count1",
                            "type": "quantitative",
                            "aggregate": "sum",
                            "title": "Fires count"
                        },
                        "text": {
                            "field": "Count1",
                            "type": "quantitative",
                            "title": "Fires count",
                            "format": ".2f"
                        }
                    }
                }
            ]
        }
    ],
    "resolve": {
        "scale": {
            "y": "independent" // Control dual Y-axes
        }
    }
}

// Chart4 spec
const spec3 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 400,
    "background": "transparent",
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/Historical_Wildfires.csv"
    },
	// Data transform
    "transform": [{
            "filter": "datum.Year == 2019",
        },
        {
            "aggregate": [{
                    "op": "sum",
                    "field": "Count",
                    "as": "NCount"
                },
                {
                    "op": "sum",
                    "field": "Estimated_fire_area",
                    "as": "NEstimated_fire_area"
                }
            ],
            "groupby": ["STATE_NAME", "Month"]
        },
        {
            "calculate": "toNumber(datum.Month)",
            "as": "month_num"
        }
    ],
    "params": [{
        "name": "industry3",
        "select": {
            "type": "point",
            "fields": ["month_num"]
        },
        "bind": "legend"
    }, {
        "name": "industry4",
        "select": {
            "type": "point",
            "fields": ["STATE_NAME"]
        },
        "bind": "legend"
    }],
    "mark": {
        "type": "circle",
        "stroke": "rgba(0,0,0,0.01)",
        "strokeWidth": 0.1,
        // "fill": "red"
    },
    "encoding": {
        "x": {
            "field": "NCount",
            "type": "quantitative",
            "axis": {
                "labelAngle": 0
            },
            "title": "Fires count",
            "axis": {
                "grid": true,
                "gridColor": "white",
                "gridWidth": 1
            },
        },
        "y": {
            "field": "NEstimated_fire_area",
            "type": "quantitative",
            "title": "Estimated fire area",
            "axis": {
                "grid": true,
                "gridColor": "white",
                "gridWidth": 1
            },
            "sort": {
                "order": "descending",
                "field": "month_num",
                type: "number"
            }
        },
        "size": {
            "condition": {
                "param": "industry4",
                "field": "STATE_NAME",
                "title": "State",
                "scale": {
                    "range": [10, 200]
                }
            },
            "value": 1

        },
        "color": {
            "field": "month_num",
            "title": "Month",
            "scale": {
                "scheme": "Reds"
            },
        },
        "opacity": {
            "condition": {
                "param": "industry3",
                "value": 1
            },
            "value": 0.05
        },
        "tooltip": [{
                "field": "STATE_NAME",
                "title": "State"
            },
            {
                "field": "Month",
                "title": "Month"
            },
            {
                "field": "NCount",
                "title": "Fires count"
            },
            {
                "field": "NEstimated_fire_area",
                "title": "Estimated fire area"
            }
        ]
    }
}

// Chart5 spec
const spec4 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 300,
    "background": "transparent",
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/animals.csv"
    },
    "layer": [{
        "mark": {
            "type": "arc",
            "innerRadius": 0,
            "stroke": "transparent"
        }
    }, {
        "mark": {
            "type": "text",
            "radiusOffset": 10
        },
        "encoding": {
            "text": {
                "field": "count",
                "type": "quantitative"
            }
        }
    }],
    "encoding": {
        "theta": {
            "field": "count",
            "type": "quantitative",
            "stack": true,
            "scale": {
                "type": "sqrt",
                "zero": true
            }
        },
        "radius": {
            "field": "count",
            "scale": {
                "type": "sqrt",
                "zero": true,
                "rangeMin": 10
            },
            "sort": "-x"
        },
        "color": {
            "field": "kind",
            "type": "nominal",
            "title": "Animal kind",
            "scale": {
                "scheme": "Reds"
            },
            "sort": "descending"
        },
        "tooltip": [{
                "field": "count",
                "title": "Count"
            },
            {
                "field": "kind",
                "title": "Animal kind"
            },
        ]
    }
}

// Tooltip chart spec, when hover mouse on chart, you can get a chart in toolip
const spectooltip = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
    "width": "container",
    "autosize": {
        "type": "fit",
        "contains": "padding"
    },
    "height": 160,
    "background": "transparent",
    "data": {
        "url": "https://raw.githubusercontent.com/guoguo1234-1/Vega-Llite-Australi-Wildfire/refs/heads/main/data/Historical_Wildfires.csv"
    },
    "transform": [{
            "filter": "datum.Year == 2019",
        },
        {
            "aggregate": [{
                "op": "sum",
                "field": "Count",
                "as": "Count0"
            }],
            "groupby": ["Month"]
        },
        {
            "calculate": "toNumber(datum.Month)",
            "as": "month_num"
        }
    ],
    "title": "This is title",
    "mark": {
        "type": "bar",
        "color": "red"
    },
    "encoding": {
        "x": {
            "field": "month_num",
            "type": "ordinal",
            "sort": {
                "field": "month_num",
                type: "number"
            },
            "title": "Month"
        },
        "y": {
            "field": "Count0",
            "type": "quantitative",
            "title": "Fire count"
        }
    }
}

// Pop chart tooltip
const htmlTooltipOptions = {
    theme: "light",
    sanitize: value => value,
    formatTooltip: value => {
        const datum = value?.datum ?? value;
        // ...return handcrafted HTML string
        // {Month: '2', State: 'New South Wales', Fires count: '731'}
        spectooltip["transform"][0]["filter"] = `datum.Year == 2019 & datum.STATE_NAME == '${ value["State"] }'`;
        //console.log(spectooltip["transform"][0]["filter"])
        spectooltip["title"] = `${ value['State'] } - ${ value['Fires count'] }`;
        vegaEmbed('#tt', spectooltip);
        return `<div id="tt" style="width: 300px; height: 160px;"></div>`
    }
}

// Initialize the geographic heat map
vegaEmbed('#vis1', spec, {
        actions: true
    }).then(function(result) {})
    .catch(console.error);

// Initialize the geographic heat map
vegaEmbed('#vis2', spec1, {
        actions: true,
        tooltip: htmlTooltipOptions // Tooltip chart config
    }).then(function(result) {})
    .catch(console.error);

// Initialize the geographic heat map
vegaEmbed('#vis3', spec2, {
        actions: true
    }).then(function(result) {})
    .catch(console.error);

// Initialize the geographic heat map
vegaEmbed('#vis4', spec3, {
        actions: true
    }).then(function(result) {})
    .catch(console.error);

// Initialize the geographic heat map
vegaEmbed('#vis5', spec4, {
        actions: true
    }).then(function(result) {})

    .catch(console.error);




