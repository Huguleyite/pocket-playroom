"use strict";

const chapterNames = ["First Signal", "Dead Ends", "Linked Rows", "Clearance", "Full Transmission"];

// Letters identify individual blocks. Repeated letters form a single rectangle.
// Lowercase blocks start dark. The final string marks the blocks that slide.
const campaignBoards = [
  // Dead Ends
  ["Open circuit", "Send a test pulse to see where the live branch ends.", 3, [
    "..IHHH.", "..I.GGG", ".......", "FSbccA.", "F.RDEA."
  ], ""],
  ["Wrong floor", "Check the receiver’s row before following the brightest branch.", 4, [
    ".a.cBSE", ".a.DR.E", "FFF....", ".h.....", "Gh....."
  ], "a"],
  ["False start", "Trace from the receiver to the first gap.", 4, [
    "...hhh.", "....iii", "ggg....", "FSBCC.a", "F.RdE.a"
  ], "a"],
  ["One row short", "Look for the turn that reaches the receiver’s row.", 4, [
    "...nnn.", "a.dCSKL", "a.gFEB.", "RJIIHB.", "...MM.."
  ], "a"],
  ["Backfeed", "Follow each branch to its last relay.", 4, [
    "JISC.a.", ".bDe.a.", ".bFFGHR", "kk.....", ".LLL..."
  ], "a"],
  ["Blind alley", "The lit branch at the source ends early. Find the route across three rows.", 5, [
    "...KK..", "a..CSHI", "a..DDDb", "..RGFeb", "JJJ...."
  ], "a"],

  // Linked Rows
  ["Tandem", "The marked blocks on a row move together.", 5, [
    "..H....", "..Sc.Ai", "B.DD.A.", "B.EEfR.", "j...G.."
  ], "ABi"],
  ["Countershift", "Check where the whole group lands before sliding.", 5, [
    "kA.dCS.", ".A.FE.B", "RhhGG.B", "I.JJJ..", "I..LL.."
  ], "ABk"],
  ["Shared rail", "Use the marked relay that carries the signal between rows.", 4, [
    "kk.....", "SCCD.Ai", "B.eF.Ai", "B.ggR.H", "..jj..."
  ], "ABi"],
  ["Cross traffic", "Plan the slides before powering the dark relays.", 6, [
    ".K..Mll", "A.eeDS.", "A.Gff.B", "nC.HH.B", ".C.JiR."
  ], "ABCn"],
  ["Relay pair", "A linked block can move without carrying the pulse.", 6, [
    "SDDE.a.", "b.FG.a.", "b.HH.cl", "mRII.c.", "..jj.kk"
  ], "abcl"],
  ["In step", "Each slide needs to leave room for the next group.", 6, [
    "JA.ddS.", "KA.ee.b", "KC.FF.b", ".C.GGGR", "iii..h."
  ], "AbCJ"],

  // Clearance
  ["Make room", "Move the middle rail first to clear the tall relay’s path.", 5, [
    "....L..", ".kkiij.", "ScccD.A", "b.EEFFA", "bGGHHR."
  ], "AEF"],
  ["Right of way", "Dark blocks still occupy space. Check both halves of the tall relay.", 5, [
    "A.DCCCS", "AgFEE.B", ".RiiHHB", "..MJ.KK", "LLM...."
  ], "AEFg"],
  ["Sidestep", "Make room for the turn, then complete the route.", 5, [
    "SccDE.a", "B.fffGa", "BHIIJR.", ".mmmNNN", "kkkLL.."
  ], "afG"],
  ["Clear the turn", "Follow the receiver’s row back to the crowded middle rail.", 5, [
    "KKKMM..", "A.dCCCS", "Affee.B", "RIHHGGB", "...JJJL"
  ], "Aef"],
  ["The squeeze", "A single slide can clear the turn and align the middle row.", 6, [
    "SCdEE.A", "B.ffGGA", "BHijjR.", ".kkkMM.", "llnnn.."
  ], "AfG"],
  ["Occupied lane", "Plan the slides in order before powering the gaps.", 6, [
    "KKKjj..", "lIII...", "a.DDCCS", "affee.B", ".RhGGGB"
  ], "aef"],

  // Full Transmission
  ["Long return", "Send the pulse through four rows.", 6, [
    "N.OOO..", "SDDEE.A", "B.FFFgA", "BHiiJC.", "RKllMC."
  ], "ACFg"],
  ["Over and back", "Check where the signal changes direction.", 7, [
    "A.FEDDS", "AHHHG.B", "c.JJJIB", "c.lkkkR", ".MMMnn."
  ], "AcGH"],
  ["Quiet channel", "Connect the receiver through the crowded middle rows.", 7, [
    ".o.n.mm", "SDDDE.A", "b.ffGhA", "biJJJ.C", "llRKK.C"
  ], "ACfGh"],
  ["Cross current", "Map the route before moving the first rail.", 7, [
    "A.FFEdS", "AHggg.b", "C.JIIIb", "C.MlKRp", "QQ.NNO."
  ], "ACgH"],
  ["Final checks", "Check the space each upright needs before switching on the gaps.", 8, [
    "SDDDE.A", "b.fffGA", "bhhhi.C", "RjjjK.C", "NNN.l.M"
  ], "ACfG"],
  ["Last signal", "Deliver the final signal across four rows.", 8, [
    "nnOOMMM", "A.EdddS", "Agfff.B", "C.JiiHB", "C.llKR."
  ], "ACfg"]

];

function parseCampaignBoard([name, objective, moves, rows, sliding]) {
  const blocks = new Map();
  let source, receiver;
  rows.forEach((row, y) => [...row].forEach((symbol, x) => {
    if (symbol === ".") return;
    if (symbol === "S") { source = [x, y]; return; }
    if (symbol === "R") { receiver = [x, y]; return; }
    const first = blocks.get(symbol);
    if (first) {
      first[2] = Math.max(first[2], x - first[0] + 1);
      first[3] = Math.max(first[3], y - first[1] + 1);
    } else {
      blocks.set(symbol, [x, y, 1, 1, symbol === symbol.toUpperCase(), sliding.includes(symbol)]);
    }
  }));
  return { name, objective, moves, source, receiver, relays: [...blocks.values()] };
}

