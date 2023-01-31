
import { FlumeConfig, Colors, Controls } from "flume"


const config = new FlumeConfig()
config.addPortType({
  type: "number",
  name: "number",
  label: "Number",
  color: Colors.red,
  controls: [
    Controls.number({
      name: "num",
      
      label: "Number"
    })
  ]
})
.addNodeType({
  type: "number",
  label: "Number",
  initialWidth: 150,
  inputs: ports => [
    ports.number()
  ],
  outputs: ports => [
    ports.number()
  ]
})
.addNodeType({
  type: "addNumbers",
  label: "Add Numbers",
  initialWidth: 150,
  inputs: ports => [
    ports.number({name: "num1"}),
    ports.number({name: "num2"})
  ],
  outputs: ports => [
    ports.number({name: "result"})
  ]
})
/*  ...  */
  .addRootNodeType({
    type: "homepage",
    label: "Homepage",
    initialWidth: 170,
    inputs: ports => [
      ports.string({
        name: "title",
        label: "Title"
      }),
      ports.string({
        name: "description",
        label: "Description"
      }),
      ports.boolean({
        name: "showSignup",
        label: "Show Signup"
      }),
      ports.number({
        name: "copyrightYear",
        label: "Copyright Year"
      })
    ]
  })


  export default config;