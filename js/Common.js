/*
 +--------------------------------------------------------------------+
 | CiviCRM version 4.4                                                |
 +--------------------------------------------------------------------+
 | Copyright CiviCRM LLC (c) 2004-2013                                |
 +--------------------------------------------------------------------+
 | This file is a part of CiviCRM.                                    |
 |                                                                    |
 | CiviCRM is free software; you can copy, modify, and distribute it  |
 | under the terms of the GNU Affero General Public License           |
 | Version 3, 19 November 2007 and the CiviCRM Licensing Exception.   |
 |                                                                    |
 | CiviCRM is distributed in the hope that it will be useful, but     |
 | WITHOUT ANY WARRANTY; without even the implied warranty of         |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.               |
 | See the GNU Affero General Public License for more details.        |
 |                                                                    |
 | You should have received a copy of the GNU Affero General Public   |
 | License and the CiviCRM Licensing Exception along                  |
 | with this program; if not, contact CiviCRM LLC                     |
 | at info[AT]civicrm[DOT]org. If you have questions about the        |
 | GNU Affero General Public License or the licensing of CiviCRM,     |
 | see the CiviCRM license FAQ at http://civicrm.org/licensing        |
 +--------------------------------------------------------------------+
 */

/**
 * @file: global functions for CiviCRM
 * FIXME: We are moving away from using global functions. DO NOT ADD MORE.
 * @see CRM object - the better alternative to adding global functions
 */

var CRM = CRM || {};
var cj = jQuery;

/**
 * Short-named function for string translation, defined in global scope so it's available everywhere.
 *
 * @param  $text   string  string for translating
 * @param  $params object  key:value of additional parameters
 *
 * @return         string  the translated string
 */
function ts(text, params) {
  "use strict";
  text = CRM.strings[text] || text;
  if (typeof(params) === 'object') {
    for (var i in params) {
      if (typeof(params[i]) === 'string' || typeof(params[i]) === 'number') {
        // sprintf emulation: escape % characters in the replacements to avoid conflicts
        text = text.replace(new RegExp('%' + i, 'g'), String(params[i]).replace(/%/g, '%-crmescaped-'));
      }
    }
    return text.replace(/%-crmescaped-/g, '%');
  }
  return text;
}

/**
 *  This function is called by default at the bottom of template files which have forms that have
 *  conditionally displayed/hidden sections and elements. The PHP is responsible for generating
 *  a list of 'blocks to show' and 'blocks to hide' and the template passes these parameters to
 *  this function.
 *
 * @access public
 * @param  showBlocks Array of element Id's to be displayed
 * @param  hideBlocks Array of element Id's to be hidden
 * @param elementType Value to set display style to for showBlocks (e.g. 'block' or 'table-row' or ...)
 * @return none
 */
function on_load_init_blocks(showBlocks, hideBlocks, elementType) {
  if (elementType == null) {
    var elementType = 'block';
  }

  /* This loop is used to display the blocks whose IDs are present within the showBlocks array */
  for (var i = 0; i < showBlocks.length; i++) {
    var myElement = document.getElementById(showBlocks[i]);
    /* getElementById returns null if element id doesn't exist in the document */
    if (myElement != null) {
      myElement.style.display = elementType;
    }
    else {
      alert('showBlocks array item not in .tpl = ' + showBlocks[i]);
    }
  }

  /* This loop is used to hide the blocks whose IDs are present within the hideBlocks array */
  for (var i = 0; i < hideBlocks.length; i++) {
    var myElement = document.getElementById(hideBlocks[i]);
    /* getElementById returns null if element id doesn't exist in the document */
    if (myElement != null) {
      myElement.style.display = 'none';
    }
    else {
      alert('showBlocks array item not in .tpl = ' + hideBlocks[i]);
    }
  }
}

/**
 *  This function is called when we need to show or hide a related form element (target_element)
 *  based on the value (trigger_value) of another form field (trigger_field).
 *
 * @access public
 * @param  trigger_field_id     HTML id of field whose onchange is the trigger
 * @param  trigger_value        List of integers - option value(s) which trigger show-element action for target_field
 * @param  target_element_id    HTML id of element to be shown or hidden
 * @param  target_element_type  Type of element to be shown or hidden ('block' or 'table-row')
 * @param  field_type           Type of element radio/select
 * @param  invert               Boolean - if true, we HIDE target on value match; if false, we SHOW target on value match
 * @return none
 */
