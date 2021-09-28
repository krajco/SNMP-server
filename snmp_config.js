const fs = require('fs')

class SNMPConfiguration {
    constructor() {
        let configFile = 'agent_config.json';
        this._data = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    }

    updateConfiguration(configuration) {
        this._object_type = configuration['object_type'] + 's';
        this._object_name = configuration['object_name']

        if(this.objectExists(configuration)){
            this.update(configuration);
        }else{
            this.create(configuration);
        }
    }

    objectExists(data){
        let list = this._data[this._object_type];
        for(let i = 0; i < list.length; i++){
            if(list[i]['object_name'] === this._object_name)
                return true;
        }
        return false;
    }

    update(data){
        let list = this._data[this._object_type];
        for(let i = 0; i < list.length; i++){
            if(list[i]['object_name'] === this._object_name){
                list[i] = data;
                break;
            }
        }
        
        this._data[this._object_type] = list;
    }

    create(data){
        this._data[this._object_type].push(data);
    }

    print(){
        console.log(JSON.stringify(this._data, null, 4))
        console.log('****************************************')
    }
    
}

// let newVal = {
//     object_type: 'table',
//     object_name: 'test2',
//     attributes: [
//         {
//             attr_name: 'editable',
//             atrr_type: 'String',
//         },
//         {
//             attr_name: 'Identifikator',
//             atrr_type: 'string',
//         },
//     ],
//     sensors: [

//     ]
// }