(function ($) {

	// Your CSS as text
	var styles = `
		#setting_configurator{
			display:flex;
			background: white;
		}
		.form-container{
			display: flex;
			align-items: center;
			margin-left:10px;
			padding: 4px;
			/* border: 1px solid; */
			border-radius: 4px;
			background: #2271b124;
		}
		div[type="array"], div[type="object"]{
			margin-left: auto !important;
		}
		@media (max-width: 768px) {
				.form-container{
					display: unset;
				}
		}
		.dragging {
		  opacity: 1;
		}
		.content_page_container{
			position: relative;
			box-shadow: 0 0 6px #084a7959;
			height: 650px;
			overflow-y: auto;
			overflow-x: hidden;
		}
		.content_page_container >div{
			height: 100%;
		}
	`
	var styleSheet = document.createElement("style");
	styleSheet.innerText = styles;
	document.head.appendChild(styleSheet);

	'use strict';
	var editor_container;
	var json;
	var persistance = { displays: {} };

	$(window).load(function () {
		editor_container = document.getElementById('setting_configurator');
		if (editor_container) {
			//editor_container.style.backgroundColor = 'yellow';
			json = JSON.parse(document.getElementById("settings_CPDO_setting").value);
			createObjectTree(null, null, json, 0);
			createPreview(json['edit_source']);
		}
	});
	function createPreview(_src) {
		var previewDiv = document.createElement("div");
		var iFrameDiv = document.createElement("iframe");
		css(previewDiv, {
			position: 'relative',
			width: '50%',
			/*background: 'white',*/
			margin: '10px',
			padding: '10px'
		});
		css(iFrameDiv, {
			width: '100%',
			height: '650px',
			position: 'absolute',
			left: '0',
			top: '0',
			'box-shadow': '0 0 6px #084a7959'
		});
		iFrameDiv.src = _src;
		previewDiv.appendChild(iFrameDiv);
		editor_container.appendChild(previewDiv);
	}
	function css(element, style) {
		for (const property in style)
			element.style[property] = style[property];
	}
	function addInput(_div, _key, _value, _tab, _type) {
		if (_key.split('.').pop() != 'token') {
			var new_element = document.createElement("textarea");
			if (_key.split('.').pop() == 'content') {
				var render_content = document.createElement("div");
				render_content.innerHTML = _value;
				render_content.className = "content_page_container";
				/*css(render_content, {
					position: 'relative',
					'box-shadow': '0 0 6px #084a7959',
					height: '650px',
					'overflow-y': 'auto',
					'overflow-x': 'hidden'
				});*/
			}
		} else {
			new_element = document.createElement("input");
		}

		new_element.style.border = "0";
		new_element.style.fontSize = "12px";
		new_element.style.width = "100%";
		new_element.style.margin = "0 10px 10px 0";
		new_element.style.padding = "10px";
		new_element.style.border = "1px solid darkgrey";
		new_element.setAttribute("bind", _key);
		new_element.setAttribute("value-type", _type);
		_key == 'token'
			? (new_element.readOnly = true, new_element.type = 'password')
			: null;
		//new_element.style.marginLeft = _tab*40 + "px";
		new_element.value = _value;
		new_element.addEventListener('keyup', setValue);
		_div.appendChild(new_element);
		render_content ? _div.appendChild(render_content) : null;
	}
	function addBoolean(_div, _key, _value, _tab, _type) {
		var new_element = document.createElement("select");
		var trueItem = document.createElement("option");
		var falseItem = document.createElement("option");
		trueItem.value = true; trueItem.text = true;
		falseItem.value = false; falseItem.text = false;
		_value == 'true' ? trueItem.selected = 'selected' : falseItem.selected = 'selected';
		new_element.appendChild(trueItem);
		new_element.appendChild(falseItem);
		new_element.style.border = "0";
		new_element.style.width = "100%";
		new_element.style.margin = "0 10px 10px 0";
		new_element.style.maxWidth = "unset";
		new_element.style.padding = "10px";
		new_element.style.border = "1px solid darkgrey";
		new_element.setAttribute("bind", _key);
		new_element.setAttribute("value-type", _type);
		new_element.addEventListener("change", setValue);
		_div.appendChild(new_element);
	}
	function getJson() {
		var new_element = document.createElement("div");
		editor_container.appendChild(new_element);
	}
	function createObjectTree(_div, _key, _data, _tab, _index) {
		var div = initDiv(_div, _tab, _key);
		Object.keys(_data).map(key => {
			addKey(div, (_key ? (_key + ".") : "") + key, _data[key], _tab)
		});
		addItem(div, _key, "object");
	}
	function addItem(_div, _key, _type) {
		var div_container = document.createElement("div");
		var add_button = document.createElement("div");
		var message = document.createElement("div");
		css(message, {
			/*'padding-left': '10px',*/
			color: 'red',
			'font-style': 'italic',
			'text-align': 'right'
		});
		add_button.addEventListener('click', add_custom);
		if (_type != "array") {
			[{ id: "selector", name: "type", values: ["object", "array", "string", "number", "boolean"] }, { id: "input", name: "key" }, { id: "input", name: "value" }].map(x => {
				switch (x.id) {
					case "selector":
						var form_item = document.createElement("select");
						form_item.addEventListener('change', selector_change);
						x.values.map(value => {
							var option = document.createElement("option");
							option.value = value;
							option.name = value;
							option.innerHTML = value;
							form_item.appendChild(option);
						})
						form_item.id = _key + '_' + x.name + '_input';
						var label_item = document.createElement("label");
						css(label_item, {
							/*'font-weight': 'bold',*/
							padding: '0 10px 0 10px',
							display: 'block'
						});
						css(form_item, {
							'font-weigh': 'bold',
							padding: '0 0 0 10px',
							'min-width': '100px',
							display: 'block',
							'border-color': 'transparent'
						});
						break;
					default:
						if (_key && _key.split('.').pop() == 'content') {
							var form_item = document.createElement("textarea");
						} else {
							form_item = document.createElement("input");
						}

						form_item.addEventListener('keyup', input_form_change);
						form_item.id = _key + '_' + x.name + '_input';
						var label_item = document.createElement("label");
						label_item.id = _key + '_' + x.name + '_label';
						css(label_item, {
							/*'font-weight': 'bold',*/
							padding: '0 10px 0 10px',
							display: x.name == 'value' ? 'none' : 'block'
						});
						css(form_item, {
							'font-weigh': 'bold',
							'max-width': '100px',
							padding: '4px',
							display: x.name == 'value' ? 'none' : 'block',
							'border-color': 'transparent'
						});
						break;
				}

				label_item.innerHTML = x.name;
				div_container.appendChild(label_item);
				div_container.appendChild(form_item);
				div_container.className = 'form-container';
			})
		}
		add_button.innerHTML = "add";
		/*css(div_container, {
			display: 'flex',
			'align-items': 'center'
		});*/
		css(add_button, {
			cursor: 'pointer',
			background: 'rgb(54 165 255)',
			color: 'white',
			display: 'flex',
			'border-radius': '4px',
			width: '40px',
			height: '10px',
			'justify-content': 'center',
			'align-items': 'center',
			'font-size': '12px',
			margin: '0 0 0 10px',
			padding: '10px'
		});
		add_button.setAttribute("bind", _key);
		message.id = _key + "_message";
		add_button.setAttribute("type", _type);
		div_container.appendChild(add_button);
		_div.appendChild(div_container);
		_div.appendChild(message);
	}
	function input_form_change() {
		const reg = /_(key|value)_input/
		addMessage(document.getElementById(event.target.id.replace(reg, '_message')), '');
	}
	function selector_change() {
		document.getElementById(event.target.id.replace("type_input", "message")).innerHTML = '';
		switch (event.target.value) {
			case "object":
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "value")).style.display = "none";
				document.getElementById(event.target.id.replace("type", "value").replace("input", "label")).style.display = "none";
				break;
			case "array":
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "value")).style.display = "none";
				document.getElementById(event.target.id.replace("type", "value").replace("input", "label")).style.display = "none";
				break;
			case "boolean":
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "value")).style.display = "none";
				document.getElementById(event.target.id.replace("type", "value").replace("input", "label")).style.display = "none";
				break;
			default:
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "key").replace("input", "label")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "value")).style.display = "block";
				document.getElementById(event.target.id.replace("type", "value").replace("input", "label")).style.display = "block";
				break;
		}
	}
	function deleteItem(_div, _key, _type) {
		var delete_button = document.createElement("div");
		delete_button.addEventListener('click', delete_custom);
		css(delete_button, {
			cursor: 'pointer',
			background: _type == 'object' ? 'transparent' : 'transparent',
			color: _type != 'object' ? 'rgb(102 168 215)' : 'white',
			display: 'flex',
			/*'border-radius': '10px',*/
			width: '40px',
			height: '40px',
			'justify-content': 'center',
			'align-items': 'center',
			'font-size': '14px',
			'margin-left': _type != 'object' ? 'auto' : 'unset',
			'margin-right': '10px',
			'font-weight': 'normal'
		});
		delete_button.setAttribute("bind", _key);
		delete_button.innerHTML = "delete";//"✕"
		_div.appendChild(delete_button);
	}
	function delete_custom() {
		var name = event.target.getAttribute("bind");
		Object_Manager(json, (name).split('.'), {}, 'Unset');
		document.getElementById("settings_CPDO_setting").value = JSON.stringify(json);
		editor_container.innerHTML = "";
		createObjectTree(null, null, json, 0);
	}
	function descriptionItem(_div, _description) {
		var description = document.createElement("div");
		description.innerHTML = _description;
		css(description, {
			padding: '0 0px 10px 10px',
			'font-size': '12px',
			'font-style': 'italic',
			color: '#9b9b9b'
		});
		_div.appendChild(description);
	}
	function cloneItem(_div, _key, _type) {
		var clone_button = document.createElement("div");
		clone_button.addEventListener('click', clone_custom);
		css(clone_button, {
			cursor: 'pointer',
			background: _type == 'object' ? 'transparent' : 'transparent',
			color: 'white',
			display: 'flex',
			/*'border-radius': '10px',*/
			width: '40px',
			height: '40px',
			/*'justify-content': 'center',*/
			'align-items': 'center',
			'margin-left': 'auto',
			'font-weight': 'normal'
		});
		clone_button.setAttribute("bind", _key);
		clone_button.innerHTML = "clone";
		_div.appendChild(clone_button);
	}
	function clone_custom() {
		var name = event.target.getAttribute("bind");
		Object_Manager(json, (name).split('.'), {}, 'Clone');
		document.getElementById("settings_CPDO_setting").value = JSON.stringify(json);
		editor_container.innerHTML = "";
		createObjectTree(null, null, json, 0);
	}
	function addMessage(_message, _text) {
		_message.innerHTML = _text;
	}
	function add_custom() {
		var id = event.target.getAttribute("bind");
		var insert_type = event.target.getAttribute("type");
		if (document.getElementById(id + '_type_input')) {
			var type = document.getElementById(id + '_type_input').value;
			var name = document.getElementById(id + '_key_input').value;
			var value = document.getElementById(id + '_value_input').value;
			switch (type) {
				case "boolean":
					value = (value === "true");
					insert_type = '';
					break;
				case "number":
					value = Number(value);
					insert_type = '';
					break;
				case "object":
					insert_type = 'object';
					break;
				case "array":
					insert_type = 'array';
					break;
				case null:

					break;
				default:
					insert_type = '';
					break;
			}
		}
		switch (insert_type) {
			case "object":
				if (!name) {
					addMessage(document.getElementById(id + '_message'), 'form not complete');
					return
				}
				id == 'null'
					? (Object_Manager(json, (name).split('.'), {}, 'Set'), persistance.displays[name + "_container"] = "block")
					: (Object_Manager(json, (id + '.' + name).split('.'), {}, 'Set'), persistance.displays[id + '.' + name + "_container"] = "block");
				break;
			case "array":
				if (name != undefined) {
					switch (name.length) {
						case 0:
							addMessage(document.getElementById(id + '_message'), 'form not complete');
							return;
						default:
							id == 'null'
								? (Object_Manager(json, (name).split('.'), [], 'Set'), persistance.displays[name + "_container"] = "block")
								: (Object_Manager(json, (id + '.' + name).split('.'), [], 'Set'), persistance.displays[id + '.' + name + "_container"] = "block");
							break;
					}
				} else {
					persistance.displays[id + "_container"] = "block";
					Object_Manager(json, id.split('.'), {}, 'Set');
				}
				break;
			default:
				if (!name) {
					addMessage(document.getElementById(id + '_message'), 'form not complete');
					return
				}
				if (name.length) {
					id == 'null'
						? Object_Manager(json, (name).split('.'), value, 'Set')
						: Object_Manager(json, (id + '.' + name).split('.'), value, 'Set')
				}
				break;
		}
		addMessage(document.getElementById(id + '_message'), '');
		document.getElementById("settings_CPDO_setting").value = JSON.stringify(json);
		editor_container.innerHTML = "";
		createObjectTree(null, null, json, 0);

	}
	function initDiv(_div, _tab, _key) {
		var div = document.createElement("div");
		div.id = _key ? _key + "_container" : "main_settings_container";
		css(div, {
			display: persistance.displays[_key + "_container"] ? persistance.displays[_key + "_container"] : _key ? 'none' : 'block',
			'margin-bottom': '10px',
			/*'border-radius': '4px',*/
			padding: div.id == "main_settings_container" ? '10px 0 0 0' : '10px 0 10px 10px',
			/*border: '1px dotted #2271b1',*/
			width: div.id == "main_settings_container" ? '50%' : 'unset'
		});

		if (_div) {
			_div.appendChild(div);
		} else {
			editor_container.appendChild(div);
		}
		return div
	}
	let dragged;
	function createArrayTree(_div, _key, _data, _tab) {
		var div = initDiv(_div, _tab, _key);
		_data.map((x, index) => {
			var header = document.createElement("div");
			header.setAttribute("draggable", true);
			//drag event
			header.addEventListener("drag", (event) => { dragged = event.target.id });
			header.addEventListener("dragstart", (event) => { });
			header.addEventListener("dragend", (event) => { });
			header.addEventListener("dragover", (event) => {
				// prevent default to allow drop
				event.preventDefault();
				event.target.style.opacity = '.5';
			});
			header.addEventListener("dragleave", (event) => {
				// prevent default to allow drop
				event.preventDefault();
				event.target.style.opacity = '1';
			});
			header.addEventListener("drop", (event) => {
				// prevent default action (open as link for some elements)
				event.preventDefault();
				let target_index = Number(event.target.id.replace('_tab', '').split('.').pop());
				let origin_index = Number(dragged.replace('_tab', '').split('.').pop());
				let collection = Object_Manager(json, dragged.replace('_tab', '').split('.').slice(0, -1), null, 'Get');
				if (target_index == origin_index) {

				} else if (origin_index > target_index) {
					let origin = collection[origin_index];
					let bridge = collection[target_index];
					let altern;
					console.log(bridge);
					collection.map((x, index) => {
						if (index > target_index && index < origin_index) {
							altern = collection[index];
							collection[index] = bridge;
							bridge = altern;
						} else if (index == origin_index) {
							collection[index] = bridge;
						}
					})
					collection[target_index] = origin;
				} else {//OK
					let next = collection[origin_index];
					collection.map((x, index) => {
						let bridge;
						if (index >= origin_index && index < target_index) {
							collection[index] = collection[index + 1]
						} else if (index == target_index) {
							collection[index] = next
						}
					})
				}
				Object_Manager(json, event.target.id.replace('_tab', '').split('.').slice(0, -1), collection, 'Set');
				console.log(json);
				document.getElementById("settings_CPDO_setting").value = JSON.stringify(json);
				editor_container.innerHTML = "";
				createObjectTree(null, null, json, 0);
			});
			header.id = _key + "." + index + "_tab";
			header.addEventListener('click', toogle);
			header.innerHTML = '<span style="pointer-events:none;">' + (index + 1) + ' - ' + x.id + '</span>&nbsp;&nbsp;<span style="pointer-events:none;font-weight:normal;font-size:9px;font-style:italic"> ( object )</span>';
			css(header, {
				cursor: 'pointer',
				margin: '0 0 10px 10px',
				padding: '0 0 0 10px ',
				background: !persistance.displays[_key + '.' + index + '_container'] || persistance.displays[_key + '.' + index + '_container'] == 'none' ? 'rgb(34, 113, 177)' : 'rgb(132 172 205)',
				'font-weight': 'bold',
				'border-radius': '4px',
				color: 'white',
				display: 'flex',
				'align-items': 'center'
			});
			cloneItem(header, _key + "." + index, "object");
			deleteItem(header, _key + "." + index, "object");
			div.appendChild(header);
			x.description ? descriptionItem(div, x.description) : null;
			createObjectTree(div, _key + "." + index, x, _tab, index)
		});
		addItem(div, _key + '.' + _data.length, "array");
	}
	function addKey(_div, _key, _data, _tab) {
		var new_element = document.createElement("div");
		css(new_element, {
			'margin-bottom': '10px',
			padding: '0 0 0 10px',
			/*background: '#f0f8ff',*/
		});
		var new_element_rot = document.createElement("div");
		css(new_element_rot, {
			cursor: 'pointer',
			'font-weight': 'bold',
			'border-radius': '4px',
			/*padding: '10px 0 10px 0',*/
			display: 'flex',
			'align-items': 'center',
			padding: '0 0 0 10px',
			border: '1px solid darkgrey',
			margin: '0 0 4px 0',
			background: '#f7f7f7'
		});
		new_element_rot.id = _key + "_tab";
		new_element_rot.addEventListener('click', toogle);
		/*var edit_name = document.createElement("div");
		edit_name.innerHTML = "edit name";
		edit_name.id = _key + "_tab_key_edit_pb"
		edit_name.addEventListener('click', editItemName);
		css(edit_name, {
			cursor: 'pointer',
			'font-weight': 'normal',
			color: '#54b8ff',
			'font-size': '12px'
		});*/
		new_element_rot.innerHTML = '<span id="' + _key + '_tab_key_name" style="pointer-events:none">' + _key.split('.').pop() + '</span>&nbsp;&nbsp;<div id="' + _key + '_tab_key_edit" ></div>&nbsp;&nbsp;<span style="pointer-events:none;font-weight:normal;font-size:9px;font-style:italic"> ( ' + ((_data instanceof Array) ? ('array [' + _data.length + '] elements') : typeof _data) + ' )</span>';
		new_element.appendChild(new_element_rot);
		_div.appendChild(new_element);
		_data.description ? descriptionItem(_div, _data.description) : null;
		json.descriptions && json.descriptions[_key] ? descriptionItem(new_element, json.descriptions[_key]) : null;
		switch (typeof _data) {
			case "string":
				_key != 'token'
					? (
						deleteItem(new_element_rot, _key, "")
					)
					: null;
				addInput(new_element, _key, _data, _tab, "string");
				break;
			case "boolean":
				deleteItem(new_element_rot, _key, "");
				//addInput(new_element, _key, _data.toString(), _tab, "boolean");
				addBoolean(new_element, _key, _data.toString(), _tab, "boolean");
				break;
			case "object":
				/*document.getElementById(_key + "_tab_key_edit").appendChild(edit_name);*/
				cloneItem(new_element_rot, _key, "");
				deleteItem(new_element_rot, _key, "object");
				new_element_rot.style.padding = "0 0 0 10px";
				new_element_rot.style.background = !persistance.displays[_key + "_container"] || persistance.displays[_key + "_container"] == "none" ? "rgb(34 113 177)" : 'rgb(132 172 205)';
				new_element_rot.style.color = "white";
				if (_data instanceof Array) {
					createArrayTree(_div, _key, _data, _tab + 1);
				} else {
					createObjectTree(_div, _key, _data, _tab + 1);
				}
				break;
			case "number":
				deleteItem(new_element_rot, _key, "");
				addInput(new_element, _key, _data.toString(), _tab, "number");
				break;
		}
	}

	function editItemName() {
		console.log(event);
	}

	function toogle() {
		var target = document.getElementById(event.target.id.split("tab")[0] + "container");
		if (target) {
			target.style.display != "none" ? target.style.display = "none" : target.style.display = "block";
			if (target.style.display == "none") {
				event.target.style.background = "rgb(34, 113, 177)";
			} else {
				event.target.style.background = "rgb(132 172 205)";
			}
			persistance.displays[target.id] = target.style.display;
		}
	}

	function setValue() {
		//eval(json+event.target.getAttribute("bind"))=event.target.value;
		var type = event.target.getAttribute("value-type");
		var value = event.target.value;
		switch (type) {
			case "boolean":
				value = (value === "true");
				break;
			case "number":
				value = Number(value);
				break;
			default:
				break;
		}
		Object_Manager(json, event.target.getAttribute("bind").split('.'), value, 'Set');
		document.getElementById("settings_CPDO_setting").value = JSON.stringify(json);
	}
	function Object_Manager(obj, Path, value, Action) {
		try {
			if (Array.isArray(Path) == false) {
				Path = [Path];
			}

			let level = 0;
			var Return_Value;
			Path.reduce((a, b) => {
				level++;
				if (level === Path.length) {
					if (Action === 'Set') {
						a[b] = value;
						return value;
					}
					else if (Action === 'Get') {
						Return_Value = a[b];
					}
					else if (Action === 'Unset') {
						if (a instanceof Array) {
							a.splice(b, 1);
						} else {
							delete a[b];
						}
					} else if (Action === 'Clone') {
						var cloned = JSON.parse(JSON.stringify(a[b]));
						cloned.id = a[b].id + '-copy';
						if (a instanceof Array) {
							a.splice(Number(b) + 1, 0, cloned);
						} else {
							a[cloned.id] = cloned;
							window.scrollTo(0, document.body.scrollHeight);
						}
					}
				}
				else {
					return a[b];
				}
			}, obj);
			return Return_Value;
		}

		catch (err) {
			console.error(err);
			return obj;
		}
	}


})(jQuery);
