/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


Blockly.Blocks.variables.HUE = 330;

// ************************************************************************
// THIS SECTION IS INSERTED INTO BLOCKLY BY BLOCKLYDUINO.
Blockly.Blocks['variables_declare'] = {
  // Variable setter.
  helpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendValueInput('VALUE', null)
        .appendField('Declare')
        .appendField(new Blockly.FieldVariable(
        Blockly.LANG_VARIABLES_SET_ITEM), 'VAR')
        .appendField("as")
      .appendField(new Blockly.FieldDropdown([["Number", "int"]]), "TYPE")
      .appendField("value");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};
// ************************************************************************

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

// New variable blocks


Blockly.Blocks['constants_boolean'] = {
  /**
   * Block for boolean data type: true and false.
   * @this Blockly.Block
   */
  init: function() {
    var BOOLEANS =
        [[Blockly.Msg.LOGIC_BOOLEAN_TRUE, 'TRUE'],
         [Blockly.Msg.LOGIC_BOOLEAN_FALSE, 'FALSE']];
    this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(290);
    this.setOutput(true, 'Boolean');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.Blocks['constants_highlow'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), 'BOOL')
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['constants_high'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(290); // Pink
    this.appendDummyInput()
        .appendField("HIGH")
    this.setOutput(true, 'Boolean');
    this.setTooltip('pin HIGH');
  }
};

Blockly.Blocks['constants_low'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(290); // Pink
    this.appendDummyInput()
        .appendField("LOW")
    this.setOutput(true, 'Boolean');
    this.setTooltip('pin LOW');
  }
};

Blockly.Blocks['constants_true'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(290); // Pink
    this.appendDummyInput()
        .appendField("TRUE")
    this.setOutput(true, 'Boolean');
    this.setTooltip('Boolean true');
  }
};

Blockly.Blocks['constants_false'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(290); // Pink
    this.appendDummyInput()
        .appendField("FALSE")
    this.setOutput(true, 'Boolean');
    this.setTooltip('Boolean false');
  }
};

Blockly.Blocks['variables_array_create'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck("Variable_array")
        .appendField("create an integer array      variable");
    this.appendValueInput("size")
        .setCheck("Number")
        .appendField("                                              size");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Create an array of standard integers. -32,768 to +32,767');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_array_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("array variable name"), "variable");
    this.setOutput(true, "Variable_array");
    this.setColour(290);
    this.setTooltip('Variable array');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_array_name_pos'] = {
  init: function() {
    this.appendValueInput("position")
        .setCheck("Number")
        .appendField(new Blockly.FieldTextInput("array variable name"), "varName")
        .appendField("  #");
    this.setOutput(true, "Number");
    this.setColour(290);
    this.setTooltip('Get the value of an array.');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_int_array_member'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck("Variable_array")
        .appendField("                                          variable");
    this.appendValueInput("position")
        .setCheck("Number")
        .appendField("set an integer array member  position");
    this.appendValueInput("value")
        .setCheck("Number")
        .appendField("                                             value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Set the value of an array');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_integer'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck("Variable_int")
        .appendField("set integer variable     variable");
    this.appendValueInput("value")
        .setCheck("Number")
        .appendField("                                      value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Set standard integer variable. -32,768 to +32,767');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_integer_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("integer variable name"), "variable");
    this.setOutput(true, "Variable_int");
    this.setColour(290);
    this.setTooltip('Integer variable (for set integer variable)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_integer'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("integer variable name"), "variable");
    this.setOutput(true, "Number");
    this.setColour(290);
    this.setTooltip('Integer variable (returns an integer)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_digital'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck("Variable_digital")
        .appendField("set digital variable     variable");
    this.appendValueInput("value")
        .setCheck("Digital")
        .appendField("                                      value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Set digital variable');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_digital_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("digital variable name"), "variable");
    this.setOutput(true, "Variable_digital");
    this.setColour(290);
    this.setTooltip('Digital variable (for set digital variable)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_digital'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("digital variable name"), "variable");
    this.setOutput(true, "Digital");
    this.setColour(330);
    this.setTooltip('Digital variable');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_decimal'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck("Variable_decimal")
        .appendField("set decimal number variable     variable");
    this.appendValueInput("value")
        .setCheck("Digital")
        .appendField("                                             value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Set decimal variable');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_set_decimal_name'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("decimal variable name"), "variable");
    this.setOutput(true, "Variable_decimal");
    this.setColour(290);
    this.setTooltip('Decimal variable (for set decimal variable)');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variables_decimal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Decimal variable name"), "variable");
    this.setOutput(true, "Double");
    this.setColour(330);
    this.setTooltip('Decimal variable');
    this.setHelpUrl('http://www.example.com/');
  }
};