function showHideByValue(trigger_field_id, trigger_value, target_element_id, target_element_type, field_type, invert) {
  if (target_element_type == null) {
    var target_element_type = 'block';
  }
  else {
    if (target_element_type == 'table-row') {
      var target_element_type = '';
    }
  }

  if (field_type == 'select') {
    var trigger = trigger_value.split("|");
    var selectedOptionValue = document.getElementById(trigger_field_id).options[document.getElementById(trigger_field_id).selectedIndex].value;

    var target = target_element_id.split("|");
    for (var j = 0; j < target.length; j++) {
      if (invert) {
        cj('#' + target[j]).show();
      }
      else {
        cj('#' + target[j]).hide();
      }
      for (var i = 0; i < trigger.length; i++) {
        if (selectedOptionValue == trigger[i]) {
          if (invert) {
            cj('#' + target[j]).hide();
          }
          else {
            cj('#' + target[j]).show();
          }
        }
      }
    }

  }
  else {
    if (field_type == 'radio') {
      var target = target_element_id.split("|");
      for (var j = 0; j < target.length; j++) {
        if (document.getElementsByName(trigger_field_id)[0].checked) {
          if (invert) {
            cj('#' + target[j]).hide();
          }
          else {
            cj('#' + target[j]).show();
          }
        }
        else {
          if (invert) {
            cj('#' + target[j]).show();
          }
          else {
            cj('#' + target[j]).hide();
          }
        }
      }
    }
  }
}

/**
 *
 * Function for checking ALL or unchecking ALL check boxes in a resultset page.
 *
 * @access public
 * @param fldPrefix - common string which precedes unique checkbox ID and identifies field as
 *                    belonging to the resultset's checkbox collection
 * @param object - checkbox
 * Sample usage: onClick="javascript:changeCheckboxValues('chk_', cj(this) );"
 *
 * @return
 */
function toggleCheckboxVals(fldPrefix, object) {
  var val = (object.id == 'toggleSelect' && cj(object).is(':checked'));
  cj('Input[id*="' + fldPrefix + '"],Input[id*="toggleSelect"]').prop('checked', val);
  // change the class of selected rows
  on_load_init_checkboxes(object.form.name);
}

function countSelectedCheckboxes(fldPrefix, form) {
  fieldCount = 0;
  for (i = 0; i < form.elements.length; i++) {
    fpLen = fldPrefix.length;
    if (form.elements[i].type == 'checkbox' && form.elements[i].name.slice(0, fpLen) == fldPrefix && form.elements[i].checked == true) {
      fieldCount++;
    }
  }
  return fieldCount;
}

/**
 * Function to enable task action select
 */
function toggleTaskAction(status) {
  var radio_ts = document.getElementsByName('radio_ts');
  if (!radio_ts[1]) {
    radio_ts[0].checked = true;
  }
  if (radio_ts[0].checked || radio_ts[1].checked) {
    status = true;
  }

  var formElements = ['task', 'Go', 'Print'];
  for (var i = 0; i < formElements.length; i++) {
    var element = document.getElementById(formElements[i]);
    if (element) {
      if (status) {
        element.disabled = false;
      }
      else {
        element.disabled = true;
      }
    }
  }
}

/**
 * This function is used to check if any actio is selected and also to check if any contacts are checked.
 *
 * @access public
 * @param fldPrefix - common string which precedes unique checkbox ID and identifies field as
 *                    belonging to the resultset's checkbox collection
 * @param form - name of form that checkboxes are part of
 * Sample usage: onClick="javascript:checkPerformAction('chk_', myForm );"
 *
 */
function checkPerformAction(fldPrefix, form, taskButton, selection) {
  var cnt;
  var gotTask = 0;

  // taskButton TRUE means we don't need to check the 'task' field - it's a button-driven task
  if (taskButton == 1) {
    gotTask = 1;
  }
  else {
    if (document.forms[form].task.selectedIndex) {
      //force user to select all search contacts, CRM-3711
      if (document.forms[form].task.value == 13 || document.forms[form].task.value == 14) {
        var toggleSelect = document.getElementsByName('toggleSelect');
        if (toggleSelect[0].checked || document.forms[form].radio_ts[0].checked) {
          return true;
        }
        else {
          alert("Please select all contacts for this action.\n\nTo use the entire set of search results, click the 'all records' radio button.");
          return false;
        }
      }
      gotTask = 1;
    }
  }

  if (gotTask == 1) {
    // If user wants to perform action on ALL records and we have a task, return (no need to check further)
    if (document.forms[form].radio_ts[0].checked) {
      return true;
    }

    cnt = (selection == 1) ? countSelections() : countSelectedCheckboxes(fldPrefix, document.forms[form]);
    if (!cnt) {
      alert("Please select one or more contacts for this action.\n\nTo use the entire set of search results, click the 'all records' radio button.");
      return false;
    }
  }
  else {
    alert("Please select an action from the drop-down menu.");
    return false;
  }
}

