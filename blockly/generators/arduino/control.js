/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Arduino for control blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.loops');

goog.require('Blockly.Arduino');


Blockly.Arduino.delay_micro = function() {
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000000'
  var code = 'delayMicroseconds(' + delay_time + ');\n';
  return code;
};

Blockly.Arduino.delay_milli = function() {
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
  var code = 'delay(' + delay_time + ');\n';
  return code;
};

Blockly.Arduino.control_while = function() {
  var value_test = Blockly.Arduino.valueToCode(this, 'test', Blockly.Arduino.ORDER_ATOMIC);
  var statements_commands = Blockly.Arduino.statementToCode(this, 'commands');

  var code = 'while ('+value_test+') {\n' + statements_commands + '\n}\n';
  return code;
};

Blockly.Arduino.control_do_while = function() {
  var value_test = Blockly.Arduino.valueToCode(this, 'test', Blockly.Arduino.ORDER_ATOMIC);
  var statements_commands = Blockly.Arduino.statementToCode(this, 'commands');

  var code = 'do\n{\n' + statements_commands + '\n}while (' + value_test + ');\n';
  return code;
};

Blockly.Arduino.control_repeat_times = function() {
  var value_times = Blockly.Arduino.valueToCode(this, 'times', Blockly.Arduino.ORDER_ATOMIC);
  var statements_commands = Blockly.Arduino.statementToCode(this, 'commands');

  // Make temp variable
  varNames.push("a");
  varSize.push(-1);
  Blockly.Arduino.definitions_['_ABVAR_' + varNames.length + '_a'] = "_ABVAR_" + varNames.length + "_a;\n";
  var code = 'for (_ABVAR_' + varNames.length + '_a=1; _ABVAR_' + varNames.length + '_a<= ( ' + value_times + ' ); ++_ABVAR_' + varNames.length + '_a )\n{\n' + statements_commands + '\n}\n';
  return code;
};

Blockly.Arduino.control_repeat_and_count = function() {
  var value_variable = Blockly.Arduino.valueToCode(this, 'variable', Blockly.Arduino.ORDER_ATOMIC);
  var value_times = Blockly.Arduino.valueToCode(this, 'times', Blockly.Arduino.ORDER_ATOMIC);
  var statements_commands = Blockly.Arduino.statementToCode(this, 'commands');
  var code = 'for (' + value_variable + '=1; ' + value_variable + '<= ( ' + value_times + ' ); ++' + value_variable + ' )\n{\n' + statements_commands + '\n}\n';
  return code;
};

Blockly.Arduino.control_repeat_between = function() {
  var value_variable = Blockly.Arduino.valueToCode(this, 'variable', Blockly.Arduino.ORDER_ATOMIC);
  var value_start = Blockly.Arduino.valueToCode(this, 'start', Blockly.Arduino.ORDER_ATOMIC);
  var value_stop = Blockly.Arduino.valueToCode(this, 'stop', Blockly.Arduino.ORDER_ATOMIC);
  var value_steps = Blockly.Arduino.valueToCode(this, 'steps', Blockly.Arduino.ORDER_ATOMIC);
  var statements_commands = Blockly.Arduino.statementToCode(this, 'commands');
  var code = 'for (' + value_variable + '=' + value_start + '; ' + value_variable + '<= ( ' + value_stop + ' ); ' + value_variable + '+=' + value_steps + ' )\n{\n' + statements_commands + '\n}\n';
  return code;
};

