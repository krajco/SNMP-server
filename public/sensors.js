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

function createHTMLElement(type, classes, attributes) {
    let element = document.createElement(type);
    for(let i = 0; i < classes.length; i++) {
        element.classList.add(classes[i]);
    }

    for(let i = 0; i < attributes.length; i++) {
        element.setAttribute(attributes[i][0], attributes[i][1]);
    }

    return element;
}


let elements = 0;
function newElementMibObject(attribute, type){
    elements++;

    let form = document.getElementById('form_mib_objects');

    let div_row = createHTMLElement('div',['form-group', 'row'],[['id','mib_row_' + elements]]);

    let div_col1 = createHTMLElement('div', ['col'], []);
    let div_col2 = createHTMLElement('div', ['col'], []);
    let div_col3 = createHTMLElement('div', ['col'], []);
    
    let input = createHTMLElement('input', ['form-control'], [['placeholder', 'Attribute name'],['name', 'mib_attr_' + elements]]);
    input.value = attribute;

    let select = createHTMLElement('select', ['form-control'], [['id', 'mib_object_select_' + (elements)], ['name', 'mib_attr_type_' + elements]])

    let opt1 = createHTMLElement('option', [], [['value', 'string']]);
    let opt2 = createHTMLElement('option', [], [['value', 'number']]);
    let opt3 = createHTMLElement('option', [], [['value', 'boolean']]);
    opt1.innerHTML = 'String';
    opt2.innerHTML = 'Number';
    opt3.innerHTML = 'Boolean';

    select.appendChild(opt1);
    select.appendChild(opt2);
    select.appendChild(opt3);
    select.value = type;
    

    let removeButton = createHTMLElement('button', ['btn', 'btn-danger'],
     [
         ['id','mib_object_remove_' + (elements)],
         ['onclick', 'removeMibElement(this.id)']
    ])
    removeButton.innerHTML = 'Remove';

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