/**
 * This function changes the style for a checkbox block when it is selected.
 *
 * @access public
 * @param chkName - it is name of the checkbox
 * @return null
 */
function checkSelectedBox(chkName) {
  var checkElement = cj('#' + chkName);
  if (checkElement.prop('checked')) {
    cj('input[value=ts_sel]:radio').prop('checked', true);
    checkElement.parents('tr').addClass('crm-row-selected');
  }
  else {
    checkElement.parents('tr').removeClass('crm-row-selected');
  }
}

/**
 * This function is to show the row with  selected checkbox in different color
 * @param form - name of form that checkboxes are part of
 *
 * @access public
 * @return null
 */
function on_load_init_checkboxes(form) {
  var formName = form;
  var fldPrefix = 'mark_x';
  for (i = 0; i < document.forms[formName].elements.length; i++) {
    fpLen = fldPrefix.length;
    if (document.forms[formName].elements[i].type == 'checkbox' && document.forms[formName].elements[i].name.slice(0, fpLen) == fldPrefix) {
      checkSelectedBox(document.forms[formName].elements[i].name, formName);
    }
  }
}

/**
 * Function to change the color of the class
 *
 * @param form - name of the form
 * @param rowid - id of the <tr>, <div> you want to change
 *
 * @access public
 * @return null
 */
function changeRowColor(rowid, form) {
  switch (document.getElementById(rowid).className) {
    case 'even-row'          :
      document.getElementById(rowid).className = 'selected even-row';
      break;
    case 'odd-row'           :
      document.getElementById(rowid).className = 'selected odd-row';
      break;
    case 'selected even-row' :
      document.getElementById(rowid).className = 'even-row';
      break;
    case 'selected odd-row'  :
      document.getElementById(rowid).className = 'odd-row';
      break;
    case 'form-item'         :
      document.getElementById(rowid).className = 'selected';
      break;
    case 'selected'          :
      document.getElementById(rowid).className = 'form-item';
  }
}

/**
 * This function is to show the row with  selected checkbox in different color
 * @param form - name of form that checkboxes are part of
 *
 * @access public
 * @return null
 */
function on_load_init_check(form) {
  for (i = 0; i < document.forms[form].elements.length; i++) {
    if (( document.forms[form].elements[i].type == 'checkbox'
      && document.forms[form].elements[i].checked == true )
      || ( document.forms[form].elements[i].type == 'hidden'
      && document.forms[form].elements[i].value == 1 )) {
      var ss = document.forms[form].elements[i].id;
      var row = 'rowid' + ss;
      changeRowColor(row, form);
    }
  }
}

/**
 * reset all the radio buttons with a given name
 *
 * @param string fieldName
 * @param object form
 * @return null
 */
function unselectRadio(fieldName, form) {
  for (i = 0; i < document.forms[form].elements.length; i++) {
    if (document.forms[form].elements[i].name == fieldName) {
      document.forms[form].elements[i].checked = false;
    }
  }
  return;
}

/**
 * Function to change button text and disable one it is clicked
 *
 * @param obj object - the button clicked
 * @param formID string - the id of the form being submitted
 * @param string procText - button text after user clicks it
 * @return null
 */
var submitcount = 0;
/* Changes button label on submit, and disables button after submit for newer browsers.
 Puts up alert for older browsers. */
function submitOnce(obj, formId, procText) {
  // if named button clicked, change text
  if (obj.value != null) {
    obj.value = procText + " ...";
  }
  if (document.getElementById) { // disable submit button for newer browsers
    obj.disabled = true;
    document.getElementById(formId).submit();
    return true;
  }
  else { // for older browsers
    if (submitcount == 0) {
      submitcount++;
      return true;
    }
    else {
      alert("Your request is currently being processed ... Please wait.");
      return false;
    }
  }
}

function popUp(URL) {
  day = new Date();
  id = day.getTime();
  eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=640,height=420,left = 202,top = 184');");
}

/**
 * Function to show / hide the row in optionFields
 *
 * @param element name index, that whose innerHTML is to hide else will show the hidden row.
 */
function showHideRow(index) {
  if (index) {
    cj('tr#optionField_' + index).hide();
    if (cj('table#optionField tr:hidden:first').length) {
      cj('div#optionFieldLink').show();
    }
  }
  else {
    cj('table#optionField tr:hidden:first').show();
    if (!cj('table#optionField tr:hidden:last').length) {
      cj('div#optionFieldLink').hide();
    }
  }
  return false;
}