Blockly.Arduino.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Arduino.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var code;
  if (argument0.match(/^-?\d+(\.\d+)?$/) &&
      argument1.match(/^-?\d+(\.\d+)?$/)) {
    // Both arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0 + (up ? '++' : '--') + ') {\n' +
        branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !argument0.match(/^-?\d+(\.\d+)?$/)) {
      var startVar = Blockly.Arduino.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'int ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !argument1.match(/^-?\d+(\.\d+)?$/)) {
      var endVar = Blockly.Arduino.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'int ' + endVar + ' = ' + argument1 + ';\n';
    }
    code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
        '    (' + startVar + ' <= ' + endVar + ') ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + ';\n' +
        '    ' + variable0 + ' += (' + startVar + ' <= ' + endVar +
            ') ? 1 : -1) {\n' +
        branch0 + '}\n';
  }
  return code;
};
Blockly.Arduino.controls_repeat = function() {
  var times = this.getFieldValue('TIMES');
  Blockly.Arduino.definitions_['index_i'] = 'int i;\n';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  var code = 'for (i = 1; i <= '+times+'; i++ ) {\n' + branch + '\n}';
  return code + '\n';

};
var setupNames = 0;
Blockly.Arduino.resetSetupLoop = function() {
  setupNames = 0;
};

Blockly.Arduino.setup_and_loop = function() {
    if(setupNames<1){
	  setupNames++;
	  var branch_setup = Blockly.Arduino.statementToCode(this, 'setup');
	  var branch_code = Blockly.Arduino.statementToCode(this, 'loop');
	  Blockly.Arduino.setups_['setup_output_code'] = branch_setup;
	  return branch_code + '\n';
	}else{
		alert("multiple loop block found!");
		return '';
	}
};

Blockly.Arduino.control_do_loop = function() {
    if(setupNames<1){
	  setupNames++;
	  var branch_code = Blockly.Arduino.statementToCode(this, 'loop');
	  return branch_code + '\n';
	}else{
		alert("multiple loop block found!");
		return '';
	}
};


Blockly.Arduino.controls_whileUntil = function() {
  var mode = this.getFieldValue('MODE');
  var bool=Blockly.Arduino.valueToCode(this, 'BOOL', Blockly.Arduino.ORDER_NONE);

  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  if(mode==='WHILE'){
	  var code = 'while ('+bool+') {\n' + branch + '\n}';
  }else{
	  var code = 'while (!'+bool+') {\n' + branch + '\n}';
	}

  return code + '\n';

};
Blockly.Arduino.controls_infloop = function() {
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  var code = 'while ( true ) {\n' + branch + '\n}';

  return code + '\n';

};

/*
 * SUBROUTINE AREA
 */

var subNames = [];
var missingSubs = [];

// Finds varaible and returns the index it is located at, if not found returns -1
function findSubroutine(name) {
  var subNum = -1;
  for (var i = 0; i < subNames.length; i++) {
    if (subNames[i] == name && subNames[i] != 'setup' && subNames[i] != 'loop') { // FOUND
      subNum = i;
      break;
    }
  }
  return subNum;
}

Blockly.Arduino.resetSubroutines = function() {
  subNames = [];
  missingSubs = [];
};

Blockly.Arduino.control_subroutine = function() {
  var text_subroutine_name = this.getFieldValue('subroutine_name').replace(/\s/g, "");
  var statements_subroutine = Blockly.Arduino.statementToCode(this, 'subroutine');
  
  var subNum = findSubroutine(text_subroutine_name);
  var code = '';
  if(subNum == -1) {
    subNames.push(text_subroutine_name);
    Blockly.Arduino.definitions_['subroutine_' + (subNames.length-1)]='void _ABFUNC_' + (subNames.length-1) + '_' + text_subroutine_name + '() {\n' + statements_subroutine + '}\n';
  }else {
    alert("ERROR: Invalid subroutine name used.\nYou tried to use the same subroutine name twice\n(Tried: " + text_subroutine_name + ")");
  }

  return code;
};

Blockly.Arduino.control_call_subroutine = function() {
  var text_subroutine_name = this.getFieldValue('subroutine_name');

  var subNum = findSubroutine(text_subroutine_name);
  var code = '';
  if(subNum == -1) {
    //alert("ERROR: Invalid subroutine name used.\nYou tried to invoke the subroutine before creating it\n(Tried: " + text_subroutine_name + ")");
    missingSubs.push(text_subroutine_name); // Add unresolved subroutine name to list
  }else {
    code = '_ABFUNC_' + subNum + '_' + text_subroutine_name + '();\n';
  }

  return code;
};
