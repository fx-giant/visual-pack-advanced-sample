namespace("leesa.visual")["advancedBarChart"] = (function (leesa, _, d3) {
	var leesaUtil = leesa.util;
	var leesaModel = leesa.model;
	var getPrecision = leesaUtil.getPrecision;
	var bindingModel = leesaModel.binding;
	var createInclusionCondition = bindingModel.createInclusionCondition;

	var magicalChart = {
		extend: function (quadrant) {},
		render: function (quadrant, callback) {
			var content = quadrant.htmlJContent();
			content.html("");
			var visual = quadrant.visual();
			var data = quadrant.data();
			var parameters = visual.parameters || {};


			var categoryPath = parameters.categoryPath;
			var valuePath = parameters.valuePath;

			var colors = parameters.colors;
			var is3D = parameters.is3D;
			var isAnimated = parameters.isAnimated;
			var precision = 2;

			if (valuePath)
				precision = getPrecision(quadrant, valuePath);

			if (!categoryPath || !valuePath) {
				data = getSampleData();
				valuePath = "visits";
				categoryPath = "country"
			}


			var _visualIdentifier = "Advanced Bar Chart"; //uncomment to see what values you have
			console.log(_visualIdentifier + " Quadrant:", quadrant)
			console.log(_visualIdentifier + " Visual:", visual)
			console.log(_visualIdentifier + " Data:", data);
			console.log(_visualIdentifier + " Parameters:", parameters);

			var settings = {
				type: "serial",
				theme: "light",
				dataProvider: data,
				categoryField: categoryPath,
				graphs: [{
					type: "column",
					valueField: valuePath,
					fillAlphas: 1,
					lineAlpha: 0,
					fillColorsField: "_color"
				}],
				numberFormatter: {
					precision: precision,
					decimalSeparator: ",",
					thousandsSeparator: ""
				},
				listeners: [{
					event: "clickGraphItem",
					method: applyCrossChartFilter
				}]
			};

			if (is3D) {
				settings.depth3D = 20;
				settings.angle = 30;
			}

			if (isAnimated) {
				settings.startDuration = 2;
			}

			if (colors && colors.length > 0) {
				var numberOfColors = colors.length;
				for (var i in data) {
					data[i]._color = colors[i % numberOfColors];
					data[i]._originalColor = colors[i % numberOfColors];
				}
			}

			AmCharts.makeChart(content[0], settings);
			var lastSelectedItem = null;

			function applyCrossChartFilter(event) {
				var item = event.item;
				var chart = event.chart;
				var category = item.category;
				var binding = quadrant.getBinding(categoryPath);
				var inclusionCondition = createInclusionCondition(category, binding);
				lastSelectedItem = item;
				if (item.isSelected) {
					lastSelectedItem = null;
					quadrant.publishCondition(inclusionCondition, true);
				} else {
					quadrant.publishCondition(inclusionCondition);
				}
				var chartData = chart.dataProvider;
				var lastSelectedItemValue = (lastSelectedItem || {}).category;
				for (var i in chartData)
					if (chartData[i][categoryPath] == lastSelectedItemValue)
						chartData[i]._color = "000000";
					else
						chartData[i]._color = chartData[i]._originalColor;
				chart.validateData();
			}
		},
		configuration: {},
	}
	return magicalChart;

	function getSampleData() {
		return [{
			"country": "USA",
			"visits": 2025
		}, {
			"country": "China",
			"visits": 1882
		}, {
			"country": "Japan",
			"visits": 1809
		}, {
			"country": "Germany",
			"visits": 1322
		}, {
			"country": "UK",
			"visits": 1122
		}, {
			"country": "France",
			"visits": 1114
		}, {
			"country": "India",
			"visits": 984
		}, {
			"country": "Spain",
			"visits": 711
		}, {
			"country": "Netherlands",
			"visits": 665
		}, {
			"country": "Russia",
			"visits": 580
		}, {
			"country": "South Korea",
			"visits": 443
		}, {
			"country": "Canada",
			"visits": 441
		}, {
			"country": "Brazil",
			"visits": 395
		}];
	}
})(leesa, _, d3)