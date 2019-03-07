// const tap = require('tap');
// tap.mochaGlobals();
import { expect } from 'chai';
import prepareRowData from "./prepareRowData.js";
import output1 from './prepareRowData_output1.json';
describe("prepareRowData", function () {
  it("maps overlapping annotations to rows correctly", function () {
    const annotation1 = {
      start: 0,
      end: 9,
      id: "a"
    };
    const annotation2 = {
      start: 10,
      end: 4,
      id: "b"
    };
    const bpsPerRow = 5;
    const sequenceData = {
      sequence: "gagagagagagagaga",
      features: [annotation1],
      translations: [annotation1],
      parts: {
        a: annotation1
      },
      cutsites: {
        b: annotation2
      },
      orfs: [annotation2],
      primers: [annotation2]
    };
    const rowData = prepareRowData(sequenceData, bpsPerRow); // console.log('rowData:',JSON.stringify(rowData,null,4))

    expect(rowData).to.deep.equal(output1);
  });
});