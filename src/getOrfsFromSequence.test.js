// const tap = require('tap');
// tap.mochaGlobals();
import { expect } from 'chai';

import getOrfsFromSequence from './getOrfsFromSequence.js';
// getOrfsFromSequence(frame, sequence, minimumOrfSize, forward, circular)
describe("getOrfsFromSequence", function() {
  it("finds correct orfs in reverse direction in slightly more complex sequence", function() {
    const orfs = getOrfsFromSequence({
      sequence:
        "gattttaatcactataccaattgagatgggctagtcaatgataattactagtccttttcccgggtgatctgggtatctgtaaattctgctagacctttgctggaaaacttgtaaattctgctagaccctctgtaaattccgctagacctttgtgtgttttttttgtttatattcaagtggttataatttatagaataaagaaagaataaaaaaagataaaaagaatagatcccagccctgtgtataactcactactttagtcagttccgcagtattacaaaaggatgtcgcaaacgctgtttgctcctctacaaaacagaccttaaaaccctaaaggcttaagtagcaccctcgcaagctcgggcaaatcgctgaatattccttttgtctccgaccatcaggcacctgagtcgctgtctttttcgtgacattcagttcgctgcgctcacggctctggcagtgaatgggggtaaatggcactacaggcgccttttatggattcatgcaaggaaactacccataatacaagaaaagcccgtcacgggcttctcagggcgttttatggcgggtctgctatgtggtgctatctgactttttgctgttcagcagttcctgccctctgattttccagtctgaccacttcggattatcccgtgacaggtcattcagactggctaatgcacccagtaaggcagcggtatcatcaacaggcttacccgtcttactgtccctagtgcttggattctcaccaataaaaaacgcccggcggcaaccgagcgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtccaagcgagctcgatatcaaattacgccccgccctgccactcatcgcagtactgttgtaattcattaagcattctgccgacatggaagccatcacaaacggcatgatgaacctgaatcgccagcggcatcagcaccttgtcgccttgcgtataatatttgcccatggtgaaaacgggggcgaagaagttgtccatattggccacgtttaaatcaaaactggtgaaactcacccagggattggctgagacgaaaaacatattctcaataaaccctttagggaaataggccaggttttcaccgtaacacgccacatcttgcgaatatatgtgtagaaactgccggaaatcgtcgtggtattcactccagagcgatgaaaacgtttcagtttgctcatggaaaacggtgtaacaagggtgaacactatcccatatcaccagctcaccgtctttcattgccatacgaaattccggatgagcattcatcaggcgggcaagaatgtgaataaaggccggataaaacttgtgcttatttttctttacggtctttaaaaaggccgtaatatccagctgaacggtctggttataggtacattgagcaactgactgaaatgcctcaaaatgttctttacgatgccattgggatatatcaacggtggtatatccagtgatttttttctccattttagcttccttagctcctgaaaatctcgataactcaaaaaatacgcccggtagtgatcttatttcattatggtgaaagttggaacctcttacgtgccgatcaacgtctcattttcgccagatatcgacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaatttttaagaaggagatatacatatgagtaaaggagaagaacttttcactggagttgtcccaattcttgttgaattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgatgcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacat",
      minimumOrfSize: 3280,
      forward: false,
      circular: false
    });
    expect(orfs).to.be.length(0);
    const orf = orfs[0];
    // expect(orf).to.be.an('object');
    // expect(orf.start).to.equal(11);
    // expect(orf.end).to.equal(0);
    // expect(orf.forward).to.equal(false);
    // expect(orf.frame).to.equal(0);
    // expect(orf.internalStartCodonIndices).to.deep.equal([8]);
    // expect(orf.id).to.be.a('string');
  });
  it("finds correct orfs in reverse direction in slightly more complex sequence", function() {
    const orfs = getOrfsFromSequence({
      sequence: "ttarrrcatcat",
      //   E       S     S
      //rrrttarrrcatrrrcatr
      //fatgfffatgffftaafff
      //0123456789012345678
      // S     S       E
      //
      //E       S  S
      //ttarrrcatcat
      //atgatgffftaa
      //0123456789012345
      //S  S       E
      //
      minimumOrfSize: 0,
      forward: false,
      circular: false
    });
    expect(orfs).to.be.length(1);
    const orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(11);
    expect(orf.forward).to.equal(false);
    expect(orf.frame).to.equal(0);
    expect(orf.isOrf).to.equal(true);
    expect(orf.internalStartCodonIndices).to.deep.equal([8]);
    expect(orf.id).to.be.a("string");
  });
  it("finds correct orfs in reverse direction in simple sequence", function() {
    const orfs = getOrfsFromSequence({
      sequence: "ttacat",
      minimumOrfSize: 0,
      forward: false,
      circular: false
    });
    expect(orfs).to.be.length(1);
    const orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(5);
    expect(orf.forward).to.equal(false);
    expect(orf.frame).to.equal(0);
    expect(orf.isOrf).to.equal(true);
    expect(orf.internalStartCodonIndices).to.deep.equal([]);
    expect(orf.id).to.be.a("string");
  });
  it("finds correct orfs in slightly more complex sequence", function() {
    const orfs = getOrfsFromSequence({
      sequence: "atgatgffftaa",
      minimumOrfSize: 0,
      forward: true,
      circular: false
    });
    expect(orfs).to.be.length(1);
    const orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(11);
    expect(orf.isOrf).to.equal(true);
    expect(orf.forward).to.equal(true);
    expect(orf.frame).to.equal(0);
    expect(orf.internalStartCodonIndices).to.deep.equal([3]);
    expect(orf.id).to.be.a("string");
  });
  it("finds correct orfs in simple sequence", function() {
    const orfs = getOrfsFromSequence({
      sequence: "atgtaa",
      minimumOrfSize: 0,
      forward: true,
      circular: false
    });
    expect(orfs).to.be.length(1);
    const orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(5);
    expect(orf.forward).to.equal(true);
    expect(orf.isOrf).to.equal(true);
    expect(orf.frame).to.equal(0);
    expect(orf.internalStartCodonIndices).to.deep.equal([]);
    expect(orf.id).to.be.a("string");
  });
  it("it will find additional orfs if useAdditionalOrfStartCodons is set to true in simple sequence", function() {
    let orfs = getOrfsFromSequence({
      sequence: "ctgtaa",
      minimumOrfSize: 0,
      forward: true,
      circular: false,
      useAdditionalOrfStartCodons: true,
    });
    expect(orfs).to.be.length(1);
    let orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(5);
    expect(orf.forward).to.equal(true);
    expect(orf.isOrf).to.equal(true);
    expect(orf.frame).to.equal(0);
    expect(orf.internalStartCodonIndices).to.deep.equal([]);
    expect(orf.id).to.be.a("string");
    orfs = getOrfsFromSequence({
      sequence: "gtgtaa",
      minimumOrfSize: 0,
      forward: true,
      circular: false,
      useAdditionalOrfStartCodons: true,
    });
    expect(orfs).to.be.length(1);
    orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(5);
    expect(orf.forward).to.equal(true);
    expect(orf.isOrf).to.equal(true);
    expect(orf.frame).to.equal(0);
    expect(orf.internalStartCodonIndices).to.deep.equal([]);
    expect(orf.id).to.be.a("string");
  });
  it("finds correct orfs in simple sequence with different capitalizations", function() {
    const orfs = getOrfsFromSequence({
      sequence: "ATGTAA",
      minimumOrfSize: 0,
      forward: true,
      circular: false
    });
    expect(orfs).to.be.length(1);
    const orf = orfs[0];
    expect(orf).to.be.an("object");
    expect(orf.start).to.equal(0);
    expect(orf.end).to.equal(5);
    expect(orf.forward).to.equal(true);
    expect(orf.isOrf).to.equal(true);
    expect(orf.frame).to.equal(0);
    expect(orf.internalStartCodonIndices).to.deep.equal([]);
    expect(orf.id).to.be.a("string");
  });
  it("doesnt find orfs in simple sequence with no orfs", function() {
    const orfs = getOrfsFromSequence({
      sequence: "gtgtaa",
      minimumOrfSize: 0,
      forward: true,
      circular: false
    });
    expect(orfs).to.be.an("array");
    expect(orfs).to.be.length(0);
  });
});
