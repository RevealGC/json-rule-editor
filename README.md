## QBES Rules Editor: json-rule-editor

npm start 




{
	"name": "RID(8771348140) 12-6 15:24:2",
	"attributes": [
		{
			"name": "reporting_id",
			"type": "number",
			"value": 8771348140
		},
		{
			"name": "ASSET_DEPR_SOLD_VAL",
			"type": "number",
			"value": 396000
		},
		{
			"name": "ASSET_DEPR_VAL_BY",
			"type": "number",
			"value": 81130000
		},
		{
			"name": "ASSET_DEPR_VAL_EY",
			"type": "number",
			"value": 85506000
		},
		{
			"name": "CAPEX_ASSET_DEPR",
			"type": "number",
			"value": 4572000
		},
		{
			"name": "CAPEX_BUILD_NEW",
			"type": "number",
			"value": 1087000
		},
		{
			"name": "CAPEX_BUILD_USED",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_CL_VAL",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_MACH_NEW",
			"type": "number",
			"value": 3485000
		},
		{
			"name": "CAPEX_MACH_USED",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_NEW_TOT",
			"type": "number",
			"value": 4572000
		},
		{
			"name": "CAPEX_OTH_NEW",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_OTH_USED",
			"type": "number",
			"value": 400
		},
		{
			"name": "CAPEX_SOFTWARE_INTDEV",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_SOFTWARE_PREPKG",
			"type": "number",
			"value": 118000
		},
		{
			"name": "CAPEX_SOFTWARE_VAL",
			"type": "number",
			"value": 118000
		},
		{
			"name": "CAPEX_SOFTWARE_VEND",
			"type": "number",
			"value": 0
		},
		{
			"name": "CAPEX_TOT",
			"type": "number",
			"value": 4572000
		},
		{
			"name": "CAPEX_USED_TOT",
			"type": "number",
			"value": 0
		},
		{
			"name": "CERT_CALYR_STAT",
			"type": "number",
			"value": 1000
		},
		{
			"name": "CERT_DATE_FROM",
			"type": "number",
			"value": 60116000
		},
		{
			"name": "CERT_DATE_TO",
			"type": "number",
			"value": 53117000
		},
		{
			"name": "DEPR_TOT",
			"type": "number",
			"value": 62198000
		},
		{
			"name": "EMP_MAR12",
			"type": "number",
			"value": 1656000
		},
		{
			"name": "PAY_ANN",
			"type": "number",
			"value": 1000026
		},
		{
			"name": "PAY_QTR1",
			"type": "number",
			"value": 17579000
		},
		{
			"name": "RCPT_TOT",
			"type": "number",
			"value": 3500002
		},
		{
			"name": "STATE",
			"type": "string"
		}
	],
	"decisions": [
		{
			"event": {
				"name": "RULE COST_FUEL GREATER THAN 100000",
				"type": "58",
				"params": {
					"rvs": "[\"COST_FUEL\"]",
					"action": [
						{
							"COMP1": "3+5+\"COST_FUEL\""
						},
						{
							"COMP2": "3*5+\"COST_FUEL\""
						}
					],
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"output": [
				"COST_FUEL"
			],
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				]
			}
		},
		{
			"event": {
				"name": "RULE 1",
				"type": "51",
				"params": {
					"rvs": "[\"COST_FUEL\"]",
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				]
			}
		},
		{
			"event": {
				"name": "GOOD RULE RANGE",
				"type": "59",
				"params": {
					"rvs": "[\"COST_FUEL\"]",
					"action": [
						{
							"COMP1": "3+5+\"COST_FUEL\""
						},
						{
							"COMP2": "3*5+\"COST_FUEL\""
						}
					],
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"output": [
				"COST_FUEL"
			],
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				]
			}
		},
		{
			"event": {
				"name": "RULE COST_FUEL GREATER THAN 100000",
				"type": "54",
				"params": {
					"rvs": "[\"COST_FUEL\"]",
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				]
			}
		},
		{
			"event": {
				"name": "RULE 1",
				"type": "50",
				"params": {
					"rvs": "[\"COST_FUEL\"]",
					"action": [
						{
							"COMP1": "3+5+\"COST_FUEL\""
						},
						{
							"COMP2": "3*5+\"COST_FUEL\""
						},
						{
							"COMP_BENEFIT": "100*\"BENEFIT\"+\"COST_FUEL\""
						}
					],
					"message": "COST_FUEL must be between 40000 and 44000"
				}
			},
			"index": 4,
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 40000,
						"operator": ">="
					},
					{
						"id": 2,
						"fact": "COST_FUEL",
						"value": 42000,
						"operator": "<="
					}
				]
			}
		},
		{
			"event": {
				"name": "Price change check",
				"type": "61",
				"params": {
					"rvs": "[\"RCPT_TOT\", \"PAY_ANN\"]",
					"action": [
						{
							"TOTAL_INCOME_BONUS": " \"INCOME_LOAN\" +100"
						},
						{
							"TOTAL_INCOME_BONUS2": " \"INCOME_LOAN\" * \"BASE_LOAN\" "
						}
					],
					"message": "TEST"
				}
			},
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "INCOME_LOAN",
						"value": 10,
						"operator": ">="
					},
					{
						"all": [
							{
								"id": 2,
								"fact": "INCOME_LOAN_SURPLUS",
								"value": 0,
								"operator": "="
							},
							{
								"id": 2,
								"fact": "INCOME_LOAN_TEST",
								"value": 0,
								"operator": "="
							}
						]
					}
				]
			}
		},
		{
			"event": {
				"name": "PAY_ANN > 10000",
				"type": "63",
				"params": {
					"rvs": "[\"PAY_ANN\"]",
					"action": [
						{
							"NEW_RCPT_TOT": " \"PAY_QTR1\" *4"
						}
					],
					"message": "PAY_ANN must be greater than $10,000"
				}
			},
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "PAY_ANN",
						"value": 10000,
						"operator": ">"
					}
				]
			}
		},
		{
			"event": {
				"type": "3",
				"params": {
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"output": [
				"COST_FUEL"
			],
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				],
				"action": [
					{
						"COMP1": "\"3+5+\"COST_FUEL\""
					},
					{
						"COMP2": "\"3*5+\"COST_FUEL\""
					}
				]
			}
		},
		{
			"event": {
				"type": "4",
				"params": {
					"message": "COST_FUEL greater than 1000000"
				}
			},
			"output": [
				"COST_FUEL"
			],
			"conditions": {
				"all": [
					{
						"id": 110,
						"fact": "COST_FUEL",
						"value": 1000000,
						"operator": ">="
					}
				],
				"action": [
					{
						"COMP1": "\"3+5+\"COST_FUEL\""
					},
					{
						"COMP2": "\"3*5+\"COST_FUEL\""
					}
				]
			}
		},
		{
			"event": {
				"name": "RCPT_TOT > 0",
				"type": "100",
				"params": {
					"rvs": "[\"RCPT_TOT\"]",
					"message": "RCPT_TOT must be greater than 0"
				}
			},
			"conditions": {
				"all": [
					{
						"id": 1,
						"fact": "RCPT_TOT",
						"value": 0,
						"operator": ">"
					}
				]
			}
		},
		{
			"event": {
				"name": "NNN",
				"type": "10",
				"params": {
					"rvs": "[\"ABC\"]",
					"message": "KKK",
					"rvsJSON": [
						"ABC"
					],
					"actionType": "notify"
				}
			},
			"index": 11,
			"conditions": {
				"all": [
					{
						"fact": "ASSET_DEPR_SOLD_VAL",
						"value": 10,
						"operator": "greaterThan"
					}
				]
			}
		},
		{
			"event": {
				"name": "727Rule",
				"type": 33,
				"params": {
					"rvs": "[\"AC\"]",
					"message": "727Message",
					"rvsJSON": [
						"AC"
					],
					"actionType": "notify"
				}
			},
			"index": 12,
			"conditions": {
				"all": [
					{
						"fact": "CAPEX_CL_VAL",
						"value": 100,
						"operator": "greaterThanInclusive"
					}
				]
			}
		},
		{
			"event": {
				"name": "AM Rule",
				"type": 34,
				"params": {
					"rvs": "[\"PAY_ANN\"]",
					"message": "AM Rule Message",
					"rvsJSON": [
						"PAY_ANN"
					],
					"actionType": "notify"
				}
			},
			"index": 13,
			"conditions": {
				"all": [
					{
						"fact": "ASSET_DEPR_SOLD_VAL",
						"value": 10,
						"operator": "greaterThan"
					}
				]
			}
		},
		{
			"event": {
				"name": "NK Price change check",
				"type": "1",
				"params": {
					"rvs": "[\"RCPT_TOT\",\"PAY_ANN\"]",
					"action": [
						{
							"PAY_ANN": "PAY_ANN"
						},
						{
							"RCPT_TOT": "RCPT_TOT"
						},
						{
							"PAY_QTR1": "PAY_QTR1"
						},
						{
							"CHILD_REN": "1+0"
						}
					],
					"impute": [
						{
							"computedRV": "PAY_ANN",
							"expression": "PAY_ANN"
						},
						{
							"computedRV": "RCPT_TOT",
							"expression": "RCPT_TOT"
						},
						{
							"computedRV": "PAY_QTR1",
							"expression": "PAY_QTR1"
						},
						{
							"computedRV": "CHILD_REN",
							"expression": "1+0"
						}
					],
					"message": " COMP1 >=10 CHAINED RULE VIA COMP1 WHICH IS COMPUTED EARLIER",
					"rvsJSON": [
						"RCPT_TOT",
						"PAY_ANN"
					],
					"actionType": "impute"
				},
				"ruleId": "1"
			},
			"index": 13,
			"conditions": {
				"all": [
					{
						"fact": "PAY_ANN",
						"value": 100,
						"operator": "greaterThan"
					}
				]
			}
		}
	],
	"facts": {
		"reporting_id": "8771348140",
		"ASSET_DEPR_SOLD_VAL": 396000,
		"ASSET_DEPR_VAL_BY": 81130000,
		"ASSET_DEPR_VAL_EY": 85506000,
		"CAPEX_ASSET_DEPR": 4572000,
		"CAPEX_BUILD_NEW": 1087000,
		"CAPEX_BUILD_USED": 0,
		"CAPEX_CL_VAL": 0,
		"CAPEX_MACH_NEW": 3485000,
		"CAPEX_MACH_USED": 0,
		"CAPEX_NEW_TOT": 4572000,
		"CAPEX_OTH_NEW": 0,
		"CAPEX_OTH_USED": 400,
		"CAPEX_SOFTWARE_INTDEV": 0,
		"CAPEX_SOFTWARE_PREPKG": 118000,
		"CAPEX_SOFTWARE_VAL": 118000,
		"CAPEX_SOFTWARE_VEND": 0,
		"CAPEX_TOT": 4572000,
		"CAPEX_USED_TOT": 0,
		"CERT_CALYR_STAT": 1000,
		"CERT_DATE_FROM": 60116000,
		"CERT_DATE_TO": 53117000,
		"DEPR_TOT": 62198000,
		"EMP_MAR12": 1656000,
		"PAY_ANN": 1000026,
		"PAY_QTR1": 17579000,
		"RCPT_TOT": 3500002
	}
}





