const snmp = require('net-snmp');
const bent = require('bent');
const fs = require('fs');

console.log('SNMP Agent listening on 161/UDP!')

var options = {
    version: snmp.Version2c,
    port: 161,
    disableAuthorization: false,
    accessControlModelType: snmp.AccessControlModelType.Simple,
    engineID: "8000B98380XXXXXXXXXXXXXXXXXXXXXXXX", // where the X's are random hex digits
    address: null,
    transport: "udp4"
};

var callback = function (error, data) {
    if ( error )
        console.error (error);
};

let agent = snmp.createAgent (options, callback);
let authorizer = agent.getAuthorizer ();

authorizer.addUser({
    name: "fred",
    level: snmp.SecurityLevel.authPriv,
    authProtocol: snmp.AuthProtocols.sha,
    authKey: "password1",
    privProtocol: snmp.PrivProtocols.des,
    privKey: "password1"
});


var acm = agent.getAuthorizer().getAccessControlModel();
acm.setUserAccess ("fred", snmp.AccessLevel.ReadWrite);

// snmpget -v3 -l authPriv -u fred -a SHA -A "password1" -x des -X "password1" localhost 1.3.6.1.3.999.1.1.3.2

class ConfigParser{
    #mib;
    #tableOid = '1.3.6.1.3.999.1.';
    #scalarOid = '1.3.6.1.3.999.2.';
    #tableIndex = 0;
    #scalarIndex = 0;
    #registeredProviders = [];

    constructor(){
        this.#mib = JSON.parse(fs.readFileSync('agent_config.json'));
    }

    getTableProviders() {
        let tables = this.#getTables();
        let providers = [];

        tables.forEach(table => {
            let data = this.#createTable(table)
            providers.push(data);
        })

        return providers;
    }

    initTables(mib) {
        let tables = this.#getTables();
        tables.forEach(table => {
            this.#registeredProviders.push({
                name: table.object_name,
                sensors: table.sensors
            });
        });

        setInterval(this.#updater, 3000, this.#registeredProviders, mib);
    }

    #updater(providers, mib) {
        let getRow = function(json, index = 0) {
            let list = [];
            if(index > 0)
                list.push(index);

            for(let key in json){
                if(typeof json[key] === 'object'){
                    let innerList = getRow(json[key]);
                    list = list.concat(innerList);
                }else
                if(json[key] === false){
                    list.push(0);
                }
                else if(json[key] === true){
                    list.push(1);
                }
                else{
                    list.push(json[key]);
                }
            }
            return list;
        };

        providers.forEach( provider => {
            let index = 1;
            provider.sensors.forEach(sensor => {
                let data = bent({'Authorization': `Bearer: ${process.env.SUPERVISOR_TOKEN}`}, 'json')(`http://supervisor/core/api/states/${sensor}`);
                data.then( data => {
                    let row = getRow(data, index);
                    mib.addTableRow(provider.name, row);
                    index++;
                });
            });
        });
    }

    #createTable(mibObject){
        let tableProvider = {
            name: mibObject.object_name,
            type: snmp.MibProviderType.Table,
            oid: this.#generateTableOID(),
            maxAccess: snmp.MaxAccess["not-accessible"],
            tableColumns: this.#getTableColumns(mibObject),
            tableIndex: [
                {
                    columnName: mibObject.object_name + 'Index'
                }
            ]
        }
        return tableProvider;
    }

    #getTableColumns(table) {
        let columns = [];

        columns.push({
            number: 1,
            name: table.object_name + 'Index',
            type: snmp.ObjectType.Integer,
            maxAccess: snmp.MaxAccess["read-only"]
        });

        let index = 2;
        table.attributes.forEach( item => {
            let data = {
                number: index,
                name: item.attr_name,
                type: this.#getAttrType(item.atrr_type),
                maxAccess: snmp.MaxAccess["read-only"]
            }
            columns.push(data);
            index++;
        });

        return columns;
    }

    #getAttrType(type){
        let types = {
            string: snmp.ObjectType.OctetString,
            integer: snmp.ObjectType.Integer,
            number: snmp.ObjectType.Integer,
            boolean: snmp.ObjectType.Integer
        }

        return types[type];
    }

    #generateTableOID() {
        this.#tableIndex++;
        return this.#tableOid + this.#tableIndex
    }


    #generateScalarOID() {
        this.#scalarIndex++;
        return this.#scalarOid + this.#scalarIndex;
    }

    #getTables() {
        return this.#mib.tables;
    }

    #getScalars(){
        return this.#mib.scalars;
    }
}


let parser = new ConfigParser();
let tableProviders = parser.getTableProviders();

let mib = agent.getMib();
tableProviders.forEach( tableProvider => {
    mib.registerProvider(tableProvider);
});

parser.initTables(mib);
