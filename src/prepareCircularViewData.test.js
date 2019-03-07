import prepareCircularViewData from './prepareCircularViewData';
import { expect } from 'chai';
import mapAnnotationsToRows from './mapAnnotationsToRows.js';
describe("prepareCircularViewData", function() {
  it("maps overlapping annotations to rows correctly", function() {
    let annotation1 = {
      start: 0,
      end: 9,
      id: "a"
    };
    let annotation2 = {
      start: 0,
      end: 9,
      id: "b"
    };
    let annotations = [annotation1, annotation2];
    let sequenceLength = 10;
    let bpsPerRow = 5;
    let annotationsToRowsMap = mapAnnotationsToRows(
      annotations,
      sequenceLength,
      bpsPerRow
    );
    expect(annotationsToRowsMap).to.deep.equal({
      0: [
        {
          annotation: annotation1,
          start: 0,
          end: 4,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "beginningAndEnd"
        },
        {
          start: 0,
          end: 4,
          id: annotation2.id,
          yOffset: 1,
          annotation: annotation2,
          enclosingRangeType: "beginningAndEnd"
        }
      ],
      1: [
        {
          annotation: annotation1,
          start: 5,
          end: 9,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "beginningAndEnd"
        },
        {
          start: 5,
          end: 9,
          id: annotation2.id,
          yOffset: 1,
          annotation: annotation2,
          enclosingRangeType: "beginningAndEnd"
        }
      ]
    });
  });
  it("correctly calculates y-offset for annotation split by origin", function() {
    let annotation1 = {
      start: 7,
      end: 9,
      id: "a"
    };
    let annotation2 = {
      start: 5,
      end: 3,
      id: "b"
    };
    let annotations = [annotation1, annotation2];
    let sequenceLength = 10;
    let bpsPerRow = 10;
    let annotationsToRowsMap = mapAnnotationsToRows(
      annotations,
      sequenceLength,
      bpsPerRow
    );
    expect(annotationsToRowsMap).to.deep.equal({
      0: [
        {
          start: 7,
          end: 9,
          id: annotation1.id,
          yOffset: 0,
          annotation: annotation1,
          enclosingRangeType: "beginningAndEnd"
        },
        {
          annotation: annotation2,
          start: 0,
          end: 3,
          id: annotation2.id,
          yOffset: 1,
          enclosingRangeType: "end"
        },
        {
          annotation: annotation2,
          start: 5,
          end: 9,
          id: annotation2.id,
          yOffset: 1,
          enclosingRangeType: "beginning"
        }
      ]
    });
  });
  it("correctly calculates y-offset for annotation split by origin (different ordering of annotations)", function() {
    let annotation1 = {
      start: 5,
      end: 3,
      id: "a"
    };
    let annotation2 = {
      start: 7,
      end: 9,
      id: "b"
    };
    let annotations = [annotation1, annotation2];
    let sequenceLength = 10;
    let bpsPerRow = 10;
    let annotationsToRowsMap = mapAnnotationsToRows(
      annotations,
      sequenceLength,
      bpsPerRow
    );
    expect(annotationsToRowsMap).to.deep.equal({
      0: [
        {
          annotation: annotation1,
          start: 0,
          end: 3,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "end"
        },
        {
          annotation: annotation1,
          start: 5,
          end: 9,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "beginning"
        },
        {
          start: 7,
          end: 9,
          id: annotation2.id,
          yOffset: 1,
          annotation: annotation2,
          enclosingRangeType: "beginningAndEnd"
        }
      ]
    });
  });

  it("maps single annotation to rows correctly", function() {
    let annotation1 = {
      start: 0,
      end: 9,
      id: "a"
    };
    let annotations = [annotation1];
    let sequenceLength = 10;
    let bpsPerRow = 5;
    let annotationsToRowsMap = mapAnnotationsToRows(
      annotations,
      sequenceLength,
      bpsPerRow
    );
    expect(annotationsToRowsMap).to.deep.equal({
      0: [
        {
          annotation: annotation1,
          start: 0,
          end: 4,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "beginningAndEnd"
        }
      ],
      1: [
        {
          annotation: annotation1,
          start: 5,
          end: 9,
          id: annotation1.id,
          yOffset: 0,
          enclosingRangeType: "beginningAndEnd"
        }
      ]
    });
  });
});
