import chai from 'chai';
var should = chai.should();
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import getReverseComplementAnnotation from "./getReverseComplementAnnotation.js";
describe("getReverseComplementAnnotation", function () {
  it("reverse complements an annotation ", function () {
    //0123456789
    //---abc----   //normal
    //----cba---   //reverse complemented
    var newAnn = getReverseComplementAnnotation({
      start: 3,
      end: 5
    }, 10);
    newAnn.should.deep.equal({
      start: 4,
      end: 6,
      forward: true
    });
  });
  it("reverse complements an annotation crossing origin", function () {
    //0123456789
    //cde-----ab   //normal
    //ab-----edc   //reverse complemented
    var newAnn = getReverseComplementAnnotation({
      start: 8,
      end: 2
    }, 10);
    newAnn.should.deep.equal({
      start: 7,
      end: 1,
      forward: true
    });
  });
});