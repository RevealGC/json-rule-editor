import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/app';
import { uploadRuleset, uploadDBRuleset } from '../../actions/ruleset';
// uploadDBRuleset UPLOAD_DBRULESET 'UPLOAD_DBRULESET'
import { TitlePanel } from '../../components/panel/panel';
import Button from '../../components/button/button';
import { createHashHistory } from 'history';
import FooterLinks from '../../components/footer/footer';
import footerLinks from '../../data-objects/footer-links.json';
import { includes } from 'lodash/collection';
import Notification from '../../components/notification/notification';
import { RULE_AVAILABLE_UPLOAD, RULE_UPLOAD_ERROR } from '../../constants/messages';
import ApperanceContext from '../../context/apperance-context';

function readFile(file, cb) {
  // eslint-disable-next-line no-undef
  var reader = new FileReader();
  reader.onload = () => {
    try {
      cb(JSON.parse(reader.result), file.name);
    } catch (e) {
      cb(undefined, undefined, e.message);
    }
  }
  return reader.readAsText(file);
}


const rulesetDefault = [
  {
    "name": "AIES VALIDATION 2594421835",
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
]

class HomeContainer extends Component {

    constructor(props) {
        super(props);
        this.state = { uploadedFilesCount: 0, files: [], ruleset: [rulesetDefault], uploadError: false, fileExist: true, message: {}};
        this.drop = this.drop.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.printFile = this.printFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleDBRules = this.handleDBRules.bind(this);
        this.chooseDirectory = this.chooseDirectory.bind(this);
    }

    allowDrop(e) {
      e.preventDefault();
    }

    printFile(file, name, error) {
      if (error) {
        this.setState({ uploadError: true, fileExist: false, message: RULE_UPLOAD_ERROR });
      } else {
        const isFileAdded = this.state.files.some(fname => fname === name) || includes(this.props.rulenames, file.name);
        if (!isFileAdded) {
          const files = this.state.files.concat([name]);
          const ruleset = this.state.ruleset.concat(file);
          this.setState({files, ruleset, fileExist: false });
        } else {
          const message = { ...RULE_AVAILABLE_UPLOAD, heading: RULE_AVAILABLE_UPLOAD.heading.replace('<name>', file.name) };
          this.setState({ fileExist: true, message });
        }
      }
      
    }

    uploadFile(items, index) {
      const file = items[index].getAsFile();
      readFile(file, this.printFile);
    }

    uploadDirectory(item) {
      var dirReader = item.createReader();
      const print = this.printFile;
      dirReader.readEntries(function(entries) {
        for (let j=0; j<entries.length; j++) {
          let subItem = entries[j];
          if (subItem.isFile) {
            subItem.file((file) => {
              readFile(file, print);
            });
          }
        }
      });
   }

   // this method is not required. its to select files from local disk.
   /* chooseFile() {
    const file = document.getElementById("uploadFile");
    if (file && file.files) {
      for (let i = 0; i < file.files.length; i++) {
        readFile(file.files[i], this.printFile);
      }
    }
   } */

   chooseDirectory(e) {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'application/json') {
          readFile(files[i], this.printFile);
        }
      }
    }
   }

    drop(e) {
      e.preventDefault();
      const items = e.dataTransfer.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          let item = items[i].webkitGetAsEntry();
          if (item.isFile) {
            this.uploadFile(items, i);
          } else if (item.isDirectory) {
              this.uploadDirectory(item);
            }
          }
        }
    }
    
    handleUpload() {
      if(this.state.ruleset.length > 0) {
        this.props.uploadRuleset(this.state.ruleset);
        this.navigate('./ruleset');
      }
    }
    handleDBRules(){
      if( this.state.ruleset.length > 0){
        this.props.uploadDBRuleset(this.state.ruleset)
        this.navigate('./ruleset');
      }
    }
    navigate(location)  {
      const history = createHashHistory();
      this.props.login();
      history.push(location); 
    }

    render() {
      const { fileExist, uploadError, message } = this.state;
      const title = this.props.loggedIn ? "Upload Rules" : "Create / Upload Rules";
      const appctx = this.context;

     

      return <div className="home-container">
        <div className="single-panel-container">
        { (fileExist || uploadError) && <Notification body={message.body} heading={message.heading} type={message.type} /> }
          <TitlePanel title={title} titleClass="fa fa-cloud-upload">
            <div className="upload-panel">
              <div className={`drop-section ${appctx.background}`} onDrop={this.drop} onDragOver={this.allowDrop}>
                  <div><label htmlFor="uploadFile">Choose Ruleset directory<input id="uploadFile" type="file" onChange={this.chooseDirectory} webkitdirectory="true" multiple/></label> or Drop Files</div>
                  {this.state.files.length > 0 && <div className="file-drop-msg">{`${this.state.files.length} json files are dropped!`}</div>}
              </div>
            </div>
            <div className="btn-group">
              <Button label={"AIES"} onConfirm={this.handleDBRules} classname="primary-btn" type="button" />
              {!this.props.loggedIn && <Button label={"Create"} onConfirm={() => this.navigate('./create-ruleset')} classname="primary-btn" type="button" disabled={this.state.files.length > 0} />}
              {/* <Button label={"AIES"} onConfirm={this.handleDBRules} classname="primary-btn" type="button" /> */}
            </div>  


          </TitlePanel>
        </div>
        {!this.props.loggedIn && <div className='footer-container home-page'>
           <FooterLinks links={footerLinks} />
        </div>}
      </div>
    }
}

HomeContainer.contextType = ApperanceContext;

HomeContainer.propTypes = {
  ruleset: PropTypes.array,
  uploadRuleset: PropTypes.func,
  uploadDBRuleset: PropTypes.func,
  login: PropTypes.func,
  loggedIn: PropTypes.bool,
  rulenames: PropTypes.array,
}

HomeContainer.defaultProps = {
  rulenames: [],
  ruleset: [],
  uploadRuleset: () => false,
  uploadDBRuleset: () => false,
  login: () => false,
  loggedIn: false,
}

const mapStateToProps = (state) => ({
  rulenames: state.ruleset.rulesets.map(r => r.name),
  loggedIn: state.app.loggedIn,
});

const mapDispatchToProps = (dispatch) => ({

  login: () => dispatch(login()),
  uploadRuleset: (ruleset) =>  dispatch(uploadRuleset(ruleset)),
  uploadDBRuleset : (ruleset) => dispatch(uploadDBRuleset(ruleset))

});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);