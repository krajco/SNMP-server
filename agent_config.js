const fs = require('fs');
const { formatWithOptions } = require('util');

class SNMPConfiguration {
    #object_type;
    #object_name;
    #data;
    #configFile = 'agent_config.json';
    
    constructor() {
        try{
            this.#data = JSON.parse(fs.readFileSync(this.#configFile, 'utf-8'));
        }catch(err) {
            console.log(err);
        }
    }

    updateConfiguration(raw_data) {
        let configuration = this.#inputParser(raw_data);
        this.#object_type = configuration['object_type'] + 's';
        this.#object_name = configuration['object_name']

        if(this.#objectExists(configuration)){
            this.#update(configuration);
        }else{
            this.#create(configuration);
        }
    
        this.#saveConfiguration();
    }

    #objectExists(data){
        let list = this.#data[this.#object_type];
        for(let i = 0; i < list.length; i++){
            if(list[i]['object_name'] === this.#object_name)
                return true;
        }
        return false;
    }

    #update(data){
        let list = this.#data[this.#object_type];
        for(let i = 0; i < list.length; i++){
            if(list[i]['object_name'] === this.#object_name){
                list[i] = data;
                break;
            }
        }
        
        this.#data[this.#object_type] = list;
    }

    #create(data){
        this.#data[this.#object_type].push(data);
    }

    #inputParser(input){
        let output = {
            object_type: input['object_type'],
            object_name: input['object_name'],
            attributes: [],
            sensors:[],
        }
    
        for(let i = 1; ; i++){
            let mib_attr = 'mib_attr_' + i;
            let mib_attr_type = 'mib_attr_type_' + i;
            if(!input.hasOwnProperty(mib_attr))
                break;
    
            output['attributes'].push({attr_name: input[mib_attr], atrr_type: input[mib_attr_type]});
        }
    
        return output;
    }

    #saveConfiguration(){
        fs.writeFileSync(this.#configFile, JSON.stringify(this.#data, null, 4), 'utf-8');
    }

    printConfiguration(){
        console.log(JSON.stringify(this.#data, null, 4));
    }
}

module.exports.SNMPConfiguration = SNMPConfiguration
