const fs = require('fs')

class SNMPConfiguration {
    #object_type;
    #object_name;
    #data;
    
    constructor() {
        let configFile = 'agent_config.json';
        try{
            this.#data = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        }catch(err) {
            console.log(err);
        }
    }

    updateConfiguration(configuration) {
        this.#object_type = configuration['object_type'] + 's';
        this.#object_name = configuration['object_name']

        if(this.#objectExists(configuration)){
            this.#update(configuration);
        }else{
            this.#create(configuration);
        }
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

    printConfiguration(){
        console.log(JSON.stringify(this.#data, null, 4));
    }
}

module.exports.SNMPConfiguration = SNMPConfiguration