/**
 * Function to check activity status in relavent to activity date
 *
 * @param element message JSON object.
 */
function activityStatus(message) {
  var d = new Date(), time = [], i;
  var currentDateTime = d.getTime()
  var activityTime = cj("input#activity_date_time_time").val().replace(":", "");

  //chunk the time in bunch of 2 (hours,minutes,ampm)
  for (i = 0; i < activityTime.length; i += 2) {
    time.push(activityTime.slice(i, i + 2));
  }
  var activityDate = new Date(cj("input#activity_date_time_hidden").val());

  d.setFullYear(activityDate.getFullYear());
  d.setMonth(activityDate.getMonth());
  d.setDate(activityDate.getDate());
  var hours = time['0'];
  var ampm = time['2'];

  if (ampm == "PM" && hours != 0 && hours != 12) {
    // force arithmetic instead of string concatenation
    hours = hours * 1 + 12;
  }
  else {
    if (ampm == "AM" && hours == 12) {
      hours = 0;
    }
  }
  d.setHours(hours);
  d.setMinutes(time['1']);

  var activity_date_time = d.getTime();

  var activityStatusId = cj('#status_id').val();

  if (activityStatusId == 2 && currentDateTime < activity_date_time) {
    if (!confirm(message.completed)) {
      return false;
    }
  }
  else {
    if (activity_date_time && activityStatusId == 1 && currentDateTime >= activity_date_time) {
      if (!confirm(message.scheduled)) {
        return false;
      }
    }
  }
}

CRM.strings = CRM.strings || {};
CRM.validate = CRM.validate || {
  params: {},
  functions: []
};