### Getting Started

Json rule editor is an unornamented web interface tool to manage your business rules and decision outcomes. A single page application to effortlesly upload / create business rules via json files. Since the lightweight libraries are the new normal in web applications, possessing logics in json file will be a effective way to manage the application code. Having said that redudancy can be detoured by discarding the other business rule file format such as xml or excel, which is often hectic to parse and adding complications to developer.

Process to implement json rule file in your application follows

- Generate rule file using json rule editor
- Place the generated file in your application folder,
- and pass the relative path of file and input parameters into json rules engine to get the output.

Facinating feature it implies is, we can validate the business decisions instantly once after rules are added. Thus, ensuring expected outcome is returned from the rule sheet before generates the file. Consequently it eliminates issues at first place when rules are being created instead of identifing at later stage of development or testing.

### Usage:

To launch the json rule editor tool, you can do either of the below 
1. 	Click [json rule editor](https://www.json-rule-editor.com) 
2.  or install it locally via `git clone https://github.com/vinzdeveloper/json-rule-editor.git`
     - start the application by `npm install` and `npm start`

The detailed steps to create json rule file using this tool in [next section](https://vinzdeveloper.github.io/json-rule-editor/docs/create-rules.html).

### Thanks to json-rules-engine:

In principle, json rules engine is an integral backbone library should be added into your application to process the business rules created from this rule editor. It is highly recommended to go through the json rules engine concepts and explore the features it offers.

Install json rules engine in your application using the steps mentioned in the [npm](https://www.npmjs.com/package/json-rules-engine)

This documentation explains the steps to create / manage rules in json rule editor tool.

This documentation covers,

1. [Why Rule Engine?](https://vinzdeveloper.github.io/json-rule-editor/docs/rule-engine.html)
2. [Create Business Decisions using Json Rule Editor](https://vinzdeveloper.github.io/json-rule-editor/docs/create-rules.html)
3. [Implementation of rules in application](https://vinzdeveloper.github.io/json-rule-editor/docs/implementation.html)
4. [Manage existing rule](https://vinzdeveloper.github.io/json-rule-editor/docs/manage-rules.html)
5. [More examples in Decisions](https://vinzdeveloper.github.io/json-rule-editor/docs/decisions.html)
6. [Advanced examples](https://vinzdeveloper.github.io/json-rule-editor/docs/advanced.html)



