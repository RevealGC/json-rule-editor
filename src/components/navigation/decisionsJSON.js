
{
    "name": "AIES VALIDATION 8771348140",
    "attributes": [
      {
        "name": "ASSET_DEPR_SOLD_VAL",
        "type": "number"
      },
      {
        "name": "ASSET_DEPR_VAL_BY",
        "type": "number"
      },
      {
        "name": "ASSET_DEPR_VAL_EY",
        "type": "number"
      },
      {
        "name": "CAPEX_ASSET_DEPR",
        "type": "number"
      },
      {
        "name": "CAPEX_BUILD_NEW",
        "type": "number"
      },
      {
        "name": "CAPEX_BUILD_USED",
        "type": "number"
      },
      {
        "name": "CAPEX_CL_VAL",
        "type": "number"
      },
      {
        "name": "CAPEX_MACH_NEW",
        "type": "number"
      },
      {
        "name": "CAPEX_MACH_USED",
        "type": "number"
      },
      {
        "name": "CAPEX_NEW_TOT",
        "type": "number"
      },
      {
        "name": "CAPEX_OTH_NEW",
        "type": "number"
      },
      {
        "name": "CAPEX_OTH_USED",
        "type": "number"
      },
      {
        "name": "CAPEX_SOFTWARE_INTDEV",
        "type": "number"
      },
      {
        "name": "CAPEX_SOFTWARE_PREPKG",
        "type": "number"
      },
      {
        "name": "CAPEX_SOFTWARE_VAL",
        "type": "number"
      },
      {
        "name": "CAPEX_SOFTWARE_VEND",
        "type": "number"
      },
      {
        "name": "CAPEX_TOT",
        "type": "number"
      },
      {
        "name": "CAPEX_USED_TOT",
        "type": "number"
      },
      {
        "name": "CERT_CALYR_STAT",
        "type": "number"
      },
      {
        "name": "CERT_DATE_FROM",
        "type": "number"
      },
      {
        "name": "CERT_DATE_TO",
        "type": "number"
      },
      {
        "name": "DEPR_TOT",
        "type": "number"
      },
      {
        "name": "EMP_MAR12",
        "type": "number"
      },
      {
        "name": "PAY_ANN",
        "type": "number"
      },
      {
        "name": "PAY_QTR1",
        "type": "number"
      },
      {
        "name": "RCPT_TOT",
        "type": "number"
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
          "name": "Price change check",
          "type": "1",
          "params": {
            "rvs": "[\"COMP1\"]",
            "action": [
              {
                "COMPUTE_ON_COMPUTED_VAR": " \"INCOME_LOAN\" +100000"
              },
              {
                "TOTAL_INCOME_BONUS2": " \"INCOME_LOAN\" * \"BASE_LOAN\" "
              }
            ],
            "message": " COMP1 >=10 CHAINED RULE VIA COMP1 WHICH IS COMPUTED EARLIER"
          }
        },
        "conditions": {
          "all": [
            {
              "id": 1,
              "fact": "COMP1",
              "value": 10,
              "operator": ">="
            }
          ]
        }
      },
      {
        "event": {
          "type": "GOOD RULE RANGE",
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
          "type": "GOOD RULE RANGE",
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
      }
    ]
  }