(function ($, undefined) {
  "use strict";
  $(document).ready(function () {
    $().crmtooltip();
    $('.crm-container table.row-highlight').on('change', 'input.select-row, input.select-rows', function () {
      var target, table = $(this).closest('table');
      if ($(this).hasClass('select-rows')) {
        target = $('tbody tr', table);
        $('input.select-row', table).prop('checked', $(this).prop('checked'));
      }
      else {
        target = $(this).closest('tr');
        $('input.select-rows', table).prop('checked', $(".select-row:not(':checked')", table).length < 1);
      }
      target.toggleClass('crm-row-selected', $(this).is(':checked'));
    });
    $('body').on('click', function (event) {
      $('.btn-slide-active').removeClass('btn-slide-active').find('.panel').hide();
      if ($(event.target).is('.btn-slide')) {
        $(event.target).addClass('btn-slide-active').find('.panel').show();
      }
    });
  });

  /**
   * Function to make multiselect boxes behave as fields in small screens
   */
  function advmultiselectResize() {
    var amswidth = $("#crm-container form:has(table.advmultiselect)").width();
    if (amswidth < 700) {
      $("form table.advmultiselect td").css('display', 'block');
    }
    else {
      $("form table.advmultiselect td").css('display', 'table-cell');
    }
    var contactwidth = $('#crm-container #mainTabContainer').width();
    if (contactwidth < 600) {
      $('#crm-container #mainTabContainer').addClass('narrowpage');
      $('#crm-container #mainTabContainer.narrowpage #contactTopBar td').each(function (index) {
        if (index > 1) {
          if (index % 2 == 0) {
            $(this).parent().after('<tr class="narrowadded"></tr>');
          }
          var item = $(this);
          $(this).parent().next().append(item);
        }
      });
    }
    else {
      $('#crm-container #mainTabContainer.narrowpage').removeClass('narrowpage');
      $('#crm-container #mainTabContainer #contactTopBar tr.narrowadded td').each(function () {
        var nitem = $(this);
        var parent = $(this).parent();
        $(this).parent().prev().append(nitem);
        if (parent.children().size() == 0) {
          parent.remove();
        }
      });
      $('#crm-container #mainTabContainer.narrowpage #contactTopBar tr.added').detach();
    }
    var cformwidth = $('#crm-container #Contact .contact_basic_information-section').width();

    if (cformwidth < 720) {
      $('#crm-container .contact_basic_information-section').addClass('narrowform');
      $('#crm-container .contact_basic_information-section table.form-layout-compressed td .helpicon').parent().addClass('hashelpicon');
      if (cformwidth < 480) {
        $('#crm-container .contact_basic_information-section').addClass('xnarrowform');
      }
      else {
        $('#crm-container .contact_basic_information-section.xnarrowform').removeClass('xnarrowform');
      }
    }
    else {
      $('#crm-container .contact_basic_information-section.narrowform').removeClass('narrowform');
      $('#crm-container .contact_basic_information-section.xnarrowform').removeClass('xnarrowform');
    }
  }

  advmultiselectResize();
  $(window).resize(function () {
    advmultiselectResize();
  });

  $.fn.crmtooltip = function () {
    $(document)
      .on('mouseover', 'a.crm-summary-link:not(.crm-processed)', function (e) {
        $(this).addClass('crm-processed');
        $(this).addClass('crm-tooltip-active');
        var topDistance = e.pageY - $(window).scrollTop();
        if (topDistance < 300 | topDistance < $(this).children('.crm-tooltip-wrapper').height()) {
          $(this).addClass('crm-tooltip-down');
        }
        if (!$(this).children('.crm-tooltip-wrapper').length) {
          $(this).append('<div class="crm-tooltip-wrapper"><div class="crm-tooltip"></div></div>');
          $(this).children().children('.crm-tooltip')
            .html('<div class="crm-loading-element"></div>')
            .load(this.href);
        }
      })
      .on('mouseout', 'a.crm-summary-link', function () {
        $(this).removeClass('crm-processed');
        $(this).removeClass('crm-tooltip-active crm-tooltip-down');
      })
      .on('click', 'a.crm-summary-link', false);
  };

  var h;
  CRM.help = function (title, params, url) {
    h && h.close && h.close();
    var options = {
      expires: 0
    };
    h = CRM.alert('...', title, 'crm-help crm-msg-loading', options);
    params.class_name = 'CRM_Core_Page_Inline_Help';
    params.type = 'page';
    $.ajax(url || CRM.url('civicrm/ajax/inline'),
      {
        data: params,
        dataType: 'html',
        success: function (data) {
          $('#crm-notification-container .crm-help .notify-content:last').html(data);
          $('#crm-notification-container .crm-help').removeClass('crm-msg-loading').addClass('info');
        },
        error: function () {
          $('#crm-notification-container .crm-help .notify-content:last').html('Unable to load help file.');
          $('#crm-notification-container .crm-help').removeClass('crm-msg-loading').addClass('error');
        }
      }
    );
  };

  /**
   * @param string text Displayable message
   * @param string title Displayable title
   * @param string type 'alert'|'info'|'success'|'error' (default: 'alert')
   * @param {object} options
   * @return {*}
   * @see http://wiki.civicrm.org/confluence/display/CRM/Notifications+in+CiviCRM
   */
  CRM.alert = function (text, title, type, options) {
    type = type || 'alert';
    title = title || '';
    options = options || {};
    if ($('#crm-notification-container').length) {
      var params = {
        text: text,
        title: title,
        type: type
      };
      // By default, don't expire errors and messages containing links
      var extra = {
        expires: (type == 'error' || text.indexOf('<a ') > -1) ? 0 : (text ? 10000 : 5000),
        unique: true
      };
      options = $.extend(extra, options);
      options.expires = options.expires === false ? 0 : parseInt(options.expires, 10);
      if (options.unique && options.unique !== '0') {
        $('#crm-notification-container .ui-notify-message').each(function () {
          if (title === $('h1', this).html() && text === $('.notify-content', this).html()) {
            $('.icon.ui-notify-close', this).click();
          }
        });
      }
      return $('#crm-notification-container').notify('create', params, options);
    }
    else {
      if (title.length) {
        text = title + "\n" + text;
      }
      alert(text);
      return null;
    }
  };

  /**
   * Close whichever alert contains the given node
   *
   * @param node
   */
  CRM.closeAlertByChild = function (node) {
    $(node).closest('.ui-notify-message').find('.icon.ui-notify-close').click();
  };

  /**
   * Prompt the user for confirmation.
   *
   * @param buttons {object|function} key|value pairs where key == button label and value == callback function
   *  passing in a function instead of an object is a shortcut for a sinlgle button labeled "Continue"
   * @param options {object|void} Override defaults, keys include 'title', 'message',
   *  see jQuery.dialog for full list of available params
   */
  CRM.confirm = function (buttons, options, cancelLabel) {
    var dialog, callbacks = {};
    cancelLabel = cancelLabel || ts('Cancel');
    var settings = {
      title: ts('Confirm Action'),
      message: ts('Are you sure you want to continue?'),
      resizable: false,
      modal: true,
      width: 'auto',
      close: function () {
        $(dialog).remove();
      },
      buttons: {}
    };

    settings.buttons[cancelLabel] = function () {
      dialog.dialog('close');
    };
    options = options || {};
    $.extend(settings, options);
    if (typeof(buttons) === 'function') {
      callbacks[ts('Continue')] = buttons;
    }
    else {
      callbacks = buttons;
    }
    $.each(callbacks, function (label, callback) {
      settings.buttons[label] = function () {
        callback.call(dialog);
        dialog.dialog('close');
      };
    });
    dialog = $('<div class="crm-container crm-confirm-dialog"></div>')
      .html(options.message)
      .appendTo('body')
      .dialog(settings);
    return dialog;
  };

  /**
   * Sets an error message
   * If called for a form item, title and removal condition will be handled automatically
   */
  $.fn.crmError = function (text, title, options) {
    title = title || '';
    text = text || '';
    options = options || {};

    var extra = {
      expires: 0
    };
    if ($(this).length) {
      if (title == '') {
        var label = $('label[for="' + $(this).attr('name') + '"], label[for="' + $(this).attr('id') + '"]').not('[generated=true]');
        if (label.length) {
          label.addClass('crm-error');
          var $label = label.clone();
          if (text == '' && $('.crm-marker', $label).length > 0) {
            text = $('.crm-marker', $label).attr('title');
          }
          $('.crm-marker', $label).remove();
          title = $label.text();
        }
      }
      $(this).addClass('error');
    }
    var msg = CRM.alert(text, title, 'error', $.extend(extra, options));
    if ($(this).length) {
      var ele = $(this);
      setTimeout(function () {
        ele.one('change', function () {
          msg && msg.close && msg.close();
          ele.removeClass('error');
          label.removeClass('crm-error');
        });
      }, 1000);
    }
    return msg;
  };

  // Display system alerts through js notifications
  function messagesFromMarkup() {
    $('div.messages:visible', this).not('.help').not('.no-popup').each(function () {
      var text, title = '';
      $(this).removeClass('status messages');
      var type = $(this).attr('class').split(' ')[0] || 'alert';
      type = type.replace('crm-', '');
      $('.icon', this).remove();
      if ($('.msg-text', this).length > 0) {
        text = $('.msg-text', this).html();
        title = $('.msg-title', this).html();
      }
      else {
        text = $(this).html();
      }
      var options = $(this).data('options') || {};
      $(this).remove();
      // Duplicates were already removed server-side
      options.unique = false;
      CRM.alert(text, title, type, options);
    });
    // Handle qf form errors
    $('form :input.error', this).one('blur', function() {
      // ignore autocomplete fields
      if ($(this).is('.ac_input')) {
        return;
      }

      $('.ui-notify-message.error a.ui-notify-close').click();
      $(this).removeClass('error');
      $(this).next('span.crm-error').remove();
      $('label[for="' + $(this).attr('name') + '"], label[for="' + $(this).attr('id') + '"]')
        .removeClass('crm-error')
        .find('.crm-error').removeClass('crm-error');
    });
  }

  $.widget('civi.crmSnippet', {
    options: {
      url: null,
      block: true,
      crmForm: null
    },
    _originalContent: null,
    _originalUrl: null,
    isOriginalUrl: function() {
      var 
        args = {}, 
        same = true,
        newUrl = this._formatUrl(this.options.url),
        oldUrl = this._formatUrl(this._originalUrl);
      // Compare path
      if (newUrl.split('?')[0] !== oldUrl.split('?')[0]) {
        return false;
      }
      // Compare arguments
      $.each(newUrl.split('?')[1].split('&'), function(k, v) {
        var arg = v.split('=');
        args[arg[0]] = arg[1];
      });
      $.each(oldUrl.split('?')[1].split('&'), function(k, v) {
        var arg = v.split('=');
        if (args[arg[0]] !== undefined && arg[1] !== args[arg[0]]) {
          same = false;
        }
      });
      return same;
    },
    resetUrl: function() {
      this.options.url = this._originalUrl;
    },
    _create: function() {
      this.element.addClass('crm-ajax-container');
      if (!this.element.is('.crm-container *')) {
        this.element.addClass('crm-container');
      }
      this._handleOrderLinks();
      // Set default if not supplied
      this.options.url = this.options.url || document.location.href;
      this._originalUrl = this.options.url;
    },
    _onFailure: function(data) {
      this.options.block && this.element.unblock();
      this.element.trigger('crmAjaxFail', data);
      CRM.alert(ts('Unable to reach the server. Please refresh this page in your browser and try again.'), ts('Network Error'), 'error');
    },
    _formatUrl: function(url) {
      // Strip hash
      url = url.split('#')[0];
      // Add snippet argument to url
      if (url.search(/[&?]snippet=/) < 0) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + 'snippet=json';
      } else {
        url = url.replace(/snippet=[^&]*/, 'snippet=json');
      }
      return url;
    },
    // Hack to deal with civicrm legacy sort functionality
    _handleOrderLinks: function() {
      var that = this;
      $('a.crm-weight-arrow', that.element).click(function(e) {
        that.options.block && that.element.block();
        $.getJSON(that._formatUrl(this.href)).done(function() {
          that.refresh();
        });
        e.stopImmediatePropagation();
        return false;
      });
    },
    refresh: function() {
      var that = this;
      var url = this._formatUrl(this.options.url);
      this.options.block && $('.blockOverlay', this.element).length < 1 && this.element.block();
      $.getJSON(url, function(data) {
        if (typeof(data) != 'object' || typeof(data.content) != 'string') {
          that._onFailure(data);
          return;
        }
        data.url = url;
        that.element.trigger('crmBeforeLoad', data);
        if (that._originalContent === null) {
          that._originalContent = that.element.contents().detach();
        }
        that.element.html(data.content);
        that._handleOrderLinks();
        that.element.trigger('crmLoad', data);
        that.options.crmForm && that.element.trigger('crmFormLoad', data);
      }).fail(function() {
          that._onFailure();
        });
    },
    _destroy: function() {
      this.element.removeClass('crm-ajax-container');
      if (this._originalContent !== null) {
        this.element.empty().append(this._originalContent);
      }
    }
  });

  var dialogCount = 0;
  CRM.loadPage = function(url, options) {
    var settings = {
      target: '#crm-ajax-dialog-' + (dialogCount++),
      dialog: false
    };
    if (!options || !options.target) {
      settings.dialog = {
        modal: true,
        width: '65%',
        height: parseInt($(window).height() * .75),
        close: function() {
          $(this).dialog('destroy').remove();
        }
      };
    }
    options && $.extend(true, settings, options);
    settings.url = url;
    // Create new dialog
    if (settings.dialog) {
      $('<div id="'+ settings.target.substring(1) +'"><div class="crm-loading-element">' + ts('Loading') + '...</div></div>').dialog(settings.dialog);
    }
    if (settings.dialog && !settings.dialog.title) {
      $(settings.target).on('crmLoad', function(event, data) {
        data.title && $(this).dialog('option', 'title', data.title);
      });
    }
    $(settings.target).crmSnippet(settings).crmSnippet('refresh');
    return $(settings.target);
  };

  CRM.loadForm = function(url, options) {
    var settings = {
      crmForm: {
        ajaxForm: {},
        autoClose: true,
        validate: true,
        refreshAction: ['next_new', 'submit_savenext'],
        cancelButton: '.cancel.form-submit',
        openInline: 'a.button:not("[href=#], .no-popup")',
        onCancel: function(event) {},
        onError: function(data) {
          var $el = $(this);
          $el.html(data.content).trigger('crmLoad', data).trigger('crmFormLoad', data).trigger('crmFormError', data);
          if (typeof(data.errors) == 'object') {
            $.each(data.errors, function(formElement, msg) {
              $('[name="'+formElement+'"]', $el).crmError(msg);
            });
          }
        }
      }
    };
    // Move options that belong to crmForm. Others will be passed through to crmSnippet
    options && $.each(options, function(key, value) {
      if (typeof(settings.crmForm[key]) !== 'undefined') {
        settings.crmForm[key] = value;
      }
      else {
        settings[key] = value;
      }
    });

    var widget = CRM.loadPage(url, settings);

    widget.on('crmFormLoad', function(event, data) {
      var $el = $(this);
      var settings = $el.crmSnippet('option', 'crmForm');
      settings.cancelButton && $(settings.cancelButton, this).click(function(event) {
        var returnVal = settings.onCancel.call($el, event);
        if (returnVal !== false) {
          $el.trigger('crmFormCancel', event);
          if ($el.data('uiDialog') && settings.autoClose) {
            $el.dialog('close');
          }
          else if (!settings.autoClose) {
            $el.crmSnippet('resetUrl').crmSnippet('refresh');
          }
        }
        return returnVal === false;
      });
      if (settings.validate) {
        $("form", this).validate(typeof(settings.validate) == 'object' ? settings.validate : CRM.validate.params);
      }
      $("form", this).ajaxForm($.extend({
        url: data.url.replace(/reset=1[&]?/, ''),
        dataType: 'json',
        success: function(response) {
          if (response.status !== 'form_error') {
            $el.crmSnippet('option', 'block') && $el.unblock();
            $el.trigger('crmFormSuccess', response);
            // Reset form for e.g. "save and new"
            if (response.userContext && settings.refreshAction && $.inArray(response.buttonName, settings.refreshAction) >= 0) {
              $el.crmSnippet('option', 'url', response.userContext).crmSnippet('refresh');
            }
            else if ($el.data('uiDialog') && settings.autoClose) {
              $el.dialog('close');
            }
            else if (settings.autoClose === false) {
              $el.crmSnippet('resetUrl').crmSnippet('refresh');
            }
          }
          else {
            response.url = data.url;
            settings.onError.call($el, response);
          }
        },
        beforeSerialize: function(form, options) {
          if (window.CKEDITOR && window.CKEDITOR.instances) {
            for (var instance in CKEDITOR.instances) {
              CKEDITOR.instances[instance].updateElement();
            }
          }
        },
        beforeSubmit: function(submission) {
          $el.crmSnippet('option', 'block') && $el.block();
          $el.trigger('crmFormSubmit', submission);
        }
      }, settings.ajaxForm));
      if (settings.openInline) {
        settings.autoClose = $el.crmSnippet('isOriginalUrl');
        $(settings.openInline, this).click(function(event) {
          $el.crmSnippet('option', 'url', $(this).attr('href')).crmSnippet('refresh');
          return false;
        });
      }
    });
    return widget;
  };

  // Preprocess all cj ajax calls to display messages
  $(document).ajaxSuccess(function(event, xhr, settings) {
    try {
      if ((!settings.dataType || settings.dataType == 'json') && xhr.responseText) {
        var response = $.parseJSON(xhr.responseText);
        if (typeof(response.crmMessages) == 'object') {
          $.each(response.crmMessages, function(n, msg) {
            CRM.alert(msg.text, msg.title, msg.type, msg.options);
          })
        }
      }
    }
    // Suppress errors
    catch (e) {}
  });

  $(function () {
    // Trigger crmLoad on initial content for consistency. It will also be triggered for ajax-loaded content.
    $('.crm-container').trigger('crmLoad');

    if ($('#crm-notification-container').length) {
      // Initialize notifications
      $('#crm-notification-container').notify();
      messagesFromMarkup.call($('#crm-container'));
    }

    // bind the event for image popup
    $('body').on('click', 'a.crm-image-popup', function() {
      var o = $('<div class="crm-container crm-custom-image-popup"><img src=' + $(this).attr('href') + '></div>');

      CRM.confirm('',
        {
          title: ts('Preview'),
          message: o
        },
        ts('Done')
      );
      return false;
    });
  });

  $.fn.crmAccordions = function (speed) {
    var container = $(this).length > 0 ? $(this) : $('.crm-container');
    speed = speed === undefined ? 200 : speed;
    container
      .off('click.crmAccordions')
      // Allow normal clicking of links
      .on('click.crmAccordions', 'div.crm-accordion-header a', function (e) {
        e.stopPropagation && e.stopPropagation();
      })
      .on('click.crmAccordions', '.crm-accordion-header, .crm-collapsible .collapsible-title', function () {
        if ($(this).parent().hasClass('collapsed')) {
          $(this).next().css('display', 'none').slideDown(speed);
        }
        else {
          $(this).next().css('display', 'block').slideUp(speed);
        }
        $(this).parent().toggleClass('collapsed');
        return false;
      });
  };
  $.fn.crmAccordionToggle = function (speed) {
    $(this).each(function () {
      if ($(this).hasClass('collapsed')) {
        $('.crm-accordion-body', this).first().css('display', 'none').slideDown(speed);
      }
      else {
        $('.crm-accordion-body', this).first().css('display', 'block').slideUp(speed);
      }
      $(this).toggleClass('collapsed');
    });
  };

  /**
   * Clientside currency formatting
   * @param value
   * @param format - currency representation of the number 1234.56
   * @return string
   * @see CRM_Core_Resources::addCoreResources
   */
  var currencyTemplate;
  CRM.formatMoney = function(value, format) {
    var decimal, separator, sign, i, j, result;
    if (value === 'init' && format) {
      currencyTemplate = format;
      return;
    }
    format = format || currencyTemplate;
    result = /1(.?)234(.?)56/.exec(format);
    if (result === null) {
      return 'Invalid format passed to CRM.formatMoney';
    }
    separator = result[1];
    decimal = result[2];
    sign = (value < 0) ? '-' : '';
    //extracting the absolute value of the integer part of the number and converting to string
    i = parseInt(value = Math.abs(value).toFixed(2)) + '';
    j = ((j = i.length) > 3) ? j % 3 : 0;
    result = sign + (j ? i.substr(0, j) + separator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + separator) + (2 ? decimal + Math.abs(value - i).toFixed(2).slice(2) : '');
    return format.replace(/1.*234.*56/, result);
  };
})(jQuery);
