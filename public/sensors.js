function reloadSensors() {
    clearMibRows();
    let data = document.getElementById('types').value;
    data = JSON.parse(data);

    let attributes = jsonConversion(data);
    console.log(attributes);

    document.getElementById('mib_properties').value = JSON.stringify(data); 
}

function jsonConversion(json) {
    let list = [];
    for(key in json){
        if(typeof json[key] === 'object'){
            let innerList = jsonConversion(json[key]);
            list = list.concat(innerList);
        }else {
            newElementMibObject(key, typeof json[key])
            let data = {
                key: key,
                type: typeof json[key]
            }
            list.push(data);
        }
    }
    return list;
}

let elements = 0;
function newElementMibObject(attribute, type){
    elements++;

    let form = document.getElementById('mib_object');

    let div_row = document.createElement('div');
    div_row.classList.add('row');
    div_row.setAttribute('id', 'mib_row_' + (elements));

    let div_col1 = document.createElement('div');
    div_col1.classList.add('col');
    let div_col2 = document.createElement('div');
    div_col2.classList.add('col');
    let div_col3 = document.createElement('div');
    div_col3.classList.add('col');

    let input = document.createElement('input');
    input.setAttribute('placeholder', 'Attribute name')
    input.classList.add('form-control');
    input.value = attribute;

    let select = document.createElement('select');
    let opt1 = document.createElement('option');
    let opt2 = document.createElement('option');
    let opt3 = document.createElement('option');
    opt1.setAttribute('value', 'string');
    opt1.innerHTML = 'String';
    opt2.setAttribute('value', 'number');
    opt2.innerHTML = 'Number';
    opt3.setAttribute('value', 'boolean');
    opt3.innerHTML = 'Boolean';
    select.appendChild(opt1);
    select.appendChild(opt2);
    select.appendChild(opt3);

    select.value = type;
    
    select.classList.add('form-control');
    select.setAttribute('id', 'mib_object_select_' + (elements));

    let removeButton = document.createElement('div');
    removeButton.classList.add('btn')
    removeButton.classList.add('btn-danger')
    removeButton.setAttribute('id','mib_object_remove_' + (elements));
    removeButton.innerHTML = 'Remove';
    removeButton.setAttribute('onclick', 'removeMibElement(this.id)')

    div_col1.appendChild(input);
    div_col2.appendChild(select);
    div_col3.appendChild(removeButton);

    div_row.appendChild(div_col1);
    div_row.appendChild(div_col2);
    div_row.appendChild(div_col3);

    form.appendChild(div_row);
}

function removeMibElement(id) {
    let number = id.replace('mib_object_remove_','')
    let row_id = 'mib_row_' + number;

    let row = document.getElementById(row_id);
    row.parentElement.removeChild(row);
}

function clearMibRows() {
    for(let i = 0; i < elements; i++){
        let row = document.getElementById('mib_row_' + i);
        if(row)
            row.parentElement.removeChild(row);
    }
}