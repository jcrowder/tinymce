/*
 NOTE: This file is partially duplicated in the following locations:
  - plugins/table/core/Utils.ts
  - advtable
 Make sure that if making changes to this file, the other files are updated as well
 */

import { Arr, Optional, Strings } from '@ephox/katamari';
import { TableLookup } from '@ephox/snooker';
import { Attribute, Compare, ContentEditable, PredicateFind, SugarElement, SugarNode } from '@ephox/sugar';
import * as d3 from 'd3-dsv';

import Editor from 'tinymce/core/api/Editor';

const getBody = (editor: Editor): SugarElement<HTMLElement> =>
  SugarElement.fromDom(editor.getBody());

const getIsRoot = (editor: Editor) => (element: SugarElement<Node>): boolean =>
  Compare.eq(element, getBody(editor));

const removeDataStyle = (table: SugarElement<HTMLTableElement>): void => {
  Attribute.remove(table, 'data-mce-style');

  const removeStyleAttribute = (element: SugarElement<HTMLElement>) => Attribute.remove(element, 'data-mce-style');

  Arr.each(TableLookup.cells(table), removeStyleAttribute);
  Arr.each(TableLookup.columns(table), removeStyleAttribute);
  Arr.each(TableLookup.rows(table), removeStyleAttribute);
};

const getSelectionStart = (editor: Editor): SugarElement<Element> =>
  SugarElement.fromDom(editor.selection.getStart());

const getSelectionEnd = (editor: Editor): SugarElement<Element> =>
  SugarElement.fromDom(editor.selection.getEnd());

const getPixelWidth = (elm: HTMLElement): number =>
  elm.getBoundingClientRect().width;

const getPixelHeight = (elm: HTMLElement): number =>
  elm.getBoundingClientRect().height;

const getRawWidth = (editor: Editor, elm: HTMLElement): Optional<string> => {
  const raw = editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width');
  return Optional.from(raw).filter(Strings.isNotEmpty);
};

const isPercentage = (value: string): boolean => /^(\d+(\.\d+)?)%$/.test(value);
const isPixel = (value: string): boolean => /^(\d+(\.\d+)?)px$/.test(value);

const isInEditableContext = (cell: SugarElement<HTMLTableCellElement | HTMLTableCaptionElement>): boolean =>
  PredicateFind.closest(cell, SugarNode.isTag('table')).exists(ContentEditable.isEditable);

// This function should be implemented in your Utils module.
const convertToTable = (parsedData: string[]) => {
  let table = '<table>';
  let row = '<tr>';

  parsedData.forEach((cell) => {
    if (cell.includes('<br>')) {
      const parts = cell.split('<br>');
      parts.forEach((part, index) => {
        row += `<td>${part}</td>`;
        if (index < parts.length - 1) {
          row += '</tr>';
          table += row;
          row = '<tr>';
        }
      });
    } else {
      row += `<td>${cell}</td>`;
    }
  });

  // Close the last row and the table
  row += '</tr>';
  table += row;
  table += '</table>';

  return table;
};

export {
  getBody,
  getIsRoot,
  removeDataStyle,
  getSelectionStart,
  getSelectionEnd,
  isPercentage,
  isPixel,
  getPixelWidth,
  getPixelHeight,
  getRawWidth,
  isInEditableContext,
  convertToTable
};
